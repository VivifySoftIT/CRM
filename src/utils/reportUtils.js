// src/utils/reportUtils.js

/**
 * Aggregates results for the CRM dashboard KPIs
 */
export const getCRMStats = (leads, deals, campaigns) => {
  const wonDeals = deals.filter(d => d.stage === 'converted' || d.stage === 'Won');
  const pipelineDeals = deals.filter(d => d.stage !== 'converted' && d.stage !== 'Won');
  
  const totalRevenue = wonDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
  const avgDealSize = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0;
  
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  return {
    totalRevenue,
    totalDeals: deals.length,
    wonDeals: wonDeals.length,
    pipelineRevenue: pipelineDeals.reduce((sum, d) => sum + (d.amount || 0), 0),
    avgDealSize,
    conversionRate: conversionRate.toFixed(1)
  };
};

/**
 * Prepares data for specific chart types
 */
export const getPipelineData = (deals) => {
  const stages = [...new Set(deals.map(d => d.stage))];
  return stages.map(stage => ({
    name: stage.charAt(0).toUpperCase() + stage.slice(1),
    value: deals.filter(d => d.stage === stage).length,
    amount: deals.filter(d => d.stage === stage).reduce((s, d) => s + (d.amount || 0), 0)
  }));
};

export const getLeadsBySource = (leads) => {
  const sources = [...new Set(leads.map(l => l.source))];
  return sources.map(source => ({
    name: source,
    value: leads.filter(l => l.source === source).length
  }));
};

/**
 * Helper to get a time-series of revenue
 */
export const getMonthlyRevenue = (deals) => {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const wonDeals = deals.filter(d => d.stage === 'converted' || d.stage === 'Won');
  
  // Use current year as default
  const year = new Date().getFullYear();
  
  return MONTHS.map((month, index) => {
    const monthRevenue = wonDeals.filter(d => {
        const date = new Date(d.closeDate || d.date);
        return date.getMonth() === index && date.getFullYear() === year;
    }).reduce((sum, d) => sum + (d.amount || 0), 0);
    
    return { name: month, value: monthRevenue };
  });
};
