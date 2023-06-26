import { NextFunction, Request, Response } from "express";
import User from "../entities/User";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        
        if (!token) return next()

        const {username}: any = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOneBy({"email": username});

        if (!user) throw new Error("UnAuthenticated");

        // 유저 정보를 res.locals.user에 넣어주기
        res.locals.user = user;
        return next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({"error": "Something went wrong"});
    }
}