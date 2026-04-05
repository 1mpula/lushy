"use client";

import { supabase } from '@/utils/supabase';
import { 
  AlertCircle, 
  CheckCircle2, 
  CreditCard, 
  LogOut, 
  LayoutDashboard, 
  User, 
  Settings, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };

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

            const { data, error } = await supabase
                .from('professionals')
                .select('*')
                .eq('user_id', user.id)
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
    const DPO_PAYMENT_LINK = "#";

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-dark flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-dark text-white selection:bg-primary/30">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            {/* Sidebar / Sidebar-like Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/80 backdrop-blur-xl border-b border-glass-border">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <img src="/lushy-logo.png" alt="Lushy" className="h-10" />
                        <div className="hidden md:flex items-center gap-6">
                            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                            <NavItem icon={<User size={20} />} label="Profile" />
                            <NavItem icon={<Settings size={20} />} label="Settings" />
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-text-secondary hover:text-red-400 font-black transition-all group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span className="hidden sm:inline uppercase text-xs tracking-widest">Logout</span>
                    </button>
                </div>
            </nav>

            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={transition}
                        className="mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                            <Sparkles size={14} className="text-primary" />
                            <span className="text-xs font-black text-primary tracking-widest uppercase">Member Dashboard</span>
                        </div>
                        <h1 className="text-5xl font-black font-heading mb-4">
                            Welcome, <span className="gradient-text">{profile?.business_name || profile?.full_name || 'Professional'}</span>
                        </h1>
                        <p className="text-text-secondary text-lg">Your business hub for growth and management.</p>
                    </motion.div>

                    <div className="grid gap-8">
                        {isPro ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ ...transition, delay: 0.2 }}
                                className="glass-card p-10 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group shadow-2xl"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all duration-700" />
                                
                                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                    <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center rotate-3 shadow-2xl shadow-emerald-500/40">
                                        <ShieldCheck size={48} className="text-white" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="text-emerald-500 font-black text-xs uppercase tracking-widest mb-2">Status: Verified</div>
                                        <h2 className="text-3xl font-black mb-3">Active Subscription</h2>
                                        <p className="text-emerald-100/70 text-lg">Your account is fully unlocked. Go back to the Lushy mobile app to manage your services and bookings.</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ ...transition, delay: 0.2 }}
                                className="glass-card p-2 rounded-[40px] border-glass-border overflow-hidden shadow-2xl"
                            >
                                <div className="p-10">
                                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                                        <div className="w-24 h-24 bg-red-500/10 rounded-3xl border border-red-500/20 flex items-center justify-center">
                                            <AlertCircle size={48} className="text-red-500" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h2 className="text-3xl font-black mb-2 tracking-tight">Expand Your Reach</h2>
                                            <p className="text-text-secondary text-lg">Your professional tools are currently locked. Subscribe to start reaching thousands of new clients.</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                                        <BenefitItem icon={<Zap size={18} />} text="Unlimited service listings" />
                                        <BenefitItem icon={<CheckCircle2 size={18} />} text="Accept unlimited bookings" />
                                        <BenefitItem icon={<CreditCard size={18} />} text="100% earnings, no commission" />
                                        <BenefitItem icon={<LayoutDashboard size={18} />} text="Premium analytics & insights" />
                                    </div>

                                    <div className="bg-white/5 rounded-[32px] p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="text-center md:text-left">
                                            <div className="text-sm font-black text-text-secondary uppercase tracking-[0.2em] mb-1">Standard Pro Rate</div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-black text-white">P149</span>
                                                <span className="text-xl font-bold text-text-secondary">/month</span>
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={() => router.push("/subscribe")}
                                            className="w-full md:w-auto px-10 py-5 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95 text-xl"
                                        >
                                            <CreditCard size={24} />
                                            Activate Account
                                        </button>
                                    </div>
                                    <p className="text-center text-text-secondary/40 text-sm mt-6 font-bold uppercase tracking-widest">Verify Status or Pay Securely</p>
                                </div>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard label="Live Jobs" value="0" />
                            <StatCard label="Total Bookings" value="0" />
                            <StatCard label="Client Rating" value="N/A" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <div className={`flex items-center gap-2 font-bold cursor-pointer transition-all ${active ? 'text-primary' : 'text-text-secondary hover:text-white'}`}>
            {icon}
            <span className="text-sm">{label}</span>
        </div>
    );
}

function BenefitItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-3 text-text-secondary font-bold">
            <div className="text-primary">{icon}</div>
            <span className="text-[15px]">{text}</span>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="glass-card p-6 rounded-3xl border-glass-border">
            <div className="text-text-secondary font-black uppercase text-[10px] tracking-widest mb-1">{label}</div>
            <div className="text-3xl font-black">{value}</div>
        </div>
    );
}
