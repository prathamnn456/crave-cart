import foodModel from "../models/foodModel.js";
import fs from 'fs'

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({})
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

// add food
const addFood = async (req, res) => {

    try {
        let image_filename = `${req.file.filename}`

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category:req.body.category,
            type: req.body.type || "veg",
            image: image_filename,
        })

        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// edit food (update fields, optionally replace image)
const editFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Item not found" });
        }

        const update = {
            name: req.body.name ?? food.name,
            description: req.body.description ?? food.description,
            price: req.body.price !== undefined ? Number(req.body.price) : food.price,
            category: req.body.category ?? food.category,
            type: req.body.type ?? food.type,
        };

        // if a new image was uploaded, remove the old file and use the new one
        if (req.file) {
            fs.unlink(`uploads/${food.image}`, () => { });
            update.image = req.file.filename;
        }

        await foodModel.findByIdAndUpdate(req.body.id, update);
        res.json({ success: true, message: "Food Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// toggle availability (in stock / out of stock)
const setAvailability = async (req, res) => {
    try {
        await foodModel.findByIdAndUpdate(req.body.id, { available: !!req.body.available });
        res.json({ success: true, message: req.body.available ? "Marked in stock" : "Marked out of stock" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// delete food
const removeFood = async (req, res) => {
    try {

        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { })

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Food Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

export { listFood, addFood, editFood, setAvailability, removeFood }