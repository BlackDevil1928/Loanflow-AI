import { Link } from 'react-router-dom'

export default function Logo({ className = "w-8 h-8" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#38bdf8', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#0284c7', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#7dd3fc', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#38bdf8', stopOpacity: 1 }} />
                </linearGradient>
            </defs>

            <circle cx="256" cy="256" r="240" fill="url(#logoGradient)" opacity="0.1" />

            <path
                d="M 150 150 L 150 380 L 280 380 L 280 340 L 190 340 L 190 150 Z"
                fill="url(#logoGradient)"
                stroke="url(#accentGradient)"
                strokeWidth="4"
            />

            <path
                d="M 200 200 Q 280 180 360 200"
                stroke="url(#accentGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
            />

            <path
                d="M 200 240 Q 280 220 360 240"
                stroke="url(#accentGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                opacity="0.8"
            />

            <path
                d="M 200 280 Q 280 260 360 280"
                stroke="url(#accentGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
            />

            <circle cx="200" cy="200" r="8" fill="#7dd3fc" />
            <circle cx="280" cy="180" r="8" fill="#38bdf8" />
            <circle cx="360" cy="200" r="8" fill="#0ea5e9" />

            <circle cx="200" cy="240" r="6" fill="#7dd3fc" opacity="0.8" />
            <circle cx="280" cy="220" r="6" fill="#38bdf8" opacity="0.8" />
            <circle cx="360" cy="240" r="6" fill="#0ea5e9" opacity="0.8" />

            <circle cx="200" cy="280" r="6" fill="#7dd3fc" opacity="0.6" />
            <circle cx="280" cy="260" r="6" fill="#38bdf8" opacity="0.6" />
            <circle cx="360" cy="280" r="6" fill="#0ea5e9" opacity="0.6" />

            <path
                d="M 340 160 L 345 170 L 355 165 L 350 175 L 360 180 L 350 185 L 355 195 L 345 190 L 340 200 L 335 190 L 325 195 L 330 185 L 320 180 L 330 175 L 325 165 L 335 170 Z"
                fill="#7dd3fc"
                opacity="0.8"
            />
        </svg>
    )
}
