import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'

const AppDownload = () => {
    return (
        <div className='app-download reveal' id='app-download'>
            <div className='app-download-text'>
                <h2>Get the CraveCart app</h2>
                <p>Faster checkout, live tracking, and app-only deals. Your cravings, one tap away.</p>
            </div>
            <div className="app-download-platforms">
                <img src={assets.play_store} alt="Get it on Google Play" />
                <img src={assets.app_store} alt="Download on the App Store" />
            </div>
        </div>
    )
}

export default AppDownload
