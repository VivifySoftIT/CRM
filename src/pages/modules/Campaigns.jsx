import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, Plus, Search, Filter, 
  BarChart3, Users, Target, Rocket,
  TrendingUp, MousePointer2, Mail, MessageSquare
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_CAMPAIGNS } from '../../data/mockCampaigns';
import CampaignTable from '../../components/campaigns/CampaignTable';
import CreateCampaignForm from '../../components/campaigns/CreateCampaignForm';

export default function Campaigns() {
  const { isDark } = useTheme();
  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('crm_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState(null);

  useEffect(() => {
    localStorage.setItem('crm_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const stats = useMemo(() => {
    const active = campaigns.filter(c => c.status === 'Active');
    const totalRevenue = campaigns.reduce((acc, c) => acc + (c.metrics?.revenue || 0), 0);
    const totalLeads = campaigns.reduce((acc, c) => acc + (c.metrics?.leads || 0), 0);
    
    return {
      active: active.length,
      revenue: totalRevenue,
      leads: totalLeads,
      avgROI: totalRevenue > 0 ? (totalRevenue / campaigns.reduce((acc, c) => acc + (c.actualCost || 0), 1) * 100).toFixed(1) : 0
    };
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           c.owner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
      const matchesType = filterType === 'All' || c.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [campaigns, searchTerm, filterStatus, filterType]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSave = (formData) => {
    if (campaignToEdit) {
      setCampaigns(prev => prev.map(c => c.id === campaignToEdit.id ? { ...c, ...formData } : c));
    } else {
      const newCampaign = {
        ...formData,
        id: `camp-${Date.now()}`,
        actualCost: 0,
        metrics: { sent: 0, opened: 0, clicked: 0, leads: 0, conversions: 0, revenue: 0 },
        createdAt: new Date().toISOString()
      };
      setCampaigns(prev => [newCampaign, ...prev]);
    }
    setIsModalOpen(false);
    setCampaignToEdit(null);
  };

  const cardStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: 16,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1600, margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Campaigns</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 600 }}>Manage and track your marketing performance</p>
        </div>
        <button 
          onClick={() => { setCampaignToEdit(null); setIsModalOpen(true); }}
          className="b24-btn b24-btn-primary"
          style={{ padding: '12px 24px', borderRadius: 12, background: '#3b82f6', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)' }}
        >
          <Plus size={18} /> Create Campaign
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 40 }}>
        {[
          { label: 'Active Campaigns', value: stats.active, icon: Rocket, color: '#10b981' },
          { label: 'Total Leads', value: stats.leads.toLocaleString(), icon: Users, color: '#3b82f6' },
          { label: 'Revenue Generated', value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: '#8b5cf6' },
          { label: 'Overall ROI', value: `${stats.avgROI}%`, icon: BarChart3, color: '#f59e0b' }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            style={cardStyle}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${stat.color}15`, color: stat.color, display: 'grid', placeItems: 'center' }}>
                <stat.icon size={22} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 300 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder="Search campaigns, owners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="b24-input"
            style={{ paddingLeft: 48, width: '100%', borderRadius: 12, background: 'var(--card-bg)' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <select 
            className="b24-select" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ minWidth: 140, borderRadius: 12, background: 'var(--card-bg)' }}
          >
            <option value="All">All Status</option>
            <option value="Planned">Planned</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select 
            className="b24-select" 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            style={{ minWidth: 180, borderRadius: 12, background: 'var(--card-bg)' }}
          >
            <option value="All">All Types</option>
            <option value="Email Campaign">Email</option>
            <option value="SMS Campaign">SMS</option>
            <option value="Social Media Campaign">Social</option>
            <option value="Event Campaign">Event</option>
            <option value="Advertisement Campaign">Ads</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div style={{ background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', overflow: 'hidden' }}>
        <CampaignTable 
          campaigns={filteredCampaigns} 
          onEdit={(c) => { setCampaignToEdit(c); setIsModalOpen(true); }}
          onDelete={handleDelete}
        />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <CreateCampaignForm 
            onClose={() => { setIsModalOpen(false); setCampaignToEdit(null); }}
            onSave={handleSave}
            campaignToEdit={campaignToEdit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
