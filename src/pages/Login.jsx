import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff, User, Phone, AlertCircle } from 'lucide-react';
import { authApi } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // 1. Try Real API Authentication
      const response = await authApi.login({ email, password });
      
      if (response && response.success) {
        localStorage.setItem('token', response.token);
        
        // Handle Role-based Navigation from API response
        const role = response.user.role;
        if (role === 'SuperAdmin') {
          localStorage.setItem('userType', 'super_admin');
          navigate('/super-admin/dashboard');
        } else if (role === 'Admin') {
          localStorage.setItem('userType', 'tenant_admin');
          navigate('/dashboard');
        } else if (role === 'Staff') {
          localStorage.setItem('userType', 'staff');
          navigate('/staff/dashboard');
        } else if (role === 'Client') {
          localStorage.setItem('userType', 'client');
          navigate('/client/dashboard');
        }
        return;
      }
    } catch (err) {
      if (err.isBackendError) {
        setError(err.message);
        setIsLoading(false);
        return;
      }

      console.warn('Backend API connection failed, checking demo credentials...', err.message);
      
      // 2. Fallback to Demo/Mock Logic if API is not yet published or unreachable
      setTimeout(() => {
        if (email === 'Superadmin@gmail.com' && password === 'Admin@123') {
          localStorage.setItem('userType', 'super_admin');
          localStorage.setItem('token', 'mock_jwt_token');
          navigate('/super-admin/dashboard');
        } else if (email === 'admin@vivifycrm.com') {
          localStorage.setItem('userType', 'super_admin');
          navigate('/super-admin/dashboard');
        } else if (email === 'staff@vivifycrm.com') {
          localStorage.setItem('userType', 'staff');
          navigate('/staff/dashboard');
        } else if (email === 'client@vivifycrm.com') {
          localStorage.setItem('userType', 'client');
          navigate('/client/dashboard');
        } else {
          setError('Invalid credentials. Please check your email and password.');
        }
        setIsLoading(false);
      }, 800);
      return;
    }
    
    setIsLoading(false);
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
        <div style={{ position: 'absolute', top: '30%', right: '-5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      {/* ── Left Panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 64px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'grid', placeItems: 'center', boxShadow: '0 0 24px rgba(99,102,241,0.45)' }}>
            <Sparkles size={20} color="white" />
          </div>
          <span style={{ color: 'white', fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Vivify<span style={{ color: '#818cf8' }}>CRM</span>
          </span>
        </motion.div>

        {/* Status pill */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.22)', borderRadius: 30, padding: '6px 14px', marginBottom: 28, width: 'fit-content' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }} />
          <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>PLATFORM v2.0 — ALL SYSTEMS OPERATIONAL</span>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.h1 key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
            style={{ color: 'white', fontSize: 52, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-2.5px', marginBottom: 20 }}>
              <>The Future of<br />Enterprise is<br />
              <span style={{ background: 'linear-gradient(135deg,#818cf8 0%,#c084fc 50%,#f472b6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Unified.</span></>
          </motion.h1>
        </AnimatePresence>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ color: '#475569', fontSize: 15, lineHeight: 1.75, maxWidth: 400, marginBottom: 48 }}>
          A modular, multi-tenant ecosystem built for scale. Manage your entire global infrastructure from a single AI-integrated control plane.
        </motion.p>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { dot: '#6366f1', text: 'Multi-region tenant management' },
            { dot: '#8b5cf6', text: 'Real-time analytics & automation' },
            { dot: '#a855f7', text: 'Enterprise-grade security layer' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.dot, boxShadow: `0 0 8px ${item.dot}`, flexShrink: 0 }} />
              <span style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{ width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 40px', position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          style={{ width: '100%' }}>

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.035)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 24,
            padding: '40px 36px',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)'
          }}>

            {/* Card header */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ color: 'white', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
                Welcome back.
              </h2>
              <p style={{ color: '#475569', fontSize: 14 }}>
                Sign in to your control panel.
              </p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 14px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                <p style={{ color: '#fca5a5', fontSize: 13, fontWeight: 500, margin: 0 }}>{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: focused === 'email' ? '#818cf8' : '#334155', transition: 'color 0.2s', pointerEvents: 'none' }} />
                  <input type="email" required value={email} placeholder="name@company.com"
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                    style={{
                      width: '100%', padding: '13px 14px 13px 42px', borderRadius: 12,
                      border: `1.5px solid ${focused === 'email' ? 'rgba(129,140,248,0.6)' : 'rgba(255,255,255,0.08)'}`,
                      background: focused === 'email' ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
                      color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                      boxShadow: focused === 'email' ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
                      transition: 'all 0.2s'
                    }} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: focused === 'password' ? '#818cf8' : '#334155', transition: 'color 0.2s', pointerEvents: 'none' }} />
                  <input type={showPass ? 'text' : 'password'} required value={password} placeholder="••••••••••"
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                    style={{
                      width: '100%', padding: '13px 42px 13px 42px', borderRadius: 12,
                      border: `1.5px solid ${focused === 'password' ? 'rgba(129,140,248,0.6)' : 'rgba(255,255,255,0.08)'}`,
                      background: focused === 'password' ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
                      color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                      boxShadow: focused === 'password' ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
                      transition: 'all 0.2s'
                    }} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0, display: 'flex' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: '#6366f1', width: 14, height: 14 }} />
                  Keep me signed in
                </label>
                <span style={{ fontSize: 13, color: '#818cf8', fontWeight: 600, cursor: 'pointer' }}>Forgot password?</span>
              </div>

              {/* Submit */}
              <motion.button type="submit" disabled={isLoading}
                whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
                style={{
                  height: 50, borderRadius: 12, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                  background: isLoading ? 'rgba(99,102,241,0.45)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  color: 'white', fontSize: 15, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: isLoading ? 'none' : '0 6px 24px rgba(99,102,241,0.4)',
                  transition: 'all 0.2s', marginTop: 4
                }}>
                {isLoading ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
                      style={{ width: 17, height: 17, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block' }} />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign in to Portal 
                    <ArrowRight size={17} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Quick Access Portal Buttons */}
            <div style={{ marginTop: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 12, letterSpacing: '0.07em', textTransform: 'uppercase', textAlign: 'center' }}>
                Quick Access (Demo)
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Super Admin', email: 'Superadmin@gmail.com', pass: 'Admin@123', color: '#6366f1' },
                  { label: 'Admin', email: 'tenant@vivifycrm.com', pass: 'password123', color: '#8b5cf6' },
                  { label: 'Staff', email: 'staff@vivifycrm.com', pass: 'staff123', color: '#a855f7' },
                  { label: 'Client', email: 'client@vivifycrm.com', pass: 'client123', color: '#ec4899' }
                ].map((role) => (
                  <button
                    key={role.label}
                    onClick={() => {
                      setEmail(role.email);
                      setPassword(role.pass);
                    }}
                    style={{
                      padding: '8px 4px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid rgba(255,255,255,0.06)`,
                      color: '#94a3b8',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = role.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.color = '#94a3b8';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: role.color }} />
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sign Up CTA */}
            <div style={{ marginTop: 24, padding: '16px', borderRadius: 16, background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8, fontWeight: 500 }}>New to VivifyCRM?</p>
              <p style={{ color: 'white', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Start your <span style={{ color: '#818cf8' }}>30-day free trial</span> today.</p>
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/register')}
                style={{
                  width: '100%', padding: '10px', borderRadius: 10, background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.3)',
                  color: '#818cf8', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                }}>
                Unlock Free Trial
              </motion.button>
            </div>

            {/* Footer */}
            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#475569' }}>
              © 2026 VivifySoft IT · <span style={{ color: '#64748b', cursor: 'pointer' }}>Privacy</span> · <span style={{ color: '#64748b', cursor: 'pointer' }}>Terms</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
