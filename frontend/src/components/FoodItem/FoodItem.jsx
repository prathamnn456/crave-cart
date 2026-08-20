import React, { useContext, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';
import StarRating from '../StarRating/StarRating';

const FoodItem = ({ image, name, price, desc , id, type, category, onQuickView }) => {

    const [itemCount, setItemCount] = useState(0);
    const {cartItems,addToCart,removeFromCart,url,currency,isFavorite,toggleFavorite,getRating} = useContext(StoreContext);
    const { avg: rating, count } = getRating(id);
    const faved = isFavorite(id);

    const openQuickView = () => onQuickView && onQuickView({ image, name, price, desc, id, type, category });

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className='food-item-image food-item-clickable' src={url+"/images/"+image} alt={name} onClick={openQuickView} />
                <button
                    className={'food-item-fav' + (faved ? ' active' : '')}
                    title={faved ? 'Remove from favorites' : 'Add to favorites'}
                    onClick={() => toggleFavorite(id)}
                >
                    <svg viewBox="0 0 24 24" fill={faved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M12 21s-6.7-4.35-9.33-8.02C.9 10.36 1.4 6.9 4.1 5.6c1.9-.9 4.02-.2 5.2 1.35L12 9.9l2.7-2.95c1.18-1.55 3.3-2.25 5.2-1.35 2.7 1.3 3.2 4.76 1.43 7.38C18.7 16.65 12 21 12 21Z" strokeLinejoin="round"/>
                    </svg>
                </button>
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
