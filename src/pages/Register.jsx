import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sparkles, Building2, User, ChevronLeft, ShieldCheck, CheckCircle2, Clock, Zap } from 'lucide-react';
import { authApi } from '../utils/api';

const Register = () => {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authApi.register(formData);
      
      if (response && response.success) {
        // Registration successful! Show the success popup.
        setShowSuccess(true);
        // We will navigate to login after they click the button in the popup
      } else {
        setError(response.message || 'Registration failed.');
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Server error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100vw', display: 'flex',
      background: '#060612', fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative', overflow: 'hidden'
    }}>
      {/* ── Background effects ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: 500 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', boxShadow: '0 0 24px rgba(99,102,241,0.45)' }}>
              <Sparkles size={20} color="white" />
            </div>
            <span style={{ color: 'white', fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
              Vivify<span style={{ color: '#818cf8' }}>CRM</span>
            </span>
          </div>

          {/* Main Card */}
          <div style={{
            background: 'rgba(255,255,255,0.035)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 24,
            padding: '40px 36px',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)'
          }}>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                /* Step 1: Promotion & Terms */
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 30, padding: '6px 14px', marginBottom: 20 }}>
                      <Clock size={14} color="#818cf8" />
                      <span style={{ color: '#818cf8', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>30-DAY FREE TRIAL</span>
                    </div>
                    <h2 style={{ color: 'white', fontSize: 32, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12 }}>
                      Unlock Your Future.
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6 }}>
                      Experience the full power of VivifyCRM. No limitations, no hidden fees, just pure enterprise infrastructure.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                    {[
                      { icon: Zap, text: "Full AI Workflows & Automation Suite" },
                      { icon: ShieldCheck, text: "Enterprise Security & Multi-tenant Layer" },
                      { icon: CheckCircle2, text: "No credit card required for 30 days" }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'grid', placeItems: 'center' }}>
                          <item.icon size={16} color="#818cf8" />
                        </div>
                        <span style={{ color: '#cbd5e1', fontSize: 14, fontWeight: 500 }}>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 32 }}>
                    <p style={{ color: '#475569', fontSize: 12, lineHeight: 1.6 }}>By clicking next, you agree to our <span style={{ color: '#818cf8' }}>Terms of Service</span> and acknowledge that the trial period is strictly 30 calendar days from registration.</p>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
                    onClick={handleNext}
                    style={{
                      width: '100%', height: 50, borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                      color: 'white', fontSize: 15, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      boxShadow: '0 6px 24px rgba(99,102,241,0.4)',
                      transition: 'all 0.2s'
                    }}>
                    Next: Create Account
                    <ArrowRight size={17} />
                  </motion.button>
                </motion.div>
              ) : (
                /* Step 2: Registration Form */
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <button onClick={handleBack} 
                    style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, padding: 0, marginBottom: 24 }}>
                    <ChevronLeft size={16} /> Back
                  </button>

                  <div style={{ marginBottom: 32 }}>
                    <h2 style={{ color: 'white', fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 8 }}>
                      Set up your portal.
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {/* Fields */}
                    {[
                      { id: 'company', label: 'Company Name', icon: Building2, type: 'text', placeholder: 'Nexus Corp', value: formData.companyName, field: 'companyName' },
                      { id: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Sarah Chen', value: formData.fullName, field: 'fullName' },
                      { id: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'sarah@nexus.com', value: formData.email, field: 'email' },
                      { id: 'password', label: 'Create Password', icon: Lock, type: 'password', placeholder: '••••••••••', value: formData.password, field: 'password' }
                    ].map((f) => (
                      <div key={f.id}>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{f.label}</label>
                        <div style={{ position: 'relative' }}>
                          <f.icon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: focused === f.id ? '#818cf8' : '#334155', transition: 'color 0.2s', pointerEvents: 'none' }} />
                          <input type={f.type} required value={f.value} placeholder={f.placeholder}
                            onChange={e => setFormData({...formData, [f.field]: e.target.value})}
                            onFocus={() => setFocused(f.id)} onBlur={() => setFocused('')}
                            style={{
                              width: '100%', padding: '13px 14px 13px 42px', borderRadius: 12,
                              border: `1.5px solid ${focused === f.id ? 'rgba(129,140,248,0.6)' : 'rgba(255,255,255,0.08)'}`,
                              background: focused === f.id ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
                              color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s'
                            }} />
                        </div>
                      </div>
                    ))}

                    <motion.button type="submit" disabled={isLoading}
                      whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
                      style={{
                        height: 50, borderRadius: 12, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                        background: isLoading ? 'rgba(99,102,241,0.45)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                        color: 'white', fontSize: 15, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 12, boxShadow: '0 6px 24px rgba(99,102,241,0.4)'
                      }}>
                      {isLoading ? "Provisioning..." : "Launch 30-Day Free Trial"}
                      {!isLoading && <CheckCircle2 size={17} />}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <p style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: '#475569' }}>
               Powered by the Vivify Foundation · Scalable B2B Infrastructure
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Success Popup Overlay ── */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(6,6,18,0.9)', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
            }}>
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              style={{
                width: '100%', maxWidth: 440, background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 32, padding: '48px 40px',
                textAlign: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.6)'
              }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#10b981)', display: 'grid', placeItems: 'center', margin: '0 auto 24px', boxShadow: '0 0 32px rgba(34,197,94,0.3)' }}>
                <CheckCircle2 size={40} color="white" />
              </div>
              <h2 style={{ color: 'white', fontSize: 28, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.5px' }}>
                System Provisioned.
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
                Congratulations! Your 30-day Free Trial of **{formData.companyName}** is now live and ready for your first login.
              </p>
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                style={{
                  width: '100%', height: 54, borderRadius: 14, border: 'none', cursor: 'pointer',
                  background: 'white', color: '#060612', fontSize: 15, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: '0 12px 32px rgba(255,255,255,0.15)'
                }}>
                Proceed to Login
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
