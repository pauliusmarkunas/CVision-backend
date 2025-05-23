import express from "express";
import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/user", userRouter);

// router.use("/guest", guestRouter);

// router.use("/stats", statsRouter);

export default router;
