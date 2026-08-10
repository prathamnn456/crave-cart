import React, { useContext, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';
import StarRating, { ratingFor } from '../StarRating/StarRating';

const FoodItem = ({ image, name, price, desc , id, type, category, onQuickView }) => {

    const [itemCount, setItemCount] = useState(0);
    const {cartItems,addToCart,removeFromCart,url,currency} = useContext(StoreContext);
    const { rating, count } = ratingFor(id);

    const openQuickView = () => onQuickView && onQuickView({ image, name, price, desc, id, type, category });

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className='food-item-image food-item-clickable' src={url+"/images/"+image} alt={name} onClick={openQuickView} />
                <span className={'food-item-veg veg-dot' + (type === 'nonveg' ? ' nonveg' : '')} title={type === 'nonveg' ? 'Non-veg' : 'Veg'}></span>
                {!cartItems[id]
                ?<img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="" />
                :<div className="food-item-counter">
                        <img src={assets.remove_icon_red} onClick={()=>removeFromCart(id)} alt="" />
                        <p>{cartItems[id]}</p>
                        <img src={assets.add_icon_green} onClick={()=>addToCart(id)} alt="" />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p className='food-item-clickable' onClick={openQuickView}>{name}</p> <StarRating rating={rating} count={count} />
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className="food-item-price">{currency}{price}</p>
            </div>
        </div>
    )
}

export default FoodItem
