"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  ArrowLeft,
  CreditCard,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase";

const transition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

const PLAN_MONTHLY_PRICE = 149;
const PLAN_ANNUAL_PRICE = 1490;

function SubscribeContent() {
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<"loading" | "success" | "error" | null>(null);
  const [verifyMessage, setVerifyMessage] = useState("");
  
  const [profile, setProfile] = useState<any>(null);
  const [pro, setPro] = useState<any>(null);
  const [userEmail, setUserEmail] = useState("");
  
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("monthly");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const boot = async () => {
      // 1. Check if returning from DPO payment
      const verify = searchParams.get("verify");
      const transToken = searchParams.get("token") || sessionStorage.getItem("lushy_pending_token");
      const companyRef = searchParams.get("ref") || sessionStorage.getItem("lushy_pending_ref");
      const proId = sessionStorage.getItem("lushy_pro_id");

      if (verify === "1" && transToken && companyRef && proId) {
        setVerifying(true);
        window.history.replaceState({}, document.title, window.location.pathname);
        await verifyPayment(transToken, companyRef, proId);
        return;
      }

      // 2. Fetch session and professional profile
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      setUserEmail(session.user.email || "");

      const { data: userProfile, error: profileErr } = await supabase
        .from("profiles")
        .select("role, full_name, email")
        .eq("id", session.user.id)
        .single();
        
      if (profileErr || userProfile?.role !== "provider") {
         await supabase.auth.signOut();
         router.push("/login");
         return;
      }
      
      setProfile(userProfile);

      const { data: proData, error: proErr } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
        
      if (proErr || !proData) {
         router.push("/");
         return;
      }
      
      setPro(proData);
      setLoading(false);
    };
    
    boot();
  }, [router, searchParams]);

  const verifyPayment = async (token: string, ref: string, proId: string) => {
      setVerifyStatus("loading");
      setVerifyMessage("Hold on while we securely confirm your transaction...");
      
      try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) throw new Error("Session expired. Please log in again.");

          const res = await fetch(`https://ehabinuyyasvahhxkhdw.supabase.co/functions/v1/dpo-payment`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                  action: 'verifyToken',
                  transactionToken: token,
                  companyRef: ref,
                  professionalId: proId,
              }),
          });
          
          const data = await res.json();
          
          if (data.isPaid) {
              sessionStorage.removeItem("lushy_pending_token");
              sessionStorage.removeItem("lushy_pending_ref");
              sessionStorage.removeItem("lushy_pro_id");
              
              setVerifyStatus("success");
              setVerifyMessage("Payment confirmed! Your Lushy Pro account is now active. Open the app to manage your business.");
              
              const { data: updatedPro } = await supabase
                  .from("professionals")
                  .select("*")
                  .eq("id", proId)
                  .single();
                  
              if (updatedPro) setPro(updatedPro);
              setTimeout(() => setVerifying(false), 3000);
          } else {
              throw new Error(data.explanation || "Payment not completed. Please try again.");
          }
      } catch (err: any) {
          setVerifyStatus("error");
          setVerifyMessage(err.message || "An error occurred verifying your payment.");
      }
  };

  const initiatePayment = async () => {
      if (!pro) return;
      setPaymentLoading(true);
      setError("");

      try {
          const amount = selectedPlan === "monthly" ? PLAN_MONTHLY_PRICE : PLAN_ANNUAL_PRICE;
          const { data: { session } } = await supabase.auth.getSession();

          const res = await fetch(`https://ehabinuyyasvahhxkhdw.supabase.co/functions/v1/dpo-payment`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session?.access_token}`,
              },
              body: JSON.stringify({
                  action: 'createToken',
                  professionalId: pro.id,
                  email: userEmail,
                  amount: amount,
              }),
          });

          const data = await res.json();

          if (!data.transToken) {
              throw new Error(data.explanation || data.error || "Could not create secure payment session.");
          }

          sessionStorage.setItem("lushy_pending_token", data.transToken);
          sessionStorage.setItem("lushy_pending_ref", data.companyRef);
          sessionStorage.setItem("lushy_pro_id", pro.id);

          const dpoUrl = `https://secure.3gdirectpay.com/payv3.php?ID=${data.transToken}`;
          window.location.href = dpoUrl;

      } catch (err: any) {
          setError(err.message);
          setPaymentLoading(false);
      }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading && !verifying) {
    return (
      <main className="min-h-screen bg-bg-dark flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </main>
    );
  }

  if (verifying) {
    return (
      <main className="min-h-screen bg-bg-dark text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 lg:p-14 rounded-[3rem] border-primary/20 text-center relative z-10 max-w-xl w-full flex flex-col items-center">
          {verifyStatus === "loading" && <Loader2 className="w-20 h-20 text-primary animate-spin mb-6" />}
          {verifyStatus === "success" && <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] mb-6"><Check size={40} strokeWidth={3} /></div>}
          {verifyStatus === "error" && <AlertCircle className="w-24 h-24 text-red-500 mb-6 mx-auto" />}
          
          <h2 className="text-3xl font-black font-heading tracking-tight mb-4">
               {verifyStatus === 'loading' ? 'Verifying Transaction' : verifyStatus === 'success' ? 'You\'re All Set!' : 'Verification Failed'}
          </h2>
          <p className="text-lg text-text-secondary font-medium mb-8">
               {verifyMessage}
          </p>
          
          {verifyStatus === "error" && (
              <button onClick={() => setVerifying(false)} className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-colors">
                  Return to Dashboard
              </button>
          )}
        </motion.div>
      </main>
    );
  }

  const status = pro?.subscription_status || "trial";
  const dueDate = pro?.subscription_due_date ? new Date(pro.subscription_due_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
  const isSuspended = status === "suspended" || status === "past_due";
  const isActive = status === "active";

  return (
    <main className="min-h-screen bg-bg-dark text-white p-6 md:p-10 lg:p-20 relative overflow-hidden flex justify-center items-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-accent/10 rounded-full blur-[120px] animate-float-delayed" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="relative z-10 w-full max-w-2xl mt-12 mb-12">
        <div className="flex items-center justify-between mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-glass-border flex items-center justify-center group-hover:bg-white/10 transition-all">
                  <ArrowLeft size={20} className="text-white group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
            <button onClick={handleSignOut} className="text-sm font-black text-text-secondary hover:text-white uppercase tracking-widest transition-colors">
                Sign Out
            </button>
        </div>

        <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black font-heading mb-4 tracking-tight">Pro Portal</h1>
            <p className="text-text-secondary text-lg">Welcome back, {profile?.full_name || pro?.business_name}</p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-3xl mb-8 flex items-center gap-3 font-bold text-sm">
                <AlertCircle size={20} className="shrink-0" />
                <span>{error}</span>
            </div>
        )}

        <div className="glass-card p-6 md:p-12 rounded-[2.5rem] border-glass-border shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-glass-border">
                <div>
                   <h3 className="text-xs uppercase tracking-widest font-black text-text-secondary mb-2">Current Status</h3>
                   <div className="flex items-center gap-3">
                       <span className={`flex h-3 w-3 rounded-full ${isActive ? 'bg-emerald-500' : isSuspended ? 'bg-red-500' : 'bg-amber-500'}`} />
                       <span className="text-2xl font-black tracking-tight">
                           {isActive ? "Active" : status === "trial" ? "14-Day Free Trial" : "Suspended"}
                       </span>
                   </div>
                </div>
                {dueDate && (
                    <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 text-sm font-semibold text-text-secondary text-center">
                        {isActive ? `Renews on` : isSuspended ? `Past due since` : `Ends on`} 
                        <span className="text-white ml-2 block sm:inline font-bold">{dueDate}</span>
                    </div>
                )}
            </div>

            {!isActive && (
                 <div className="bg-white/5 p-2 rounded-2xl flex items-center mb-8 border border-white/5 relative z-10">
                     <button
                         onClick={() => setSelectedPlan("monthly")}
                         className={`flex-1 py-4 text-center rounded-xl text-sm font-black uppercase tracking-widest transition-all ${selectedPlan === "monthly" ? "bg-white text-bg-dark shadow-lg" : "text-text-secondary hover:text-white"}`}
                     >
                         Monthly
                     </button>
                     <button
                         onClick={() => setSelectedPlan("annual")}
                         className={`flex-1 py-4 text-center rounded-xl text-sm font-black uppercase tracking-widest transition-all ${selectedPlan === "annual" ? "bg-white text-bg-dark shadow-lg relative" : "text-text-secondary hover:text-white"}`}
                     >
                         Annually
                         {selectedPlan === "annual" && <span className="absolute -top-3 -right-2 bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-full animate-pulse shadow-lg text-nowrap">Save P298</span>}
                     </button>
                 </div>
            )}

            <div className={`p-8 rounded-3xl ${isActive ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-primary/10 border-primary/20'} border relative overflow-hidden mb-10`}>
                <div className={`absolute top-[-50px] right-[-50px] w-32 h-32 rounded-full blur-[80px] ${isActive ? 'bg-emerald-500' : 'bg-primary'}`} />
                <h4 className={`text-xs uppercase font-black tracking-widest mb-1 ${isActive ? "text-emerald-400" : "text-primary"}`}>Lushy Professional</h4>
                <div className="flex items-end gap-2 mb-8 relative z-10">
                    <span className="text-5xl font-black">
                        P{isActive ? "--" : selectedPlan === "monthly" ? PLAN_MONTHLY_PRICE : PLAN_ANNUAL_PRICE}
                    </span>
                    {!isActive && <span className="text-lg font-bold text-text-secondary pb-1">/ {selectedPlan === "monthly" ? "month" : "year"}</span>}
                </div>

                <ul className="space-y-4 relative z-10">
                    <li className="flex items-center gap-4 text-sm font-bold text-white/90">
                        <Check size={20} className={isActive ? "text-emerald-400" : "text-primary"} /> Accept unlimited client bookings
                    </li>
                    <li className="flex items-center gap-4 text-sm font-bold text-white/90">
                        <Check size={20} className={isActive ? "text-emerald-400" : "text-primary"} /> Connect directly with clients
                    </li>
                    <li className="flex items-center gap-4 text-sm font-bold text-white/90">
                        <Check size={20} className={isActive ? "text-emerald-400" : "text-primary"} /> Advanced calendar & analytics
                    </li>
                    <li className="flex items-center gap-4 text-sm font-bold text-white/90">
                        <Check size={20} className={isActive ? "text-emerald-400" : "text-primary"} /> Zero commissions on your services
                    </li>
                </ul>
            </div>

            {!isActive && (
                <div className="text-center relative z-10">
                    <button
                        onClick={initiatePayment}
                        disabled={paymentLoading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl mb-4 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,64,129,0.3)] transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {paymentLoading ? <Loader2 className="animate-spin" size={24} /> : (
                            <>
                                <CreditCard size={22} />
                                <span>Secure Subscription via DPO</span>
                            </>
                        )}
                    </button>
                    <p className="text-xs text-text-secondary font-medium leading-relaxed px-4">
                        By confirming payment, you agree to our <Link href="/terms" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary hover:underline">Policies</Link>. Your subscription automatically renews. Cancel anytime.
                    </p>
                </div>
            )}
            
            {isActive && (
               <div className="text-center relative z-10">
                  <Link href="/pro/dashboard" className="inline-flex items-center justify-center w-full bg-white text-bg-dark font-black py-5 rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                      Go to Dashboard Overview
                  </Link>
               </div>
            )}
        </div>
      </motion.div>
    </main>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-bg-dark flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </main>
    }>
      <SubscribeContent />
    </Suspense>
  );
}
