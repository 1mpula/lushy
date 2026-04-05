"use client";

import { supabase } from '@/utils/supabase';
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };

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
                // Verify they are actually a professional
                const { data: proData, error: proError } = await supabase
                    .from('professionals')
                    .select('id')
                    .eq('user_id', data.user.id)
                    .single();

                if (proError || !proData) {
                    await supabase.auth.signOut();
                    throw new Error("This portal is reserved for Lushy Professionals.");
                }

                // Redirect to the standalone subscription portal
                window.location.href = '/subscribe.html';
            }
        } catch (err: any) {
            setError(err.message || 'Invalid login credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-bg-dark text-text-primary selection:bg-primary/30 flex items-center justify-center p-6 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-accent/10 rounded-full blur-[100px] animate-float-delayed" />
            </div>

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group z-50">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-glass-border flex items-center justify-center group-hover:bg-white/10 transition-all">
                    <ArrowLeft size={20} className="text-white group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="text-white font-bold hidden sm:block">Back to Home</span>
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex flex-col items-center mb-12">
                    <img src="/lushy-logo.png" alt="Lushy" className="h-16 mb-6" />
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <Sparkles size={14} className="text-primary" />
                        <span className="text-xs font-black text-primary tracking-widest uppercase">Professional Portal</span>
                    </div>
                    <h1 className="text-4xl font-black font-heading text-white tracking-tight text-center">
                        Welcome Back
                    </h1>
                </div>

                <div className="glass-card p-10 rounded-[40px] border-glass-border shadow-2xl relative overflow-hidden">
                    {/* Inner glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 text-sm font-bold text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-3 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-glass-border rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-text-secondary/50 font-bold"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-3 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-glass-border rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-text-secondary/50 font-bold"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl mt-4 flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 group transition-all active:scale-95 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                <>
                                    <span>Sign in to Dashboard</span>
                                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-glass-border text-center">
                        <p className="text-text-secondary text-sm font-semibold mb-2">
                            New to the beauty economy?
                        </p>
                        <Link href="/#download" className="text-primary font-black hover:underline underline-offset-4">
                            Download the Lushy App
                        </Link>
                    </div>
                </div>

                <p className="text-center text-text-secondary/50 text-xs mt-12 font-bold tracking-widest uppercase">
                    &copy; 2026 Lushy Startups
                </p>
            </motion.div>
        </main>
    );
}
