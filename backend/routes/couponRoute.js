import express from 'express';
import { applyCoupon } from '../controllers/couponController.js';

const couponRouter = express.Router();

couponRouter.post('/apply', applyCoupon);

export default couponRouter;
