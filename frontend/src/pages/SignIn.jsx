import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Sparkles, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

// Pupil Component
const Pupil = ({ size = 12, maxDistance = 5, pupilColor = "black", forceLookX, forceLookY }) => {
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)
    const pupilRef = useRef(null)

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMouseX(e.clientX)
            setMouseY(e.clientY)
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    const calculatePupilPosition = () => {
        if (!pupilRef.current) return { x: 0, y: 0 }
        if (forceLookX !== undefined && forceLookY !== undefined) {
            return { x: forceLookX, y: forceLookY }
        }

        const pupil = pupilRef.current.getBoundingClientRect()
        const pupilCenterX = pupil.left + pupil.width / 2
        const pupilCenterY = pupil.top + pupil.height / 2
        const deltaX = mouseX - pupilCenterX
        const deltaY = mouseY - pupilCenterY
        const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance)
        const angle = Math.atan2(deltaY, deltaX)
        const x = Math.cos(angle) * distance
        const y = Math.sin(angle) * distance

        return { x, y }
    }

    const pupilPosition = calculatePupilPosition()

    return (
        <div
            ref={pupilRef}
            className="rounded-full"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: pupilColor,
                transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                transition: 'transform 0.1s ease-out',
            }}
        />
    )
}

// EyeBall Component
const EyeBall = ({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = "white", pupilColor = "black", isBlinking = false, forceLookX, forceLookY }) => {
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)
    const eyeRef = useRef(null)

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMouseX(e.clientX)
            setMouseY(e.clientY)
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    const calculatePupilPosition = () => {
        if (!eyeRef.current) return { x: 0, y: 0 }
        if (forceLookX !== undefined && forceLookY !== undefined) {
            return { x: forceLookX, y: forceLookY }
        }

        const eye = eyeRef.current.getBoundingClientRect()
        const eyeCenterX = eye.left + eye.width / 2
        const eyeCenterY = eye.top + eye.height / 2
        const deltaX = mouseX - eyeCenterX
        const deltaY = mouseY - eyeCenterY
        const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance)
        const angle = Math.atan2(deltaY, deltaX)
        const x = Math.cos(angle) * distance
        const y = Math.sin(angle) * distance

        return { x, y }
    }

    const pupilPosition = calculatePupilPosition()

    return (
        <div
            ref={eyeRef}
            className="rounded-full flex items-center justify-center transition-all duration-150"
            style={{
                width: `${size}px`,
                height: isBlinking ? '2px' : `${size}px`,
                backgroundColor: eyeColor,
                overflow: 'hidden',
            }}
        >
            {!isBlinking && (
                <div
                    className="rounded-full"
                    style={{
                        width: `${pupilSize}px`,
                        height: `${pupilSize}px`,
                        backgroundColor: pupilColor,
                        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                        transition: 'transform 0.1s ease-out',
                    }}
                />
            )}
        </div>
    )
}

export default function SignIn() {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const navigate = useNavigate()

    // Animation states
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)
    const [isPurpleBlinking, setIsPurpleBlinking] = useState(false)
    const [isBlackBlinking, setIsBlackBlinking] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false)
    const [isPurplePeeking, setIsPurplePeeking] = useState(false)

    const purpleRef = useRef(null)
    const blackRef = useRef(null)
    const yellowRef = useRef(null)
    const orangeRef = useRef(null)

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMouseX(e.clientX)
            setMouseY(e.clientY)
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    // Blinking effects
    useEffect(() => {
        const scheduleBlink = (setBlink) => {
            const blinkTimeout = setTimeout(() => {
                setBlink(true)
                setTimeout(() => {
                    setBlink(false)
                    scheduleBlink(setBlink)
                }, 150)
            }, Math.random() * 4000 + 3000)
            return blinkTimeout
        }

        const purpleTimeout = scheduleBlink(setIsPurpleBlinking)
        const blackTimeout = scheduleBlink(setIsBlackBlinking)
        return () => {
            clearTimeout(purpleTimeout)
            clearTimeout(blackTimeout)
        }
    }, [])

    // Looking at each other when typing
    useEffect(() => {
        if (isTyping) {
            setIsLookingAtEachOther(true)
            const timer = setTimeout(() => setIsLookingAtEachOther(false), 800)
            return () => clearTimeout(timer)
        }
    }, [isTyping])

    // Purple peeking when password is visible
    useEffect(() => {
        if (formData.password.length > 0 && showPassword) {
            const peekTimeout = setTimeout(() => {
                setIsPurplePeeking(true)
                setTimeout(() => setIsPurplePeeking(false), 800)
            }, Math.random() * 3000 + 2000)
            return () => clearTimeout(peekTimeout)
        }
    }, [formData.password, showPassword, isPurplePeeking])

    const calculatePosition = (ref) => {
        if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 }
        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 3
        const deltaX = mouseX - centerX
        const deltaY = mouseY - centerY
        const faceX = Math.max(-15, Math.min(15, deltaX / 20))
        const faceY = Math.max(-10, Math.min(10, deltaY / 30))
        const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120))
        return { faceX, faceY, bodySkew }
    }

    const purplePos = calculatePosition(purpleRef)
    const blackPos = calculatePosition(blackRef)
    const yellowPos = calculatePosition(yellowRef)
    const orangePos = calculatePosition(orangeRef)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { data, error } = await signIn(formData.email, formData.password)

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            navigate('/dashboard')
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Content Section with Characters */}
            <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 p-12 text-white">
                <div className="relative z-20">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <span>AI Loan Assistant</span>
                    </div>
                </div>

                <div className="relative z-20 flex items-end justify-center h-[500px]">
                    {/* Cartoon Characters */}
                    <div className="relative" style={{ width: '550px', height: '400px' }}>
                        {/* Purple character */}
                        <div
                            ref={purpleRef}
                            className="absolute bottom-0 transition-all duration-700 ease-in-out"
                            style={{
                                left: '70px',
                                width: '180px',
                                height: (isTyping || (formData.password.length > 0 && !showPassword)) ? '440px' : '400px',
                                backgroundColor: '#6C3FF5',
                                borderRadius: '10px 10px 0 0',
                                zIndex: 1,
                                transform: (formData.password.length > 0 && showPassword)
                                    ? `skewX(0deg)`
                                    : (isTyping || (formData.password.length > 0 && !showPassword))
                                        ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
                                        : `skewX(${purplePos.bodySkew || 0}deg)`,
                                transformOrigin: 'bottom center',
                            }}
                        >
                            <div
                                className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                                style={{
                                    left: (formData.password.length > 0 && showPassword) ? `20px` : isLookingAtEachOther ? `55px` : `${45 + purplePos.faceX}px`,
                                    top: (formData.password.length > 0 && showPassword) ? `35px` : isLookingAtEachOther ? `65px` : `${40 + purplePos.faceY}px`,
                                }}
                            >
                                <EyeBall
                                    size={18}
                                    pupilSize={7}
                                    maxDistance={5}
                                    eyeColor="white"
                                    pupilColor="#2D2D2D"
                                    isBlinking={isPurpleBlinking}
                                    forceLookX={(formData.password.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                                    forceLookY={(formData.password.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                                />
                                <EyeBall
                                    size={18}
                                    pupilSize={7}
                                    maxDistance={5}
                                    eyeColor="white"
                                    pupilColor="#2D2D2D"
                                    isBlinking={isPurpleBlinking}
                                    forceLookX={(formData.password.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                                    forceLookY={(formData.password.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                                />
                            </div>
                        </div>

                        {/* Black character */}
                        <div
                            ref={blackRef}
                            className="absolute bottom-0 transition-all duration-700 ease-in-out"
                            style={{
                                left: '240px',
                                width: '120px',
                                height: '310px',
                                backgroundColor: '#2D2D2D',
                                borderRadius: '8px 8px 0 0',
                                zIndex: 2,
                                transform: (formData.password.length > 0 && showPassword)
                                    ? `skewX(0deg)`
                                    : isLookingAtEachOther
                                        ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                                        : (isTyping || (formData.password.length > 0 && !showPassword))
                                            ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                                            : `skewX(${blackPos.bodySkew || 0}deg)`,
                                transformOrigin: 'bottom center',
                            }}
                        >
                            <div
                                className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                                style={{
                                    left: (formData.password.length > 0 && showPassword) ? `10px` : isLookingAtEachOther ? `32px` : `${26 + blackPos.faceX}px`,
                                    top: (formData.password.length > 0 && showPassword) ? `28px` : isLookingAtEachOther ? `12px` : `${32 + blackPos.faceY}px`,
                                }}
                            >
                                <EyeBall
                                    size={16}
                                    pupilSize={6}
                                    maxDistance={4}
                                    eyeColor="white"
                                    pupilColor="#2D2D2D"
                                    isBlinking={isBlackBlinking}
                                    forceLookX={(formData.password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                                    forceLookY={(formData.password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
                                />
                                <EyeBall
                                    size={16}
                                    pupilSize={6}
                                    maxDistance={4}
                                    eyeColor="white"
                                    pupilColor="#2D2D2D"
                                    isBlinking={isBlackBlinking}
                                    forceLookX={(formData.password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                                    forceLookY={(formData.password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
                                />
                            </div>
                        </div>

                        {/* Orange character */}
                        <div
                            ref={orangeRef}
                            className="absolute bottom-0 transition-all duration-700 ease-in-out"
                            style={{
                                left: '0px',
                                width: '240px',
                                height: '200px',
                                zIndex: 3,
                                backgroundColor: '#FF9B6B',
                                borderRadius: '120px 120px 0 0',
                                transform: (formData.password.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${orangePos.bodySkew || 0}deg)`,
                                transformOrigin: 'bottom center',
                            }}
                        >
                            <div
                                className="absolute flex gap-8 transition-all duration-200 ease-out"
                                style={{
                                    left: (formData.password.length > 0 && showPassword) ? `50px` : `${82 + (orangePos.faceX || 0)}px`,
                                    top: (formData.password.length > 0 && showPassword) ? `85px` : `${90 + (orangePos.faceY || 0)}px`,
                                }}
                            >
                                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(formData.password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(formData.password.length > 0 && showPassword) ? -4 : undefined} />
                                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(formData.password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(formData.password.length > 0 && showPassword) ? -4 : undefined} />
                            </div>
                        </div>

                        {/* Yellow character */}
                        <div
                            ref={yellowRef}
                            className="absolute bottom-0 transition-all duration-700 ease-in-out"
                            style={{
                                left: '310px',
                                width: '140px',
                                height: '230px',
                                backgroundColor: '#E8D754',
                                borderRadius: '70px 70px 0 0',
                                zIndex: 4,
                                transform: (formData.password.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${yellowPos.bodySkew || 0}deg)`,
                                transformOrigin: 'bottom center',
                            }}
                        >
                            <div
                                className="absolute flex gap-6 transition-all duration-200 ease-out"
                                style={{
                                    left: (formData.password.length > 0 && showPassword) ? `20px` : `${52 + (yellowPos.faceX || 0)}px`,
                                    top: (formData.password.length > 0 && showPassword) ? `35px` : `${40 + (yellowPos.faceY || 0)}px`,
                                }}
                            >
                                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(formData.password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(formData.password.length > 0 && showPassword) ? -4 : undefined} />
                                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(formData.password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(formData.password.length > 0 && showPassword) ? -4 : undefined} />
                            </div>
                            <div
                                className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
                                style={{
                                    left: (formData.password.length > 0 && showPassword) ? `10px` : `${40 + (yellowPos.faceX || 0)}px`,
                                    top: (formData.password.length > 0 && showPassword) ? `88px` : `${88 + (yellowPos.faceY || 0)}px`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="relative z-20 flex items-center gap-8 text-sm text-white/60">
                    <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link to="/" className="hover:text-white transition-colors">Contact</Link>
                </div>

                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Right Login Section */}
            <div className="flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-[420px]">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-12">
                        <div className="w-8 h-8 rounded-lg bg-primary-600/10 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-primary-600" />
                        </div>
                        <span>AI Loan Assistant</span>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h1>
                        <p className="text-gray-600 text-sm">Please enter your details</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="anna@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setIsTyping(true)}
                                    onBlur={() => setIsTyping(false)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <input id="remember" type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                                <label htmlFor="remember" className="text-sm font-normal cursor-pointer text-gray-700">
                                    Remember for 30 days
                                </label>
                            </div>
                            <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-red-200 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full h-12 text-base font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Log in"}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center text-sm text-gray-600 mt-8">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-gray-900 font-medium hover:underline">
                            Sign Up
                        </Link>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center mt-6">
                        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
