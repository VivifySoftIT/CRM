import React, { useState } from 'react';
import { 
  MoreVertical, Edit2, Trash2, Power, 
  ExternalLink, ChevronRight, Hash, 
  Tag, IndianRupee, User, Calendar
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ProductsTable({ products, onEdit, onDelete, onToggleStatus }) {
  const { isDark } = useTheme();
  const [activeMenu, setActiveMenu] = useState(null);

  const cardBg = isDark ? '#1a2233' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const textTitle = isDark ? '#f1f5f9' : '#1e293b';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const hoverBg = isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div 
      style={{ background: cardBg, border: `1px solid ${border}` }}
      className="rounded-2xl overflow-hidden shadow-sm overflow-x-auto"
    >
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="border-b" style={{ borderColor: border, background: isDark ? 'rgba(0,0,0,0.1)' : '#f8fafc' }}>
            <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest pl-6">Product & SKU</th>
            <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Category</th>
            <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Price</th>
            <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
            <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
            <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Owner</th>
            <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right pr-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr 
              key={product.id} 
              className="border-b last:border-0 transition-colors group"
              style={{ borderColor: border }}
            >
              {/* Product & SKU */}
              <td className="p-4 pl-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Hash size={18} />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm mb-0.5" style={{ color: textTitle }}>{product.name}</div>
                    <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{product.sku}</div>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-gray-400" />
                  <span className="text-sm font-semibold" style={{ color: textMuted }}>{product.category}</span>
                </div>
              </td>

              {/* Price */}
              <td className="p-4 text-sm">
                <div className="flex items-center gap-1 font-black text-blue-600">
                  <span className="text-xs">₹</span>
                  {product.price.toLocaleString()}
                </div>
              </td>

              {/* Stock */}
              <td className="p-4 text-sm font-bold" style={{ color: textTitle }}>
                {product.stock !== null ? (
                  <div className="flex flex-col">
                    <span>{product.stock} {product.unit}</span>
                    {product.stock < 10 && product.stock > 0 && (
                      <span className="text-[10px] text-orange-500 font-black uppercase mt-0.5 leading-none">Low Stock</span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 font-medium">Service</span>
                )}
              </td>

              {/* Status */}
              <td className="p-4 text-center">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase inline-flex items-center gap-1.5 ${
                  product.status === 'Active' 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'bg-gray-500/10 text-gray-500'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${product.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                  {product.status}
                </span>
              </td>

              {/* Owner */}
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 overflow-hidden">
                    {product.owner.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold" style={{ color: textTitle }}>{product.owner}</span>
                    <span className="text-[10px] text-gray-400 font-bold">{formatDate(product.createdAt)}</span>
                  </div>
                </div>
              </td>

              {/* Actions */}
              <td className="p-4 text-right pr-6 relative">
                 <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(product)}
                      className="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors tooltip"
                      title="Edit Product"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onToggleStatus(product.id)}
                      className="p-1.5 hover:bg-emerald-500/10 text-emerald-500 rounded-lg transition-colors"
                      title={product.status === 'Active' ? 'Deactivate' : 'Activate'}
                    >
                      <Power size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(product.id)}
                      className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>

                 {/* Mobile menu button (if needed for smaller screens later) */}
                 <div className="md:hidden">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === product.id ? null : product.id)}
                      className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <MoreVertical size={18} style={{ color: textMuted }} />
                    </button>
                 </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
