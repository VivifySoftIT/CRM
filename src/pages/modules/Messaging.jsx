import React, { useState } from 'react';
import { Send, Phone, User, MessageSquare, Image as ImageIcon, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const Messaging = () => {
    const contacts = [
        { name: "Alice Johnson", phone: "+1 245-888-000", time: "10:45 AM", unread: 2, lastMsg: "Thanks for the proposal!" },
        { name: "Bob Smith", phone: "+1 202-555-0158", time: "Yesterday", unread: 0, lastMsg: "When can we schedule a demo?" },
        { name: "Charlie Brown", phone: "+1 515-321-7788", time: "Mar 15", unread: 0, lastMsg: "Sent the documents." }
    ];

    const [activeContact, setActiveContact] = useState(contacts[0]);

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ height: 'calc(100vh - 120px)', display: 'flex', gap: '20px' }}>
            {/* Sidebar List */}
            <div className="glass-card" style={{ width: '320px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)' }}>
                    <h4 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MessageSquare size={18} color="var(--success)" /> Quick Messenger
                    </h4>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {contacts.map((contact, idx) => (
                        <div 
                            key={idx}
                            onClick={() => setActiveContact(contact)}
                            style={{ 
                                padding: '16px 20px', 
                                borderBottom: '1px solid rgba(0, 0, 0,0.05)',
                                background: activeContact.name === contact.name ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                borderLeft: activeContact.name === contact.name ? '3px solid var(--primary)' : '3px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                <h5 style={{ fontSize: '14px', fontWeight: '600' }}>{contact.name}</h5>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{contact.time}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>{contact.lastMsg}</p>
                                {contact.unread > 0 && (
                                    <span style={{ background: 'var(--success)', color: 'var(--text-primary)', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: '700' }}>{contact.unread}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Chat Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--success), var(--primary))', display: 'grid', placeItems: 'center' }}>
                            <User size={20} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '16px' }}>{activeContact.name}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={10} /> {activeContact.phone}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-outline" style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '12px', color: '#128C7E', borderColor: '#128C7E' }}>WhatsApp</button>
                        <button className="btn-outline" style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '12px', color: '#007AFF', borderColor: '#007AFF' }}>SMS</button>
                    </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ alignSelf: 'flex-start', maxWidth: '70%', background: 'rgba(0, 0, 0,0.05)', padding: '12px 16px', borderRadius: '16px 16px 16px 4px' }}>
                        <p style={{ fontSize: '14px' }}>Hi, I received the proposal. Looks good!</p>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', textAlign: 'right', marginTop: '4px' }}>10:42 AM</span>
                    </div>
                    <div style={{ alignSelf: 'flex-end', maxWidth: '70%', background: 'var(--primary)', padding: '12px 16px', borderRadius: '16px 16px 4px 16px' }}>
                        <p style={{ fontSize: '14px' }}>Great! Let me know if you have any questions before we finalize.</p>
                        <span style={{ fontSize: '10px', color: 'rgba(0, 0, 0,0.7)', display: 'block', textAlign: 'right', marginTop: '4px' }}>10:44 AM</span>
                    </div>
                    <div style={{ alignSelf: 'flex-start', maxWidth: '70%', background: 'rgba(0, 0, 0,0.05)', padding: '12px 16px', borderRadius: '16px 16px 16px 4px' }}>
                        <p style={{ fontSize: '14px' }}>{activeContact.lastMsg}</p>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', textAlign: 'right', marginTop: '4px' }}>{activeContact.time}</span>
                    </div>
                </div>

                {/* Input Area */}
                <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)' }}>
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px solid rgba(0, 0, 0,0.1)' }}>
                        <button style={{ background: 'none', border: 'none', padding: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}><Smile size={20} /></button>
                        <button style={{ background: 'none', border: 'none', padding: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}><ImageIcon size={20} /></button>
                        <input type="text" placeholder="Type a message..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', padding: '8px 16px', fontSize: '14px' }} />
                        <button className="btn-primary" style={{ padding: '10px', borderRadius: '50%' }}><Send size={18} /></button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Messaging;
