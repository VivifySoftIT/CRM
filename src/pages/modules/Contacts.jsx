import React, { useState } from 'react';
import { 
  Users, UserPlus, Search, 
  Mail, Phone, MoreHorizontal, 
  ChevronRight, Filter, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contacts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    
    const mockContacts = [
        { id: 1, name: "Alice Johnson", company: "Spark Solutions", email: "alice@spark.com", phone: "+1 245-888-000", status: "Active", type: "Client" },
        { id: 2, name: "Bob Smith", company: "Vertex Corp", email: "bob@vertex.io", phone: "+1 202-555-0158", status: "Inactive", type: "Prospect" },
        { id: 3, name: "Charlie Brown", company: "Z-Group", email: "charlie@zgroup.com", phone: "+1 515-321-7788", status: "Active", type: "Client" },
        { id: 4, name: "David Wilson", company: "NexGen", email: "david@nexgen.co", phone: "+1 415-982-3344", status: "Active", type: "Prospect" },
        { id: 5, name: "Eva Garcia", company: "Lumina", email: "eva@lumina.io", phone: "+1 312-700-6600", status: "Active", type: "Client" },
        { id: 6, name: "Frank Miller", company: "Swift Logic", email: "frank@swift.com", phone: "+1 617-555-1234", status: "Pending", type: "Suspect" },
    ];

    const filteredContacts = mockContacts.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', border: 'none' }}>
                        <Search size={18} color="var(--text-secondary)" />
                        <input 
                            type="text" 
                            placeholder="Find contacts..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)' }} 
                        />
                    </div>
                    <button className="btn-outline">
                        <Filter size={18} /> Filters
                    </button>
                    <button className="btn-outline">
                        <Download size={18} /> Export
                    </button>
                </div>
                <button className="btn-primary" style={{ padding: '10px 20px', borderRadius: '12px' }}>
                    <UserPlus size={18} /> New Contact
                </button>
            </div>

            {/* Main Grid View */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                <AnimatePresence>
                    {filteredContacts.map((contact, idx) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: idx * 0.05 }}
                            key={contact.id} 
                            className="glass-card contact-card" 
                            style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
                        >
                            <div className="card-top" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(45deg, var(--primary), var(--accent))', display: 'grid', placeItems: 'center', fontSize: '18px', fontWeight: '700' }}>
                                        {contact.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '16px' }}>{contact.name}</h4>
                                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{contact.company}</p>
                                    </div>
                                </div>
                                <div style={{ cursor: 'pointer', padding: '4px' }}>
                                    <MoreHorizontal size={20} color="var(--text-secondary)" />
                                </div>
                            </div>

                            <div style={{ padding: '16px 0', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    <Mail size={14} /> {contact.email}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    <Phone size={14} /> {contact.phone}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                                <span style={{ 
                                    padding: '4px 12px', 
                                    borderRadius: '20px', 
                                    fontSize: '11px', 
                                    fontWeight: '700', 
                                    textTransform: 'uppercase',
                                    background: contact.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: contact.status === 'Active' ? 'var(--success)' : 'var(--danger)',
                                }}>
                                    {contact.status}
                                </span>
                                <span style={{ fontSize: '12px', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}>
                                    View Details <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <style>{`
                .contact-card:hover {
                    border-color: var(--primary);
                    transform: translateY(-5px);
                    background: rgba(0, 0, 0,0.06);
                }
            `}</style>
        </motion.div>
    );
};

export default Contacts;
