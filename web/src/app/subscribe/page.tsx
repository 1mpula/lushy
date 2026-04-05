"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  LogOut,
  Shield,
  Zap,
  Users,
  Star,
  Crown,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  { icon: Users, label: "Unlimited client bookings" },
  { icon: Zap, label: "0% commission on all services" },
  { icon: Star, label: "Priority listing in search" },
  { icon: Shield, label: "Verified Pro badge on profile" },
  { icon: Calendar, label: "Advanced booking management" },
];

export default function SubscribePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [proData, setProData] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const router = useRouter();

  const monthlyPrice = 149;
  const annualPrice = 1490;
  const annualSavings = monthlyPrice * 12 - annualPrice;

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      setUser(session.user);

      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("id", session.user.id)
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
      const months = billingCycle === "annual" ? 12 : 1;
      const { error } = await supabase
        .from("professionals")
        .update({
          subscription_status: "active",
          subscription_end_date: new Date(
            new Date().setMonth(new Date().getMonth() + months)
          ).toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      setProData({ ...proData, subscription_status: "active" });
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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-text-muted text-sm">Loading your account...</p>
        </div>
      </main>
    );
  }

  const isSubscribed = proData?.subscription_status === "active";
  const displayPrice = billingCycle === "annual" ? annualPrice : monthlyPrice;
  const displayPeriod = billingCycle === "annual" ? "/year" : "/month";

  return (
    <main className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="glow-orb absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="glow-orb-slow absolute bottom-[-15%] right-[10%] w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between max-w-4xl mx-auto mb-12 relative z-10"
      >
        <div
          className="text-primary text-xl font-black tracking-widest uppercase"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Lushy<span className="text-white/60 text-sm font-semibold ml-1.5 normal-case tracking-normal">Pro</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-text-muted text-sm hidden sm:block">
            {user?.email}
          </span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-text-muted hover:text-white transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto relative z-10"
      >
        {isSubscribed ? (
          /* ─── ACTIVE Subscription ──────────────────────────── */
          <div className="glass-card rounded-3xl p-10 md:p-14 text-center" style={{ borderColor: "rgba(16, 185, 129, 0.2)" }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle2 className="w-10 h-10 text-success" />
            </motion.div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 border border-success/20 mb-6">
              <Crown className="w-4 h-4 text-success" />
              <span className="text-xs font-bold text-success uppercase tracking-wider">Active Subscription</span>
            </div>

            <h2
              className="text-3xl md:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              You&apos;re all set!
            </h2>
            <p className="text-text-secondary text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Your Lushy Pro subscription is active. Your profile is visible to
              thousands of clients searching for beauty professionals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-3.5 bg-white/8 hover:bg-white/12 text-white font-semibold rounded-xl transition-all border border-white/10">
                Open Mobile App
              </button>
            </div>
          </div>
        ) : (
          /* ─── INACTIVE — Subscription Pricing ─────────────── */
          <div>
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warning/10 border border-warning/20 mb-6">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span className="text-xs font-bold text-warning uppercase tracking-wider">Action Required</span>
              </div>

              <h2
                className="text-3xl md:text-4xl font-black text-white mb-4"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Activate your Pro account
              </h2>
              <p className="text-text-secondary text-lg max-w-xl mx-auto leading-relaxed">
                Subscribe to appear on the Lushy marketplace. Start receiving
                bookings from clients in your area today.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-white/10 text-white border border-white/15"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  billingCycle === "annual"
                    ? "bg-primary/15 text-primary border border-primary/25"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                Annual
                <span className="text-[10px] font-black uppercase bg-success/15 text-success px-2 py-0.5 rounded-full">
                  Save P{annualSavings}
                </span>
              </button>
            </div>

            {/* Pricing Card */}
            <div className="glass-card rounded-3xl overflow-hidden max-w-xl mx-auto">
              {/* Price Header */}
              <div className="p-8 md:p-10 border-b border-white/5">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-2">
                      {billingCycle === "annual" ? "Annual Plan" : "Standard Pro Plan"}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="text-5xl md:text-6xl font-black text-white"
                        style={{ fontFamily: "var(--font-outfit)" }}
                      >
                        P{displayPrice}
                      </span>
                      <span className="text-text-muted text-lg font-medium">{displayPeriod}</span>
                    </div>
                  </div>
                  {billingCycle === "annual" && (
                    <div className="text-right hidden sm:block">
                      <p className="text-text-muted text-xs font-medium">Effective monthly</p>
                      <p className="text-white font-bold text-lg">
                        P{Math.round(annualPrice / 12)}<span className="text-text-muted text-sm">/mo</span>
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-text-secondary text-sm leading-relaxed">
                  14-day free trial included. Cancel anytime. No hidden fees.
                </p>
              </div>

              {/* Features List */}
              <div className="p-8 md:p-10 space-y-4">
                {FEATURES.map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                    className="flex items-center gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <span className="text-white text-sm font-medium">{feature.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="p-8 md:p-10 pt-0">
                <button
                  onClick={handleSimulatePayment}
                  disabled={processingPayment}
                  className="w-full btn-primary py-4.5 rounded-xl flex items-center justify-center gap-3 text-base"
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span className="font-bold">
                        Start Free Trial — P{displayPrice}{displayPeriod}
                      </span>
                    </>
                  )}
                </button>

                <p className="text-center text-text-muted text-xs mt-5 leading-relaxed">
                  By subscribing you agree to our{" "}
                  <span className="text-text-secondary underline cursor-pointer">Terms of Service</span> and{" "}
                  <span className="text-text-secondary underline cursor-pointer">Cancellation Policy</span>.
                  <br />
                  Your subscription will auto-renew unless cancelled before the billing date.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </main>
  );
}
