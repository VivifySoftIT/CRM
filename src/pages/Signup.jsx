import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Mail, Phone, Lock, Eye, EyeOff, Building2, CreditCard, Landmark, Hash, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const STEPS = ['Account Info', 'Bank Details', 'Confirm'];

const labelStyle = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#475569',
  marginBottom: 8, letterSpacing: '0.07em', textTransform: 'uppercase',
};

function Field({ label, icon: Icon, fkey, value, onChange, type = 'text', placeholder, error, extra, focused, onFocus, onBlur }) {
  const isFocused = focused === fkey;
  const style = {
    width: '100%', padding: '13px 14px 13px 42px', borderRadius: 12, boxSizing: 'border-box',
    border: `1.5px solid ${error ? '#ef4444' : isFocused ? 'rgba(129,140,248,0.6)' : 'rgba(255,255,255,0.08)'}`,
    background: isFocused ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
    color: 'white', fontSize: 14, outline: 'none',
    boxShadow: isFocused ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
    transition: 'all 0.2s',
  };
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: isFocused ? '#818cf8' : '#334155', transition: 'color 0.2s', pointerEvents: 'none' }} />
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          onChange={e => onChange(e.target.value)}
          onFocus={() => onFocus(fkey)}
          onBlur={onBlur}
          style={style}
        />
        {extra}
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [focused, setFocused] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);

  const [account, setAccount] = useState({ name: '', email: '', phone: '', company: '', password: '' });
  const [bank, setBank] = useState({ accountHolder: '', bankName: '', accountNumber: '', routingNumber: '', accountType: 'Checking' });

  const setA = (k, v) => setAccount(p => ({ ...p, [k]: v }));
  const setB = (k, v) => setBank(p => ({ ...p, [k]: v }));

  const fieldProps = { focused, onFocus: setFocused, onBlur: () => setFocused('') };

  const validateStep0 = () => {
    const e = {};
    if (!account.name.trim()) e.name = 'Required';
    if (!/\S+@\S+\.\S+/.test(account.email)) e.email = 'Valid email required';
    if (!account.phone.trim()) e.phone = 'Required';
    if (!account.password || account.password.length < 6) e.password = 'Min 6 characters';
    return e;
  };

  const validateStep1 = () => {
    const e = {};
    if (!bank.accountHolder.trim()) e.accountHolder = 'Required';
    if (!bank.bankName.trim()) e.bankName = 'Required';
    if (!/^\d{8,17}$/.test(bank.accountNumber)) e.accountNumber = '8–17 digits required';
    if (!/^\d{9}$/.test(bank.routingNumber)) e.routingNumber = 'Must be 9 digits';
    return e;
  };

  const next = () => {
    const e = step === 0 ? validateStep0() : step === 1 ? validateStep1() : {};
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const submit = () => {
    if (!agreed) return;
    localStorage.setItem('onboardingName', account.name);
    localStorage.setItem('onboardingEmail', account.email);
    localStorage.setItem('onboardingPhone', account.phone);
    localStorage.setItem('userType', 'admin');
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', background: '#060612', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 540, padding: '24px 20px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, justifyContent: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', boxShadow: '0 0 24px rgba(99,102,241,0.45)' }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ color: 'white', fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>Vivify<span style={{ color: '#818cf8' }}>CRM</span></span>
        </div>



        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 24, padding: '40px 36px', backdropFilter: 'blur(24px)', boxShadow: '0 32px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
          <AnimatePresence mode="wait">

            {/* Step 0: Account Info */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Create your account</h2>
                <p style={{ color: '#475569', fontSize: 14, marginBottom: 28 }}>Enter your personal and login details.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field {...fieldProps} label="Full Name" icon={User} fkey="name" value={account.name} onChange={v => setA('name', v)} placeholder="John Doe" error={errors.name} />
                    <Field {...fieldProps} label="Company (optional)" icon={Building2} fkey="company" value={account.company} onChange={v => setA('company', v)} placeholder="Acme Corp" />
                  </div>
                  <Field {...fieldProps} label="Email Address" icon={Mail} fkey="email" value={account.email} onChange={v => setA('email', v)} placeholder="you@company.com" error={errors.email} />
                  <Field {...fieldProps} label="Phone Number" icon={Phone} fkey="phone" type="tel" value={account.phone} onChange={v => setA('phone', v)} placeholder="+1 555-0123" error={errors.phone} />
                  <Field {...fieldProps} label="Password" icon={Lock} fkey="password" value={account.password} onChange={v => setA('password', v)} placeholder="Min 6 characters"
                    type={showPass ? 'text' : 'password'} error={errors.password}
                    extra={
                      <button type="button" onClick={() => setShowPass(s => !s)}
                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0, display: 'flex' }}>
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  />
                </div>
              </motion.div>
            )}

            {/* Step 1: Bank Details */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Bank Details</h2>
                <p style={{ color: '#475569', fontSize: 14, marginBottom: 28 }}>Used for billing and payouts. Secured with 256-bit encryption.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Field {...fieldProps} label="Account Holder Name" icon={User} fkey="accountHolder" value={bank.accountHolder} onChange={v => setB('accountHolder', v)} placeholder="John Doe" error={errors.accountHolder} />
                  <Field {...fieldProps} label="Bank Name" icon={Landmark} fkey="bankName" value={bank.bankName} onChange={v => setB('bankName', v)} placeholder="Chase, Wells Fargo..." error={errors.bankName} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field {...fieldProps} label="Account Number" icon={CreditCard} fkey="accountNumber" type="number" value={bank.accountNumber} onChange={v => setB('accountNumber', v)} placeholder="Account number" error={errors.accountNumber} />
                    <Field {...fieldProps} label="Routing Number" icon={Hash} fkey="routingNumber" type="number" value={bank.routingNumber} onChange={v => setB('routingNumber', v)} placeholder="9-digit number" error={errors.routingNumber} />
                  </div>
                  <div>
                    <label style={labelStyle}>Account Type</label>
                    <select value={bank.accountType} onChange={e => setB('accountType', e.target.value)}
                      style={{ width: '100%', padding: '13px 14px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
                      <option>Checking</option>
                      <option>Savings</option>
                      <option>Business Checking</option>
                      <option>Business Savings</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)' }}>
                    <span style={{ fontSize: 18 }}>🔒</span>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>Your bank details are encrypted and stored securely. We never share your information with third parties.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Review & Confirm</h2>
                <p style={{ color: '#475569', fontSize: 14, marginBottom: 28 }}>Double-check your details before creating your account.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 20px' }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: '#475569', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>Account Info</p>
                    {[['Name', account.name], ['Email', account.email], ['Phone', account.phone], account.company ? ['Company', account.company] : null].filter(Boolean).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: '#475569' }}>{k}</span>
                        <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 20px' }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: '#475569', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>Bank Details</p>
                    {[
                      ['Account Holder', bank.accountHolder],
                      ['Bank', bank.bankName],
                      ['Account No.', bank.accountNumber ? `••••${bank.accountNumber.slice(-4)}` : '—'],
                      ['Routing No.', bank.routingNumber ? `•••••${bank.routingNumber.slice(-4)}` : '—'],
                      ['Type', bank.accountType],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: '#475569' }}>{k}</span>
                        <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginTop: 4 }}>
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                      style={{ accentColor: '#6366f1', width: 15, height: 15, marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                      I agree to the <span style={{ color: '#818cf8', cursor: 'pointer' }}>Terms of Service</span> and <span style={{ color: '#818cf8', cursor: 'pointer' }}>Privacy Policy</span>.
                    </span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            {step > 0 && (
              <button onClick={() => { setErrors({}); setStep(s => s - 1); }}
                style={{ flex: 1, height: 48, borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <ArrowLeft size={16} /> Back
              </button>
            )}
            {step < 2 ? (
              <button onClick={next}
                style={{ flex: 2, height: 48, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 24px rgba(99,102,241,0.4)' }}>
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={submit} disabled={!agreed}
                style={{ flex: 2, height: 48, borderRadius: 12, border: 'none', background: agreed ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.07)', color: agreed ? 'white' : '#475569', fontSize: 14, fontWeight: 700, cursor: agreed ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: agreed ? '0 6px 24px rgba(16,185,129,0.4)' : 'none', transition: 'all 0.2s' }}>
                <CheckCircle2 size={16} /> Create Account
              </button>
            )}
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#334155' }}>
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#818cf8', fontWeight: 700, cursor: 'pointer' }}>Sign in</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
