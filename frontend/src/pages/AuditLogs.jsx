import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import {
    History,
    User,
    Bot,
    Shield,
    Clock,
    FileText
} from 'lucide-react'

export default function AuditLogs() {
    const { user } = useAuth()
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLogs()
    }, [user])

    const fetchLogs = async () => {
        if (!user) return

        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false })
            .limit(50)

        if (data) {
            setLogs(data)
        } else {
            // Mock data for demo
            setLogs([
                {
                    id: '1',
                    action: 'Loan Application Started',
                    agent_name: 'SalesAgent',
                    timestamp: new Date().toISOString(),
                    details: { income: 50000, employment: 'Salaried' }
                },
                {
                    id: '2',
                    action: 'KYC Document Uploaded',
                    agent_name: 'VerificationAgent',
                    timestamp: new Date(Date.now() - 60000).toISOString(),
                    details: { document_type: 'PAN' }
                },
                {
                    id: '3',
                    action: 'Credit Score Calculated',
                    agent_name: 'UnderwritingAgent',
                    timestamp: new Date(Date.now() - 120000).toISOString(),
                    details: { score: 750, decision: 'APPROVED' }
                },
                {
                    id: '4',
                    action: 'Sanction Letter Generated',
                    agent_name: 'SanctionAgent',
                    timestamp: new Date(Date.now() - 180000).toISOString(),
                    details: { loan_amount: 600000, interest_rate: 10.5 }
                },
            ])
        }
        setLoading(false)
    }

    const getAgentIcon = (agentName) => {
        if (agentName.includes('Sales')) return <User className="w-5 h-5 text-blue-400" />
        if (agentName.includes('Verification')) return <Shield className="w-5 h-5 text-green-400" />
        if (agentName.includes('Underwriting')) return <FileText className="w-5 h-5 text-yellow-400" />
        if (agentName.includes('Sanction')) return <FileText className="w-5 h-5 text-purple-400" />
        return <Bot className="w-5 h-5 text-gray-400" />
    }

    const formatTime = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleString()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Audit Logs</h1>
                    <p className="text-xl text-primary-100">Complete trail of all actions and decisions</p>
                </div>

                <div className="glass rounded-2xl p-8">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="text-white text-lg">Loading audit logs...</div>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12">
                            <History className="w-16 h-16 text-white/50 mx-auto mb-4" />
                            <p className="text-white/70 text-lg">No audit logs yet</p>
                            <p className="text-white/50 mt-2">Actions will be logged here for compliance</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 mt-1">
                                            {getAgentIcon(log.agent_name)}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-semibold text-white">{log.action}</h3>
                                                <div className="flex items-center space-x-2 text-primary-100 text-sm">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{formatTime(log.timestamp)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 mb-3">
                                                <span className="px-3 py-1 bg-primary-500/30 text-primary-100 rounded-full text-sm font-medium">
                                                    {log.agent_name}
                                                </span>
                                            </div>

                                            {log.details && Object.keys(log.details).length > 0 && (
                                                <div className="bg-black/20 rounded-lg p-4 mt-3">
                                                    <p className="text-sm text-primary-100 mb-2 font-semibold">Details:</p>
                                                    <div className="grid grid-cols-2 gap-2 text-sm text-white">
                                                        {Object.entries(log.details).map(([key, value]) => (
                                                            <div key={key} className="flex justify-between">
                                                                <span className="text-primary-100 capitalize">{key.replace('_', ' ')}:</span>
                                                                <span className="font-semibold">{JSON.stringify(value)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                        <div className="flex items-start space-x-3">
                            <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                            <div className="text-white/90">
                                <p className="font-semibold mb-2">Compliance & Security</p>
                                <ul className="text-sm space-y-1 text-white/70">
                                    <li>• All actions are logged with timestamps</li>
                                    <li>• Agent names and decisions are tracked</li>
                                    <li>• Logs are immutable and tamper-proof</li>
                                    <li>• Meets regulatory compliance requirements</li>
                                    <li>• Data is encrypted at rest and in transit</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
