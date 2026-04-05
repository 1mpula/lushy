"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  MapPin, 
  Sparkles,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

const transition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

export default function Signup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    businessName: "",
    category: "Hair",
    location: "Gaborone",
    bio: ""
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No user created");

      // 2. Create professional profile
      const { error: proError } = await supabase
        .from("professionals")
        .insert({
          user_id: authData.user.id,
          business_name: formData.businessName,
          expertise: [formData.category], // Store as array
          location: formData.location,
          bio: formData.bio,
          subscription_status: 'trial' // Default to trial as per schema
        });

      if (proError) throw proError;

      // Redirect to the standalone subscription portal
      window.location.href = "/subscribe.html";
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg-dark text-text-primary selection:bg-primary/30 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-accent/10 rounded-full blur-[100px] animate-float-delayed" />
      </div>

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group z-50">
        <div className="w-10 h-10 rounded-full bg-white/5 border border-glass-border flex items-center justify-center group-hover:bg-white/10 transition-all font-bold">
           <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform text-white" />
        </div>
        <span className="text-white font-black uppercase text-xs tracking-widest hidden sm:block">Back to Lushy</span>
      </Link>

      <div className="w-full max-w-xl relative z-10">
        <div className="flex flex-col items-center mb-12">
            <img src="/lushy-logo.png" alt="Lushy" className="h-16 mb-8" />
            <div className="flex items-center gap-4">
              <StepIndicator currentStep={step} stepNumber={1} icon={<User size={14} />} />
              <div className="w-8 h-px bg-glass-border" />
              <StepIndicator currentStep={step} stepNumber={2} icon={<Briefcase size={14} />} />
              <div className="w-8 h-px bg-glass-border" />
              <StepIndicator currentStep={step} stepNumber={3} icon={<Sparkles size={14} />} />
            </div>
        </div>

        <motion.div 
          layout
          className="glass-card p-10 lg:p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl border-primary/20"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={transition}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-black font-heading mb-2">Create Your Account</h2>
                  <p className="text-text-secondary font-bold">Join the community of elite beauty pros.</p>
                </div>
                
                <InputField 
                   label="Full Name" 
                   icon={<User size={18} />} 
                   placeholder="Zarah Thompson"
                   value={formData.fullName}
                   onChange={v => setFormData({...formData, fullName: v})}
                />
                <InputField 
                   label="Email Address" 
                   icon={<Mail size={18} />} 
                   placeholder="zarah@lushyapp.com"
                   type="email"
                   value={formData.email}
                   onChange={v => setFormData({...formData, email: v})}
                />
                <InputField 
                   label="Password" 
                   icon={<Lock size={18} />} 
                   placeholder="••••••••"
                   type="password"
                   value={formData.password}
                   onChange={v => setFormData({...formData, password: v})}
                />

                <button 
                  onClick={nextStep}
                  disabled={!formData.fullName || !formData.email || !formData.password}
                  className="w-full bg-white text-black py-5 rounded-2xl font-black text-lg mt-8 flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                >
                  Continue
                  <ArrowRight size={22} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={transition}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-black font-heading mb-2">Business Presence</h2>
                  <p className="text-text-secondary font-bold">How should clients find you?</p>
                </div>

                <InputField 
                   label="Business Name" 
                   icon={<Briefcase size={18} />} 
                   placeholder="The Glow Studio"
                   value={formData.businessName}
                   onChange={v => setFormData({...formData, businessName: v})}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-3 ml-2">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white/5 border border-glass-border rounded-2xl py-4 px-5 text-white focus:outline-none focus:border-primary transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option className="bg-bg-dark">Hair</option>
                      <option className="bg-bg-dark">Nails</option>
                      <option className="bg-bg-dark">Lashes</option>
                      <option className="bg-bg-dark">Makeup</option>
                    </select>
                  </div>
                  <InputField 
                     label="Location" 
                     icon={<MapPin size={18} />} 
                     placeholder="Gaborone"
                     value={formData.location}
                     onChange={v => setFormData({...formData, location: v})}
                  />
                </div>

                <div className="flex gap-4 mt-8">
                   <button 
                    onClick={prevStep}
                    className="flex-1 bg-white/5 text-white py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all border border-glass-border"
                  >
                    Back
                  </button>
                  <button 
                    onClick={nextStep}
                    disabled={!formData.businessName || !formData.location}
                    className="flex-[2] bg-white text-black py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Next Step
                    <ArrowRight size={22} />
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
                transition={transition}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-black font-heading mb-2">Almost There</h2>
                  <p className="text-text-secondary font-bold">Tell us a bit about your expertise.</p>
                </div>

                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-3 ml-2">Professional Bio</label>
                   <textarea 
                     rows={4}
                     placeholder="I specialize in bridal hair and precision cuts with over 10 years of experience..."
                     className="w-full bg-white/5 border border-glass-border rounded-3xl py-5 px-6 text-white focus:outline-none focus:border-primary transition-all font-medium leading-relaxed resize-none"
                     value={formData.bio}
                     onChange={e => setFormData({...formData, bio: e.target.value})}
                   />
                </div>

                <div className="flex gap-4 mt-8">
                   <button 
                    onClick={prevStep}
                    className="flex-1 bg-white/5 text-white py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all border border-glass-border"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSignup}
                    disabled={loading || !formData.bio}
                    className="flex-[2] bg-primary text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-primary-dark transition-all active:scale-95 shadow-xl shadow-primary/20"
                  >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : (
                      <>
                        Complete Profile
                        <Check size={22} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-center text-text-secondary font-bold text-sm mt-12">
           Already have a professional account? <Link href="/login" className="text-primary hover:underline underline-offset-4">Sign in here</Link>
        </p>
      </div>
    </main>
  );
}

function StepIndicator({ currentStep, stepNumber, icon }: { currentStep: number, stepNumber: number, icon: React.ReactNode }) {
  const active = currentStep >= stepNumber;
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${active ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,64,129,0.5)]' : 'bg-white/5 text-text-secondary border border-glass-border'}`}>
      {currentStep > stepNumber ? <Check size={14} strokeWidth={3} /> : icon}
    </div>
  );
}

function InputField({ label, icon, placeholder, type = "text", value, onChange }: { label: string, icon: React.ReactNode, placeholder: string, type?: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="relative group">
      <label className="block text-[10px] font-black uppercase tracking-widest text-text-secondary mb-3 ml-2 group-focus-within:text-primary transition-colors">{label}</label>
      <div className="relative">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
          {icon}
        </div>
        <input 
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white/5 border border-glass-border rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-bold placeholder:text-text-secondary/30"
        />
      </div>
    </div>
  );
}
