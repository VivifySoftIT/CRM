import { useTheme } from './ThemeContext';

/**
 * Returns a `t` object with all color tokens for the Staff portal.
 * Components just call:  const t = useStaffTheme();
 * then use t.bg, t.card, t.text, etc. in inline styles.
 */
export function useStaffTheme() {
  const { isDark, toggle } = useTheme();

  const t = isDark ? {
    // ── Dark tokens ──────────────────────────────────────────────
    bg:           '#0f172a',
    bgSecondary:  '#1e293b',
    card:         '#1e293b',
    cardBorder:   '#334155',
    cardShadow:   '0 1px 8px rgba(0,0,0,0.4)',
    text:         '#f1f5f9',
    textSecondary:'#94a3b8',
    textMuted:    '#64748b',
    input:        '#0f172a',
    inputBorder:  '#334155',
    divider:      '#334155',
    hover:        '#334155',
    tableHead:    '#0f172a',
    tableRow:     '#1e293b',
    tableRowAlt:  '#172033',
    tableHover:   '#1a2d4a',
    navbarBg:     '#1e293b',
    navbarBorder: '#334155',
    badge: {
      High:        { bg:'#450a0a', color:'#fca5a5', border:'#7f1d1d' },
      Medium:      { bg:'#451a03', color:'#fcd34d', border:'#78350f' },
      Low:         { bg:'#1e293b', color:'#94a3b8', border:'#334155' },
      Open:        { bg:'#0c1a3a', color:'#93c5fd', border:'#1e3a5f' },
      'In Progress':{ bg:'#451a03', color:'#fcd34d', border:'#78350f' },
      Closed:      { bg:'#052e16', color:'#86efac', border:'#14532d' },
      Active:      { bg:'#052e16', color:'#86efac', border:'#14532d' },
      Inactive:    { bg:'#1e293b', color:'#94a3b8', border:'#334155' },
      Pending:     { bg:'#0c1a3a', color:'#93c5fd', border:'#1e3a5f' },
      Overdue:     { bg:'#450a0a', color:'#fca5a5', border:'#7f1d1d' },
      Completed:   { bg:'#052e16', color:'#86efac', border:'#14532d' },
    },
    kpi: [
      { iconBg:'#1e3a5f', iconColor:'#60a5fa', border:'#1e3a5f' },
      { iconBg:'#451a03', iconColor:'#fbbf24', border:'#78350f' },
      { iconBg:'#2e1065', iconColor:'#c084fc', border:'#4c1d95' },
      { iconBg:'#052e16', iconColor:'#4ade80', border:'#14532d' },
    ],
    chartGrid:    '#334155',
    chartTick:    '#64748b',
    tooltipBg:    '#1e293b',
    tooltipBorder:'#334155',
  } : {
    // ── Light tokens ─────────────────────────────────────────────
    bg:           '#f8fafc',
    bgSecondary:  '#f1f5f9',
    card:         '#ffffff',
    cardBorder:   '#f1f5f9',
    cardShadow:   '0 1px 8px rgba(0,0,0,0.06)',
    text:         '#0f172a',
    textSecondary:'#475569',
    textMuted:    '#94a3b8',
    input:        '#f8fafc',
    inputBorder:  '#e2e8f0',
    divider:      '#f1f5f9',
    hover:        '#f8fafc',
    tableHead:    '#f8fafc',
    tableRow:     '#ffffff',
    tableRowAlt:  '#fafafa',
    tableHover:   '#f0f9ff',
    navbarBg:     '#ffffff',
    navbarBorder: '#e5e7eb',
    badge: {
      High:        { bg:'#fef2f2', color:'#dc2626', border:'#fecaca' },
      Medium:      { bg:'#fffbeb', color:'#d97706', border:'#fde68a' },
      Low:         { bg:'#f8fafc', color:'#64748b', border:'#e2e8f0' },
      Open:        { bg:'#eff6ff', color:'#2563eb', border:'#bfdbfe' },
      'In Progress':{ bg:'#fffbeb', color:'#d97706', border:'#fde68a' },
      Closed:      { bg:'#f0fdf4', color:'#16a34a', border:'#bbf7d0' },
      Active:      { bg:'#f0fdf4', color:'#16a34a', border:'#bbf7d0' },
      Inactive:    { bg:'#f8fafc', color:'#64748b', border:'#e2e8f0' },
      Pending:     { bg:'#eff6ff', color:'#2563eb', border:'#bfdbfe' },
      Overdue:     { bg:'#fef2f2', color:'#dc2626', border:'#fecaca' },
      Completed:   { bg:'#f0fdf4', color:'#16a34a', border:'#bbf7d0' },
    },
    kpi: [
      { iconBg:'#eff6ff', iconColor:'#2563eb', border:'#bfdbfe' },
      { iconBg:'#fffbeb', iconColor:'#d97706', border:'#fde68a' },
      { iconBg:'#faf5ff', iconColor:'#7c3aed', border:'#ddd6fe' },
      { iconBg:'#f0fdf4', iconColor:'#16a34a', border:'#bbf7d0' },
    ],
    chartGrid:    '#f1f5f9',
    chartTick:    '#94a3b8',
    tooltipBg:    '#ffffff',
    tooltipBorder:'#e2e8f0',
  };

  return { t, isDark, toggle };
}
