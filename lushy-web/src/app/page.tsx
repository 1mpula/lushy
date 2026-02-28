"use client";

import { ArrowRight, CalendarCheck, MapPin, Sparkles, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 px-6 py-6 lg:px-12 flex items-center justify-between z-50 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-charcoal">Lushy</span>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm mb-8">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-semibold text-charcoal">The premier beauty booking app</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold text-charcoal tracking-tight mb-8 leading-[1.1]">
            Book your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-400">best look.</span>
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover top-rated barbers, nail techs, makeup artists, and massage therapists in your city. Book home visits or salon appointments instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => alert("Lushy is currently in Beta. The iOS app will be available on the App Store soon!")}
              className="w-full sm:w-auto px-8 py-4 bg-charcoal text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
            >
              Download on iOS
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => alert("Lushy is currently in Beta. The Android app will be available on Google Play soon!")}
              className="w-full sm:w-auto px-8 py-4 bg-white text-charcoal border border-slate-200/60 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/50"
            >
              Get it on Android
            </button>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-lg shadow-pink-100/20 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
              <MapPin className="text-primary" size={24} />
            </div>
            <h3 className="font-bold text-lg text-charcoal mb-2">House Calls or Salons</h3>
            <p className="text-slate-500 text-sm">Professionals come to you, or you visit their workspace.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-lg shadow-pink-100/20 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <CalendarCheck className="text-secondary" size={24} />
            </div>
            <h3 className="font-bold text-lg text-charcoal mb-2">Instant Booking</h3>
            <p className="text-slate-500 text-sm">See live availability and book appointments in seconds.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-lg shadow-pink-100/20 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
              <Star className="text-emerald-500" size={24} />
            </div>
            <h3 className="font-bold text-lg text-charcoal mb-2">Verified Reviews</h3>
            <p className="text-slate-500 text-sm">Read real reviews and see photos before you book.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
