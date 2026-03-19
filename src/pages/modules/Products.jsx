import React from 'react';
import { ShoppingBag, Plus, MoreVertical, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const Products = () => {
    const catalog = [
        { id: "P-01", name: "Premium Web Hosting", category: "Services", price: "$120.00/yr", stock: "Unlimited", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=100&h=100" },
        { id: "P-02", name: "Enterprise CRM Setup", category: "Consulting", price: "$4,500.00", stock: "Unlimited", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=100&h=100" },
        { id: "P-03", name: "Wireless Headset X1", category: "Hardware", price: "$89.99", stock: "45", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=100&h=100" },
        { id: "P-04", name: "Annual Maintenance Contract", category: "Services", price: "$1,200.00/yr", stock: "Unlimited", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=100&h=100" }
    ];

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', border: 'none' }}>
                        <Search size={18} color="var(--text-secondary)" />
                        <input type="text" placeholder="Search products..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)' }} />
                    </div>
                    <button className="btn-outline">
                        <Filter size={18} /> Category
                    </button>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Add Product
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {catalog.map((item, idx) => (
                    <motion.div whileHover={{ scale: 1.02 }} key={idx} className="glass-card product-card" style={{ overflow: 'hidden', padding: 0 }}>
                        <div style={{ height: '160px', width: '100%', position: 'relative' }}>
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                                {item.category}
                            </div>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <h4 style={{ fontSize: '16px' }}>{item.name}</h4>
                                <MoreVertical size={18} color="var(--text-secondary)" cursor="pointer" />
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>SKU: {item.id} • Stock: {item.stock}</p>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                                <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>{item.price}</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn-outline" style={{ padding: '6px', border: 'none' }}><Edit2 size={16} color="var(--text-secondary)" /></button>
                                    <button className="btn-outline" style={{ padding: '6px', border: 'none' }}><Trash2 size={16} color="var(--danger)" /></button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <style>{`
                .product-card:hover {
                    border-color: var(--primary);
                    box-shadow: 0 12px 40px rgba(99, 102, 241, 0.2);
                }
            `}</style>
        </motion.div>
    );
};

export default Products;
