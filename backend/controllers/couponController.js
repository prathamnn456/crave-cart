// Simple in-code coupon catalog. Extend or move to the DB later.
// discount is computed against the cart SUBTOTAL (before delivery fee).
const COUPONS = {
    CRAVE10:   { type: 'percent', value: 10, label: '10% off your order' },
    SAVE20:    { type: 'percent', value: 20, label: '20% off your order' },
    WELCOME15: { type: 'percent', value: 15, maxDiscount: 100, label: '15% off (up to ₹100)' },
    FLAT50:    { type: 'flat', value: 50, minOrder: 200, label: '₹50 off orders over ₹200' },
};

// Authoritative discount calculation, reused by the order controllers.
// returns { valid, discount, code, label, message }
export const computeDiscount = (rawCode, subtotal) => {
    if (!rawCode) return { valid: false, discount: 0, message: 'No coupon' };
    const code = String(rawCode).trim().toUpperCase();
    const c = COUPONS[code];
    if (!c) return { valid: false, discount: 0, message: 'Invalid coupon code' };
    if (c.minOrder && subtotal < c.minOrder) {
        return { valid: false, discount: 0, message: `Add ₹${c.minOrder - subtotal} more to use ${code}` };
    }
    let discount = c.type === 'percent' ? (subtotal * c.value) / 100 : c.value;
    if (c.maxDiscount) discount = Math.min(discount, c.maxDiscount);
    discount = Math.min(Math.round(discount), subtotal); // never exceed the subtotal
    if (discount <= 0) return { valid: false, discount: 0, message: 'Coupon not applicable' };
    return { valid: true, discount, code, label: c.label, message: `${code} applied — you saved ₹${discount}` };
};

// POST /api/coupon/apply  { code, amount }  (amount = cart subtotal)
const applyCoupon = async (req, res) => {
    try {
        const result = computeDiscount(req.body.code, Number(req.body.amount) || 0);
        if (!result.valid) return res.json({ success: false, message: result.message });
        res.json({ success: true, discount: result.discount, code: result.code, label: result.label, message: result.message });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error' });
    }
};

export { applyCoupon };
