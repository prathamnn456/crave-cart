import express from 'express';
import { loginUser,registerUser, getProfile, saveAddress, deleteAddress } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/profile",authMiddleware,getProfile);
userRouter.post("/address/save",authMiddleware,saveAddress);
userRouter.post("/address/delete",authMiddleware,deleteAddress);

export default userRouter;
