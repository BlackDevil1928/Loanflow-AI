import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import {
    MessageSquare,
    FileText,
    CheckCircle,
    Clock,
    XCircle,
    AlertTriangle,
    TrendingUp,
    DollarSign,
    Users,
    Activity
} from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function Dashboard() {
    const { user } = useAuth()
    const location = useLocation()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [userName, setUserName] = useState('')
    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        totalAmount: 0
    })

    useEffect(() => {
        fetchUserData()
        fetchApplications()
    }, [user])

    // Refetch applications when returning to dashboard
    useEffect(() => {
        if (location.pathname === '/dashboard') {
            fetchApplications()
        }
    }, [location])

    const fetchUserData = async () => {
        if (!user) return

        const { data, error } = await supabase
            .from('users')
            .select('name')
            .eq('id', user.id)
            .single()

        if (data) {
            setUserName(data.name)
        }
    }

    const fetchApplications = async () => {
        if (!user) return

        const { data, error } = await supabase
            .from('loan_applications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (data) {
            setApplications(data)

            // Calculate statistics
            const stats = {
                total: data.length,
                approved: data.filter(app => app.status === 'APPROVED').length,
                pending: data.filter(app => app.status === 'PENDING').length,
                rejected: data.filter(app => app.status === 'REJECTED').length,
                review: data.filter(app => app.status === 'REVIEW').length,
                totalAmount: data.reduce((sum, app) => sum + (app.loan_amount || 0), 0)
            }
            setStats(stats)
        }
        setLoading(false)
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case 'REJECTED':
                return <XCircle className="w-5 h-5 text-red-500" />
            case 'REVIEW':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />
            default:
                return <Clock className="w-5 h-5 text-blue-500" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-100 text-green-800'
            case 'REJECTED':
                return 'bg-red-100 text-red-800'
            case 'REVIEW':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-blue-100 text-blue-800'
        }
    }

    // Chart data
    const pieData = [
        { name: 'Approved', value: stats.approved, color: '#10b981' },
        { name: 'Pending', value: stats.pending, color: '#3b82f6' },
        { name: 'Review', value: stats.review, color: '#f59e0b' },
        { name: 'Rejected', value: stats.rejected, color: '#ef4444' },
    ].filter(item => item.value > 0)

    const monthlyData = applications.slice(0, 6).reverse().map((app, index) => ({
        name: new Date(app.created_at).toLocaleDateString('en-US', { month: 'short' }),
        amount: app.loan_amount || 0,
        status: app.status
    }))

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-xl">
                    <h1 className="text-4xl font-black text-white mb-2">
                        Welcome back, {userName || 'User'}! 👋
                    </h1>
                    <p className="text-primary-100 text-lg">
                        Here's your loan application overview
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="glass rounded-xl p-6 animate-fadeIn">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-primary-100 text-sm font-medium">Total Applications</p>
                                <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
                            </div>
                            <div className="bg-blue-500/20 p-3 rounded-lg">
                                <FileText className="w-8 h-8 text-blue-300" />
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-6 animate-fadeIn">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-primary-100 text-sm font-medium">Approved</p>
                                <p className="text-3xl font-bold text-white mt-2">{stats.approved}</p>
                            </div>
                            <div className="bg-green-500/20 p-3 rounded-lg">
                                <CheckCircle className="w-8 h-8 text-green-300" />
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-6 animate-fadeIn">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-primary-100 text-sm font-medium">Pending</p>
                                <p className="text-3xl font-bold text-white mt-2">{stats.pending + stats.review}</p>
                            </div>
                            <div className="bg-yellow-500/20 p-3 rounded-lg">
                                <Clock className="w-8 h-8 text-yellow-300" />
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-6 animate-fadeIn">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-primary-100 text-sm font-medium">Total Amount</p>
                                <p className="text-2xl font-bold text-white mt-2">₹{(stats.totalAmount / 100000).toFixed(1)}L</p>
                            </div>
                            <div className="bg-purple-500/20 p-3 rounded-lg">
                                <DollarSign className="w-8 h-8 text-purple-300" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                {applications.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Pie Chart - Application Status */}
                        <div className="glass rounded-2xl p-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <Activity className="w-5 h-5 mr-2" />
                                Application Status Distribution
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Bar Chart - Loan Amounts */}
                        <div className="glass rounded-2xl p-6 animate-fadeIn">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Loan Amount Trends
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="#fff" />
                                    <YAxis stroke="#fff" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                                        labelStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="amount" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Start Application Card */}
                <div className="glass rounded-2xl p-8 mb-8 animate-fadeIn">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-6 md:mb-0">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Start Your Loan Application
                            </h2>
                            <p className="text-primary-100">
                                Our AI assistant will guide you through the process in minutes
                            </p>
                        </div>
                        <Link
                            to="/chat"
                            className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span>Start Application</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="glass rounded-2xl p-8 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <FileText className="w-6 h-6 mr-2" />
                        Recent Applications
                    </h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="text-white text-lg">Loading applications...</div>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="w-16 h-16 text-white/50 mx-auto mb-4" />
                            <p className="text-white/70 text-lg">No applications yet</p>
                            <p className="text-white/50 mt-2">Start your first loan application to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.slice(0, 5).map((app) => (
                                <div
                                    key={app.id}
                                    className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="mb-4 md:mb-0">
                                            <div className="flex items-center space-x-2 mb-2">
                                                {getStatusIcon(app.status)}
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            <div className="text-white space-y-1">
                                                <p className="text-lg font-semibold">
                                                    Loan Amount: ₹{app.loan_amount?.toLocaleString() || 'N/A'}
                                                </p>
                                                <p className="text-sm text-primary-100">
                                                    Income: ₹{app.income?.toLocaleString()} | Employment: {app.employment_type}
                                                </p>
                                                <p className="text-sm text-primary-100">
                                                    Credit Score: {app.credit_score || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-white/70 text-sm">
                                            Applied: {new Date(app.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {applications.length > 5 && (
                                <Link
                                    to="/applications"
                                    className="block text-center text-white hover:text-primary-200 transition-colors mt-4"
                                >
                                    View all {applications.length} applications →
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
