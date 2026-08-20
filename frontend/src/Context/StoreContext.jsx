import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = import.meta.env.VITE_API_URL || "http://localhost:4000"
    const [food_list, setFoodList] = useState([]);
    const [foodLoading, setFoodLoading] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const [favorites, setFavorites] = useState([]); // array of favorited food ids
    const [ratings, setRatings] = useState({}); // foodId -> { avg, count }
    const [coupon, setCoupon] = useState(null); // { code, discount, label }
    const currency = "₹";
    const deliveryCharge = 50;

    const addToCart = async (itemId) => {
        const isNew = !cartItems[itemId];
        if (isNew) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        const item = food_list.find((p) => p._id === itemId);
        toast.success(`${item ? item.name : "Item"} added to cart 🛒`, { toastId: "cart" });
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        const item = food_list.find((p) => p._id === itemId);
        const willBeEmpty = cartItems[itemId] <= 1;
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        toast.info(willBeEmpty ? `${item ? item.name : "Item"} removed from cart` : "Removed one", { toastId: "cart" });
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
              if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }  
            } catch (error) {
                
            }
            
        }
        return totalAmount;
    }

    const applyCoupon = async (code) => {
        const subtotal = getTotalCartAmount();
        if (!code || !code.trim()) {
            toast.error("Please enter a promo code");
            return false;
        }
        try {
            const res = await axios.post(url + "/api/coupon/apply", { code, amount: subtotal });
            if (res.data.success) {
                setCoupon({ code: res.data.code, discount: res.data.discount, label: res.data.label });
                toast.success(res.data.message);
                return true;
            }
            toast.error(res.data.message || "That promo code isn't valid");
            return false;
        } catch (error) {
            toast.error("Could not apply coupon");
            return false;
        }
    }

    const removeCoupon = () => setCoupon(null);

    // discount clamped to the current subtotal (in case the cart shrank)
    const getDiscount = () => (coupon ? Math.min(coupon.discount, getTotalCartAmount()) : 0);

    // keep the discount in sync when the cart changes while a coupon is applied
    useEffect(() => {
        if (!coupon) return;
        const subtotal = getTotalCartAmount();
        if (subtotal === 0) { setCoupon(null); return; }
        (async () => {
            try {
                const res = await axios.post(url + "/api/coupon/apply", { code: coupon.code, amount: subtotal });
                if (res.data.success) {
                    setCoupon({ code: res.data.code, discount: res.data.discount, label: res.data.label });
                } else {
                    setCoupon(null);
                }
            } catch { /* keep last known discount on network error */ }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartItems]);

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data)
        } finally {
            setFoodLoading(false)
        }
    }

    const loadRatings = async () => {
        try {
            const res = await axios.post(url + "/api/review/summary", {});
            setRatings(res.data.summary || {});
        } catch { /* ignore */ }
    }

    const getRating = (id) => ratings[id] || { avg: 0, count: 0 };

    const submitReview = async (foodId, rating, comment) => {
        if (!token) { toast.info("Sign in to leave a review"); return false; }
        try {
            const res = await axios.post(url + "/api/review/add", { foodId, rating, comment }, { headers: { token } });
            if (res.data.success) {
                toast.success("Thanks for your review! ⭐");
                loadRatings();
                return true;
            }
            toast.error(res.data.message || "Could not save review");
            return false;
        } catch {
            toast.error("Could not save review");
            return false;
        }
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
        setCartItems(response.data.cartData);
    }

    const isFavorite = (id) => favorites.includes(id);

    const toggleFavorite = async (id) => {
        if (!token) {
            toast.info("Sign in to save your favorites ❤️", { toastId: "fav" });
            return;
        }
        const willFav = !favorites.includes(id);
        setFavorites((prev) => willFav ? [...prev, id] : prev.filter((f) => f !== id)); // optimistic
        const item = food_list.find((p) => p._id === id);
        toast[willFav ? "success" : "info"](
            `${item ? item.name : "Item"} ${willFav ? "added to" : "removed from"} favorites`,
            { toastId: "fav" }
        );
        try {
            await axios.post(url + "/api/favorite/toggle", { itemId: id }, { headers: { token } });
        } catch {
            setFavorites((prev) => willFav ? prev.filter((f) => f !== id) : [...prev, id]); // revert
            toast.error("Could not update favorites");
        }
    }

    const loadFavorites = async (tk) => {
        try {
            const res = await axios.post(url + "/api/favorite/get", {}, { headers: { token: tk } });
            setFavorites(res.data.favorites || []);
        } catch { /* ignore */ }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            loadRatings();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData({ token: localStorage.getItem("token") })
                await loadFavorites(localStorage.getItem("token"))
            }
        }
        loadData()
    }, [])

    const contextValue = {
        url,
        food_list,
        foodLoading,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge,
        coupon,
        applyCoupon,
        removeCoupon,
        getDiscount,
        favorites,
        isFavorite,
        toggleFavorite,
        loadFavorites,
        ratings,
        getRating,
        submitReview
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;