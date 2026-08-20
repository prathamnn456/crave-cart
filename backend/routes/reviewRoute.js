import express from 'express';
import { addReview, getReviews, getSummary } from '../controllers/reviewController.js';
import authMiddleware from '../middleware/auth.js';

const reviewRouter = express.Router();

reviewRouter.post("/add", authMiddleware, addReview);
reviewRouter.post("/list", getReviews);
reviewRouter.post("/summary", getSummary);

export default reviewRouter;
