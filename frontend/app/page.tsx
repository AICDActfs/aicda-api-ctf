'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MatrixRain from '../components/MatrixRain';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [code, setCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('ctf_access_token')) {
      router.push('/labs');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName) {
      setError('Student name required');
      return;
    }
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, studentName })
      });
      const data = await res.json();
      
      if (data.valid) {
        localStorage.setItem('ctf_access_token', data.token);
        localStorage.setItem('ctf_student_name', studentName);
        router.push('/labs');
      } else {
        setError('ACCESS DENIED: Invalid Code');
      }
    } catch (err) {
      setError('Connection Error');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <MatrixRain />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md p-8 glass-card"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 glitch">AICDA API CTF</h1>
          <p className="text-matrix-light">API Security Training Lab</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-matrix-light">{'//'} STUDENT NAME</label>
            <input 
              type="text" 
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-black/50 border border-matrix-green p-3 text-matrix-green focus:outline-none focus:border-matrix-light font-mono"
              placeholder="Enter your name..."
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-matrix-light">{'//'} ENTER ACCESS CODE</label>
            <input 
              type="password" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-black/50 border border-matrix-green p-3 text-matrix-green focus:outline-none focus:border-matrix-light font-mono"
              placeholder="> _"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button 
            type="submit"
            className="w-full border-2 border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black font-bold py-3 transition-colors duration-300"
          >
            INITIALIZE SEQUENCE
          </button>
        </form>
      </motion.div>
    </main>
  );
}
