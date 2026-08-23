import express  from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import adminRouter from "./routes/adminRoute.js"
import couponRouter from "./routes/couponRoute.js"
import favoriteRouter from "./routes/favoriteRoute.js"
import reviewRouter from "./routes/reviewRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000;


// middlewares
app.use(express.json())

// restrict browser calls to our own sites (Vercel prod + previews) and local dev.
// Non-browser callers (curl, Stripe webhooks) send no Origin and are allowed.
app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (/\.vercel\.app$/.test(origin) || /^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
        return cb(null, false);
    }
}))

// db connection
connectDB()

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/admin",adminRouter)
app.use("/api/coupon",couponRouter)
app.use("/api/favorite",favoriteRouter)
app.use("/api/review",reviewRouter)

// health check
app.get("/", (req, res) => {
    res.send("API Working")
  });

app.listen(port, () => console.log(`Server started on http://localhost:${port}`))