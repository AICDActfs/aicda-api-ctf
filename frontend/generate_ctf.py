import os
import json

base_dir = r"D:\antigravity\aicda-ctf\frontend"

def write_file(path, content):
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

# package.json
write_file("package.json", """
{
  "name": "aicda-ctf-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18",
    "framer-motion": "^11.2.6",
    "lucide-react": "^0.379.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.3"
  }
}
""")

write_file("next.config.js", """
/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
""")

write_file("tailwind.config.ts", """
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        matrix: {
          green: "#00ff41",
          dark: "#000000",
          light: "#00ffff",
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
""")

write_file("tsconfig.json", """
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
""")

write_file("postcss.config.js", """
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
""")

write_file(".env.example", """
NEXT_PUBLIC_API_URL=https://aicda-api.fly.dev
""")

write_file("vercel.json", """
{
  "framework": "nextjs"
}
""")

write_file("app/globals.css", """
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 255, 65;
  --background-start-rgb: 0, 0, 0;
  --background-end-rgb: 0, 0, 0;
}

body {
  color: rgb(var(--foreground-rgb));
  background: black;
  font-family: 'JetBrains Mono', monospace;
}

.glitch {
  position: relative;
  color: #00ff41;
  text-shadow: 0.05em 0 0 #00ffff, -0.05em -0.025em 0 #ff00ff;
  animation: glitch 1s infinite linear alternate-reverse;
}

@keyframes glitch {
  0% { text-shadow: 0.05em 0 0 #00ffff, -0.05em -0.025em 0 #ff00ff; }
  14% { text-shadow: 0.05em 0 0 #00ffff, -0.05em -0.025em 0 #ff00ff; }
  15% { text-shadow: -0.05em -0.025em 0 #00ffff, 0.025em 0.025em 0 #ff00ff; }
  49% { text-shadow: -0.05em -0.025em 0 #00ffff, 0.025em 0.025em 0 #ff00ff; }
  50% { text-shadow: 0.025em 0.05em 0 #00ffff, 0.05em 0 0 #ff00ff; }
  99% { text-shadow: 0.025em 0.05em 0 #00ffff, 0.05em 0 0 #ff00ff; }
  100% { text-shadow: -0.025em 0 0 #00ffff, -0.025em -0.025em 0 #ff00ff; }
}

.glass-card {
  background: rgba(0, 20, 0, 0.4);
  backdrop-filter: blur(4px);
  border: 1px solid #00ff41;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.2), inset 0 0 10px rgba(0, 255, 65, 0.1);
}

.glass-card-hover:hover {
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.6), inset 0 0 20px rgba(0, 255, 65, 0.3);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

.neon-border {
  border: 1px solid #00ff41;
  box-shadow: 0 0 5px #00ff41;
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #000; }
::-webkit-scrollbar-thumb { background: #00ff41; }
::-webkit-scrollbar-thumb:hover { background: #00ffff; }
""")

write_file("app/layout.tsx", """
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AICDA API CTF",
  description: "API Security Training Lab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-matrix-green min-h-screen">
        {children}
      </body>
    </html>
  );
}
""")

write_file("components/MatrixRain.tsx", """
'use client';
import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-40 pointer-events-none"
    />
  );
}
""")

write_file("app/page.tsx", """
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
""")

write_file("components/ProgressBar.tsx", """
'use client';
import { motion } from 'framer-motion';

export default function ProgressBar({ solvedCount, total }: { solvedCount: number, total: number }) {
  const percentage = (solvedCount / total) * 100;
  
  return (
    <div className="w-full my-6">
      <div className="flex justify-between text-sm mb-2 text-matrix-light">
        <span>PROGRESS</span>
        <span>{solvedCount} / {total} SYSTEMS COMPROMISED</span>
      </div>
      <div className="h-4 bg-gray-900 border border-matrix-green/50 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-matrix-green neon-border"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}
""")

write_file("components/LabCard.tsx", """
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface LabCardProps {
  level: number;
  title: string;
  category: string;
  points: number;
  slug: string;
  solved: boolean;
}

export default function LabCard({ level, title, category, points, slug, solved }: LabCardProps) {
  return (
    <Link href={`/labs/${slug}`}>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className={`glass-card p-6 h-full flex flex-col justify-between cursor-pointer transition-all duration-300 ${solved ? 'border-matrix-light bg-matrix-green/10' : ''}`}
      >
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm text-matrix-light">LEVEL {level}</span>
            <span className={`px-2 py-1 text-xs font-bold ${solved ? 'bg-matrix-green text-black' : 'border border-matrix-green text-matrix-green'}`}>
              {solved ? '✅ PWNED' : '⚡ ACTIVE'}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
          <p className="text-sm text-gray-400 mb-4">{category}</p>
        </div>
        
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-matrix-green/30">
          <span className="text-matrix-green font-mono">{points} PTS</span>
          <span className="text-xs hover:underline">ACCESS TERMINAL →</span>
        </div>
      </motion.div>
    </Link>
  );
}
""")

write_file("components/FlagSubmitModal.tsx", """
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
""")

write_file("app/labs/page.tsx", """
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MatrixRain from '../../components/MatrixRain';
import LabCard from '../../components/LabCard';
import ProgressBar from '../../components/ProgressBar';
import FlagSubmitModal from '../../components/FlagSubmitModal';

const CHALLENGES = [
  { level: 1, title: 'Debug Leak', category: 'API3+API1', points: 100, slug: 'debug-leak' },
  { level: 2, title: 'User Registration', category: 'API2', points: 100, slug: 'register' },
  { level: 3, title: 'JWT Token', category: 'API2', points: 100, slug: 'jwt-token' },
  { level: 4, title: 'BOLA', category: 'API1', points: 100, slug: 'bola' },
  { level: 5, title: 'Mass Assignment', category: 'API3', points: 100, slug: 'mass-assignment' },
  { level: 6, title: 'BFLA', category: 'API5', points: 100, slug: 'bfla' },
  { level: 7, title: 'Password Reset', category: 'API2', points: 100, slug: 'password-reset' },
  { level: 8, title: 'JWT Forgery', category: 'API2', points: 100, slug: 'jwt-forgery' },
  { level: 9, title: 'SQL Injection', category: 'API8', points: 100, slug: 'sqli' },
  { level: 10, title: 'Rate Limit', category: 'API4', points: 100, slug: 'rate-limit' },
];

export default function LabsDashboard() {
  const router = useRouter();
  const [solved, setSolved] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('ctf_access_token')) {
      router.push('/');
      return;
    }
    setStudentName(localStorage.getItem('ctf_student_name') || 'Agent');
    
    const solvedState: Record<number, boolean> = {};
    for (let i = 1; i <= 10; i++) {
      solvedState[i] = localStorage.getItem(`flag_level_${i}`) === 'true';
    }
    setSolved(solvedState);
  }, [router]);

  const solvedCount = Object.values(solved).filter(Boolean).length;
  const isAllSolved = solvedCount === 10;

  return (
    <div className="min-h-screen relative p-8">
      <MatrixRain />
      
      {isAllSolved && (
        <div className="fixed inset-0 bg-matrix-green/20 backdrop-blur-md z-40 flex items-center justify-center">
          <div className="text-center p-12 glass-card">
            <h1 className="text-6xl font-bold text-white glitch mb-4">🎉 ALL LABS SOLVED!</h1>
            <p className="text-2xl text-matrix-light">Master Hacker: {studentName}</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto z-10 relative">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end border-b border-matrix-green/30 pb-6">
          <div>
            <h1 className="text-4xl font-bold glitch mb-2">AICDA API CTF</h1>
            <p className="text-matrix-light">Welcome to the mainframe, {studentName}</p>
          </div>
          <div className="w-full md:w-1/3 mt-4 md:mt-0">
            <ProgressBar solvedCount={solvedCount} total={10} />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {CHALLENGES.map(c => (
            <LabCard 
              key={c.level}
              {...c}
              solved={!!solved[c.level]}
            />
          ))}
        </div>

        <div className="flex justify-center mb-12">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-12 py-4 text-xl font-bold border-2 border-matrix-light text-matrix-light hover:bg-matrix-light hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,255,0.5)]"
          >
            SUBMIT FLAG
          </button>
        </div>
      </div>

      <FlagSubmitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={(level) => setSolved(prev => ({...prev, [level]: true}))}
      />
    </div>
  );
}
""")

write_file("components/TerminalBlock.tsx", """
'use client';
import { useState } from 'react';

export default function TerminalBlock({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black border border-matrix-green/30 rounded p-4 relative group my-4">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleCopy}
          className="text-xs bg-matrix-green/20 text-matrix-green px-2 py-1 rounded hover:bg-matrix-green hover:text-black"
        >
          {copied ? 'COPIED!' : 'COPY'}
        </button>
      </div>
      <pre className="font-mono text-sm text-gray-300 overflow-x-auto pr-16 whitespace-pre-wrap">
        <span className="text-matrix-light">$</span> {command}
      </pre>
    </div>
  );
}
""")

# Individual lab pages configuration
labs = [
    {
        "slug": "debug-leak",
        "title": "Level 1: Debug Leak",
        "owasp": "API3 + API1",
        "theory": "Developers sometimes forget to disable debugging endpoints or intentionally leave them for convenience. These endpoints can expose sensitive configuration details, full user lists, or even raw credentials without any authentication checks.",
        "steps": "1. Navigate to the API base URL\n2. Try accessing the debug endpoint commonly used in this framework\n3. Inspect the JSON response to find the hidden flag",
        "command": "curl https://aicda-api.fly.dev/api/v1/users/_debug",
        "objective": "Find the exposed debug endpoint and retrieve the flag."
    },
    {
        "slug": "register",
        "title": "Level 2: User Registration",
        "owasp": "API2",
        "theory": "Before exploiting deeper API vulnerabilities, you need to be able to authenticate. Most APIs have a registration endpoint that creates a standard user account.",
        "steps": "1. Send a POST request to the registration endpoint with your details\n2. Ensure the Content-Type header is set to application/json",
        "command": "curl -X POST https://aicda-api.fly.dev/api/v1/register -H 'Content-Type: application/json' -d '{\"username\":\"student\",\"password\":\"pass123\",\"email\":\"student@lab.local\"}'",
        "objective": "Register a new user account. The flag is returned upon successful registration."
    },
    {
        "slug": "jwt-token",
        "title": "Level 3: JWT Token",
        "owasp": "API2",
        "theory": "JSON Web Tokens (JWT) are base64 encoded, not encrypted. This means anyone who intercepts the token can read its payload simply by decoding it. Sensitive information should never be stored in a JWT payload.",
        "steps": "1. Login with the user you created in Level 2\n2. Copy the token from the response\n3. Decode the middle section (payload) of the JWT",
        "command": "curl -X POST https://aicda-api.fly.dev/api/v1/login -H 'Content-Type: application/json' -d '{\"username\":\"student\",\"password\":\"pass123\"}'\n\n# Then decode the payload:\necho <TOKEN> | cut -d. -f2 | base64 -d",
        "objective": "Login to get a JWT, then decode it to find the flag hidden inside."
    },
    {
        "slug": "bola",
        "title": "Level 4: Broken Object Level Authorization (BOLA)",
        "owasp": "API1",
        "theory": "BOLA occurs when an application doesn't verify if the currently authenticated user has permission to access the requested resource. If you can change the ID in the URL to view another user's data, the API is vulnerable to BOLA.",
        "steps": "1. Use your token from Level 3\n2. Request the profile of the 'admin' user instead of your own profile",
        "command": "curl https://aicda-api.fly.dev/api/v1/users/admin -H 'Authorization: Bearer $TOKEN'",
        "objective": "Access the admin user's details using your standard user token."
    },
    {
        "slug": "mass-assignment",
        "title": "Level 5: Mass Assignment",
        "owasp": "API3",
        "theory": "Mass Assignment happens when APIs take data directly from the client request and bind it to internal objects without proper filtering. An attacker can add fields that weren't intended to be modified by the user, such as 'admin: true'.",
        "steps": "1. Register a new user, but inject an additional field indicating you are an admin",
        "command": "curl -X POST https://aicda-api.fly.dev/api/v1/register -H 'Content-Type: application/json' -d '{\"username\":\"evil\",\"password\":\"evil123\",\"email\":\"evil@lab.local\",\"admin\":true}'",
        "objective": "Escalate your privileges to admin upon registration by supplying extra fields."
    },
    {
        "slug": "bfla",
        "title": "Level 6: Broken Function Level Authorization (BFLA)",
        "owasp": "API5",
        "theory": "BFLA happens when complex access control policies fail to separate regular and administrative functions. Regular users can perform actions that should be restricted to administrators.",
        "steps": "1. Use your standard user token\n2. Attempt an administrative action, like deleting a user",
        "command": "curl -X DELETE https://aicda-api.fly.dev/api/v1/users/name1 -H 'Authorization: Bearer $TOKEN'",
        "objective": "Perform an admin-only action using a standard user token."
    },
    {
        "slug": "password-reset",
        "title": "Level 7: Password Reset Takeover",
        "owasp": "API2",
        "theory": "If a password reset or change endpoint doesn't properly verify the old password or properly map the reset token to the correct user, an attacker might be able to change someone else's password.",
        "steps": "1. Exploit the password change endpoint to overwrite the admin's password\n2. Login as admin with the new password",
        "command": "curl -X PUT https://aicda-api.fly.dev/api/v1/users/admin/password -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{\"new_password\":\"hacked\"}'\n\ncurl -X POST https://aicda-api.fly.dev/api/v1/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":\"hacked\"}'",
        "objective": "Reset the administrator's password and log into their account."
    },
    {
        "slug": "jwt-forgery",
        "title": "Level 8: JWT Forgery",
        "owasp": "API2",
        "theory": "If a JWT signing secret is weak, attackers can crack it offline. Once cracked, they can forge valid tokens for any user, including admins, bypassing authentication entirely.",
        "steps": "1. Find the weak secret (often exposed in debug endpoints or source code)\n2. Use a script to sign a new JWT claiming you are an admin",
        "command": "# Use python or jwt.io to create a token with the secret 'secret123'\n# Header: {\"alg\": \"HS256\", \"typ\": \"JWT\"}\n# Payload: {\"user\": \"admin\", \"admin\": true}\n\ncurl https://aicda-api.fly.dev/api/v1/admin/flag -H 'Authorization: Bearer $FORGED_TOKEN'",
        "objective": "Forge a JWT token using a weak secret to masquerade as the administrator."
    },
    {
        "slug": "sqli",
        "title": "Level 9: SQL Injection",
        "owasp": "API8",
        "theory": "SQL Injection in APIs occurs when user input is concatenated directly into database queries. Attackers can manipulate the input to alter the logic of the SQL statement.",
        "steps": "1. Inject SQL payload into the URL parameter\n2. Use the payload ' OR '1'='1 to bypass the query logic",
        "command": "curl \"https://aicda-api.fly.dev/api/v1/users/admin'%20OR%20'1'='1\" -H 'Authorization: Bearer $TOKEN'",
        "objective": "Exploit SQL injection in the user lookup endpoint."
    },
    {
        "slug": "rate-limit",
        "title": "Level 10: Rate Limit",
        "owasp": "API4",
        "theory": "Without proper rate limiting, APIs are susceptible to brute-force attacks, credential stuffing, or Denial of Service (DoS).",
        "steps": "1. Write a script to send requests rapidly\n2. Once the threshold is exceeded, the flag might be revealed in an error message or rate limit header",
        "command": "for i in $(seq 1 100); do curl -s https://aicda-api.fly.dev/api/v1/users -H 'Authorization: Bearer $TOKEN' > /dev/null; done\n\n# Check headers of the last request for the flag\ncurl -I https://aicda-api.fly.dev/api/v1/users",
        "objective": "Overwhelm the API to prove lack of rate limiting and trigger the flag release."
    }
]

lab_page_template = """
'use client';
import { useState } from 'react';
import Link from 'next/link';
import MatrixRain from '../../../components/MatrixRain';
import TerminalBlock from '../../../components/TerminalBlock';

export default function LabPage() {
  const [activeTab, setActiveTab] = useState<'theory' | 'steps' | 'objective'>('theory');

  return (
    <div className="min-h-screen relative p-8">
      <MatrixRain />
      
      <div className="max-w-4xl mx-auto z-10 relative">
        <Link href="/labs" className="text-matrix-green hover:text-white mb-8 inline-block">
          ← RETURN TO DASHBOARD
        </Link>
        
        <div className="glass-card p-8 mb-8">
          <div className="flex justify-between items-start mb-6 border-b border-matrix-green/30 pb-4">
            <div>
              <span className="text-sm text-matrix-light mb-2 block">OWASP: {owasp}</span>
              <h1 className="text-3xl font-bold glitch">{title}</h1>
            </div>
          </div>
          
          <div className="flex border-b border-matrix-green/30 mb-6">
            <button 
              className={`px-4 py-2 ${activeTab === 'theory' ? 'text-black bg-matrix-green font-bold' : 'text-matrix-green hover:bg-matrix-green/20'}`}
              onClick={() => setActiveTab('theory')}
            >
              📖 THEORY
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'steps' ? 'text-black bg-matrix-green font-bold' : 'text-matrix-green hover:bg-matrix-green/20'}`}
              onClick={() => setActiveTab('steps')}
            >
              💻 STEPS
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'objective' ? 'text-black bg-matrix-green font-bold' : 'text-matrix-green hover:bg-matrix-green/20'}`}
              onClick={() => setActiveTab('objective')}
            >
              🎯 OBJECTIVE
            </button>
          </div>
          
          <div className="min-h-[200px] text-gray-300">
            {activeTab === 'theory' && (
              <div className="space-y-4">
                <p className="leading-relaxed">{theory}</p>
              </div>
            )}
            
            {activeTab === 'steps' && (
              <div className="space-y-6">
                <div className="whitespace-pre-line leading-relaxed mb-4">
                  {steps}
                </div>
                <div className="bg-black/50 p-4 border-l-2 border-matrix-light">
                  <p className="text-sm text-matrix-light mb-2">TARGET API: https://aicda-api.fly.dev</p>
                  <TerminalBlock command={`{command}`} />
                </div>
              </div>
            )}
            
            {activeTab === 'objective' && (
              <div className="space-y-4">
                <p className="leading-relaxed bg-matrix-green/10 p-4 border border-matrix-green/30">
                  {objective}
                </p>
                <p className="text-sm text-matrix-light mt-4">
                  Flag Format: <span className="font-mono">flag{'{'}...{'}'}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"""

for lab in labs:
    content = lab_page_template.replace("{title}", lab["title"])
    content = content.replace("{owasp}", lab["owasp"])
    content = content.replace("{theory}", lab["theory"])
    content = content.replace("{steps}", lab["steps"])
    content = content.replace("{command}", lab["command"])
    content = content.replace("{objective}", lab["objective"])
    write_file(f"app/labs/{lab['slug']}/page.tsx", content)


write_file("app/api/auth/route.ts", """
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code, studentName } = await request.json();
    
    if (code === 'AICDAAPICTF' && studentName) {
      return NextResponse.json({ 
        valid: true, 
        token: Buffer.from(`${studentName}-auth-token-${Date.now()}`).toString('base64') 
      });
    }
    
    return NextResponse.json({ valid: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
""")

write_file("app/api/flags/route.ts", """
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FLAGS: Record<number, string> = {
  1: 'flag{d3bug_3ndp0int_3xp0s3d}',
  2: 'flag{us3r_r3gist3r3d_succ3ss}',
  3: 'flag{jwt_p4yl04d_d3c0d3d}',
  4: 'flag{b0la_adm1n_d4ta_l3ak3d}',
  5: 'flag{m4ss_4ss1gnm3nt_pr1v_3sc}',
  6: 'flag{bfl4_d3l3te_w1th0ut_r0l3}',
  7: 'flag{p4ssw0rd_r3s3t_t4k30v3r}',
  8: 'flag{jwt_f0rg3d_w34k_s3cr3t}',
  9: 'flag{sql1_byp4ss_qu3ry_1nj3ct}',
  10: 'flag{r4t3_l1m1t_n0n_3x1st3nt}',
};

// Extremely simple file-based DB for mock purposes
const DB_FILE = path.join(process.cwd(), 'submissions.json');

function saveSubmission(studentId: string, level: number) {
  try {
    let data: any = {};
    if (fs.existsSync(DB_FILE)) {
      data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
    if (!data[studentId]) {
      data[studentId] = { flags: [], timestamp: new Date().toISOString() };
    }
    if (!data[studentId].flags.includes(level)) {
      data[studentId].flags.push(level);
      data[studentId].lastUpdate = new Date().toISOString();
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Failed to save submission");
  }
}

export async function POST(request: Request) {
  try {
    const { flag, level, studentId } = await request.json();
    
    if (FLAGS[level] === flag) {
      if (studentId) saveSubmission(studentId, level);
      return NextResponse.json({ 
        correct: true, 
        level, 
        message: 'FLAG ACCEPTED. SYSTEM COMPROMISED.' 
      });
    }
    
    return NextResponse.json({ 
      correct: false, 
      message: 'ACCESS DENIED. INVALID FLAG.' 
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
""")

write_file("app/api/admin/students/route.ts", """
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'submissions.json');

export async function GET() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return NextResponse.json({ students: [] });
    }
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    const students = Object.keys(data).map(id => ({
      id,
      flagsSolved: data[id].flags.length,
      flagsList: data[id].flags,
      lastActive: data[id].lastUpdate || data[id].timestamp
    }));
    return NextResponse.json({ students });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
""")

write_file("app/admin/aicda/page.tsx", """
'use client';
import { useState, useEffect } from 'react';
import MatrixRain from '../../../components/MatrixRain';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (auth) {
      fetch('/api/admin/students')
        .then(res => res.json())
        .then(data => setStudents(data.students || []));
    }
  }, [auth]);

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center relative p-8">
        <MatrixRain />
        <div className="z-10 glass-card p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-red-500">ADMIN SECURE LOGIN</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (password === 'AICDAadmin') setAuth(true);
          }}>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full bg-black border border-red-500 p-2 mb-4 text-red-500"
            />
            <button type="submit" className="w-full bg-red-900 text-white p-2">ACCESS</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative p-8 bg-black">
      <MatrixRain />
      <div className="max-w-6xl mx-auto z-10 relative">
        <h1 className="text-4xl font-bold mb-8 text-matrix-light glitch">COMMAND CENTER</h1>
        
        <div className="glass-card p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-matrix-green">
                <th className="p-4 text-matrix-light">OPERATIVE ID</th>
                <th className="p-4 text-matrix-light">LAST ACTIVE</th>
                <th className="p-4 text-matrix-light">PROGRESS</th>
                <th className="p-4 text-matrix-light">FLAGS SOLVED</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-b border-matrix-green/30 hover:bg-matrix-green/10">
                  <td className="p-4 font-mono">{s.id}</td>
                  <td className="p-4 font-mono text-sm">{new Date(s.lastActive).toLocaleString()}</td>
                  <td className="p-4">
                    <div className="w-full bg-gray-900 h-2">
                      <div className="bg-matrix-green h-2" style={{ width: `${(s.flagsSolved / 10) * 100}%` }}></div>
                    </div>
                    <span className="text-xs">{s.flagsSolved} / 10</span>
                  </td>
                  <td className="p-4 font-mono text-xs">{s.flagsList.sort((a:any,b:any)=>a-b).join(', ')}</td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">NO DATA FOUND IN MAINFRAME</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
""")
