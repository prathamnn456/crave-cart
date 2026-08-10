import React, { useContext } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../Context/StoreContext'

const FoodDisplay = ({ category, search, foodType = "all", setFoodType, onQuickView }) => {

  const { food_list, foodLoading } = useContext(StoreContext);
  const q = (search || "").trim().toLowerCase();

  const filtered = food_list.filter((item) => {
    const matchesCategory = category === "All" || category === item.category;
    const matchesSearch = !q
      || item.name.toLowerCase().includes(q)
      || (item.description || "").toLowerCase().includes(q)
      || (item.category || "").toLowerCase().includes(q);
    const matchesType = foodType === "all" || (item.type || "veg") === foodType;
    return matchesCategory && matchesSearch && matchesType;
  });

  return (
    <div className='food-display' id='food-display'>
      <div className='food-display-head'>
        <h2>{q ? `Results for “${search}”` : 'Top dishes near you'}</h2>
        {setFoodType && (
          <div className='food-type-filter'>
            <button className={foodType === 'all' ? 'active' : ''} onClick={() => setFoodType('all')}>All</button>
            <button className={'veg' + (foodType === 'veg' ? ' active' : '')} onClick={() => setFoodType('veg')}>
              <span className='veg-dot'></span> Veg
            </button>
            <button className={'nonveg' + (foodType === 'nonveg' ? ' active' : '')} onClick={() => setFoodType('nonveg')}>
              <span className='veg-dot nonveg'></span> Non-veg
            </button>
          </div>
        )}
      </div>
      {q && !foodLoading && <p className='food-display-count'>{filtered.length} dish{filtered.length === 1 ? '' : 'es'} found</p>}

      {foodLoading ? (
        <div className='food-display-list'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div className='food-skeleton' key={i}>
              <div className='sk sk-img'></div>
              <div className='food-skeleton-body'>
                <div className='sk sk-line lg'></div>
                <div className='sk sk-line sm'></div>
                <div className='sk sk-line price'></div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className='food-display-empty'>
          <p>No dishes match your search.</p>
          <span>Try another dish or category.</span>
        </div>
      ) : (
        <div className='food-display-list'>
          {filtered.map((item) => (
            <FoodItem key={item._id} image={item.image} name={item.name} desc={item.description} price={item.price} id={item._id} type={item.type} category={item.category} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FoodDisplay
