import e, { NextFunction, Request, Response, Router } from "express";
import User from "../entities/User";
import { isEmpty, validate } from "class-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";

const mapError = (errors: Object[]) => {
    return errors.reduce((prev: any, err: any) => {
        prev[err.property] = Object.entries(err.constraints)[0][1]

        return prev;
    }, {});
}

// Request 객체를 쓰지 않을 때 _로 두면 declared but not ~~ 문구가 뜨지 않는다.
const me = async (_: Request, res: Response) => {
    return res.json(res.locals.user);
}

const register = async (req: Request, res: Response) => {
    const {email, username, password} = req.body;

    try {
        let errors: any = {};

        // 이메일과 유저네임이 이미 사용되고 있는지 확인
        const emailUser = await User.findOneBy({ email });
        const usernameUser = await User.findOneBy({ username });

        // 이미 있다면 errors 객체에 넣어줌
        if (emailUser) errors.eamil = "이미 사용중인 이메일입니다.";
        if (usernameUser) errors.username = "이미 사용중인 유저 이름입니다.";

        // 에러가 있다면 에러 response를 return해줌
        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }

        const user = new User();
        user.email = email;
        user.username = username;
        user.password = password;

        // 엔티티에서 정해놓은 조건으로 유효성 검사를 해줌
        errors = await validate(user);
        
        if (errors.length > 0) return res.status(400).json(mapError(errors));

        // 유저 정보를 table에 저장
        await user.save();
        return res.json(user);
    } catch(error) {
        console.error(error);
        return res.status(500).json({ error });
    }
}

const login = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    try {
        let errors: any = {};
        if (isEmpty(username)) errors.username = "사용자 이름은 비워둘 수 없습니다.";
        if (isEmpty(password)) errors.password = "비밀번호는 비워둘 수 없습니다";
        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }
        
        const user = await User.findOneBy( {"email": username} );

        if (!user) return res.status(404).json({username: "사용자 이름이 등록되지 않았습니다."});

        const passwordMatches = await bcrypt.compare(password, user.password);
        if(!passwordMatches) {
            return res.status(401).json({passowrd: "비밀번호가 등록되지 않았습니다."});
        }

        const token = jwt.sign({username}, process.env.JWT_SECRET);
        res.set("Set-Cookie", cookie.serialize("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        }));
        return res.json({user, token});

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

const logout = async (_: Request, res: Response) => {
    res.set(
        "Set-Cookie",
        cookie.serialize("token", "", {
            httpOnly: true,
            secure: process.env.NODE_DEV === "production",
            sameSite: "strict",
            expires: new Date(0),
            path: "/",
        })
    );
    res.status(200).json({success: true});
};

const router = Router();
router.get("/me", userMiddleware, authMiddleware, me);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", userMiddleware, authMiddleware, logout); // 미들웨어를 거쳐 로그아웃을 할 수 있는 사람인지 보는것

export default router;