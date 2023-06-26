import { Request, Response, Router } from "express";
import User from "../entities/User";
import jwt from "jsonwebtoken"

const createSub = async (req: Request, res: Response, next) => {
    const {name, title, description} = req.body;

    const token = req.cookies.token;
    if (!token) return next()

    const {username}: any = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOneBy({"username": username});

    if (!user) throw new Error("UnAuthenticated");
}

const router = Router();

router.post("/", createSub);

export default router;