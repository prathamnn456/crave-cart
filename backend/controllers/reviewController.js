import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

// POST /api/review/add  { foodId, rating, comment }  (auth)
// one review per user per food; re-submitting overwrites the previous one
const addReview = async (req, res) => {
    try {
        const { foodId, rating, comment } = req.body;
        const r = Number(rating);
        if (!foodId || !(r >= 1 && r <= 5)) {
            return res.json({ success: false, message: "Please pick a rating from 1 to 5" });
        }
        const user = await userModel.findById(req.body.userId);
        await reviewModel.findOneAndUpdate(
            { foodId, userId: req.body.userId },
            {
                foodId,
                userId: req.body.userId,
                userName: user?.name || "Guest",
                rating: r,
                comment: (comment || "").toString().slice(0, 500),
                date: new Date(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.json({ success: true, message: "Review saved" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// POST /api/review/list  { foodId }  (public)
const getReviews = async (req, res) => {
    try {
        const foodId = req.body.foodId;
        const reviews = await reviewModel.find({ foodId }).sort({ date: -1 }).limit(50);
        const count = reviews.length;
        const avg = count ? reviews.reduce((s, rv) => s + rv.rating, 0) / count : 0;
        res.json({ success: true, reviews, avg: Math.round(avg * 10) / 10, count });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// POST /api/review/summary  (public) -> { foodId: { avg, count } } for every rated dish
const getSummary = async (req, res) => {
    try {
        const agg = await reviewModel.aggregate([
            { $group: { _id: "$foodId", avg: { $avg: "$rating" }, count: { $sum: 1 } } }
        ]);
        const summary = {};
        agg.forEach((a) => { summary[a._id] = { avg: Math.round(a.avg * 10) / 10, count: a.count }; });
        res.json({ success: true, summary });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { addReview, getReviews, getSummary }
