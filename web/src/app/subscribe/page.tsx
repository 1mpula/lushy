"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2, AlertCircle, CreditCard, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function SubscribePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [proData, setProData] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/");
        return;
      }

      setUser(session.user);

      // Fetch the professional's subscription status from Supabase
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!error && data) {
        setProData(data);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleSimulatePayment = async () => {
    if (!user) return;
    setProcessingPayment(true);

    try {
      // Update Supabase to reflect that the user has paid
      const { error } = await supabase
        .from('professionals')
        .update({ 
            subscription_status: 'active',
            subscription_end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh local state to show the success UI
      setProData({ ...proData, subscription_status: 'active' });
    } catch (err) {
      console.error("Payment update failed:", err);
      alert("Failed to update payment status.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </main>
    );
  }

  const isSubscribed = proData?.subscription_status === 'active';

  return (
    <main className="min-h-screen p-4 md:p-8 flex items-center justify-center relative">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <div className="text-primary font-outfit text-3xl font-black tracking-widest mb-3 uppercase">
            Lushy Pro
          </div>
          <h1 className="text-3xl font-bold font-outfit text-white">Subscription Management</h1>
        </div>

        {isSubscribed ? (
           <div className="glass-card rounded-[32px] p-8 md:p-12 text-center border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
             <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-4">You are all set!</h2>
             <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
                Your Lushy Pro subscription is active. Your profile is currently visible to thousands of clients looking to book your services.
             </p>
             <button
               onClick={() => alert("Redirecting to Pro Dashboard App...")}
               className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full transition-all"
             >
               Go to Mobile Dashboard
             </button>
           </div>
        ) : (
           <div className="glass-card rounded-[32px] p-8 md:p-12 border-primary/30 shadow-[0_0_40px_rgba(255,51,102,0.1)]">
             <div className="text-center mb-8">
                 <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-red-500/20">
                    <AlertCircle className="w-4 h-4" /> Subscription Inactive
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-4">Unlock Your Business</h2>
                 <p className="text-text-secondary text-lg">
                    Activate your subscription to appear on the Lushy map and start accepting instant bookings from new clients today.
                 </p>
             </div>

             <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex items-center justify-between">
                <div>
                    <div className="text-sm text-text-secondary font-bold uppercase tracking-wider mb-2">Standard Pro Plan</div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-white">P149</span>
                        <span className="text-text-secondary">/month</span>
                    </div>
                </div>
                <div className="hidden sm:block text-right">
                    <ul className="text-sm text-text-secondary space-y-2">
                        <li className="flex items-center gap-2 justify-end"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 0% Commission</li>
                        <li className="flex items-center gap-2 justify-end"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Priority Listing</li>
                    </ul>
                </div>
             </div>

             <button
               onClick={handleSimulatePayment}
               disabled={processingPayment}
               className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(255,51,102,0.3)] active:scale-95 text-lg"
             >
               {processingPayment ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> Processing Payment...
                  </>
               ) : (
                  <>
                    <CreditCard className="w-6 h-6" /> Pay P149 Now
                  </>
               )}
             </button>
             
             <p className="text-center text-text-secondary/50 text-xs mt-6">
                Demo Mode: Clicking this button updates your Supabase subscription status automatically.
             </p>
           </div>
        )}
      </motion.div>
    </main>
  );
}
