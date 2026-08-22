import React, { useContext, useState } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../Context/StoreContext'

const FoodDisplay = ({ category, search, foodType = "all", setFoodType, onQuickView }) => {

  const { food_list, foodLoading, getRating } = useContext(StoreContext);
  const [sort, setSort] = useState("recommended");
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

  const rate = (id) => (getRating ? getRating(id).avg || 0 : 0);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return rate(b._id) - rate(a._id);
    return 0; // recommended = original order
  });

  return (
    <div className='food-display' id='food-display'>
      <div className='food-display-head'>
        <h2>{q ? `Results for “${search}”` : 'Top dishes near you'}</h2>
        <div className='food-display-controls'>
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
          <select className='food-sort' value={sort} onChange={(e) => setSort(e.target.value)} aria-label='Sort dishes'>
            <option value='recommended'>Recommended</option>
            <option value='price-asc'>Price: Low to High</option>
            <option value='price-desc'>Price: High to Low</option>
            <option value='rating'>Top rated</option>
          </select>
        </div>
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
          {sorted.map((item) => (
            <FoodItem key={item._id} image={item.image} name={item.name} desc={item.description} price={item.price} id={item._id} type={item.type} category={item.category} available={item.available} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FoodDisplay
