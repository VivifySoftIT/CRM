import React from 'react';
import { FolderOpen, FileText, Image, File, UploadCloud, Search, MoreVertical, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const Documents = () => {
    const folders = [
        { name: "Contracts", items: 45, size: "128 MB", color: "var(--primary)" },
        { name: "Invoices", items: 120, size: "45 MB", color: "var(--success)" },
        { name: "Proposals", items: 85, size: "210 MB", color: "var(--accent)" },
        { name: "NDAs", items: 32, size: "18 MB", color: "var(--warning)" }
    ];

    const recentFiles = [
        { name: "Spark_Solutions_Agreement_v2.pdf", type: "pdf", size: "2.4 MB", date: "Mar 19, 2026" },
        { name: "Q1_Financial_Report.xlsx", type: "excel", size: "1.1 MB", date: "Mar 18, 2026" },
        { name: "Project_Architecture.png", type: "image", size: "4.8 MB", date: "Mar 15, 2026" },
        { name: "Client_Requirements.docx", type: "doc", size: "850 KB", date: "Mar 14, 2026" }
    ];

    const getIcon = (type) => {
        switch(type) {
            case 'pdf': return <FileText color="var(--danger)" size={24} />;
            case 'image': return <Image color="var(--primary)" size={24} />;
            case 'excel': return <FileText color="var(--success)" size={24} />;
            default: return <File color="var(--secondary)" size={24} />;
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', border: 'none', width: '300px' }}>
                    <Search size={18} color="var(--text-secondary)" />
                    <input type="text" placeholder="Search files & folders..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%' }} />
                </div>
                <button className="btn-primary">
                    <UploadCloud size={18} /> Upload Files
                </button>
            </div>

            <h4 style={{ fontSize: '18px', marginBottom: '20px' }}>Folders</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {folders.map((folder, idx) => (
                    <motion.div whileHover={{ scale: 1.02 }} key={idx} className="glass-card folder-card" style={{ padding: '24px', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <FolderOpen size={40} color={folder.color} fill={`${folder.color}40`} strokeWidth={1.5} />
                            <MoreVertical size={20} color="var(--text-secondary)" />
                        </div>
                        <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{folder.name}</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{folder.items} files • {folder.size}</p>
                    </motion.div>
                ))}
            </div>

            <h4 style={{ fontSize: '18px', marginBottom: '20px' }}>Recent Files</h4>
            <div className="glass-card">
                {recentFiles.map((file, idx) => (
                    <div key={idx} className="file-row" style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                        padding: '16px 24px', borderBottom: idx === recentFiles.length - 1 ? 'none' : '1px solid var(--glass-border)' 
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 0, 0,0.05)', display: 'grid', placeItems: 'center' }}>
                                {getIcon(file.type)}
                            </div>
                            <div>
                                <p style={{ fontWeight: '500', fontSize: '14px' }}>{file.name}</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{file.size} • Uploaded {file.date}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn-outline" style={{ padding: '8px', borderRadius: '8px' }}><Download size={16} /></button>
                            <button className="btn-outline" style={{ padding: '8px', borderRadius: '8px' }}><MoreVertical size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                .folder-card:hover {
                    background: rgba(0, 0, 0,0.06);
                    border-color: var(--primary);
                }
                .file-row:hover {
                    background: rgba(0, 0, 0,0.02);
                }
            `}</style>
        </motion.div>
    );
};

export default Documents;
