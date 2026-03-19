import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I am Omni, your AI Concierge. I can look up room availability, process booking requests, or answer questions. How can I assist you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [conversationState, setConversationState] = useState('idle'); // idle, booking_dates, booking_guests, booking_room, booking_name
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isTyping]);

    const generateAIResponse = (userMsg, currentState) => {
        const msg = userMsg.toLowerCase();
        
        switch (currentState) {
            case 'idle':
                if (msg.includes('book') || msg.includes('room') || msg.includes('stay') || msg.includes('reserve')) {
                    setConversationState('booking_dates');
                    return "I can certainly help you book a room. To check availability, when are you planning to check in and check out?";
                }
                if (msg.includes('event') || msg.includes('wedding') || msg.includes('party')) {
                    return "Our hotel features a stunning 5,000 sq ft ballroom perfect for weddings and corporate events. I can have our Sales Manager contact you—what is the best email to reach you at?";
                }
                if (msg.includes('reach') || msg.includes('contact') || msg.includes('phone') || msg.includes('call')) {
                    return "You can reach our human front desk staff 24/7 by calling +1-800-OMNI-HOTEL or emailing concierge@omnihotel.com.";
                }
                if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
                    return "Hello there! Are you looking to book a stay with us, or do you have a question about the hotel amenities?";
                }
                return "I'm your AI assistant, specifically trained to help with room bookings, event inquiries, and hotel information. Would you like to check room availability?";
                
            case 'booking_dates':
                if (msg.includes('tomorrow') || msg.includes('today') || msg.match(/\d/)) {
                    setConversationState('booking_guests');
                    return "Got it. And how many guests will be staying in the room?";
                }
                return "Could you please specify the dates? For example, you can say 'Next Friday' or 'March 15th'.";

            case 'booking_guests':
                if (msg.includes('1') || msg.includes('2') || msg.includes('3') || msg.includes('4') || msg.includes('one') || msg.includes('two')) {
                    setConversationState('booking_room');
                    return "Perfect. Let me check the system... Good news! We have an Oceanview Suite and a Standard Queen Room available for those dates. Which would you prefer?";
                }
                return "Please let me know the number of guests (e.g., '2 adults').";

            case 'booking_room':
                if (msg.includes('ocean') || msg.includes('suite')) {
                    setConversationState('booking_name');
                    return "An excellent choice! The Oceanview Suite is beautiful this time of year. May I have your full name to start the reservation file?";
                }
                if (msg.includes('standard') || msg.includes('queen')) {
                    setConversationState('booking_name');
                    return "Great! The Standard Queen room has a lovely view of the gardens. May I have your full name to start the reservation file?";
                }
                return "Please choose between the Oceanview Suite or the Standard Queen room.";

            case 'booking_name':
                if (msg.length > 2) {
                    setConversationState('idle');
                    return `Thank you! I have secured that room in our system and sent an official inquiry to our Front Desk. A human agent will email you a secure payment link shortly to confirm the reservation. Is there anything else I can help you with?`;
                }
                return "Please provide your full name so I can hold the room for you.";

            default:
                return "I'm having trouble understanding. Would you like to start over and check room availability?";
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;
        
        const userMsg = input;
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput('');
        setIsTyping(true);

        // Simulate AI "Processing & Typing" delay based on realistic LLM response times
        const thinkingTime = Math.random() * 1500 + 1000; // 1 to 2.5 seconds
        
        setTimeout(() => {
            const reply = generateAIResponse(userMsg, conversationState);
            setIsTyping(false);
            setMessages(prev => [...prev, { text: reply, isBot: true }]);
        }, thinkingTime);
    };

    return (
        <div style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 9999 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="glass-card"
                        style={{ width: '380px', height: '550px', background: 'white', marginBottom: '16px', borderRadius: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}
                    >
                        {/* Header */}
                        <div className="gradient-bg" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Omni AI Concierge</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginTop: '4px', opacity: 0.9 }}>
                                    <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 10px #4ade80' }} /> Online & Ready
                                </div>
                            </div>
                            <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
                        </div>

                        {/* Messages Area */}
                        <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', background: '#f8fafc' }} className="custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    key={idx} style={{ display: 'flex', justifyContent: msg.isBot ? 'flex-start' : 'flex-end' }}
                                >
                                    {msg.isBot && <div className="gradient-bg" style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, marginRight: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>AI</div>}
                                    <div style={{ 
                                        maxWidth: '75%', padding: '14px 18px', fontSize: '14px', lineHeight: '1.6',
                                        background: msg.isBot ? 'white' : 'var(--primary)',
                                        color: msg.isBot ? 'var(--text-primary)' : 'white',
                                        borderRadius: '18px', borderTopLeftRadius: msg.isBot ? '4px' : '18px', borderBottomRightRadius: !msg.isBot ? '4px' : '18px',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                                    }}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            
                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <div className="gradient-bg" style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, marginRight: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>AI</div>
                                    <div style={{ background: 'white', padding: '14px 18px', borderRadius: '18px', borderTopLeftRadius: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%' }} />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%' }} />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%' }} />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: '20px', background: 'white', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your reply here..."
                                disabled={isTyping}
                                style={{ flex: 1, padding: '14px 20px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: '#f8fafc', fontSize: '14px' }}
                            />
                            <button 
                                onClick={handleSend}
                                disabled={isTyping || !input.trim()}
                                className="gradient-bg" 
                                style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', border: 'none', cursor: isTyping || !input.trim() ? 'not-allowed' : 'pointer', opacity: isTyping || !input.trim() ? 0.5 : 1 }}
                            >
                                {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} style={{ marginLeft: '-2px' }}/>}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Bubble */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="gradient-bg" 
                    style={{ width: '64px', height: '64px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)' }}
                >
                    {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
                </button>
            </motion.div>
        </div>
    );
};

export default AIChatBot;
