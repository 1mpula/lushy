"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, Mail, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      router.push("/subscribe");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Glow Orbs */}
      <div className="glow-orb absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="glow-orb-slow absolute bottom-[-20%] right-[-15%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="glow-orb absolute top-[40%] right-[-5%] w-[300px] h-[300px] bg-primary/8 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">Pro Dashboard</span>
            </div>
          </motion.div>

          <h1
            className="text-4xl font-black tracking-tight text-white mb-3"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Welcome back
          </h1>
          <p className="text-text-secondary text-base leading-relaxed max-w-[300px]">
            Sign in to manage your professional account and subscriptions.
          </p>
        </div>

        {/* Login Form Card */}
        <form onSubmit={handleLogin} className="glass-card rounded-3xl p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2 ml-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full input-field rounded-xl py-3.5 pl-12 pr-4"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full input-field rounded-xl py-3.5 pl-12 pr-4"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 rounded-xl flex items-center justify-center text-base mt-3"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2 font-bold">
                  Sign In
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-text-muted text-sm mt-8"
        >
          Don&apos;t have an account?{" "}
          <span className="text-primary font-semibold cursor-pointer hover:underline">
            Download the Lushy app
          </span>
        </motion.p>
      </motion.div>
    </main>
  );
}
