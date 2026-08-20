import React, { useContext, useState } from 'react'
import './Favorites.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'
import FoodModal from '../../components/FoodModal/FoodModal'
import { useNavigate } from 'react-router-dom'

const Favorites = () => {
  const { food_list, favorites, token } = useContext(StoreContext)
  const [quickItem, setQuickItem] = useState(null)
  const navigate = useNavigate()

  const favItems = food_list.filter((f) => favorites.includes(f._id))

  return (
    <div className='favorites'>
      <div className='favorites-head'>
        <h1>Your favorites</h1>
        {token && favItems.length > 0 && (
          <span className='favorites-count'>{favItems.length} saved dish{favItems.length === 1 ? '' : 'es'}</span>
        )}
      </div>

      {!token ? (
        <div className='favorites-empty'>
          <p>Sign in to see your saved dishes.</p>
          <span>Tap the ❤️ on any dish to keep it here.</span>
        </div>
      ) : favItems.length === 0 ? (
        <div className='favorites-empty'>
          <p>No favorites yet.</p>
          <span>Tap the ❤️ on any dish to keep it here.</span>
          <button onClick={() => navigate('/')}>Browse the menu</button>
        </div>
      ) : (
        <div className='food-display-list'>
          {favItems.map((item) => (
            <FoodItem key={item._id} image={item.image} name={item.name} desc={item.description} price={item.price} id={item._id} type={item.type} category={item.category} onQuickView={setQuickItem} />
          ))}
        </div>
      )}

      {quickItem && <FoodModal item={quickItem} onClose={() => setQuickItem(null)} />}
    </div>
  )
}

export default Favorites
