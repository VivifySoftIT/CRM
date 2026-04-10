import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, BookOpen, CreditCard, Ticket, FileText, MessageSquare,
  User, ChevronDown, ChevronRight, ExternalLink, ThumbsUp, ThumbsDown,
  Zap, Shield, Bell, HelpCircle, Phone, Mail, Clock, CheckCircle2, Star, X
} from 'lucide-react';

/* ── Data ──────────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'getting-started', icon: Zap,          label: 'Getting Started',   color: '#6366f1', bg: '#eef2ff', count: 12 },
  { id: 'billing',         icon: CreditCard,    label: 'Billing & Payments',color: '#10b981', bg: '#f0fdf4', count: 8  },
  { id: 'tickets',         icon: Ticket,        label: 'Support Tickets',   color: '#f59e0b', bg: '#fffbeb', count: 10 },
  { id: 'documents',       icon: FileText,      label: 'Documents',         color: '#3b82f6', bg: '#eff6ff', count: 6  },
  { id: 'account',         icon: User,          label: 'Account & Profile', color: '#8b5cf6', bg: '#f5f3ff', count: 9  },
  { id: 'security',        icon: Shield,        label: 'Security & Privacy',color: '#ef4444', bg: '#fef2f2', count: 5  },
  { id: 'notifications',   icon: Bell,          label: 'Notifications',     color: '#06b6d4', bg: '#ecfeff', count: 4  },
  { id: 'messages',        icon: MessageSquare, label: 'Messaging',         color: '#ec4899', bg: '#fdf2f8', count: 7  },
];

const ARTICLES = [
  { id: 1, cat: 'getting-started', title: 'How to navigate your client dashboard',            views: 1240, helpful: 94, time: '3 min read' },
  { id: 2, cat: 'billing',         title: 'How to download and share your invoices',          views: 980,  helpful: 91, time: '2 min read' },
  { id: 3, cat: 'tickets',         title: 'How to raise a new support ticket',                views: 876,  helpful: 97, time: '2 min read' },
  { id: 4, cat: 'billing',         title: 'Understanding your subscription plan & renewal',   views: 760,  helpful: 89, time: '4 min read' },
  { id: 5, cat: 'account',         title: 'How to update your profile and contact details',   views: 640,  helpful: 96, time: '2 min read' },
  { id: 6, cat: 'security',        title: 'Setting up two-factor authentication (2FA)',       views: 610,  helpful: 98, time: '5 min read' },
  { id: 7, cat: 'getting-started', title: 'Uploading and managing documents',                 views: 590,  helpful: 92, time: '3 min read' },
  { id: 8, cat: 'messages',        title: 'How to communicate with your account manager',     views: 540,  helpful: 90, time: '2 min read' },
  { id: 9, cat: 'getting-started', title: 'Checking ticket status and history',               views: 490,  helpful: 95, time: '2 min read' },
  { id:10, cat: 'billing',         title: 'How to update your payment method',                views: 460,  helpful: 93, time: '3 min read' },
  { id:11, cat: 'notifications',   title: 'Customising your email notification preferences',  views: 380,  helpful: 88, time: '2 min read' },
  { id:12, cat: 'security',        title: 'How to reset your password securely',              views: 350,  helpful: 99, time: '2 min read' },
];

const FAQS = [
  { q: 'How long does it take for a support ticket to be resolved?', a: 'Our average response time is under 4 hours during business hours (Mon–Fri, 9 AM–6 PM IST). Critical tickets are prioritised and typically resolved within 1 business day. You\'ll receive email updates at every stage.' },
  { q: 'Can I change my subscription plan at any time?',             a: 'Yes! You can upgrade or downgrade your plan at any time from the Billing & Payments section. Upgrades take effect immediately, and you\'ll be billed on a pro-rated basis. Downgrades take effect at the start of your next billing cycle.' },
  { q: 'How do I share documents with your team?',                   a: 'Go to the Documents section in your portal. You can upload files up to 50 MB each (PDF, DOCX, XLSX, PNG, JPG). Once uploaded, your account manager will be notified automatically and can access the files directly.' },
  { q: 'What payment methods do you accept?',                        a: 'We accept all major credit and debit cards (Visa, Mastercard, RuPay), UPI, and bank transfers for annual plans. All payments are processed securely through our payment gateway with 256-bit SSL encryption.' },
  { q: 'How do I add a team member to my account?',                  a: 'Team member management depends on your plan. Pro plans allow up to 5 users, and Enterprise plans support unlimited users. Contact your account manager via the Messages section to request additional user seats.' },
  { q: 'Is my data backed up and secure?',                           a: 'Yes. Your data is encrypted at rest (AES-256) and in transit (TLS 1.3). We perform automated backups every 6 hours with a 30-day retention policy. Our infrastructure is hosted on ISO 27001 certified data centres.' },
];

/* ── Article Reader Modal ──────────────────────────────────────────────────── */
function ArticleModal({ article, onClose }) {
  const [voted, setVoted] = useState(null);
  const cat = CATEGORIES.find(c => c.id === article.cat);
  const CatIcon = cat?.icon || BookOpen;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--card-bg)', borderRadius: 18, width: '100%', maxWidth: 640, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', border: '1px solid var(--card-border)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-darker)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: `${cat?.color}18`, display: 'grid', placeItems: 'center' }}>
              <CatIcon size={15} color={cat?.color} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: cat?.color }}>{cat?.label}</span>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--card-border)', background: 'var(--input-bg)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}><X size={13}/></button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 12px', lineHeight: 1.3 }}>{article.title}</h2>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={12}/> {article.time}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}><CheckCircle2 size={12} color='#10b981'/> {article.helpful}% found this helpful</span>
          </div>

          {/* Placeholder article body */}
          {[
            'This guide will walk you through everything you need to know about this topic step by step.',
            '**Step 1:** Log in to your client portal and navigate to the relevant section using the left sidebar.',
            '**Step 2:** Look for the action button in the top-right corner of the page. Click it to open the relevant form or modal.',
            '**Step 3:** Fill in the required information and confirm. You\'ll receive a confirmation notification once the action is complete.',
            '**Tip:** You can always reach out to your dedicated account manager via the Messages section if you need personalised assistance.',
            'If you encounter any issues, please raise a support ticket and our team will get back to you within 4 business hours.',
          ].map((para, i) => (
            <p key={i} style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 14 }}>
              {para.startsWith('**') ? (
                <><strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{para.split('**')[1]}</strong>{para.split('**').slice(2).join('')}</>
              ) : para.startsWith('**Tip') ? (
                <span style={{ display: 'block', padding: '10px 14px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', borderLeft: '3px solid #6366f1', color: 'var(--text-secondary)' }}>{para.replace('**Tip:** ', '💡 ')}</span>
              ) : para}
            </p>
          ))}
        </div>

        {/* Helpful footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--card-border)', background: 'var(--bg-darker)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>Was this article helpful?</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setVoted('yes')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${voted === 'yes' ? '#10b981' : 'var(--card-border)'}`, background: voted === 'yes' ? 'rgba(16,185,129,0.1)' : 'var(--input-bg)', color: voted === 'yes' ? '#10b981' : 'var(--text-secondary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
              <ThumbsUp size={13}/> Yes
            </button>
            <button onClick={() => setVoted('no')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${voted === 'no' ? '#ef4444' : 'var(--card-border)'}`, background: voted === 'no' ? 'rgba(239,68,68,0.08)' : 'var(--input-bg)', color: voted === 'no' ? '#ef4444' : 'var(--text-secondary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
              <ThumbsDown size={13}/> No
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Component ────────────────────────────────────────────────────────── */
export default function ClientHelpCenter() {
  const [search, setSearch]       = useState('');
  const [activeCat, setActiveCat] = useState(null);
  const [openFAQ, setOpenFAQ]     = useState(null);
  const [openArticle, setOpenArticle] = useState(null);

  const filteredArticles = useMemo(() => ARTICLES.filter(a => {
    const matchCat  = !activeCat || a.cat === activeCat;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [activeCat, search]);

  const popularArticles = useMemo(() => [...ARTICLES].sort((a, b) => b.views - a.views).slice(0, 5), []);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '100%' }}>

      {/* ── Hero Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)', borderRadius: 18, padding: '40px 36px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -30, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }}/>
        <div style={{ position: 'absolute', bottom: -80, right: 100, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'grid', placeItems: 'center', backdropFilter: 'blur(8px)' }}>
              <HelpCircle size={20} color='#fff'/>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Help Center</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px' }}>How can we help you?</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: '0 0 24px' }}>Search our knowledge base or browse categories below</p>

          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '12px 18px', maxWidth: 540 }}>
            <Search size={18} color='rgba(255,255,255,0.6)'/>
            <input value={search} onChange={e => { setSearch(e.target.value); setActiveCat(null); }}
              placeholder="Search articles, FAQs, guides..."
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: 14, width: '100%', fontFamily: "'Plus Jakarta Sans',sans-serif" }}/>
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'grid', placeItems: 'center' }}><X size={14}/></button>}
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { icon: BookOpen,   label: 'Articles',   val: '61',     color: '#6366f1' },
          { icon: Clock,      label: 'Avg Response',val: '< 4hrs', color: '#10b981' },
          { icon: Star,       label: 'Satisfaction', val: '98%',   color: '#f59e0b' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--card-shadow)' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}15`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon size={17} color={s.color}/>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Category Grid ── */}
      {!search && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 14px' }}>Browse by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCat === cat.id;
              return (
                <motion.button key={cat.id} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCat(isActive ? null : cat.id)}
                  style={{ background: isActive ? cat.color : 'var(--card-bg)', border: `1.5px solid ${isActive ? cat.color : 'var(--card-border)'}`, borderRadius: 12, padding: '16px 14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: isActive ? `0 6px 20px ${cat.color}40` : 'var(--card-shadow)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: isActive ? 'rgba(255,255,255,0.2)' : cat.bg, display: 'grid', placeItems: 'center', marginBottom: 10 }}>
                    <Icon size={17} color={isActive ? '#fff' : cat.color}/>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: isActive ? '#fff' : 'var(--text-primary)', marginBottom: 3 }}>{cat.label}</div>
                  <div style={{ fontSize: 11, color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', fontWeight: 600 }}>{cat.count} articles</div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* ── Articles List ── */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {search ? `Results for "${search}"` : activeCat ? CATEGORIES.find(c => c.id === activeCat)?.label : 'All Articles'}
              <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>({filteredArticles.length})</span>
            </h2>
            {activeCat && (
              <button onClick={() => setActiveCat(null)} style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <X size={12}/> Clear filter
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredArticles.length === 0 ? (
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '48px 32px', textAlign: 'center' }}>
                <HelpCircle size={36} color='var(--text-muted)' style={{ marginBottom: 12 }}/>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>No articles found. Try a different search term.</p>
              </div>
            ) : filteredArticles.map((article, i) => {
              const cat = CATEGORIES.find(c => c.id === article.cat);
              const CatIcon = cat?.icon || BookOpen;
              return (
                <motion.div key={article.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => setOpenArticle(article)}
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, boxShadow: 'var(--card-shadow)', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${cat?.color}12`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <CatIcon size={16} color={cat?.color}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{article.time}</span>
                      <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}><ThumbsUp size={10}/> {article.helpful}%</span>
                      <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 20, background: `${cat?.color}12`, color: cat?.color, fontWeight: 700 }}>{cat?.label}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} color='var(--text-muted)'/>
                </motion.div>
              );
            })}
          </div>

          {/* ── FAQ Section ── */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 14px' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ background: 'var(--card-bg)', border: `1px solid ${openFAQ === i ? '#6366f1' : 'var(--card-border)'}`, borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--card-shadow)', transition: 'border-color 0.2s' }}>
                  <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                    style={{ width: '100%', padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{faq.q}</span>
                    <motion.div animate={{ rotate: openFAQ === i ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0, color: openFAQ === i ? '#6366f1' : 'var(--text-muted)' }}>
                      <ChevronDown size={16}/>
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFAQ === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--card-border)' }}>
                          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, margin: '14px 0 0' }}>{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Popular Articles */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--card-border)', background: 'var(--bg-darker)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>🔥 Most Popular</h3>
            </div>
            <div style={{ padding: '8px 0' }}>
              {popularArticles.map((a, i) => (
                <button key={a.id} onClick={() => setOpenArticle(a)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--input-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7c2f' : 'var(--input-bg)', color: i < 3 ? '#fff' : 'var(--text-muted)', fontSize: 11, fontWeight: 900, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', flex: 1, lineHeight: 1.4 }}>{a.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', borderRadius: 14, padding: '20px 18px', boxShadow: '0 8px 24px rgba(37,99,235,0.3)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Still need help?</h3>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '0 0 16px', lineHeight: 1.6 }}>Our support team is available Mon–Fri, 9 AM – 6 PM IST</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="mailto:support@vivifycrm.com"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Mail size={14}/> Email Support
              </a>
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 9, background: '#fff', color: '#1e40af', fontSize: 12, fontWeight: 800, border: 'none', cursor: 'pointer', width: '100%' }}>
                <Ticket size={14}/> Raise a Ticket
              </button>
            </div>
          </div>

          {/* Response time */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '16px 18px', boxShadow: 'var(--card-shadow)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>⏱ Response Times</h3>
            {[
              { label: 'Critical issue', time: '< 1 hour',     color: '#ef4444' },
              { label: 'General support', time: '< 4 hours',   color: '#f59e0b' },
              { label: 'Billing query',   time: '< 8 hours',   color: '#3b82f6' },
              { label: 'Feature request', time: '1–3 days',    color: '#8b5cf6' },
            ].map((rt, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < 3 ? '1px solid var(--card-border)' : 'none' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{rt.label}</span>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: `${rt.color}12`, color: rt.color }}>{rt.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {openArticle && <ArticleModal article={openArticle} onClose={() => setOpenArticle(null)}/>}
      </AnimatePresence>
    </div>
  );
}
