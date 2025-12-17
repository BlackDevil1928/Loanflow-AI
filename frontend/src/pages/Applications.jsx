import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import {
    FileText,
    CheckCircle,
    Clock,
    XCircle,
    AlertTriangle,
    Download,
    Calendar
} from 'lucide-react'

export default function Applications() {
    const { user } = useAuth()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchApplications()
    }, [user])

    const fetchApplications = async () => {
        if (!user) return

        const { data, error } = await supabase
            .from('loan_applications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (data) {
            setApplications(data)
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
                return 'bg-green-100 text-green-800 border-green-300'
            case 'REJECTED':
                return 'bg-red-100 text-red-800 border-red-300'
            case 'REVIEW':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300'
            default:
                return 'bg-blue-100 text-blue-800 border-blue-300'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">My Loan Applications</h1>
                    <p className="text-xl text-primary-100">Track all your loan applications in one place</p>
                </div>

                <div className="glass rounded-2xl p-8">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="text-white text-lg">Loading applications...</div>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-white/50 mx-auto mb-4" />
                            <p className="text-white/70 text-lg">No applications yet</p>
                            <p className="text-white/50 mt-2">Start your first loan application to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map((app) => (
                                <div
                                    key={app.id}
                                    className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-3">
                                                {getStatusIcon(app.status)}
                                                <span className={`px-4 py-1 rounded-full text-sm font-semibold border ${getStatusColor(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                                                <div>
                                                    <p className="text-sm text-primary-100">Loan Amount</p>
                                                    <p className="text-xl font-semibold">
                                                        ₹{app.loan_amount?.toLocaleString() || 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-primary-100">Interest Rate</p>
                                                    <p className="text-xl font-semibold">
                                                        {app.interest_rate ? `${app.interest_rate}% p.a.` : 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-primary-100">Monthly Income</p>
                                                    <p className="text-lg">₹{app.income?.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-primary-100">Employment</p>
                                                    <p className="text-lg capitalize">{app.employment_type}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-primary-100">Credit Score</p>
                                                    <p className="text-lg font-semibold">{app.credit_score || 'Pending'}</p>
                                                </div>
                                                <div className="flex items-center space-x-2 text-primary-100">
                                                    <Calendar className="w-4 h-4" />
                                                    <p className="text-sm">
                                                        Applied: {new Date(app.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {app.status === 'APPROVED' && (
                                            <div className="flex items-center">
                                                <button className="flex items-center space-x-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all">
                                                    <Download className="w-5 h-5" />
                                                    <span>Download Letter</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
