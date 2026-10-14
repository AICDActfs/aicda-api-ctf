'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlagSubmitModal({ isOpen, onClose, onSubmitSuccess }: { isOpen: boolean, onClose: () => void, onSubmitSuccess: (level: number) => void }) {
  const [flag, setFlag] = useState('');
  const [level, setLevel] = useState('1');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const studentName = localStorage.getItem('ctf_student_name') || 'unknown';
      const res = await fetch('/api/flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag, level: parseInt(level), studentId: studentName })
      });
      const data = await res.json();
      
      if (data.correct) {
        setStatus('success');
        setMessage(data.message);
        localStorage.setItem(`flag_level_${level}`, 'true');
        setTimeout(() => {
          onSubmitSuccess(parseInt(level));
          onClose();
          setStatus('idle');
          setFlag('');
        }, 1500);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Connection error');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="glass-card w-full max-w-md p-6 relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-matrix-green hover:text-white">✕</button>
          
          <h2 className="text-2xl font-bold mb-6 glitch">SUBMIT FLAG</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-matrix-light">SELECT LEVEL</label>
              <select 
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-black/50 border border-matrix-green p-3 text-matrix-green focus:outline-none"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i+1} value={i+1}>Level {i+1}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-2 text-matrix-light">FLAG STRING</label>
              <input 
                type="text" 
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="w-full bg-black/50 border border-matrix-green p-3 text-matrix-green focus:outline-none font-mono"
                placeholder="flag{...}"
                required
              />
            </div>
            
            {status === 'error' && <p className="text-red-500 text-sm">❌ {message}</p>}
            {status === 'success' && <p className="text-matrix-green text-sm">✅ {message}</p>}
            
            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full border-2 border-matrix-green bg-matrix-green/10 text-matrix-green hover:bg-matrix-green hover:text-black font-bold py-3 transition-colors duration-300 mt-4"
            >
              {status === 'loading' ? 'VERIFYING...' : 'DECRYPT FLAG'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
