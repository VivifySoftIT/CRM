import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Megaphone, Calendar, DollarSign, 
  Target, Rocket, Users, TrendingUp, 
  Mail, MessageSquare, MousePointer2, Briefcase,
  Play, Pause, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_CAMPAIGNS, STATUS_COLORS } from '../../data/mockCampaigns';

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const campaign = useMemo(() => {
    const saved = localStorage.getItem('crm_campaigns');
    const list = saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
    return list.find(c => c.id === id);
  }, [id]);

  if (!campaign) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>Campaign not found</h2>
        <button onClick={() => navigate('/dashboard/campaigns')} className="b24-btn b24-btn-primary">Back to Campaigns</button>
      </div>
    );
  }

  const st = STATUS_COLORS[campaign.status];
  const roi = campaign.actualCost > 0 ? ((campaign.metrics.revenue / campaign.actualCost) * 100).toFixed(1) : 0;
  const conversionRate = campaign.metrics.leads > 0 ? ((campaign.metrics.conversions / campaign.metrics.leads) * 100).toFixed(1) : 0;

  const cardStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: 20,
    padding: 32,
    boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1400, margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Breadcrumb / Back */}
      <button 
        onClick={() => navigate('/dashboard/campaigns')}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: 24, fontWeight: 700, fontSize: 14 }}
      >
        <ArrowLeft size={16} /> Back to Campaigns
      </button>

      {/* Header Section */}
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ 
              background: st.bg, color: st.text, border: `1px solid ${st.border}`,
              padding: '4px 16px', borderRadius: 24, fontSize: 12, fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>
              {campaign.status}
            </span>
            <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>ID: {campaign.id}</span>
          </div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 32, fontWeight: 900, margin: 0, lineHeight: 1.2 }}>{campaign.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 14, fontWeight: 600 }}>
              <Megaphone size={16} /> {campaign.type}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 14, fontWeight: 600 }}>
              <Calendar size={16} /> {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {campaign.status === 'Planned' && (
            <button className="b24-btn b24-btn-primary" style={{ padding: '12px 24px', borderRadius: 12, background: '#10b981' }}>
              <Play size={18} /> Launch Now
            </button>
          )}
          {campaign.status === 'Active' && (
            <button className="b24-btn b24-btn-secondary" style={{ padding: '12px 24px', borderRadius: 12, color: '#f59e0b', borderColor: '#f59e0b30' }}>
              <Pause size={18} /> Pause Campaign
            </button>
          )}
          <button className="b24-btn b24-btn-secondary" style={{ padding: '12px 24px', borderRadius: 12, color: '#3b82f6', borderColor: '#3b82f630' }}>
            <CheckCircle2 size={18} /> Complete
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 40 }}>
        {[
          { label: 'Leads Generated', value: campaign.metrics.leads, sub: 'Target: 200', icon: Users, color: '#3b82f6' },
          { label: 'Conversions', value: campaign.metrics.conversions, sub: `${conversionRate}% Rate`, icon: Target, color: '#10b981' },
          { label: 'Revenue ROI', value: `${roi}%`, sub: `$${campaign.metrics.revenue.toLocaleString()}`, icon: TrendingUp, color: '#8b5cf6' },
          { label: 'Avg. Budget Util.', value: `${((campaign.actualCost / campaign.budget) * 100).toFixed(0)}%`, sub: `$${campaign.actualCost.toLocaleString()}`, icon: DollarSign, color: '#f59e0b' }
        ].map((m, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${m.color}15`, color: m.color, display: 'grid', placeItems: 'center' }}>
                <m.icon size={20} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)' }}>{m.label}</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>{m.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Detailed Content & Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32 }}>
        {/* Funnel Graph */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 32 }}>Performance Funnel</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { label: 'Total Reach', val: campaign.metrics.sent, color: '#64748b' },
              { label: 'Engaged / Opened', val: campaign.metrics.opened || campaign.metrics.clicked, color: '#3b82f6' },
              { label: 'Leads Generated', val: campaign.metrics.leads, color: '#8b5cf6' },
              { label: 'Won Conversions', val: campaign.metrics.conversions, color: '#10b981' }
            ].map((step, i, arr) => {
              const prevVal = i === 0 ? step.val : arr[0].val;
              const width = Math.max(20, (step.val / prevVal) * 100);
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 800 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{step.label}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{step.val.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 12, background: 'var(--input-bg)', borderRadius: 20, overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ duration: 1, delay: i * 0.2 }}
                      style={{ height: '100%', background: step.color, borderRadius: 20 }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div style={{ marginTop: 40, padding: 24, borderRadius: 16, background: isDark ? 'rgba(0,0,0,0.1)' : '#f8fafc', border: '1px solid var(--card-border)' }}>
            <h4 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Campaign Message</h4>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)', margin: 0, whiteSpace: 'pre-wrap' }}>
              {campaign.content}
            </p>
          </div>
        </div>

        {/* Campaign Info Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={cardStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20 }}>Budget Tracking</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Planned Budget</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-primary)' }}>${campaign.budget.toLocaleString()}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Actual Cost</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: campaign.actualCost > campaign.budget ? '#ef4444' : '#10b981' }}>${campaign.actualCost.toLocaleString()}</div>
            </div>
            
            <div style={{ height: 8, background: 'var(--input-bg)', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ width: `${Math.min((campaign.actualCost / campaign.budget) * 100, 100)}%`, height: '100%', background: campaign.actualCost > campaign.budget ? '#ef4444' : '#3b82f6' }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>
              {((campaign.actualCost / campaign.budget) * 100).toFixed(0)}% of budget utilized
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20 }}>Audience Segments</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {campaign.targetAudience.map(tag => (
                <span key={tag} style={{ padding: '6px 14px', borderRadius: 8, background: 'var(--input-bg)', border: '1px solid var(--card-border)', fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', border: 'none' }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Campaign ROI Goal</h3>
            <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5, marginBottom: 20 }}>Based on current performance, your campaign is exceeding the projected revenue goal by 12%.</p>
            <div style={{ fontSize: 32, fontWeight: 900 }}>$12,400+</div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', opacity: 0.8 }}>Above Break-even</div>
          </div>
        </div>
      </div>
    </div>
  );
}
