import * as jwt from 'jsonwebtoken'
import User from '../models/users';
import { NextFunction, Request, Response } from 'express';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;

    // console.log("req.cookies.access_token",req.cookies.access_token,process.env.TOKEN_KEY || 'zhingalala');
    // console.log("Coming")
    if (!token) {
      return res.status(401).json({ msg: "Unautherized, please login or register", user:null });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_KEY || 'zhingalala');
    if (typeof decoded === 'string' || !decoded._id) {
      res.clearCookie("access_token");
      return res.status(403).json({ msg: "Unautherized, please login or register", user:null });
    }
    const user = await User.findById(decoded._id).select({ 'password': 0,  'auth_type': 0 });
    if (!user) {
      res.clearCookie("access_token");
      return res.status(403).json({ msg: "Unautherized, please login or register", user:null });
    }

    res.user = user;
  } catch (err) {
    return res.status(403).json({ msg: "Unautherized, please login or register", err, user:null });
  }
  return next();
};

export default verifyToken;