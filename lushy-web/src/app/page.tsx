"use client";

import { ArrowRight, CalendarCheck, MapPin, Sparkles, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 overflow-hidden relative">
      {/* Animated Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none animate-float" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-pink-400/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 px-6 py-6 lg:px-12 flex items-center justify-between z-50 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="/lushy-logo.png" alt="Lushy Logo" className="h-12 sm:h-16 w-auto object-contain drop-shadow-sm" />
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-charcoal font-medium hover:text-primary transition-colors hidden sm:block">
            For Professionals
          </Link>
          <Link href="/login" className="bg-white/80 backdrop-blur-md border border-white/50 text-charcoal shadow-sm px-6 py-2.5 rounded-full font-bold hover:bg-white transition-all hover:shadow-md">
            Log In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh] z-10 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-semibold text-charcoal">The premier beauty booking app</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold font-heading text-charcoal tracking-tight mb-8 leading-[1.1] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Book your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400">best look.</span>
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Discover top-rated barbers, nail techs, makeup artists, and massage therapists in your city. Book home visits or salon appointments instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => alert("Lushy is currently in Beta. The iOS app will be available on the App Store soon!")}
              className="w-full sm:w-auto px-8 py-4 bg-charcoal text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
            >
              Download on iOS
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => alert("Lushy is currently in Beta. The Android app will be available on Google Play soon!")}
              className="w-full sm:w-auto px-8 py-4 glass-card text-charcoal rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
            >
              Get it on Android
            </button>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
          <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col items-center text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-rose-50 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
              <MapPin className="text-primary" size={28} />
            </div>
            <h3 className="font-bold font-heading text-xl text-charcoal mb-2">House Calls or Salons</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Professionals come to you, or you visit their workspace.</p>
          </div>
          <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col items-center text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-blue-50 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
              <CalendarCheck className="text-secondary" size={28} />
            </div>
            <h3 className="font-bold font-heading text-xl text-charcoal mb-2">Instant Booking</h3>
            <p className="text-slate-500 text-sm leading-relaxed">See live availability and book appointments in seconds.</p>
          </div>
          <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col items-center text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-green-50 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
              <Star className="text-emerald-500" size={28} />
            </div>
            <h3 className="font-bold font-heading text-xl text-charcoal mb-2">Verified Reviews</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Read real reviews and see photos before you book.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
