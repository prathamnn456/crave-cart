import userModel from "../models/userModel.js"

// POST /api/favorite/toggle  { itemId }  (auth) -> add if absent, remove if present
const toggleFavorite = async (req, res) => {
    try {
        const userData = await userModel.findById(req.body.userId);
        let favorites = Array.isArray(userData.favorites) ? userData.favorites : [];
        const id = req.body.itemId;
        let favorited;
        if (favorites.includes(id)) {
            favorites = favorites.filter((f) => f !== id);
            favorited = false;
        } else {
            favorites = [...favorites, id];
            favorited = true;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { favorites });
        res.json({ success: true, favorited, favorites });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// POST /api/favorite/get  (auth) -> array of favorited food ids
const getFavorites = async (req, res) => {
    try {
        const userData = await userModel.findById(req.body.userId);
        res.json({ success: true, favorites: userData.favorites || [] });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { toggleFavorite, getFavorites }
