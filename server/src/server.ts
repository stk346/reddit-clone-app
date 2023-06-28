import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth";
import subRoutes from "./routes/subs";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();

const origin = "http://localhost:3000"
app.use(cors({
    origin,
    credentials: true
}))

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
dotenv.config();

app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRoutes)
app.use("/api/subs", subRoutes)

// 스태틱 파일들이 public 폴더 안에 있음을 알려주는 코드. 추가 안하면 액박뜸
app.use(express.static("public"));


let port = 4000;
app.listen(port, async () => {
    console.log(`server running at http://localhost:${port}}`);

    AppDataSource.initialize().then( () => {
        console.log("database initialized")
}).catch(error => console.log(error))

})