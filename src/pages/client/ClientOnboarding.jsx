import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Building2, Briefcase, DollarSign, Mail, Phone, Zap } from 'lucide-react';

export default function ClientOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    name: localStorage.getItem('onboardingName') || '',
    email: localStorage.getItem('onboardingEmail') || '',
    phone: localStorage.getItem('onboardingPhone') || '',
    company: '',
    businessType: 'SaaS / Software',
    requirements: '',
    budget: '',
    contactMethod: 'Email',
  });

  const handleNext = () => setStep(2);
  const handlePrev = () => setStep(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call to save customer data
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      
      // Also need to set the userType to trigger auth routes and correct navigation in actual app usage
      localStorage.setItem('userType', 'client');
      
      // Auto-redirect to dashboard after success
      setTimeout(() => {
        navigate('/client/dashboard');
      }, 1500);
      
    }, 1500);
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--input-bg)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ background: 'var(--card-bg)', padding: 48, borderRadius: 24, textAlign: 'center', boxShadow: '0 24px 48px rgba(0,0,0,0.05)', maxWidth: 400 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
            style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'grid', placeItems: 'center', margin: '0 auto 24px' }}>
            <Check size={40} />
          </motion.div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 12px' }}>Account Created!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>Your profile has been fully set up. We're redirecting you to your personal portal...</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ width: 20, height: 20, border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--input-bg)', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative' }}>
      
      {/* Decorative BG */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 240, background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', zIndex: 0 }} />

      <div style={{ width: '100%', maxWidth: 720, margin: '0 auto', padding: '60px 24px', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
          
          <div style={{ textAlign: 'center', marginBottom: 40, color: 'var(--card-bg)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: 20, marginBottom: 16 }}>
              <Zap size={14} color="#a78bfa" />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: '#e0e7ff' }}>ALMOST THERE</span>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Let's personalize your experience.</h1>
            <p style={{ fontSize: 15, color: '#c7d2fe', opacity: 0.9 }}>Tell us a bit about your business so we can tailor the CRM for you.</p>
          </div>

          <div style={{ background: 'var(--card-bg)', borderRadius: 24, padding: 40, boxShadow: '0 24px 48px rgba(0,0,0,0.06)' }}>
            
            {/* Progress Bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
              <div style={{ flex: 1, height: 6, borderRadius: 6, background: step >= 1 ? 'var(--primary)' : 'var(--card-border)', transition: 'all 0.3s' }} />
              <div style={{ flex: 1, height: 6, borderRadius: 6, background: step >= 2 ? 'var(--primary)' : 'var(--card-border)', transition: 'all 0.3s' }} />
            </div>

            <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit}>
              
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24 }}>Basic Information</h3>
                    
                    <div style={{ display: 'grid', gap: 20 }}>
                      <div className="b24-field" style={{ margin: 0 }}>
                        <label className="b24-label">Full Name</label>
                        <input className="b24-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required />
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div className="b24-field" style={{ margin: 0 }}>
                          <label className="b24-label">Email Address</label>
                          <input type="email" className="b24-input" style={{ width: '100%', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-secondary)' }} value={formData.email} readOnly />
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>Email cannot be changed during setup.</span>
                        </div>
                        <div className="b24-field" style={{ margin: 0 }}>
                          <label className="b24-label">Phone Number</label>
                          <input type="tel" className="b24-input" style={{ width: '100%', boxSizing: 'border-box' }} value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} required />
                        </div>
                      </div>

                      <div className="b24-field" style={{ margin: 0 }}>
                        <label className="b24-label">Company / Business Name <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>(Optional)</span></label>
                        <div style={{ position: 'relative' }}>
                          <Building2 size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
                          <input className="b24-input" style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 40 }} placeholder="e.g. Acme Corp" value={formData.company} onChange={e=>setFormData({...formData, company: e.target.value})} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                      <button type="submit" style={{ padding: '12px 24px', borderRadius: 10, background: 'var(--primary)', color: 'var(--card-bg)', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                        Continue to details <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24 }}>Project & Business Details</h3>
                    
                    <div style={{ display: 'grid', gap: 20 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div className="b24-field" style={{ margin: 0 }}>
                          <label className="b24-label">Industry / Business Type</label>
                          <div style={{ position: 'relative' }}>
                            <Briefcase size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
                            <select className="b24-select" style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 40 }} value={formData.businessType} onChange={e=>setFormData({...formData, businessType: e.target.value})}>
                              {['SaaS / Software', 'E-Commerce / Retail', 'Agency / Consulting', 'Real Estate', 'Healthcare', 'Education', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="b24-field" style={{ margin: 0 }}>
                          <label className="b24-label">Estimated Budget <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>(Optional)</span></label>
                          <div style={{ position: 'relative' }}>
                            <DollarSign size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
                            <select className="b24-select" style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 40 }} value={formData.budget} onChange={e=>setFormData({...formData, budget: e.target.value})}>
                              <option value="">Select a range...</option>
                              <option value="<$5k">Under $5k</option>
                              <option value="$5k-$10k">$5k - $10k</option>
                              <option value="$10k-$50k">$10k - $50k</option>
                              <option value="$50k+">$50k+</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="b24-field" style={{ margin: 0 }}>
                        <label className="b24-label">Project Requirements / Goals</label>
                        <textarea className="b24-textarea" style={{ width: '100%', boxSizing: 'border-box', minHeight: 100 }} placeholder="Briefly describe what you're looking to build or achieve..." value={formData.requirements} onChange={e=>setFormData({...formData, requirements: e.target.value})} required />
                      </div>

                      <div className="b24-field" style={{ margin: 0 }}>
                        <label className="b24-label">Preferred Contact Method</label>
                        <div style={{ display: 'flex', gap: 12 }}>
                          {['Email', 'Phone'].map(method => (
                            <div key={method} onClick={() => setFormData({...formData, contactMethod: method})}
                              style={{ flex: 1, padding: 14, borderRadius: 12, border: formData.contactMethod === method ? '2px solid #2563eb' : '2px solid #e2e8f0', background: formData.contactMethod === method ? 'rgba(59, 130, 246, 0.1)' : 'var(--card-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s' }}>
                              <div style={{ width: 18, height: 18, borderRadius: '50%', border: formData.contactMethod === method ? '5px solid #2563eb' : '2px solid #cbd5e1', background: 'var(--card-bg)', boxSizing: 'border-box' }} />
                              {method === 'Email' ? <Mail size={16} color={formData.contactMethod === method ? 'var(--primary)' : 'var(--text-secondary)'} /> : <Phone size={16} color={formData.contactMethod === method ? 'var(--primary)' : 'var(--text-secondary)'} />}
                              <span style={{ fontSize: 13, fontWeight: 700, color: formData.contactMethod === method ? '#1e3a8a' : 'var(--text-secondary)' }}>{method}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                      <button type="button" onClick={handlePrev} className="b24-btn b24-btn-secondary" style={{ padding: '12px 20px' }}>
                        Back
                      </button>
                      <button type="submit" disabled={isLoading} style={{ padding: '12px 28px', borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', color: 'var(--card-bg)', border: 'none', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: isLoading ? 0.8 : 1 }}>
                        {isLoading ? (
                          <>
                            <div style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            Setting up portal...
                          </>
                        ) : (
                          <>Finish Setup <Check size={16} /></>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </form>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
