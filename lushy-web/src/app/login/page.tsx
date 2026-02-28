"use client";

import { supabase } from '@/utils/supabase';
import { ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                // Verify they are actually a professional, not just a standard client
                const { data: proData, error: proError } = await supabase
                    .from('professionals')
                    .select('id')
                    .eq('id', data.user.id)
                    .single();

                if (proError || !proData) {
                    await supabase.auth.signOut();
                    throw new Error("This portal is reserved for Lushy Professionals. Please use the mobile app for client accounts.");
                }

                // Redirect to professional dashboard
                router.push('/pro/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Invalid login credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 flex items-center justify-center p-6 pb-32">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <Link href="/" className="absolute top-6 left-6 lg:left-12 flex items-center gap-2 mb-12 cursor-pointer z-10 transition-transform active:scale-95">
                <img src="/lushy-logo.png" alt="Lushy Logo" className="h-12 sm:h-16 w-auto object-contain drop-shadow-sm" />
            </Link>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[32px] shadow-2xl shadow-pink-100/50 relative z-10 mt-12">
                <h1 className="text-3xl font-extrabold text-charcoal mb-2 tracking-tight text-center">
                    Pro Login
                </h1>
                <p className="text-slate-500 text-center mb-8">
                    Sign in to manage your Lushy account
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-charcoal mb-2 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 font-medium"
                                placeholder="salon@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-charcoal mb-2 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 hover:bg-pink-600 transition-all shadow-lg shadow-pink-200 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <p className="text-center text-slate-500 text-sm mt-8 font-medium">
                    Don't have an account? Download the Lushy app to sign up as a professional.
                </p>
            </div>
        </main>
    );
}
