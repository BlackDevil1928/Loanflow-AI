import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-purple-700">
                <div className="text-white text-xl">Loading...</div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/signin" replace />
    }

    return children
}
