import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Code2, Globe, Smartphone, BarChart3, Zap,
  ArrowRight, CheckCircle2, Users, Award, TrendingUp,
  ExternalLink, ChevronLeft, ChevronRight, Shield,
  Mail, Phone, MapPin, Sparkles, LogIn, UserPlus,
  Database, ShoppingBag, Brain, MessageSquare,
  Quote, BadgeCheck, Rocket, Clock
} from 'lucide-react';

/* ── Data ──────────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    title: 'VivifyCRM Platform',
    description: 'A full-featured, multi-module CRM system for enterprise sales teams — featuring lead pipelines, deal management, analytics, and AI automation.',
    image: '/images/proj_crm.png',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Recharts'],
    category: 'SaaS Platform',
    color: '#2563eb',
    stats: { users: '2,400+', uptime: '99.9%' },
  },
  {
    id: 2,
    title: 'ShopForce Commerce',
    description: 'A blazing-fast e-commerce web app with AI product recommendations, multi-vendor marketplace, real-time inventory tracking, and Stripe checkout.',
    image: '/images/proj_ecom.png',
    tags: ['Next.js', 'Stripe', 'Redis', 'TypeScript'],
    category: 'E-Commerce',
    color: '#8b5cf6',
    stats: { users: '15K+', uptime: '99.7%' },
  },
  {
    id: 3,
    title: 'MediBook Health App',
    description: 'A cross-platform mobile app for healthcare appointment booking, telemedicine video calls, prescription reminders, and patient records management.',
    image: '/images/proj_mobile.png',
    tags: ['React Native', 'Expo', 'Firebase', 'WebRTC'],
    category: 'Mobile App',
    color: '#10b981',
    stats: { users: '8K+', uptime: '99.8%' },
  },
  {
    id: 4,
    title: 'InsightIQ Analytics',
    description: 'An enterprise business intelligence platform offering real-time dashboards, KPI tracking, custom report builders, and multi-source data integrations.',
    image: '/images/proj_analytics.png',
    tags: ['Python', 'FastAPI', 'D3.js', 'BigQuery'],
    category: 'Analytics & BI',
    color: '#f59e0b',
    stats: { users: '5K+', uptime: '99.9%' },
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'CEO, TechVenture Inc.',
    project: 'VivifyCRM Platform',
    rating: 5,
    review: 'VivifySoft IT transformed our entire sales workflow. The CRM they built handles 2,400+ users flawlessly. Our team productivity jumped 40% within the first month. Absolutely world-class engineering.',
    avatar: 'SM',
    color: '#2563eb',
  },
  {
    id: 2,
    name: 'James Okonkwo',
    role: 'Founder, RetailPro',
    project: 'ShopForce Commerce',
    rating: 5,
    review: 'The e-commerce platform they delivered is outstanding. The AI recommendations alone drove a 28% increase in average order value. Their team is responsive, creative, and deeply technical.',
    avatar: 'JO',
    color: '#8b5cf6',
  },
  {
    id: 3,
    name: 'Dr. Priya Sharma',
    role: 'Director, MediHealth Group',
    project: 'MediBook Health App',
    rating: 5,
    review: 'Our patients love the MediBook app. Appointment bookings increased by 60% and no-shows dropped by 35%. VivifySoft delivered on time, on budget, and exceeded every expectation.',
    avatar: 'PS',
    color: '#10b981',
  },
  {
    id: 4,
    name: 'Marcus Chen',
    role: 'Head of Data, GlobalFinance',
    project: 'InsightIQ Analytics',
    rating: 5,
    review: 'InsightIQ cut our reporting time from days to minutes. The custom KPI dashboards are exactly what our executives needed. The team\'s expertise in data engineering is second to none.',
    avatar: 'MC',
    color: '#f59e0b',
  },
  {
    id: 5,
    name: 'Ayesha Al-Rashid',
    role: 'VP Technology, Nexus Corp',
    project: 'VivifyCRM Platform',
    rating: 5,
    review: 'Working with VivifySoft IT was a game-changer. They understood our business needs deeply and delivered a CRM that feels like it was built specifically for us. Highly recommended.',
    avatar: 'AA',
    color: '#ec4899',
  },
  {
    id: 6,
    name: 'Tom Bradwell',
    role: 'CTO, StartupLaunch',
    project: 'ShopForce Commerce',
    rating: 5,
    review: 'From discovery to deployment in 8 weeks. The code quality is exceptional — clean architecture, well-documented, and built to scale. We\'ve grown 3x and the platform hasn\'t missed a beat.',
    avatar: 'TB',
    color: '#06b6d4',
  },
];

const SKILLS = [
  { icon: Globe,       label: 'Web Development',    desc: 'React, Next.js, Vue, TypeScript',   color: '#2563eb' },
  { icon: Smartphone,  label: 'Mobile Apps',         desc: 'React Native, Flutter, Expo',       color: '#8b5cf6' },
  { icon: Database,    label: 'Backend & APIs',      desc: 'Node.js, Python, FastAPI, Django',  color: '#10b981' },
  { icon: BarChart3,   label: 'Analytics & BI',      desc: 'D3.js, Recharts, BigQuery',         color: '#f59e0b' },
  { icon: Brain,       label: 'AI Integration',      desc: 'OpenAI, LangChain, ML Pipelines',   color: '#ec4899' },
  { icon: Shield,      label: 'CRM Solutions',       desc: 'Zoho-style SaaS, Pipelines, CRM',  color: '#06b6d4' },
];

const STATS = [
  { label: 'Projects Delivered', value: '50+',    icon: Rocket,       color: '#2563eb' },
  { label: 'Happy Clients',      value: '40+',    icon: Users,        color: '#10b981' },
  { label: 'Years Experience',   value: '8+',     icon: Clock,        color: '#8b5cf6' },
  { label: 'Client Retention',   value: '96%',    icon: TrendingUp,   color: '#f59e0b' },
];

/* ── Helpers ────────────────────────────────────────────────────────────────── */
const StarRating = ({ count = 5 }) => (
  <div style={{ display: 'flex', gap: 3 }}>
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
    ))}
  </div>
);

/* ── Component ──────────────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredProject, setHoveredProject] = useState(null);
  const intervalRef = useRef(null);

  const FILTERS = ['All', 'SaaS Platform', 'E-Commerce', 'Mobile App', 'Analytics & BI'];

  const filteredProjects = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter);

  // Auto-play testimonials
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length);
      }, 4000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying, testimonialIdx]);

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setTestimonialIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };
  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060612',
      color: '#f1f5f9',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      overflowX: 'hidden',
    }}>

      {/* ── Fixed Background Grid ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      {/* ══════════════════════════════════════════════════════
          NAV
      ══════════════════════════════════════════════════════ */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          backdropFilter: 'blur(20px)',
          background: 'rgba(6,6,18,0.85)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '0 80px',
          height: 70,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#8b5cf6)', display: 'grid', placeItems: 'center', boxShadow: '0 0 20px rgba(37,99,235,0.4)' }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontSize: 19, fontWeight: 900, letterSpacing: '-0.5px', color: 'white' }}>
            Vivify<span style={{ color: '#60a5fa' }}>Soft IT</span>
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {['About', 'Projects', 'Testimonials', 'Contact'].map(l => (
            <button key={l}
              onClick={() => scrollToSection(l.toLowerCase())}
              style={{ background: 'none', border: 'none', padding: 0, color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            >
              {l}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '9px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
          >
            <LogIn size={14} /> Login
          </button>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => scrollToSection('contact')}
            style={{ padding: '9px 22px', borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}
          >
            <Rocket size={14} /> Start a Project
          </motion.button>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section id="hero" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '140px 80px 80px', textAlign: 'center' }}>
        {/* Status pill */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ position: 'absolute', top: 30 + 70, left: '50%', transform: 'translateX(-50%)', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.25)', borderRadius: 30, padding: '6px 16px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', display: 'inline-block' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em' }}>AVAILABLE FOR NEW PROJECTS · 2026</span>
        </motion.div>

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 30, padding: '7px 18px', marginBottom: 32 }}>
            <Award size={14} color="#a78bfa" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa' }}>TOP-RATED CRM & WEB APP DEVELOPMENT STUDIO</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
            style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-3px', marginBottom: 28, fontFamily: "'Outfit', sans-serif" }}>
            We Build Software That&nbsp;
            <span style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Drives Growth
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ fontSize: 19, color: '#64748b', maxWidth: 680, margin: '0 auto 48px', lineHeight: 1.7 }}>
            From enterprise CRM platforms to mobile apps — we craft high-performance software products that convert visitors, retain customers, and scale with your business.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(37,99,235,0.45)' }} whileTap={{ scale: 0.97 }}
              onClick={() => scrollToSection('projects')}
              id="btn-view-projects"
              style={{ padding: '16px 36px', borderRadius: 14, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', color: 'white', fontSize: 15, fontWeight: 800, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 6px 24px rgba(37,99,235,0.35)', transition: 'all 0.25s' }}>
              <Code2 size={18} /> View Projects
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => scrollToSection('contact')}
              id="btn-start-project"
              style={{ padding: '16px 36px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: 15, fontWeight: 800, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.25s' }}>
              <Rocket size={18} /> Start a Project <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          style={{ position: 'absolute', bottom: 56, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, backdropFilter: 'blur(20px)', padding: '20px 40px', whiteSpace: 'nowrap' }}>
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <React.Fragment key={i}>
                <div style={{ textAlign: 'center', padding: '0 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
                    <Icon size={16} color={stat.color} />
                    <span style={{ fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>{stat.value}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
                </div>
                {i < STATS.length - 1 && <div style={{ width: 1, background: 'rgba(255,255,255,0.07)' }} />}
              </React.Fragment>
            );
          })}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ABOUT / SKILLS
      ══════════════════════════════════════════════════════ */}
      <section id="about" style={{ position: 'relative', zIndex: 1, padding: '100px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

            {/* Left: Text */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 30, padding: '6px 16px', marginBottom: 24 }}>
                <Sparkles size={12} color="#34d399" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399', letterSpacing: '0.08em' }}>ABOUT VIVIFYSOFT IT</span>
              </div>
              <h2 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 24, fontFamily: "'Outfit', sans-serif" }}>
                Your Partner in <span style={{ color: '#60a5fa' }}>Digital Transformation</span>
              </h2>
              <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.8, marginBottom: 28 }}>
                VivifySoft IT is a boutique software development studio specializing in CRM systems, web apps, and mobile solutions. We work with startups and enterprises to deliver production-ready software that's fast, scalable, and beautifully designed.
              </p>
              <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.8, marginBottom: 36 }}>
                Our team of engineers, designers, and product strategists has shipped 50+ projects across 15+ industries. We don't just write code — we build digital products that solve real business problems.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['CRM & SaaS Platforms', 'Enterprise Web Apps', 'Mobile Development', 'API Architecture'].map(tag => (
                  <span key={tag} style={{ padding: '8px 16px', borderRadius: 30, border: '1px solid rgba(37,99,235,0.3)', color: '#60a5fa', fontSize: 12, fontWeight: 700, background: 'rgba(37,99,235,0.08)' }}>{tag}</span>
                ))}
              </div>
            </motion.div>

            {/* Right: Skills grid */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {SKILLS.map((skill, i) => {
                const Icon = skill.icon;
                return (
                  <motion.div key={i}
                    whileHover={{ y: -6, boxShadow: `0 12px 32px ${skill.color}20` }}
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${skill.color}22`, borderRadius: 16, padding: '22px 20px', cursor: 'default', transition: 'all 0.25s' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: `${skill.color}18`, display: 'grid', placeItems: 'center', marginBottom: 14 }}>
                      <Icon size={20} color={skill.color} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'white', marginBottom: 6 }}>{skill.label}</div>
                    <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{skill.desc}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROJECTS
      ══════════════════════════════════════════════════════ */}
      <section id="projects" style={{ position: 'relative', zIndex: 1, padding: '100px 80px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 30, padding: '6px 16px', marginBottom: 20 }}>
                <Code2 size={12} color="#a78bfa" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.08em' }}>OUR WORK</span>
              </div>
              <h2 style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>
                Previous <span style={{ color: '#a78bfa' }}>Projects</span>
              </h2>
              <p style={{ fontSize: 17, color: '#475569', maxWidth: 560, margin: '0 auto' }}>
                A curated selection of our most impactful software builds — from CRM platforms to mobile apps.
              </p>
            </motion.div>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 48, flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                style={{
                  padding: '9px 20px', borderRadius: 30, border: '1px solid',
                  borderColor: activeFilter === f ? '#2563eb' : 'rgba(255,255,255,0.1)',
                  background: activeFilter === f ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.03)',
                  color: activeFilter === f ? '#60a5fa' : '#64748b',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                }}>
                {f}
              </button>
            ))}
          </div>

          {/* Projects grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28 }}>
            <AnimatePresence>
              {filteredProjects.map((proj) => (
                <motion.div
                  key={proj.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -8 }}
                  onHoverStart={() => setHoveredProject(proj.id)}
                  onHoverEnd={() => setHoveredProject(null)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${hoveredProject === proj.id ? proj.color + '40' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 20,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'border-color 0.3s',
                    boxShadow: hoveredProject === proj.id ? `0 20px 60px ${proj.color}15` : 'none',
                  }}>

                  {/* Image */}
                  <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                    <img src={proj.image} alt={proj.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: hoveredProject === proj.id ? 'scale(1.06)' : 'scale(1)' }}
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                    {/* Fallback */}
                    <div style={{ display: 'none', height: '100%', background: `linear-gradient(135deg, ${proj.color}20, rgba(0,0,0,0.3))`, alignItems: 'center', justifyContent: 'center' }}>
                      <Code2 size={48} color={proj.color} />
                    </div>
                    {/* Category badge */}
                    <div style={{ position: 'absolute', top: 16, left: 16, padding: '5px 12px', borderRadius: 20, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', border: `1px solid ${proj.color}40` }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: proj.color }}>{proj.category}</span>
                    </div>
                    {/* Hover overlay */}
                    {hoveredProject === proj.id && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button style={{ padding: '10px 20px', borderRadius: 10, background: proj.color, color: 'white', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ExternalLink size={14} /> View Details
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '24px 28px 28px' }}>
                    <h3 style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 10, letterSpacing: '-0.5px' }}>{proj.title}</h3>
                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 20 }}>{proj.description}</p>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                      {proj.tags.map(tag => (
                        <span key={tag} style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: proj.color }}>{proj.stats.users}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Active Users</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#10b981' }}>{proj.stats.uptime}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Uptime</div>
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'flex-end' }}>
                        <button
                          onClick={() => navigate('/login')}
                          style={{ padding: '8px 18px', borderRadius: 10, background: `${proj.color}18`, border: `1px solid ${proj.color}40`, color: proj.color, fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                          View Details <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section id="testimonials" style={{ position: 'relative', zIndex: 1, padding: '100px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 30, padding: '6px 16px', marginBottom: 20 }}>
                <Star size={12} color="#fbbf24" fill="#fbbf24" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', letterSpacing: '0.08em' }}>CLIENT TESTIMONIALS</span>
              </div>
              <h2 style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>
                What Our <span style={{ color: '#fbbf24' }}>Clients Say</span>
              </h2>
              <p style={{ fontSize: 17, color: '#475569', maxWidth: 560, margin: '0 auto' }}>
                Real feedback from real clients who trusted us to build their software products.
              </p>
            </motion.div>
          </div>

          {/* Testimonial Carousel */}
          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>

            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${TESTIMONIALS[testimonialIdx].color}30`,
                  borderRadius: 24,
                  padding: '48px 56px',
                  textAlign: 'center',
                  boxShadow: `0 0 60px ${TESTIMONIALS[testimonialIdx].color}10`,
                }}>

                {/* Quote icon */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${TESTIMONIALS[testimonialIdx].color}18`, display: 'grid', placeItems: 'center' }}>
                    <Quote size={22} color={TESTIMONIALS[testimonialIdx].color} />
                  </div>
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                  <StarRating count={TESTIMONIALS[testimonialIdx].rating} />
                </div>

                {/* Review text */}
                <p style={{ fontSize: 18, color: '#cbd5e1', lineHeight: 1.8, marginBottom: 36, fontStyle: 'italic', maxWidth: 620, margin: '0 auto 36px' }}>
                  "{TESTIMONIALS[testimonialIdx].review}"
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${TESTIMONIALS[testimonialIdx].color}, ${TESTIMONIALS[testimonialIdx].color}88)`, display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 14, color: 'white', boxShadow: `0 0 20px ${TESTIMONIALS[testimonialIdx].color}40` }}>
                    {TESTIMONIALS[testimonialIdx].avatar}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: 'white' }}>{TESTIMONIALS[testimonialIdx].name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{TESTIMONIALS[testimonialIdx].role}</div>
                  </div>
                  {/* Verified badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', marginLeft: 8 }}>
                    <BadgeCheck size={13} color="#34d399" />
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#34d399' }}>Verified Client</span>
                  </div>
                </div>

                {/* Project name */}
                <div style={{ marginTop: 20, fontSize: 12, color: '#475569' }}>
                  Project: <span style={{ color: TESTIMONIALS[testimonialIdx].color, fontWeight: 700 }}>{TESTIMONIALS[testimonialIdx].project}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <button onClick={prevTestimonial}
              style={{ position: 'absolute', left: -64, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', cursor: 'pointer', display: 'grid', placeItems: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextTestimonial}
              style={{ position: 'absolute', right: -64, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', cursor: 'pointer', display: 'grid', placeItems: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
              <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 32 }}>
              {TESTIMONIALS.map((t, i) => (
                <button key={i} onClick={() => { setIsAutoPlaying(false); setTestimonialIdx(i); }}
                  style={{ width: i === testimonialIdx ? 28 : 8, height: 8, borderRadius: 10, border: 'none', background: i === testimonialIdx ? TESTIMONIALS[testimonialIdx].color : 'rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
            </div>
          </div>

          {/* Secondary testimonials grid */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 60 }}>
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <div key={t.id}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${t.color}40`; e.currentTarget.style.background = `rgba(255,255,255,0.04)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <StarRating count={t.rating} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <BadgeCheck size={11} color="#34d399" />
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#34d399' }}>Verified</span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 16 }}>"{t.review.slice(0, 120)}..."</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 12, color: 'white', flexShrink: 0 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CALL TO ACTION
      ══════════════════════════════════════════════════════ */}
      <section id="contact" style={{ position: 'relative', zIndex: 1, padding: '100px 80px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>

          {/* CTA Card */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(139,92,246,0.12) 50%, rgba(236,72,153,0.08) 100%)',
              border: '1px solid rgba(37,99,235,0.25)',
              borderRadius: 28,
              padding: '72px 80px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>

            {/* BG glow */}
            <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)' }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 30, padding: '7px 18px', marginBottom: 28 }}>
                <Zap size={13} color="#a78bfa" fill="#a78bfa" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.08em' }}>READY TO GET STARTED?</span>
              </div>

              <h2 style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-2.5px', marginBottom: 18, fontFamily: "'Outfit', sans-serif" }}>
                Interested in Working With Us?
              </h2>
              <p style={{ fontSize: 17, color: '#64748b', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.7 }}>
                Log in to your client portal to submit a new project request, track progress, and collaborate with our team — or sign up to get started as a new customer.
              </p>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
                <motion.button
                  id="btn-login-to-continue"
                  whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(37,99,235,0.45)' }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/login')}
                  style={{ padding: '18px 40px', borderRadius: 14, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', color: 'white', fontSize: 16, fontWeight: 800, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 6px 24px rgba(37,99,235,0.35)' }}>
                  <LogIn size={18} /> Login to Continue <ArrowRight size={16} />
                </motion.button>
                <motion.button
                  id="btn-become-customer"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/login')}
                  style={{ padding: '18px 40px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 16, fontWeight: 800, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.25s' }}>
                  <UserPlus size={18} /> Become a Customer
                </motion.button>
              </div>

              {/* Trust indicators */}
              <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { icon: Shield, text: 'Enterprise-grade security' },
                  { icon: CheckCircle2, text: 'No credit card required' },
                  { icon: Zap, text: 'Setup in under 24 hours' },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={15} color="#64748b" />
                    <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact info row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 40 }}>
            {[
              { icon: Mail, label: 'Email Us', value: 'hello@vivifysoft.it', color: '#2563eb' },
              { icon: Phone, label: 'Call Us', value: '+91 98765 43210', color: '#10b981' },
              { icon: MapPin, label: 'Location', value: 'Bengaluru, India (Remote Globally)', color: '#8b5cf6' },
            ].map(({ icon: Icon, label, value, color }, i) => (
              <motion.div key={i}
                whileHover={{ y: -4 }}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', display: 'flex', gap: 16, alignItems: 'center', cursor: 'default', transition: 'all 0.25s' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#2563eb,#8b5cf6)', display: 'grid', placeItems: 'center' }}>
            <Sparkles size={15} color="white" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'white', letterSpacing: '-0.3px' }}>
            Vivify<span style={{ color: '#60a5fa' }}>Soft IT</span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#334155' }}>© 2026 VivifySoft IT · All rights reserved</p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Cookie Policy'].map(l => (
            <span key={l} style={{ fontSize: 13, color: '#475569', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
              {l}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
