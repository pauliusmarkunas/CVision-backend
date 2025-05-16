import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { checkPgConnection } from "./utils/pgConnection.js";
import { testRedisConnection } from "./utils/redisConnection.js";

dotenv.config();

const { PORT, FRONTEND_ORIGIN } = process.env;

const app = express();

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    // origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
await checkPgConnection();
await testRedisConnection();
