import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Mail, Phone, Plus, Download, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Contacts = () => {
    const [filter, setFilter] = useState('All');

    const guests = [
        { id: 1, name: "Alice Johnson", room: "Suite 304", type: "VIP", email: "alice@gmail.com", phone: "+1 245-888-000", status: "Checked In", stayDate: "Mar 18 - Mar 22" },
        { id: 2, name: "Bob Smith", room: "Room 102", type: "Standard", email: "bob@vertex.io", phone: "+1 202-555-0158", status: "Checked Out", stayDate: "Mar 10 - Mar 15" },
        { id: 3, name: "Charlie Brown", room: "Penthouse", type: "Corporate", email: "charlie@zgroup.com", phone: "+1 515-321-7788", status: "Checked In", stayDate: "Mar 19 - Mar 25" },
        { id: 4, name: "David Wilson", room: "Room 205", type: "Standard", email: "david@nexgen.co", phone: "+1 415-982-3344", status: "Reservation", stayDate: "Apr 01 - Apr 05" },
        { id: 5, name: "Eva Garcia", room: "Suite 301", type: "VIP", email: "eva@lumina.io", phone: "+1 650-111-9988", status: "Checked In", stayDate: "Mar 15 - Mar 20" },
        { id: 6, name: "Frank Miller", room: "Room 110", type: "Corporate", email: "frank@swift.com", phone: "+1 312-444-5566", status: "Reservation", stayDate: "May 10 - May 12" }
    ];

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('');

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', minWidth: '300px', background: 'white' }}>
                        <Search size={18} color="var(--text-secondary)" />
                        <input 
                            type="text" 
                            placeholder="Find guest by name, room..." 
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
                        />
                    </div>
                    <button className="btn-outline">
                        <Filter size={18} /> Filters
                    </button>
                    <button className="btn-outline">
                        <Download size={18} /> Export
                    </button>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> New Reservation
                </button>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                {['All', 'Checked In', 'Reservation', 'VIP'].map(f => (
                    <span 
                        key={f} 
                        onClick={() => setFilter(f)}
                        style={{ 
                            fontSize: '14px', fontWeight: '600', cursor: 'pointer', paddingBottom: '8px',
                            color: filter === f ? 'var(--primary)' : 'var(--text-secondary)',
                            borderBottom: filter === f ? '2px solid var(--primary)' : '2px solid transparent'
                        }}
                    >
                        {f}
                    </span>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                {guests.filter(g => filter === 'All' || g.status === filter || g.type === filter).map(guest => (
                    <motion.div 
                        whileHover={{ y: -4 }}
                        key={guest.id} 
                        className="glass-card" 
                        style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'white' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'grid', placeItems: 'center', fontWeight: '700', fontSize: '18px' }}>
                                    {getInitials(guest.name)}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '16px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {guest.name} {guest.type === 'VIP' && <Star size={14} fill="var(--warning)" color="var(--warning)" />}
                                    </h4>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{guest.room} • {guest.type}</p>
                                </div>
                            </div>
                            <MoreHorizontal size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
                        </div>

                        <div style={{ height: '1px', background: 'var(--glass-border)' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Mail size={16} /> {guest.email}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Phone size={16} /> {guest.phone}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px' }}>
                            <span style={{ 
                                padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
                                background: guest.status === 'Checked In' ? 'rgba(16, 185, 129, 0.1)' : (guest.status === 'Reservation' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(239, 68, 68, 0.1)'),
                                color: guest.status === 'Checked In' ? 'var(--success)' : (guest.status === 'Reservation' ? 'var(--primary)' : 'var(--danger)')
                            }}>
                                {guest.status}
                            </span>
                            <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>Manage Folio {'>'}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Contacts;
