import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Save, Package, DollarSign, List, 
  Info, Tag, Layers, Database, User,
  Plus, Check, AlertCircle, RefreshCw
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { PRODUCT_CATEGORIES } from '../../data/mockProducts';

export default function AddProductModal({ onClose, onSubmit, productToEdit }) {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: PRODUCT_CATEGORIES[0],
    price: '',
    tax: 18,
    stock: '',
    unit: 'pcs',
    description: '',
    status: 'Active',
    owner: 'John Sales'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    }
  }, [productToEdit]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' || name === 'stock' || name === 'tax' 
        ? (value === '' ? '' : Number(value)) 
        : value 
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const generateSKU = () => {
    const prefix = formData.category.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, sku: `${prefix}-${random}` }));
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 600));
    onSubmit(formData);
    setIsSubmitting(false);
  };

  // Glassmorphic styles
  const modalBg = isDark ? '#111827' : '#ffffff';
  const overlayBg = 'rgba(0, 0, 0, 0.4)';
  const border = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e5e7eb';
  const inputBg = isDark ? 'rgba(255, 255, 255, 0.03)' : '#f9fafb';
  const textTitle = isDark ? '#f3f4f6' : '#111827';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';

  const sectionStyle = "mb-8 last:mb-0";
  const labelStyle = "block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1";
  const inputStyle = `w-full px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40`;

  const inputClass = (name) => `
    ${inputStyle} 
    ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}
    ${errors[name] ? 'border-red-500 ring-red-500/20 ring-2' : ''}
  `;

  const sectionHeader = (icon, title) => (
    <div className="flex items-center gap-2 mb-4 border-b pb-2" style={{ borderColor: border }}>
      <div className="text-blue-500">{icon}</div>
      <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: textTitle }}>{title}</h3>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: overlayBg }}
      className="fixed inset-0 z-[100] backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        style={{ 
          background: modalBg, 
          width: '100%', 
          maxWidth: '850px', 
          maxHeight: '90vh',
          border: `1px solid ${border}`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
        className="rounded-[30px] overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: border }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
              <Package size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black" style={{ color: textTitle }}>
                {productToEdit ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-xs font-bold" style={{ color: textMuted }}>Fill in the details below to update your catalog</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <X size={20} style={{ color: textMuted }} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            
            {/* Left Column: Basic & Pricing */}
            <div>
              {/* Section 1: Basic Info */}
              <div className={sectionStyle}>
                {sectionHeader(<Info size={18} />, "Basic Information")}
                <div className="space-y-4">
                  <div>
                    <label className={labelStyle}>Product Name *</label>
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Master Suite"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-black mt-1 ml-1 uppercase">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className={labelStyle}>SKU / Product Code *</label>
                    <div className="relative">
                      <input 
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        placeholder="e.g. PRD-4920"
                        className={inputClass('sku')}
                      />
                      <button 
                        onClick={generateSKU}
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-all"
                        title="Auto-generate SKU"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                    {errors.sku && <p className="text-red-500 text-[10px] font-black mt-1 ml-1 uppercase">{errors.sku}</p>}
                  </div>

                  <div>
                    <label className={labelStyle}>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={inputClass('category')}
                    >
                      {PRODUCT_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing */}
              <div className={sectionStyle}>
                {sectionHeader(<DollarSign size={18} />, "Pricing & Tax")}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}>Price (₹) *</label>
                    <input 
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className={inputClass('price')}
                    />
                    {errors.price && <p className="text-red-500 text-[10px] font-black mt-1 ml-1 uppercase">{errors.price}</p>}
                  </div>
                  <div>
                    <label className={labelStyle}>Tax (%)</label>
                    <input 
                      name="tax"
                      type="number"
                      value={formData.tax}
                      onChange={handleChange}
                      placeholder="18"
                      className={inputClass('tax')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Inventory & Rest */}
            <div>
              {/* Section 3: Inventory */}
              <div className={sectionStyle}>
                {sectionHeader(<Database size={18} />, "Stock & Inventory")}
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className={labelStyle}>Stock Quantity</label>
                    <input 
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      className={inputClass('stock')}
                    />
                  </div>
                   <div>
                    <label className={labelStyle}>Unit</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className={inputClass('unit')}
                    >
                      <option value="pcs">Pieces (pcs)</option>
                      <option value="night">Nights (room)</option>
                      <option value="session">Sessions</option>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="hours">Hours</option>
                      <option value="trip">Trip</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Description */}
              <div className={sectionStyle}>
                {sectionHeader(<List size={18} />, "Description")}
                <div>
                  <label className={labelStyle}>Product Description</label>
                  <textarea 
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us about this product..."
                    className={`${inputClass('description')} resize-none`}
                  />
                </div>
              </div>

              {/* Section 5 & 6 Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className={labelStyle}>Status</label>
                   <div className="flex gap-2">
                      {['Active', 'Inactive'].map(s => (
                        <button
                          key={s}
                          onClick={() => setFormData(f => ({ ...f, status: s }))}
                          className={`flex-1 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all border ${
                            formData.status === s 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
                              : `border-${isDark ? 'white/10' : 'gray-200'} text-${isDark ? 'gray-400' : 'gray-500'} hover:bg-white/5`
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                   </div>
                </div>
                <div>
                   <label className={labelStyle}>Owner</label>
                   <select
                      name="owner"
                      value={formData.owner}
                      onChange={handleChange}
                      className={inputClass('owner')}
                    >
                      <option value="John Sales">John Sales</option>
                      <option value="Sarah Clark">Sarah Clark</option>
                      <option value="Mike Ross">Mike Ross</option>
                      <option value="Alex Hunter">Alex Hunter</option>
                    </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t flex items-center justify-end gap-3" style={{ borderColor: border, background: isDark ? 'rgba(255, 255, 255, 0.01)' : '#f9fafb' }}>
          <button 
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Cancel
          </button>
          <button 
            disabled={isSubmitting}
            onClick={handleSave}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Product
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
