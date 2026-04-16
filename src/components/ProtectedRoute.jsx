import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
    const { user, role, loading } = useAuth();

    // Only proceed if loading is finished AND we have a role resolved (if user exists)
    if (loading || (user && role === null)) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role !== 'admin') {
        // If logged in but not an admin, send back to home
        return <Navigate to="/" replace />;
    }

    return children;
}
