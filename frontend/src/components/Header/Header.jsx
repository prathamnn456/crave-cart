import React from 'react'
import './Header.css'
import { assets } from '../../assets/assets'

const Header = ({ search, setSearch }) => {

    const goToDishes = () => {
        document.getElementById('food-display')?.scrollIntoView({ behavior: 'smooth' })
    }

    const onSearchSubmit = (e) => {
        e.preventDefault()
        goToDishes()
    }

    const searchFor = (term) => {
        setSearch(term)
        goToDishes()
    }

    return (
        <div className='header'>
            <div className='header-left'>
                <span className='header-eyebrow'><span className='header-live'></span>Delivering in Chandrapur now</span>
                <h2>Crave it.<br />We <em>deliver</em> it.</h2>
                <p>Fresh, fast, and full of flavour — order from the best kitchens in town and let the feast come to you.</p>

                <form className='header-search' onSubmit={onSearchSubmit}>
                    <input
                        placeholder='Search biryani, rolls, cheesecake…'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type='submit' className='header-search-btn'>Search</button>
                </form>

                <div className='header-popular'>
                    Popular:
                    <button type='button' className='header-tag' onClick={() => searchFor('Rolls')}>Rolls</button>
                    <button type='button' className='header-tag' onClick={() => searchFor('Cake')}>Cake</button>
                    <button type='button' className='header-tag' onClick={() => searchFor('Pasta')}>Pasta</button>
                    <button type='button' className='header-tag' onClick={() => searchFor('Salad')}>Salad</button>
                </div>

                <div className='header-stats'>
                    <div><b>30 min</b><span>Avg. delivery</span></div>
                    <div><b>4.8★</b><span>Customer rating</span></div>
                    <div><b>120+</b><span>Dishes</span></div>
                </div>
            </div>

            <div className='header-right'>
                <div className='header-img-frame'>
                    <img src={assets.header_img} alt="Delicious food from CraveCart" />
                </div>
                <div className='header-float f1'><span>⚡</span><div><b>Free delivery</b><small>on orders ₹199+</small></div></div>
                <div className='header-float f2'><span>🌟</span><div><b>4.8 rating</b><small>2,400+ reviews</small></div></div>
            </div>
        </div>
    )
}

export default Header
