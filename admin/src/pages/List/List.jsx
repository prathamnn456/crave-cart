import React, { useEffect, useState } from 'react'
import './List.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if (response.data.success) {
      setList(response.data.data);
    }
    else {
      toast.error("Error")
    }
  }

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {
      id: foodId
    })
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    }
    else {
      toast.error("Error")
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list'>
      <div className="page-head">
        <div>
          <h1>Menu</h1>
          <div className="sub">{list.length} item{list.length === 1 ? '' : 's'} live on CraveCart.</div>
        </div>
      </div>

      <div className='menu-grid'>
        {list.map((item, index) => (
          <div key={index} className='food-card'>
            <div className='food-thumb'>
              <img src={`${url}/images/` + item.image} alt={item.name} />
              <button className='food-remove' title='Remove item' onClick={() => removeFood(item._id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className='food-body'>
              <div className='food-row1'>
                <b>{item.name}</b>
                <span className='food-price tnum'>{currency}{item.price}</span>
              </div>
              <p className='food-desc'>{item.description}</p>
              <span className='food-cat'>{item.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List
