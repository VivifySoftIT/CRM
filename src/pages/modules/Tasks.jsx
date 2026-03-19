import React, { useState } from 'react';
import { CheckSquare, Circle, Plus, Calendar, Clock, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Follow up with Spark Solutions", due: "Today, 2:00 PM", priority: "High", completed: false },
        { id: 2, title: "Prepare Q2 Marketing Presentation", due: "Tomorrow", priority: "Medium", completed: false },
        { id: 3, title: "Send revised proposal to Vertex Corp", due: "Today, 5:00 PM", priority: "High", completed: false },
        { id: 4, title: "Review new lead inquiries", due: "Mar 20", priority: "Low", completed: true },
        { id: 5, title: "Call John regarding contract renewal", due: "Mar 21", priority: "Medium", completed: false }
    ]);

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const getPriorityColor = (priority) => {
        if (priority === 'High') return 'var(--danger)';
        if (priority === 'Medium') return 'var(--warning)';
        return 'var(--success)';
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>My Tasks</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>You have {tasks.filter(t=>!t.completed).length} pending tasks today.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Add Task
                </button>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <AnimatePresence>
                    {tasks.sort((a,b) => Number(a.completed) - Number(b.completed)).map((task) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={task.id} 
                            style={{ 
                                padding: '20px 24px', 
                                borderBottom: '1px solid var(--glass-border)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                opacity: task.completed ? 0.6 : 1,
                                background: task.completed ? 'rgba(0,0,0,0.2)' : 'transparent'
                            }}
                            className="task-row"
                        >
                            <div onClick={() => toggleTask(task.id)} style={{ cursor: 'pointer', color: task.completed ? 'var(--primary)' : 'var(--text-secondary)' }}>
                                {task.completed ? <CheckSquare size={24} /> : <Circle size={24} />}
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '16px', textDecoration: task.completed ? 'line-through' : 'none', marginBottom: '4px' }}>
                                    {task.title}
                                </h4>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={14} /> {task.due}
                                    </span>
                                    {!task.completed && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: getPriorityColor(task.priority) }}>
                                            <Circle size={10} fill="currentColor" /> {task.priority} Priority
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button className="btn-outline" style={{ padding: '8px', border: 'none' }}>
                                <MoreHorizontal size={20} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <style>{`
                .task-row:hover {
                    background: rgba(0, 0, 0,0.02);
                }
            `}</style>
        </motion.div>
    );
};

export default Tasks;
