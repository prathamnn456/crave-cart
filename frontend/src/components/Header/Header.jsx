import React, { useContext, useState } from 'react'
import './Header.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import useVisitorArea from '../../hooks/useVisitorArea'
import { haversineKm, etaFromKm, KITCHEN } from '../../utils/geo'

const Header = ({ search, setSearch }) => {

    const { userName, food_list, url } = useContext(StoreContext)
    const firstName = userName ? userName.trim().split(' ')[0] : ''
    const { area, coords } = useVisitorArea()
    const eta = coords ? etaFromKm(haversineKm(KITCHEN, coords)) : null

    const [focused, setFocused] = useState(false)

    // live suggestions matching what's typed (name or category), max 6
    const q = (search || '').trim().toLowerCase()
    const suggestions = q
        ? food_list.filter((it) =>
            it.name.toLowerCase().includes(q) || (it.category || '').toLowerCase().includes(q)
          ).slice(0, 6)
        : []
    const showSuggest = focused && suggestions.length > 0

    const goToDishes = () => {
        document.getElementById('food-display')?.scrollIntoView({ behavior: 'smooth' })
    }

    const onSearchSubmit = (e) => {
        e.preventDefault()
        setFocused(false)
        goToDishes()
    }

    const searchFor = (term) => {
        setSearch(term)
        goToDishes()
    }

    const pickSuggestion = (name) => {
        setSearch(name)
        setFocused(false)
        goToDishes()
    }

    return (
        <div className='header'>
            <div className='header-left'>
                <span className='header-eyebrow'><span className='header-live'></span>{area ? `Delivering in ${area} now` : 'Delivering near you now'}</span>
                {firstName && (
                    <p className='header-greeting'>👋 Hello <b>{firstName}</b>, welcome to CraveCart!</p>
                )}
                <h2>Crave it.<br />We <em>deliver</em> it.</h2>
                <p>Fresh, fast, and full of flavour — order from the best kitchens in town and let the feast come to you.</p>

                <div className='header-search-wrap'>
                    <form className='header-search' onSubmit={onSearchSubmit}>
                        <input
                            placeholder='Search biryani, rolls, cheesecake…'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setTimeout(() => setFocused(false), 120)}
                        />
                        <button type='submit' className='header-search-btn'>Search</button>
                    </form>
                    {showSuggest && (
                        <ul className='header-suggest'>
                            {suggestions.map((it) => (
                                <li key={it._id} onMouseDown={() => pickSuggestion(it.name)}>
                                    <img src={it.image ? `${url}/images/${it.image}` : assets.search_icon} alt='' />
                                    <span className='header-suggest-name'>{it.name}</span>
                                    <span className='header-suggest-cat'>{it.category}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className='header-popular'>
                    Popular:
                    <button type='button' className='header-tag' onClick={() => searchFor('Rolls')}>Rolls</button>
                    <button type='button' className='header-tag' onClick={() => searchFor('Cake')}>Cake</button>
                    <button type='button' className='header-tag' onClick={() => searchFor('Pasta')}>Pasta</button>
                    <button type='button' className='header-tag' onClick={() => searchFor('Salad')}>Salad</button>
                </div>

                <div className='header-stats'>
                    <div><b>{eta ? `~${eta} min` : '30 min'}</b><span>{eta ? 'To your location' : 'Avg. delivery'}</span></div>
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
