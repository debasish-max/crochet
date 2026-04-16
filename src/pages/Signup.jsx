import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, UserPlus, Mail, Lock } from 'lucide-react';

export default function Signup({ setToast }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Auth Signup
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signupError) throw signupError;

            const user = data.user;
            if (user) {
                // 2. Check if an admin already exists
                const { data: adminExists, error: rpcError } = await supabase.rpc('confirm_admin_exists');
                
                // If RPC fails (e.g. not created yet), default to 'user' or handle error
                // For now, if it fails, we'll try a direct query as fallback if RLS allows
                let role = 'user';
                if (!rpcError && adminExists === false) {
                    role = 'admin';
                }

                // 3. Create the profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        { id: user.id, email: user.email, role: role }
                    ]);

                if (profileError) {
                    console.warn('Profile creation failed, but account exists:', profileError.message);
                }
            }

            setToast('Account created successfully! Please log in.');
            setTimeout(() => setToast(''), 5000);
            navigate('/login');
        } catch (error) {
            console.error('Signup error:', error.message);
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
                        <UserPlus className="text-brand" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join our community and shop handcrafted treasures</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
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
                                Creating Account...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-500 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand font-bold hover:underline">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}
