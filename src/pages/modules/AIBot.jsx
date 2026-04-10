import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, Send, User, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am your VivifyCRM AI Assistant. I can help you draft emails, quickly analyze your pipeline, or summarize lead interactions. Try asking me a question below!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing and responding
    setTimeout(() => {
      let responseText = "I analyze that based on current data. How else can I assist you with your sales pipeline?";
      
      const lowerInput = userMessage.text.toLowerCase();
      if (lowerInput.includes('lead') || lowerInput.includes('pipeline')) {
        responseText = "Looking at your current pipeline, you have 24 active leads. The highest probability closure is 'Acme Corp' (85%). Should I draft a follow-up email for them?";
      } else if (lowerInput.includes('email') || lowerInput.includes('draft')) {
        responseText = "Here is a quick draft:\n\n'Hi there,\nJust checking in on our previous conversation regarding the Q4 rollout. Let me know if you need any additional resources.\nBest, [Your Name]'\n\nWould you like me to send this to your drafts?";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        responseText = "Hi there! Ready to crush some sales targets today?";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestion = (text) => {
    setInput(text);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)', padding: '24px 32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--card-border)' }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg, #8b5cf6, #c084fc)', display: 'grid', placeItems: 'center', color: '#fff', boxShadow: '0 4px 15px rgba(139,92,246,0.3)' }}>
          <Sparkles size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>VIVIFY AI Assistant</h1>
          <p style={{ fontSize: 13, color: '#8b5cf6', fontWeight: 700, margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}/> Available and Ready
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', borderRadius: 20, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
        
        {/* Chat History Panel */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', gap: 16, flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                
                <div style={{ 
                  width: 36, height: 36, borderRadius: 12, flexShrink: 0, display: 'grid', placeItems: 'center', color: '#fff',
                  background: msg.sender === 'user' ? '#2563eb' : 'linear-gradient(135deg, #8b5cf6, #c084fc)'
                }}>
                  {msg.sender === 'user' ? <User size={18} /> : <Bot size={20} />}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                  <div style={{ 
                    padding: '16px 20px', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                    background: msg.sender === 'user' ? '#2563eb' : 'var(--input-bg)',
                    color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                    borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--card-border)',
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, fontWeight: 600 }}>
                    {msg.time}
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 16 }}>
               <div style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0, display: 'grid', placeItems: 'center', color: '#fff', background: 'linear-gradient(135deg, #8b5cf6, #c084fc)' }}>
                 <Bot size={20} />
               </div>
               <div style={{ padding: '16px 24px', background: 'var(--input-bg)', borderRadius: '20px 20px 20px 4px', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 6 }}>
                 <Loader2 size={18} className="animate-spin" color="#8b5cf6" />
                 <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>Analyzing data...</span>
               </div>
             </motion.div>
          )}
        </div>

        {/* Suggestions & Input Area */}
        <div style={{ padding: '24px 32px', background: 'var(--bg-page)', borderTop: '1px solid var(--card-border)' }}>
          
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
             {['Analyze my top deals', 'Draft a follow-up email', 'Summarize today\'s tasks'].map((suggestion, i) => (
                <button key={i} onClick={() => handleSuggestion(suggestion)}
                  style={{ whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: 20, border: '1px solid #8b5cf6', background: 'rgba(139,92,246,0.05)', color: '#8b5cf6', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,92,246,0.05)'}>
                  {suggestion} <ArrowRight size={12} />
                </button>
             ))}
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', gap: 12 }}>
             <input 
               value={input} 
               onChange={e => setInput(e.target.value)} 
               placeholder="Message VIVIFY AI (e.g. 'Draft an email to Acme Corp')" 
               style={{ flex: 1, padding: '18px 24px', borderRadius: 16, border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: 15, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }} 
             />
             <button 
               type="submit" 
               disabled={!input.trim() || isTyping}
               style={{ width: 56, height: 56, borderRadius: 16, border: 'none', background: !input.trim() || isTyping ? 'var(--card-border)' : 'linear-gradient(135deg, #8b5cf6, #c084fc)', color: '#fff', display: 'grid', placeItems: 'center', cursor: !input.trim() || isTyping ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: !input.trim() || isTyping ? 'none' : '0 4px 15px rgba(139,92,246,0.3)' }}
             >
               <Send size={20} />
             </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: 'var(--text-muted)' }}>
             AI can make mistakes. Consider verifying critical pipeline figures.
          </div>
        </div>

      </div>
    </div>
  );
}
