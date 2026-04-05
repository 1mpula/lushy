"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  MapPin, 
  CalendarCheck, 
  Star, 
  Smartphone, 
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Globe
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: MapPin,
      title: "Local Discovery",
      description: "Find the best beauty professionals right in your neighborhood.",
      color: "from-pink-500/20 to-rose-500/20"
    },
    {
      icon: CalendarCheck,
      title: "Instant Booking",
      description: "Book home visits or salon appointments in just a few taps.",
      color: "from-purple-500/20 to-indigo-500/20"
    },
    {
      icon: Star,
      title: "Verified Quality",
      description: "Real reviews and portfolios from top-rated professionals.",
      color: "from-blue-500/20 to-cyan-500/20"
    }
  ];

  return (
    <main className="min-h-screen bg-bg-dark selection:bg-primary/30 relative overflow-hidden">
      {/* ─── Ambient Glow Background ──────────────────────────────── */}
      <div className="glow-orb absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="glow-orb-slow absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[100px] pointer-events-none z-0" />
      
      {/* ─── Navbar ────────────────────────────────────────────────── */}
      <nav className="relative z-50 flex items-center justify-between max-w-7xl mx-auto px-6 py-8">
        <Link href="/" className="text-primary font-outfit text-2xl font-black tracking-widest uppercase">
          Lushy
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-text-secondary hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            Pro Login
          </Link>
          <button className="btn-primary px-6 py-2.5 rounded-full text-sm">
            Get App
          </button>
        </div>
      </nav>

      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section className="relative z-10 pt-16 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-primary tracking-wide uppercase">The premier beauty booking app</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[1.1]"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Book your <span className="text-primary">best look.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-text-secondary text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
        >
          Discover top-rated barbers, nail techs, makeup artists, and massage therapists in your city. Book home visits or salon appointments instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button className="w-full sm:w-auto px-10 py-5 bg-white text-bg-dark font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all hover:-translate-y-1 active:scale-95 text-lg">
            <Smartphone className="w-6 h-6" /> Download on iOS
          </button>
          <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-white/10 hover:-translate-y-1 active:scale-95 text-lg">
            Get it on Android
          </button>
        </motion.div>
      </section>

      {/* ─── Features Grid ────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card rounded-[32px] p-10 flex flex-col items-start group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 border border-white/5`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-outfit)' }}>
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Pro Promo Section ───────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-[48px] p-12 md:p-20 overflow-hidden relative"
        >
          {/* Subtle Glow inside the card */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 font-bold text-[10px] text-primary uppercase tracking-[0.2em]">
                For Professionals
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-outfit)' }}>
                Grow your business with Lushy.
              </h2>
              <ul className="space-y-4 mb-10">
                {[
                  "Reach thousands of new clients",
                  "0% commission on your bookings",
                  "Manage your schedule instantly"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-text-secondary">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="btn-primary px-10 py-5 rounded-2xl inline-flex items-center gap-3 text-lg"
              >
                Join as a Pro <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="md:w-1/2 relative">
               <div className="w-full aspect-square max-w-md mx-auto bg-gradient-to-br from-primary/10 to-transparent rounded-full border border-white/5 flex items-center justify-center p-8">
                  <div className="w-full h-full bg-bg-dark rounded-full border border-white/10 flex items-center justify-center relative shadow-inner overflow-hidden">
                     {/* Mock App Screenshot Circle */}
                     <div className="absolute inset-2 rounded-full border border-primary/30 opacity-50 border-dashed" />
                     <div className="text-primary font-black text-3xl font-outfit uppercase tracking-tighter">Lushy App</div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────── */}
      <footer className="relative z-10 py-16 px-6 max-w-7xl mx-auto border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <div className="text-primary font-outfit text-xl font-black tracking-widest uppercase mb-4">
            Lushy
          </div>
          <p className="text-text-muted text-sm tracking-wide">
            © 2026 Lushy App. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center gap-8">
          <Link href="#" className="text-text-muted hover:text-white transition-all">
            <Globe className="w-5 h-5" />
          </Link>
          <Link href="/login" className="text-text-muted hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            Pro Login
          </Link>
          <Link href="#" className="text-text-muted hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            Support
          </Link>
        </div>
      </footer>
    </main>
  );
}
