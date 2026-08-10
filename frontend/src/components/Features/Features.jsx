import React from 'react'
import './Features.css'

const items = [
    {
        title: 'Lightning-fast delivery',
        text: 'Hot meals at your door in about 30 minutes, every time.',
        icon: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" strokeLinejoin="round" />,
    },
    {
        title: 'Live order tracking',
        text: 'Follow your rider on the map from kitchen to doorstep.',
        icon: <><circle cx="12" cy="10" r="3" /><path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8Z" strokeLinejoin="round" /></>,
    },
    {
        title: 'Freshness guaranteed',
        text: "Not happy with your meal? We'll make it right, no questions.",
        icon: <path d="M20 7 9 18l-5-5" strokeLinecap="round" strokeLinejoin="round" />,
    },
]

const Features = () => {
    return (
        <div className='features'>
            {items.map((f, i) => (
                <div className='feature reveal' style={{ '--reveal-delay': `${i * 90}ms` }} key={i}>
                    <div className='feature-ic'>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">{f.icon}</svg>
                    </div>
                    <b>{f.title}</b>
                    <p>{f.text}</p>
                </div>
            ))}
        </div>
    )
}

export default Features
