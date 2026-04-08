"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Camera, 
  MapPin, 
  Star, 
  Search, 
  SlidersHorizontal,
  Home,
  Calendar,
  User,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Settings,
  X
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function JoinAsPro() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"feed" | "profile">("feed");
  
  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    salonName: "",
    category: "Hair Stylist",
    location: "Gaborone",
  });

  const [services, setServices] = useState([
    { name: "", price: "", category: "Hair", image: null as string | null, file: null as File | null },
    { name: "", price: "", category: "Hair", image: null as string | null, file: null as File | null },
  ]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateService = (id: number, field: string, value: any) => {
    setServices(prev => {
      const next = [...prev];
      if (next[id]) {
        next[id] = { ...next[id], [field]: value };
      }
      return next;
    });
  };

  const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateService(id, "file", file); // Store the actual file for upload
      const reader = new FileReader();
      reader.onload = (prev) => {
        updateService(id, "image", prev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      if (step + 1 === 4) setView("profile");
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleLockIn = async () => {
    setLoading(true);
    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.salonName,
            role: 'provider',
            business_name: formData.salonName,
            category: formData.category,
            location: formData.location
          }
        }
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("No user ID returned");

      // Check if session exists (i.e., email confirmation is disabled)
      if (!authData.session) {
        alert("Account created! Please check your email to confirm your account, then you can add your services.");
        window.location.href = "/";
        return;
      }

      // 2. Fetch Professional Record (created by trigger)
      // We retry a few times in case the trigger is slightly delayed
      let proData = null;
      let retries = 5;
      while (retries > 0 && !proData) {
        const { data, error } = await supabase
          .from('professionals')
          .select()
          .eq('user_id', userId)
          .maybeSingle();
        
        if (data) proData = data;
        else {
          await new Promise(r => setTimeout(r, 1000));
          retries--;
        }
      }

      if (!proData) {
        throw new Error("Could not retrieve professional profile. Please try logging in.");
      }

      // 3. Upload Services & Images
      for (const service of services) {
        if (service.file && service.name && service.price) {
           const fileExt = service.file.name.split('.').pop();
           const bucketName = 'services';
           const categoryFolder = (service.category || 'hair').toLowerCase();
           const fileName = `${categoryFolder}/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
           
           const { error: storageError } = await supabase.storage
             .from(bucketName)
             .upload(fileName, service.file, { contentType: service.file.type });

           if (storageError) throw storageError;

           const { data: { publicUrl } } = supabase.storage
             .from(bucketName)
             .getPublicUrl(fileName);

           await supabase.from('services').insert({
             professional_id: proData.id,
             name: service.name,
             price: parseFloat(service.price),
             category: service.category,
             image_url: publicUrl,
             image_urls: [publicUrl]
           });
        }
      }

      alert("Welcome to Lushy! Your profile is live.");
      window.location.href = "/";
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg-dark flex">
      {/* ─── Left Panel: Wizard ─────────────────────────────────── */}
      <div className="w-full lg:w-1/2 p-8 md:p-16 overflow-y-auto">
        <Link href="/" className="text-primary font-black text-2xl tracking-widest uppercase mb-12 block">
          Lushy
        </Link>

        {/* Step Indicators */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-16 bg-primary' : 'w-10 bg-white/10'}`}
            />
          ))}
        </div>

        <div className="max-w-md">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Secure your niche.</h1>
                <p className="text-text-secondary text-lg mb-8">First, create your login credentials. You'll use these to manage your bookings later.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Email Address</label>
                    <input 
                      type="email" 
                      className="input-field w-full p-4 rounded-xl"
                      placeholder="e.g. style@lusy.pro"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Password</label>
                    <input 
                      type="password" 
                      className="input-field w-full p-4 rounded-xl"
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex mt-12">
                  <button onClick={nextStep} className="btn-primary px-8 py-4 rounded-xl flex items-center gap-2">
                    Next: Business Info <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">The launch list.</h1>
                <p className="text-text-secondary text-lg mb-8">Tell us who you are. This information will appear on your professional profile.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Salon / Business Name</label>
                    <input 
                      type="text" 
                      className="input-field w-full p-4 rounded-xl"
                      placeholder="e.g. Divine Braids"
                      value={formData.salonName}
                      onChange={(e) => updateField('salonName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Primary Category</label>
                    <select 
                      className="input-field w-full p-4 rounded-xl appearance-none"
                      value={formData.category}
                      onChange={(e) => updateField('category', e.target.value)}
                    >
                      <option>Hair Stylist</option>
                      <option>Nail Tech</option>
                      <option>Makeup Artist</option>
                      <option>Barber</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Location</label>
                    <input 
                      type="text" 
                      className="input-field w-full p-4 rounded-xl"
                      placeholder="e.g. Gaborone, Botswana"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-12">
                  <button onClick={prevStep} className="px-8 py-4 rounded-xl border border-white/10 text-white font-bold">Back</button>
                  <button onClick={nextStep} className="btn-primary px-8 py-4 rounded-xl flex items-center gap-2 flex-1 justify-center">
                    Next: Add Styles <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Showcase your work.</h1>
                <p className="text-text-secondary text-lg mb-8">Add up to 2 services. These will be featured on the main Discover feed.</p>
                
                <div className="space-y-6">
                  {services.map((service, i) => (
                    <div key={i} className="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div 
                        className="w-24 h-24 bg-bg-dark rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer overflow-hidden relative"
                        onClick={() => document.getElementById(`upload-${i}`)?.click()}
                      >
                        {service.image ? (
                          <img src={service.image} className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="text-text-muted" />
                        )}
                        <input 
                          id={`upload-${i}`}
                          type="file" 
                          hidden 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(i, e)}
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <input 
                          type="text" 
                          placeholder="Service Name (e.g. Lash Lift)"
                          className="input-field w-full p-3 rounded-lg text-sm"
                          value={service.name}
                          onChange={(e) => updateService(i, 'name', e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                           <span className="text-text-muted font-bold text-sm">P</span>
                           <input 
                            type="number" 
                            placeholder="Price"
                            className="input-field w-full p-3 rounded-lg text-sm"
                            value={service.price}
                            onChange={(e) => updateService(i, 'price', e.target.value)}
                          />
                        </div>
                        <select
                          className="input-field w-full p-3 rounded-lg text-sm appearance-none"
                          value={service.category}
                          onChange={(e) => updateService(i, 'category', e.target.value)}
                        >
                          <option value="Hair">Hair</option>
                          <option value="Nails">Nails</option>
                          <option value="Lashes">Lashes</option>
                          <option value="Wigs">Wigs</option>
                          <option value="Makeup">Makeup</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-12">
                  <button onClick={prevStep} className="px-8 py-4 rounded-xl border border-white/10 text-white font-bold">Back</button>
                  <button onClick={nextStep} className="btn-primary px-8 py-4 rounded-xl flex items-center gap-2 flex-1 justify-center">
                    Preview Profile <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Ready for thousands?</h1>
                <p className="text-text-secondary text-lg mb-8">Review your profile on the right. Once you lock it in, you're officially a Lushy Pro.</p>
                
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="text-primary w-5 h-5" />
                    </div>
                    <span className="font-bold text-white">Full discovery visibility</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="text-primary w-5 h-5" />
                    </div>
                    <span className="font-bold text-white">Founding Member badge</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="text-primary w-5 h-5" />
                    </div>
                    <span className="font-bold text-white">0% Platform commission</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={prevStep} className="px-8 py-4 rounded-xl border border-white/10 text-white font-bold">Back</button>
                  <button 
                    onClick={handleLockIn} 
                    disabled={loading}
                    className="btn-primary flex-1 py-5 rounded-2xl flex items-center justify-center gap-3 text-xl disabled:opacity-50"
                  >
                    {loading ? "Creating Account..." : "Lock In & Save Profile"} <Sparkles size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Right Panel: Mobile Preview ───────────────────────── */}
      <div className="hidden lg:flex flex-1 bg-black overflow-hidden relative items-center justify-center p-12">
        <div className="glow-orb absolute w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] pointer-events-none -bottom-1/4 -right-1/4 animate-pulse" />
        
        {/* Phone Frame */}
        <div className="w-[380px] h-[780px] bg-black border-[12px] border-[#1C1C1E] rounded-[60px] shadow-2xl relative overflow-hidden flex flex-col noise-overlay">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-3xl z-50 flex items-center justify-center gap-1.5 pt-1">
             <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />
             <div className="w-12 h-1 bg-zinc-900 rounded-full" />
          </div>

          {/* App Screens */}
          <div className="flex-1 pt-12 overflow-y-auto no-scrollbar">
            {view === "feed" ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="px-6 flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-black tracking-tight text-white">Discover</h2>
                  <SlidersHorizontal className="text-primary w-6 h-6" />
                </div>
                
                <div className="mx-6 p-4 bg-zinc-900 rounded-2xl flex items-center gap-3 mb-8 text-zinc-500 font-medium">
                  <Search size={18} />
                  <span>Search braids, nails...</span>
                </div>

                <div className="grid grid-cols-2 gap-4 px-6 mb-20">
                  {services.map((service, i) => (
                    <div key={i} className="space-y-3">
                      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-900 border border-white/5">
                        <img 
                          src={service.image || `https://images.unsplash.com/photo-${i === 0 ? '1620331311520-246422fd82f9' : '1600948836101-f9ffda59d250'}?w=400`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-black">
                          P{service.price || (i === 0 ? '100' : '150')}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white truncate">{service.name || (i === 0 ? 'Whipsy lashes' : 'Cat eye lashes')}</p>
                        <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">{formData.salonName || "Lushy pro"}</p>
                      </div>
                    </div>
                  ))}
                  {/* Mock padding items */}
                  {[1,2].map(i => (
                    <div key={i} className="aspect-[4/5] bg-zinc-900/50 rounded-3xl border border-white/5 opacity-50" />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="px-6 flex justify-between items-center mb-10">
                  <ArrowLeft className="w-5 h-5" />
                  <Settings className="w-5 h-5" />
                </div>

                <div className="text-center mb-10 px-6">
                  <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2 mb-2">
                    {formData.salonName || "Lushy pro"}
                    <span className="pro-badge px-2 py-0.5 rounded-lg text-[10px] bg-primary font-black uppercase">Pro</span>
                  </h2>
                  <div className="flex items-center justify-center gap-1.5 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                    <MapPin size={12} className="text-primary" />
                    {formData.location}
                  </div>
                </div>

                <div className="bg-zinc-900/80 backdrop-blur-md border border-white/5 mx-6 p-5 rounded-[32px] flex justify-between items-center mb-10">
                  <div className="text-center flex-1">
                    <p className="font-black text-white text-lg">3</p>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">Services</p>
                  </div>
                  <div className="w-px h-8 bg-white/5" />
                  <div className="text-center flex-1">
                    <p className="font-black text-white text-lg">1</p>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">Reviews</p>
                  </div>
                  <div className="w-px h-8 bg-white/5" />
                  <div className="text-center flex-1">
                    <p className="font-black text-white text-lg">4.0</p>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">Rating</p>
                  </div>
                </div>

                <div className="flex gap-8 px-8 mb-8 border-b border-white/5">
                   <div className="pb-3 border-b-2 border-primary text-xs font-black uppercase text-white">Services</div>
                   <div className="pb-3 text-xs font-black uppercase text-zinc-600">Reviews</div>
                </div>

                <div className="grid grid-cols-2 gap-4 px-6 pb-20">
                  {services.map((service, i) => (
                    <div key={i} className="space-y-3">
                      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-900 border border-white/5">
                        <img 
                          src={service.image || `https://images.unsplash.com/photo-${i === 0 ? '1620331311520-246422fd82f9' : '1600948836101-f9ffda59d250'}?w=400`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-black">
                          P{service.price || (i === 0 ? '100' : '150')}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white truncate">{service.name || (i === 0 ? 'Whipsy lashes' : 'Cat eye lashes')}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] font-black text-zinc-500">
                          <Star size={10} className="fill-primary text-primary" />
                          4.0
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Nav Tab */}
          <div className="h-20 bg-zinc-950 border-t border-white/5 flex justify-between items-center px-8 pb-4">
             <Home className="text-zinc-700 w-5 h-5" />
             <Search className="text-primary w-5 h-5" />
             <Calendar className="text-zinc-700 w-5 h-5" />
             <User className="text-zinc-700 w-5 h-5" />
          </div>
        </div>

        {/* View Toggles */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex bg-zinc-900/50 backdrop-blur-xl p-1.5 rounded-full border border-white/5">
           <button 
            onClick={() => setView('feed')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${view === 'feed' ? 'bg-white text-black' : 'text-zinc-500'}`}
          >
            Discover Feed
          </button>
          <button 
            onClick={() => setView('profile')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${view === 'profile' ? 'bg-white text-black' : 'text-zinc-500'}`}
          >
            Pro Profile
          </button>
        </div>
      </div>
    </main>
  );
}
