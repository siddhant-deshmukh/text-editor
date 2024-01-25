import auth from '../middleware/auth'
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import express, { NextFunction, Request, Response } from 'express'
import User, { IUserCreate, IUser } from '../models/users';
import { body, validationResult } from 'express-validator';
import validate from '../middleware/validate';
import Doc from '../models/doc';
import mongoose from 'mongoose';
import { io } from '../app';

// auth is middleware which validates the token and passon the information of user by decrypting token


dotenv.config();
var router = express.Router();

// to send information about user
router.get('/', auth, async function (req: Request, res: Response) {
  try {
    const docs = await Doc.find({
      $or: [
        { author_id: res.user._id }, //new mongoose.Schema.ObjectId(res.user._id.toString())
        // { author_id: new mongoose.Schema.ObjectId(res.user._id.toString()) }
        { write_access: { $elemMatch: { $eq: res.user._id } } }
      ]
    }).select({ content: 0 }).sort({ last_updated: -1 })

    const withUsersPromise = docs.map(async (doc) => {
      const the_doc = doc.toObject()
      if (doc.author_id.toString() === res.user._id.toString()) {
        return {
          ...the_doc,
          owner: res.user.name
        }
      } else {
        const user = await User.findById(doc.author_id).select({ name: 1 })
        if (user) {
          return {
            ...the_doc,
            owner: user.name
          }
        }
      }
    })

    const docsWithUsers = (await Promise.all(withUsersPromise)).filter((doc) => doc != undefined)

    return res.status(200).json({ docs: docsWithUsers });
  } catch (err) {
    return res.status(500).json({ msg: "Some internal error occured", err })
  }
});

router.post('/',
  auth,
  body('title').exists().isString().isLength({ max: 50, min: 3 }).trim(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const { title }: { title: string } = req.body

      const newDoc = await Doc.create({
        title,
        author_id: res.user._id,
        last_updated: Date.now(),
        write_access: []
      })
      const doc = newDoc.toObject()
      return res.status(201).json({ doc })
    } catch (err) {
      return res.status(500).json({ msg: "Some internal error occured", err })
    }
  });

router.get('/:docId', auth, async function (req: Request, res: Response) {
  try {
    const { docId } = req.params
    const doc = await Doc.findById(docId)
    if (!doc) {
      return res.status(404).json({ msg: "document not found" })
    }

    if (doc.author_id.toString() != res.user._id.toString() && !doc.write_access.find((id) => id.toString() === res.user._id.toString())) {
      return res.status(401).json({ msg: "Dont have permission" })
    }

    return res.status(200).json({ doc });
  } catch (err) {
    return res.status(500).json({ msg: "Some internal error occured", err })
  }
});

router.post('/:docId',
  auth,
  body('content').exists().isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const { docId } = req.params
      const { content }: { content: string } = req.body

      const doc = await Doc.findById(docId)
      if (!doc) {
        return res.status(404).json({ msg: "document not found" })
      }
      if (doc.author_id.toString() != res.user._id.toString() && !doc.write_access.find((id) => id.toString() === res.user._id.toString())) {
        return res.status(401).json({ msg: "Dont have permission" })
      }

      await Doc.findByIdAndUpdate(docId, {
        content
      })

      io.to(docId).emit("updated-doc", {
        docId,
        updatedDoc : content,
        updatedBy: res.user._id.toString()
      })

      return res.status(200);
    } catch (err) {
      return res.status(500).json({ msg: "Some internal error occured", err })
    }
  })

router.post('/permissions/:docId',
  auth,
  body('write_access').optional().isArray(),
  body('read_access').optional().isArray(),
  body('is_public').optional().isBoolean(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const { docId } = req.params
      const { write_access, read_access, is_public }: { write_access?: string[], read_access?: string[], is_public?: boolean } = req.body

      // if (write_access) {
      //   const PromiseArr = write_access.map(async (_id) => {
      //     const isExist = await User.exists({ _id })
      //     if(isExist) return true;
      //     else return false;
      //   })
      //   const writtem
      // }
      // if (read_access) {
      //   const PromiseArr = read_access.map(async (_id) => {
      //     const isExist = await User.exists({ _id })
      //     if(isExist) return true;
      //     else return false;
      //   })
      // }

      const doc = await Doc.findById(docId)
      if (!doc) {
        return res.status(404).json({ msg: "document not found" })
      }
      if (doc.author_id.toString() != res.user._id.toString()) {
        return res.status(401).json({ msg: "Dont have permission" })
      }

      const newDoc = await Doc.findByIdAndUpdate(docId, {
        write_access,
        read_access,
        is_public
      })
      return res.status(200).json({ doc: newDoc });
    } catch (err) {
      return res.status(500).json({ msg: "Some internal error occured", err })
    }
  })

export default router