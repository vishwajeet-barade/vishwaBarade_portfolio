'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { SiFirebase } from 'react-icons/si';
import toast from 'react-hot-toast';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setCheckingAuth(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Welcome back!');
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neural-900 via-neural-800 to-neural-900">
                <div className="text-white text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (user) {
        return <AdminDashboard user={user} onLogout={handleLogout} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neural-900 via-neural-800 to-neural-900 p-4">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary-400 rounded-full opacity-20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl mb-4">
                            <SiFirebase className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold gradient-text-ai mb-2">Admin Panel</h1>
                        <p className="text-neural-600">Sign in to manage your portfolio</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neural-400" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-neural-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neural-400" />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-neural-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <FiLogIn className="w-5 h-5" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <a
                            href="/"
                            className="text-sm text-neural-600 hover:text-primary-600 transition-colors"
                        >
                            ← Back to Portfolio
                        </a>
                    </div>
                </div>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white text-sm"
                >
                    <p className="mb-2">
                        <strong>First time setup?</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-white/80">
                        <li>Create a user in Firebase Authentication</li>
                        <li>Use that email/password to login</li>
                        <li>Start managing your portfolio!</li>
                    </ol>
                </motion.div>
            </motion.div>
        </div>
    );
}
