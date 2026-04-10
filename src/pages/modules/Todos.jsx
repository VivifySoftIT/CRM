import React, { useState } from 'react';
import { ListTodo, Plus, Trash2, Check, Circle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Todos() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Follow up with Vertex Corp', priority: 'High', completed: false },
    { id: 2, text: 'Review Q3 Sales Deck', priority: 'Medium', completed: true },
    { id: 3, text: 'Send updated pricing to Emma', priority: 'Low', completed: false },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('Medium');

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([{ id: Date.now(), text: newTodo, priority, completed: false }, ...todos]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const getPriorityColor = (p) => {
    if (p === 'High') return '#ef4444';
    if (p === 'Medium') return '#f59e0b';
    return '#3b82f6';
  };

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)', padding: '32px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(37,99,235,0.1)', display: 'grid', placeItems: 'center', color: '#2563eb' }}>
              <ListTodo size={20} />
            </div>
            To-Do List
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '4px 0 0' }}>Manage your daily tasks and priorities efficiently.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 24, alignItems: 'flex-start' }}>
        
        {/* Main List Area */}
        <div style={{ background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', padding: 24 }}>
          
          <form onSubmit={addTodo} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={newTodo} 
              onChange={e => setNewTodo(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none' }}
              autoFocus
            />
            <select 
              value={priority} 
              onChange={e => setPriority(e.target.value)}
              style={{ padding: '0 16px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button type="submit" style={{ padding: '0 20px', borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={18} /> Add
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence>
              {todos.map(todo => (
                <motion.div 
                  key={todo.id} 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: 12, border: '1px solid var(--card-border)', background: todo.completed ? 'var(--bg-page)' : 'var(--card-bg)', transition: 'all 0.2s' }}
                >
                  <button onClick={() => toggleTodo(todo.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: todo.completed ? '#10b981' : 'var(--text-muted)', padding: 0, display: 'grid', placeItems: 'center' }}>
                    {todo.completed ? <Check size={22} /> : <Circle size={22} />}
                  </button>
                  <div style={{ flex: 1, textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: 15, fontWeight: 600 }}>
                    {todo.text}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20, background: `${getPriorityColor(todo.priority)}15`, color: getPriorityColor(todo.priority) }}>
                      {todo.priority}
                    </span>
                    <button onClick={() => deleteTodo(todo.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
              {todos.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No active to-dos. You're all caught up!
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)', padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Overview</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--card-border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>Total Tasks</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)' }}>{todos.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--card-border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>Completed</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#10b981' }}>{todos.filter(t => t.completed).length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>Active</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#2563eb' }}>{todos.filter(t => !t.completed).length}</span>
            </div>
          </div>

          <div style={{ background: 'rgba(37,99,235,0.05)', borderRadius: 16, border: '1px solid rgba(37,99,235,0.1)', padding: 20 }}>
            <div style={{ display: 'flex', gap: 10, color: '#2563eb', fontWeight: 800, marginBottom: 8 }}>
              <AlertCircle size={18} /> Pro Tip
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Use the To-Do list for quick, daily actionable items. For larger client-related work, navigate to the unified <strong>Tasks</strong> module.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
