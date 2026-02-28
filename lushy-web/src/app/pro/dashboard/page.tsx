"use client";

import { supabase } from '@/utils/supabase';
import { AlertCircle, CheckCircle2, CreditCard, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            // Fetch the professional profile for this user
            const { data, error } = await supabase
                .from('professionals')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            setProfile(data || { id: user.id, subscription_status: 'inactive' });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const isPro = profile?.subscription_status === 'active';

    // NOTE: This URL will be replaced with your actual DPO Group payment link
    const DPO_PAYMENT_LINK = "#";

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-100 flex items-center justify-between px-6 py-4 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <img src="/lushy-logo.png" alt="Lushy Logo" className="h-8 w-auto object-contain drop-shadow-sm" />
                    <span className="font-bold text-xl font-heading text-charcoal">Lushy Pro</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-medium transition-colors"
                >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </nav>

            <main className="max-w-4xl mx-auto p-6 py-12">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-3xl font-extrabold text-charcoal tracking-tight mb-2">
                        Welcome back, {profile?.business_name || profile?.full_name || 'Professional'}
                    </h1>
                    <p className="text-slate-500 text-lg">Manage your Lushy subscription</p>
                </div>

                {isPro ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-100/20">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                <CheckCircle2 className="text-emerald-500" size={40} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-emerald-900 mb-1">Active Subscription</h2>
                                <p className="text-emerald-700">Your account is fully unlocked. You can accept bookings and add unlimited services in the app.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-8 sm:p-10 rounded-[32px] shadow-xl shadow-pink-100/40 border border-pink-50 text-center max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="text-red-500" size={48} strokeWidth={1.5} />
                        </div>

                        <h2 className="text-3xl font-bold text-charcoal mb-4">Subscription Required</h2>
                        <p className="text-slate-500 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
                            You must have an active Lushy Pro subscription to expand your business, accept new booking requests, and add services.
                        </p>

                        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-charcoal">Lushy Pro - Monthly</span>
                                <span className="font-bold text-xl text-primary">P200<span className="text-sm text-slate-400 font-medium"> / mo</span></span>
                            </div>
                            <ul className="space-y-3 mt-6">
                                <li className="flex items-center gap-3 text-slate-600">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <span>Unlimited service listings</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <span>Accept and manage bookings</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <span>Keep 100% of your earnings</span>
                                </li>
                            </ul>
                        </div>

                        <a
                            href={DPO_PAYMENT_LINK}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full bg-primary hover:bg-pink-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-pink-200 text-lg"
                        >
                            <CreditCard size={24} />
                            Subscribe Securely via DPO
                        </a>
                        <p className="text-slate-400 text-sm mt-4">
                            Secure payments processed by DPO Group
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
