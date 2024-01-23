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
      ]
    }).select({ content: 0 }).sort({ last_updated: -1 })
    return res.status(200).json({ docs });
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
    if (doc.author_id.toString() != res.user._id.toString()) {
      return res.status(401).json({ msg: "Dont have permission" })
    }

    return res.status(200).json({ doc });
  } catch (err) {
    return res.status(500).json({ msg: "Some internal error occured", err })
  }
});

export default router