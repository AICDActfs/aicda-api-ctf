'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProgressBar from '../../components/ProgressBar';
import LabCard from '../../components/LabCard';
import FlagSubmitModal from '../../components/FlagSubmitModal';

const LABS = [
  { id: 1, slug: 'debug-leak', title: 'Debug Endpoint Leak', owasp: 'API3: Excessive Data Exposure', points: 100 },
  { id: 2, slug: 'register', title: 'User Registration Flow', owasp: 'API2: Broken Authentication', points: 100 },
  { id: 3, slug: 'jwt-token', title: 'JWT Token Capture', owasp: 'API2: Broken Authentication', points: 100 },
  { id: 4, slug: 'bola', title: 'BOLA (Broken Object Level Auth)', owasp: 'API1: BOLA', points: 100 },
  { id: 5, slug: 'mass-assignment', title: 'Mass Assignment Privilege Escalation', owasp: 'API3: Broken Object Property Level Auth', points: 100 },
  { id: 6, slug: 'bfla', title: 'BFLA (Broken Function Level Auth)', owasp: 'API5: BFLA', points: 100 },
  { id: 7, slug: 'password-reset', title: 'Password Reset Takeover', owasp: 'API2: Broken Authentication', points: 100 },
  { id: 8, slug: 'jwt-forgery', title: 'JWT Forgery (Weak Secret)', owasp: 'API2: Broken Authentication', points: 100 },
  { id: 9, slug: 'sqli', title: 'SQL Injection in Path', owasp: 'API8: Security Misconfiguration', points: 100 },
  { id: 10, slug: 'rate-limit', title: 'Resource Consumption (Rate Limit)', owasp: 'API4: Unrestricted Resource Consumption', points: 100 },
];

export default function LabsPage() {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const [solvedFlags, setSolvedFlags] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ctf_access_token');
    if (!token) {
      router.push('/');
      return;
    }
    const name = localStorage.getItem('ctf_student_name') || 'Operative';
    setStudentName(name);

    const solved: number[] = [];
    for (let i = 1; i <= 10; i++) {
      if (localStorage.getItem(`flag_level_${i}`)) {
        solved.push(i);
      }
    }
    setSolvedFlags(solved);
  }, [router]);

  const handleFlagSuccess = (level: number) => {
    if (!solvedFlags.includes(level)) {
      const updated = [...solvedFlags, level];
      setSolvedFlags(updated);
      localStorage.setItem(`flag_level_${level}`, 'true');
    }
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all solved flags for this session?')) {
      for (let i = 1; i <= 10; i++) {
        localStorage.removeItem(`flag_level_${i}`);
      }
      setSolvedFlags([]);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const allSolved = solvedFlags.length === 10;

  return (
    <div className="min-h-screen bg-black text-[#00ff41] font-mono px-4 py-6 sm:px-8 sm:py-10">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top User Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#00ff4133] pb-4 gap-3">
          <div>
            <span className="text-[11px] text-[#00ffff88] uppercase tracking-wider block">CURRENT SESSION</span>
            <span className="text-sm sm:text-base font-bold text-white tracking-widest">{studentName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetProgress}
              className="px-3 py-1.5 text-xs border border-[#ff005555] text-[#ff0055] hover:bg-[#ff005522] rounded transition-colors"
            >
              RESET FLAGS
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs border border-[#00ff4155] text-gray-400 hover:text-white hover:bg-[#00ff4122] rounded transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="border border-[#00ff4133] bg-[#050505] p-4 sm:p-6 rounded-lg shadow-[0_0_20px_#00ff4115]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-bold text-[#00ffff] uppercase tracking-wider">
              OPERATIONAL PROGRESS ({solvedFlags.length}/10)
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#00ff41]">
              {solvedFlags.length * 100} / 1000 PTS
            </span>
          </div>
          <ProgressBar solvedCount={solvedFlags.length} total={10} />
        </div>

        {/* All Solved Banner (with dismissible view so you can still browse labs) */}
        {allSolved && (
          <div className="border-2 border-[#00ff41] bg-[#00220a] p-6 rounded-lg text-center shadow-[0_0_35px_#00ff4144] animate-pulse">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#00ff41] tracking-widest">
              🎉 ALL MISSION MODULES COMPROMISED!
            </h2>
            <p className="text-xs sm:text-sm text-[#00ffff] mt-1">
              Outstanding work, Operative. All 10 challenge flags verified.
            </p>
            <button
              onClick={handleResetProgress}
              className="mt-4 px-4 py-2 bg-[#ff0055] text-white font-bold text-xs rounded hover:bg-red-600 transition-colors"
            >
              RESET LABS TO PRACTICE AGAIN
            </button>
          </div>
        )}

        {/* Challenge Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LABS.map((lab) => {
            const isSolved = solvedFlags.includes(lab.id);
            return (
              <LabCard
                key={lab.id}
                level={lab.id}
                slug={lab.slug}
                title={lab.title}
                owasp={lab.owasp}
                points={lab.points}
                isSolved={isSolved}
              />
            );
          })}
        </div>

        {/* Bottom Submit Button */}
        <div className="sticky bottom-4 pt-2 flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#00ff41] text-black font-extrabold text-sm tracking-widest uppercase rounded shadow-[0_0_25px_#00ff4166] hover:bg-[#00ffff] hover:shadow-[0_0_30px_#00ffff88] transition-all transform active:scale-95"
          >
            🚩 SUBMIT FLAG
          </button>
        </div>

      </div>

      <FlagSubmitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleFlagSuccess}
      />
    </div>
  );
}
