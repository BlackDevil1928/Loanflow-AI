import { Link } from 'react-router-dom'
import GenerativeMountainScene from '../components/GenerativeMountainScene'
import Logo from '../components/Logo'
import {
    TrendingUp,
    Shield,
    Zap,
    Users,
    FileCheck,
    Brain,
    ArrowRight,
    CheckCircle2,
    Clock,
    Award,
    Target
} from 'lucide-react'

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-950 relative overflow-hidden">
            {/* 3D Mountain Background - Full Screen */}
            <div className="fixed inset-0 z-0">
                <GenerativeMountainScene />
            </div>

            {/* Navigation - Fully Transparent */}
            <nav className="fixed top-0 w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center space-x-3">
                            <Logo className="w-10 h-10 drop-shadow-lg" />
                            <span className="text-white text-2xl font-bold tracking-tight drop-shadow-lg">LoanFlow AI</span>
                        </div>
                        <div className="flex space-x-4">
                            <Link to="/signin" className="text-white hover:text-sky-200 transition-colors px-6 py-2.5 font-semibold text-lg drop-shadow-lg">
                                Sign In
                            </Link>
                            <Link to="/signup" className="bg-sky-400 text-gray-900 px-6 py-2.5 rounded-lg font-bold hover:bg-sky-300 hover:shadow-xl transition-all text-lg shadow-lg">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Enhanced */}
            <section className="relative min-h-screen flex items-center justify-center px-4 z-10">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="animate-fadeIn space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-4">
                            <Award className="w-5 h-5 text-sky-300" />
                            <span className="text-sky-100 font-semibold text-sm">AI-Powered Loan Processing Platform</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
                            LoanFlow AI
                        </h1>

                        {/* Subheading */}
                        <p className="text-2xl md:text-3xl text-sky-100 mb-4 max-w-4xl mx-auto drop-shadow-lg font-bold leading-relaxed">
                            Transform Your Lending Experience with
                            <span className="text-sky-300"> Intelligent Automation</span>
                        </p>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-sky-200 mb-8 max-w-3xl mx-auto drop-shadow-md font-medium leading-relaxed">
                            An advanced Agentic AI system that simulates a human loan officer, delivering instant personal loan approvals with unprecedented speed and accuracy.
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                                <div className="flex items-center justify-center mb-2">
                                    <Clock className="w-6 h-6 text-sky-300" />
                                </div>
                                <div className="text-3xl font-bold text-white">2 Min</div>
                                <div className="text-sm text-sky-200 font-medium">Approval Time</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                                <div className="flex items-center justify-center mb-2">
                                    <Target className="w-6 h-6 text-sky-300" />
                                </div>
                                <div className="text-3xl font-bold text-white">95%</div>
                                <div className="text-sm text-sky-200 font-medium">Accuracy Rate</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                                <div className="flex items-center justify-center mb-2">
                                    <Zap className="w-6 h-6 text-sky-300" />
                                </div>
                                <div className="text-3xl font-bold text-white">24/7</div>
                                <div className="text-sm text-sky-200 font-medium">Availability</div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/signup" className="group bg-sky-400 text-gray-900 px-10 py-5 rounded-xl font-black text-xl hover:bg-sky-300 hover:shadow-2xl transition-all inline-flex items-center justify-center transform hover:scale-105">
                                Get Started Free
                                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/signin" className="bg-white/10 text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-white/20 transition-all inline-flex items-center justify-center backdrop-blur-sm border-2 border-white/30 hover:border-white/50">
                                Sign In
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sky-200">
                            <div className="flex items-center space-x-2">
                                <CheckCircle2 className="w-5 h-5 text-sky-300" />
                                <span className="font-semibold">No Credit Card Required</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle2 className="w-5 h-5 text-sky-300" />
                                <span className="font-semibold">Instant Approval</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle2 className="w-5 h-5 text-sky-300" />
                                <span className="font-semibold">Secure & Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                        <div className="w-1 h-3 bg-white/50 rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Problem Statement */}
            <section className="relative py-20 px-4 bg-black/30 backdrop-blur-sm z-10">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl font-black text-white text-center mb-4 drop-shadow-lg">
                        The NBFC Challenge
                    </h2>
                    <p className="text-xl text-sky-200 text-center mb-12 max-w-3xl mx-auto font-medium">
                        Traditional lending faces critical bottlenecks that slow growth and frustrate customers
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="card bg-white hover:shadow-2xl transition-all hover:scale-105">
                            <div className="text-red-500 mb-4">
                                <Users className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Manual Processing</h3>
                            <p className="text-gray-700 leading-relaxed font-medium">
                                Traditional loan processing requires multiple human touchpoints, leading to delays and inconsistent customer experiences.
                            </p>
                        </div>
                        <div className="card bg-white hover:shadow-2xl transition-all hover:scale-105">
                            <div className="text-yellow-500 mb-4">
                                <TrendingUp className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">High Operational Costs</h3>
                            <p className="text-gray-700 leading-relaxed font-medium">
                                Large sales teams and lengthy verification processes drive up costs and reduce profitability for NBFCs.
                            </p>
                        </div>
                        <div className="card bg-white hover:shadow-2xl transition-all hover:scale-105">
                            <div className="text-orange-500 mb-4">
                                <Zap className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Slow Turnaround</h3>
                            <p className="text-gray-700 leading-relaxed font-medium">
                                Customers wait days or weeks for loan approvals, leading to poor satisfaction and lost opportunities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Overview */}
            <section className="relative py-20 px-4 z-10">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl font-black text-white text-center mb-4 drop-shadow-lg">
                        Multi-Agent AI Solution
                    </h2>
                    <p className="text-xl text-sky-200 text-center mb-12 max-w-3xl mx-auto font-medium">
                        Five specialized AI agents working in perfect harmony to automate your entire loan journey
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="card bg-white hover:shadow-2xl transition-all hover:scale-105">
                            <div className="bg-gradient-to-r from-sky-600 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <Brain className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900">Master Agent</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Orchestrates the entire workflow and maintains conversation state with intelligent routing
                            </p>
                        </div>
                        <div className="card bg-white hover:shadow-2xl transition-all hover:scale-105">
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900">Sales Agent</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Greets customers, explains products, and collects application details naturally
                            </p>
                        </div>
                        <div className="card bg-white hover:shadow-2xl transition-all hover:scale-105">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <FileCheck className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900">Verification Agent</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Validates KYC documents using advanced OCR and identity verification technology
                            </p>
                        </div>
                        <div className="card bg-white hover:shadow-2xl transition-all hover:scale-105">
                            <div className="bg-gradient-to-r from-orange-600 to-red-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900">Underwriting Agent</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Applies sophisticated credit scoring logic and makes instant approval decisions
                            </p>
                        </div>
                        <div className="card bg-white hover:shadow-2xl transition-all hover:scale-105">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900">Sanction Agent</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Generates professional sanction letters and comprehensive loan documents
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="relative py-20 px-4 bg-black/30 backdrop-blur-sm z-10">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl font-black text-white text-center mb-4 drop-shadow-lg">
                        Powerful Features
                    </h2>
                    <p className="text-xl text-sky-200 text-center mb-12 max-w-3xl mx-auto font-medium">
                        Everything you need for modern, efficient loan processing
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                            'Instant loan approvals in minutes, not days',
                            'Human-like conversational AI interface',
                            'Automated KYC verification with Gemini AI',
                            'Advanced credit scoring engine',
                            'Secure document storage and audit trails',
                            'Professional sanction letter generation',
                            'Multi-agent orchestration for complex workflows',
                            '24/7 availability with no human intervention'
                        ].map((feature, index) => (
                            <div key={index} className="flex items-start space-x-3 text-white bg-white/5 backdrop-blur-sm rounded-lg p-4 hover:bg-white/10 transition-all">
                                <CheckCircle2 className="w-6 h-6 text-sky-300 flex-shrink-0 mt-1" />
                                <span className="text-lg font-semibold">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Business Impact */}
            <section className="relative py-20 px-4 z-10">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl font-black text-white text-center mb-4 drop-shadow-lg">
                        Measurable Impact
                    </h2>
                    <p className="text-xl text-sky-200 text-center mb-12 max-w-3xl mx-auto font-medium">
                        Real results that transform your business
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
                            <div className="text-7xl font-black text-sky-300 mb-3">95%</div>
                            <div className="text-2xl text-white font-bold mb-2">Faster Processing</div>
                            <div className="text-sky-200">From days to minutes</div>
                        </div>
                        <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
                            <div className="text-7xl font-black text-sky-300 mb-3">70%</div>
                            <div className="text-2xl text-white font-bold mb-2">Cost Reduction</div>
                            <div className="text-sky-200">Lower operational expenses</div>
                        </div>
                        <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
                            <div className="text-7xl font-black text-sky-300 mb-3">24/7</div>
                            <div className="text-2xl text-white font-bold mb-2">Availability</div>
                            <div className="text-sky-200">Always-on service</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative py-24 px-4 bg-black/30 backdrop-blur-sm z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-black text-white mb-6 drop-shadow-lg">
                        Ready to Transform Your Lending?
                    </h2>
                    <p className="text-2xl text-sky-100 mb-10 font-semibold">
                        Join the future of BFSI with AI-powered loan processing
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup" className="group bg-sky-400 text-gray-900 px-10 py-5 rounded-xl font-black text-xl hover:bg-sky-300 hover:shadow-2xl transition-all inline-flex items-center justify-center transform hover:scale-105">
                            Start Free Today
                            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/signin" className="bg-white/10 text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-white/20 transition-all inline-flex items-center justify-center backdrop-blur-sm border-2 border-white/30 hover:border-white/50">
                            Sign In to Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-8 px-4 border-t border-white/10 backdrop-blur-sm z-10">
                <div className="max-w-7xl mx-auto text-center text-sky-100">
                    <p className="font-medium">&copy; 2025 LoanFlow AI. Built for Tata Capital BFSI Hackathon.</p>
                </div>
            </footer>
        </div>
    )
}
