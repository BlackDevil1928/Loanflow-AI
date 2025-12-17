import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import {
    TrendingUp,
    TrendingDown,
    Minus,
    DollarSign,
    Briefcase,
    Award,
    AlertCircle
} from 'lucide-react'

export default function CreditScore() {
    const { user } = useAuth()
    const [score, setScore] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate fetching credit score
        setTimeout(() => {
            setScore({
                score: 750,
                rating: 'Excellent',
                factors: [
                    { name: 'Payment History', score: 95, impact: 'positive' },
                    { name: 'Credit Utilization', score: 30, impact: 'positive' },
                    { name: 'Credit Age', score: 5, impact: 'neutral' },
                    { name: 'Credit Mix', score: 80, impact: 'positive' },
                    { name: 'Recent Inquiries', score: 2, impact: 'neutral' },
                ],
                recommendations: [
                    'Keep credit utilization below 30%',
                    'Continue making on-time payments',
                    'Avoid opening too many new accounts',
                ]
            })
            setLoading(false)
        }, 1000)
    }, [])

    const getScoreColor = (score) => {
        if (score >= 750) return 'text-green-400'
        if (score >= 650) return 'text-yellow-400'
        return 'text-red-400'
    }

    const getImpactIcon = (impact) => {
        if (impact === 'positive') return <TrendingUp className="w-5 h-5 text-green-400" />
        if (impact === 'negative') return <TrendingDown className="w-5 h-5 text-red-400" />
        return <Minus className="w-5 h-5 text-gray-400" />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Credit Score Analysis</h1>
                    <p className="text-xl text-primary-100">Understand your creditworthiness and eligibility</p>
                </div>

                {loading ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <div className="text-white text-lg">Calculating your credit score...</div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Score Card */}
                        <div className="glass rounded-2xl p-8">
                            <div className="text-center mb-8">
                                <div className={`text-8xl font-bold ${getScoreColor(score.score)} mb-4`}>
                                    {score.score}
                                </div>
                                <div className="text-2xl font-semibold text-white mb-2">{score.rating}</div>
                                <div className="text-primary-100">Out of 850</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white/10 rounded-lg p-6 text-center">
                                    <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                    <div className="text-white font-semibold">Max Loan Amount</div>
                                    <div className="text-2xl text-white font-bold mt-2">₹10,00,000</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-6 text-center">
                                    <TrendingDown className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                    <div className="text-white font-semibold">Interest Rate</div>
                                    <div className="text-2xl text-white font-bold mt-2">10.5% p.a.</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-6 text-center">
                                    <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                    <div className="text-white font-semibold">Approval Chance</div>
                                    <div className="text-2xl text-white font-bold mt-2">95%</div>
                                </div>
                            </div>
                        </div>

                        {/* Score Factors */}
                        <div className="glass rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Score Factors</h2>
                            <div className="space-y-4">
                                {score.factors.map((factor, index) => (
                                    <div key={index} className="bg-white/10 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-3">
                                                {getImpactIcon(factor.impact)}
                                                <span className="text-white font-semibold">{factor.name}</span>
                                            </div>
                                            <span className="text-white/70">{factor.score}%</span>
                                        </div>
                                        <div className="w-full bg-white/20 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-primary-400 to-purple-400 h-2 rounded-full"
                                                style={{ width: `${factor.score}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="glass rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <AlertCircle className="w-6 h-6 mr-2" />
                                Recommendations
                            </h2>
                            <div className="space-y-3">
                                {score.recommendations.map((rec, index) => (
                                    <div key={index} className="flex items-start space-x-3 text-white">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                                        <p>{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
