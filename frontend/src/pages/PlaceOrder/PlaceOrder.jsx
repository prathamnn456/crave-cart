import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import LocationPicker from '../../components/LocationPicker/LocationPicker';

const PlaceOrder = () => {

    const [payment, setPayment] = useState("cod")
    const [loc, setLoc] = useState(null) // { lat, lng } delivery pin
    const [savedAddrs, setSavedAddrs] = useState([])
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    })

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems,currency,deliveryCharge,coupon,getDiscount } = useContext(StoreContext);

    const navigate = useNavigate();

    const subtotal = getTotalCartAmount();
    const discount = getDiscount();
    const orderTotal = subtotal === 0 ? 0 : subtotal - discount + deliveryCharge;

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    useEffect(() => {
        if (!token) return
        axios.post(url + '/api/user/profile', {}, { headers: { token } })
            .then(r => { if (r.data.success) setSavedAddrs(r.data.user.addresses || []) })
            .catch(() => { })
    }, [token])

    // fill address fields from a reverse-geocoded map location
    const applyGeoAddress = (addr) => {
        setData(d => ({
            ...d,
            street: addr.street || d.street,
            city: addr.city || d.city,
            state: addr.state || d.state,
            zipcode: addr.zipcode || d.zipcode,
            country: addr.country || d.country,
        }))
        toast.success('Address filled from your location 📍', { toastId: 'geoaddr' })
    }

    const applySaved = (id) => {
        const a = savedAddrs.find(x => x.id === id)
        if (!a) return
        setData(d => ({
            ...d,
            firstName: a.firstName || '', lastName: a.lastName || '',
            street: a.street || '', city: a.city || '', state: a.state || '',
            zipcode: a.zipcode || '', country: a.country || '', phone: a.phone || '',
        }))
    }

    const placeOrder = async (e) => {
        e.preventDefault()
        let orderItems = [];
        food_list.map(((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo)
            }
        }))
        let orderData = {
            address: { ...data, ...(loc ? { lat: loc.lat, lng: loc.lng } : {}) },
            items: orderItems,
            amount: orderTotal,
            couponCode: coupon ? coupon.code : "",
        }
        if (payment === "stripe") {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            }
            else {
                toast.error("Something Went Wrong")
            }
        }
        else{
            let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
            if (response.data.success) {
                navigate("/myorders")
                toast.success(response.data.message)
                setCartItems({});
            }
            else {
                toast.error("Something Went Wrong")
            }
        }

    }

    useEffect(() => {
        if (!token) {
            toast.error("to place an order sign in first")
            navigate('/cart')
        }
        else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token])

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                {savedAddrs.length > 0 && (
                    <select className='saved-addr-select' defaultValue='' onChange={(e) => applySaved(e.target.value)}>
                        <option value='' disabled>📍 Use a saved address…</option>
                        {savedAddrs.map(a => <option key={a.id} value={a.id}>{a.firstName} {a.lastName} — {a.street}, {a.city}</option>)}
                    </select>
                )}
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
                <div className="multi-field">
                    <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
                    <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
                </div>
                <div className="multi-field">
                    <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
                    <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
                </div>
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
                <div className='place-order-map'>
                    <LocationPicker value={loc} onChange={setLoc} onAddress={applyGeoAddress} />
                </div>
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{subtotal}</p></div>
                        <hr />
                        {discount > 0 && (
                            <>
                                <div className="cart-total-details cart-total-discount"><p>Discount ({coupon.code})</p><p>-{currency}{discount}</p></div>
                                <hr />
                            </>
                        )}
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{subtotal === 0 ? 0 : deliveryCharge}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{orderTotal}</b></div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD ( Cash on delivery )</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Stripe ( Credit / Debit )</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>{payment==="cod"?"Place Order":"Proceed To Payment"}</button>
            </div>
        </form>
    )
}

export default PlaceOrder
