'use client';
import { useState } from 'react';

interface FlagSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (level: number) => void;
}

export default function FlagSubmitModal({ isOpen, onClose, onSuccess }: FlagSubmitModalProps) {
  const [level, setLevel] = useState('1');
  const [flag, setFlag] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;

    setLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const studentId = localStorage.getItem('ctf_student_name') || 'operative';
      const res = await fetch('/api/flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: Number(level),
          flag: flag.trim(),
          studentId: studentId
        }),
      });

      const data = await res.json();

      if (res.ok && data.correct) {
        setStatus({
          type: 'success',
          message: 'FLAG ACCEPTED // SYSTEM COMPROMISED',
        });
        
        // Immediately notify parent component to turn card to PWNED
        const lvlNum = Number(level);
        onSuccess(lvlNum);

        // Auto-close modal after brief celebration
        setTimeout(() => {
          setFlag('');
          setStatus({ type: 'idle', message: '' });
          onClose();
        }, 1200);
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'ACCESS DENIED: Invalid flag signature',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'COMMUNICATION ERROR: Unable to verify flag',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="relative w-full max-w-md border border-[#00ff41] bg-[#050505] p-6 rounded-lg shadow-[0_0_30px_#00ff4144]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-[#00ff41] transition-colors"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold text-[#00ff41] tracking-wider mb-1 flex items-center gap-2">
          <span>🚩</span> SUBMIT TARGET FLAG
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Authenticate target compromise by submitting captured flag string.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-[#00ffff88] block mb-1">SELECT MISSION LEVEL:</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#00ff4144] text-[#00ff41] px-3 py-2 text-xs rounded outline-none focus:border-[#00ff41]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-[#00ffff88] block mb-1">ENTER FLAG STRING:</label>
            <input
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="flag{...}"
              className="w-full bg-[#0a0a0a] border border-[#00ff4144] text-[#00ff41] px-3 py-2 text-xs rounded outline-none focus:border-[#00ff41] placeholder:text-gray-700"
              autoFocus
            />
          </div>

          {status.type === 'error' && (
            <div className="p-2.5 bg-red-950/40 border border-red-500 text-red-400 text-xs rounded">
              ✕ {status.message}
            </div>
          )}

          {status.type === 'success' && (
            <div className="p-2.5 bg-green-950/40 border border-[#00ff41] text-[#00ff41] text-xs font-bold rounded animate-pulse">
              ✓ {status.message}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-xs border border-gray-700 text-gray-400 rounded hover:text-white transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading || status.type === 'success'}
              className="flex-1 py-2 text-xs bg-[#00ff41] text-black font-extrabold rounded hover:bg-[#00ffff] transition-colors disabled:opacity-50"
            >
              {loading ? 'VERIFYING...' : status.type === 'success' ? 'ACCEPTED!' : 'TRANSMIT FLAG'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
