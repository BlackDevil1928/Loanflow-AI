import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Logo from './Logo'
import {
    LogOut,
    LayoutDashboard,
    MessageSquare,
    FileCheck,
    Shield,
    TrendingUp,
    FileText,
    History,
    Menu,
    X,
    User,
    ChevronDown
} from 'lucide-react'

export default function Navbar() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const [userName, setUserName] = useState('')

    useEffect(() => {
        if (user) {
            fetchUserName()
        }
    }, [user])

    const fetchUserName = async () => {
        if (!user) return

        const { data } = await supabase
            .from('users')
            .select('name')
            .eq('id', user.id)
            .single()

        if (data) {
            setUserName(data.name)
        }
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Apply for Loan', path: '/chat', icon: MessageSquare },
        { name: 'My Applications', path: '/applications', icon: FileText },
        { name: 'KYC Verification', path: '/kyc', icon: FileCheck },
        { name: 'Credit Score', path: '/credit-score', icon: TrendingUp },
        { name: 'Audit Logs', path: '/audit-logs', icon: History },
    ]

    const isActive = (path) => location.pathname === path

    if (!user) return null

    return (
        <nav className="sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center space-x-2 group flex-shrink-0">
                        <div className="flex-shrink-0 drop-shadow-lg">
                            <Logo className="w-8 h-8" />
                        </div>
                        <div className="hidden lg:block">
                            <span className="text-white text-xl font-bold drop-shadow-lg">LoanFlow AI</span>
                            <p className="text-xs text-sky-200 drop-shadow-md">Powered by Multi-Agent AI</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1 flex-1 justify-center mx-4">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all drop-shadow-md ${isActive(item.path)
                                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                                        : 'text-white/90 hover:bg-white/10 hover:text-white backdrop-blur-sm'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm font-semibold whitespace-nowrap">{item.name}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* User Profile Menu */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className="hidden sm:block relative">
                            <button
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all backdrop-blur-sm drop-shadow-lg"
                            >
                                <div className="bg-gradient-to-r from-sky-400 to-blue-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-left hidden lg:block max-w-[120px]">
                                    <p className="text-white text-sm font-bold truncate drop-shadow-md">{userName || 'User'}</p>
                                    <p className="text-sky-200 text-xs truncate drop-shadow-sm">{user?.email?.split('@')[0]}</p>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white transition-transform flex-shrink-0 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Profile Dropdown */}
                            {profileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 glass rounded-lg shadow-xl border border-white/20 py-2">
                                    <div className="px-4 py-3 border-b border-white/10">
                                        <p className="text-white font-semibold truncate">{userName}</p>
                                        <p className="text-primary-100 text-sm truncate">{user?.email}</p>
                                    </div>
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/10 transition-colors"
                                        onClick={() => setProfileMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center space-x-2 px-4 py-2 text-red-300 hover:bg-white/10 transition-colors w-full text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Sign Out */}
                        <button
                            onClick={handleSignOut}
                            className="sm:hidden text-white/70 hover:text-white transition-colors p-2"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-white p-2"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-2 border-t border-white/10">
                        {/* User Info */}
                        <div className="px-4 py-3 bg-white/10 rounded-lg mb-4">
                            <p className="text-white font-semibold truncate">{userName || 'User'}</p>
                            <p className="text-primary-100 text-sm truncate">{user?.email}</p>
                        </div>

                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                                        ? 'bg-white/20 text-white'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </nav>
    )
}
