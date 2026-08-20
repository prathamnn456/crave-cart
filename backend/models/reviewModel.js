import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    foodId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, default: "Guest" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    date: { type: Date, default: Date.now },
})

// one review per user per food (re-submitting updates the existing one)
reviewSchema.index({ foodId: 1, userId: 1 }, { unique: true });

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);
export default reviewModel;
