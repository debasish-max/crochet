import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Lock, Mail } from 'lucide-react';

export default function Login({ setToast }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            setToast('Logged in successfully');
            setTimeout(() => setToast(''), 2000);
            
            // Redirect to home (user) or admin dashboard (admin)
            // The ProtectedRoute will handle role-based redirection if they try to access /admin
            navigate('/');
        } catch (error) {
            console.error('Login error:', error.message);
            setToast(error.message);
            setTimeout(() => setToast(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-bg">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-brand/10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 rounded-full mb-4">
                        <Lock className="text-brand" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
                    <p className="text-gray-500 mt-2">Welcome back! Please enter your details</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 mt-6"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Authenticating...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-500 text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-brand font-bold hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
