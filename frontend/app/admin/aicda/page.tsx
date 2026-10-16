'use client';
import { useState, useEffect } from 'react';

interface Student {
  name: string;
  solvedCount: number;
  solvedFlags: number[];
  lastActive: string;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('aicda_admin_auth') === 'true') {
      setAuthed(true);
    }
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      
      // Sort: Highest solved count first; if tied, earliest lastActive timestamp first
      const sorted = (data.students || []).sort((a: Student, b: Student) => {
        if (b.solvedCount !== a.solvedCount) {
          return b.solvedCount - a.solvedCount;
        }
        return new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
      });

      setStudents(sorted);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) {
      fetchStudents();
      const interval = setInterval(fetchStudents, 4000);
      return () => clearInterval(interval);
    }
  }, [authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'AICDAadmin') {
      sessionStorage.setItem('aicda_admin_auth', 'true');
      setAuthed(true);
      setErr('');
    } else {
      setErr('ACCESS DENIED: Invalid Admin Password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('aicda_admin_auth');
    setAuthed(false);
    setPass('');
  };

  const exportCSV = () => {
    const headers = 'Rank,Operative Name,Solved Count,Score (PTS),Solved Levels,Completion Timestamp\n';
    const rows = students.map((s, index) => 
      `"${index + 1}","${s.name}","${s.solvedCount}/10","${s.solvedCount * 100}","${s.solvedFlags.join(';') || 'None'}","${s.lastActive || 'N/A'}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aicda_ctf_leaderboard_${Date.now()}.csv`;
    a.click();
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-black text-[#00ff41] flex items-center justify-center p-4 font-mono">
        <div className="max-w-md w-full border border-[#00ff41] p-8 bg-[#050505] shadow-[0_0_30px_#00ff4133] rounded">
          <h1 className="text-xl font-bold text-center tracking-widest text-[#00ff41] mb-2">
            AICDA ADMIN PORTAL
          </h1>
          <p className="text-xs text-center text-[#00ffff88] mb-6 tracking-wider">
            RESTRICTED ACCESS // INSTRUCTORS ONLY
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-[#00ff41aa] block mb-1">PASSWORD:</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full bg-black border border-[#00ff4155] focus:border-[#00ff41] text-[#00ff41] px-4 py-2 outline-none text-sm"
              />
            </div>
            {err && <p className="text-xs text-red-500 font-bold">{err}</p>}
            <button
              type="submit"
              className="w-full bg-[#00ff41] text-black font-bold py-2 tracking-widest hover:bg-[#00ffff] transition-colors text-sm"
            >
              AUTHENTICATE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#00ff41] font-mono p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#00ff4133] pb-4 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#00ff41] tracking-wider">
              AICDA LIVE COMMAND CENTER & LEADERBOARD
            </h1>
            <p className="text-xs text-[#00ffff88] mt-1">
              Real-Time Operative Rankings & Submissions (Auto-refreshes every 4s)
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={fetchStudents}
              className="px-3 sm:px-4 py-2 border border-[#00ff41] text-xs hover:bg-[#00ff4122]"
            >
              {loading ? 'SYNCING...' : 'REFRESH'}
            </button>
            <button
              onClick={exportCSV}
              className="px-3 sm:px-4 py-2 bg-[#00ff41] text-black font-bold text-xs hover:bg-[#00ffff]"
            >
              EXPORT CSV
            </button>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 border border-red-500 text-red-400 text-xs hover:bg-red-500/20"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-[#00ff4155] bg-[#050505] p-4 rounded">
            <span className="text-xs text-[#00ffff88]">TOTAL STUDENTS</span>
            <p className="text-3xl font-bold text-[#00ff41] mt-1">{students.length}</p>
          </div>
          <div className="border border-[#00ff4155] bg-[#050505] p-4 rounded">
            <span className="text-xs text-[#00ffff88]">TOTAL SOLVES</span>
            <p className="text-3xl font-bold text-[#00ffff] mt-1">
              {students.reduce((acc, curr) => acc + curr.solvedCount, 0)}
            </p>
          </div>
          <div className="border border-[#00ff4155] bg-[#050505] p-4 rounded">
            <span className="text-xs text-[#00ffff88]">ALL LABS COMPLETED (10/10)</span>
            <p className="text-3xl font-bold text-[#ff0055] mt-1">
              {students.filter(s => s.solvedCount === 10).length}
            </p>
          </div>
        </div>

        {/* Ranked Leaderboard Table */}
        <div className="border border-[#00ff4155] bg-[#050505] rounded overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#00ff4133] bg-[#0a1a0a] text-[#00ffff]">
                <th className="p-3 w-16 text-center">RANK</th>
                <th className="p-3">OPERATIVE NAME</th>
                <th className="p-3">SCORE</th>
                <th className="p-3">PROGRESS</th>
                <th className="p-3">SOLVED LEVELS</th>
                <th className="p-3">LAST SOLVED TIME</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No student submissions recorded yet. Submissions appear live as flags are turned in.
                  </td>
                </tr>
              ) : (
                students.map((st, i) => (
                  <tr key={i} className={`border-b border-[#00ff4122] hover:bg-[#00ff410d] ${i === 0 ? 'bg-[#00ff4108]' : ''}`}>
                    <td className="p-3 text-center font-bold">
                      {i === 0 && <span className="text-yellow-400 text-sm">🥇 #1</span>}
                      {i === 1 && <span className="text-gray-300 text-sm">🥈 #2</span>}
                      {i === 2 && <span className="text-amber-600 text-sm">🥉 #3</span>}
                      {i > 2 && <span className="text-gray-500 font-mono">#{i + 1}</span>}
                    </td>
                    <td className="p-3 font-bold text-white text-sm">{st.name}</td>
                    <td className="p-3 font-bold text-[#00ffff]">{st.solvedCount * 100} PTS</td>
                    <td className="p-3">
                      <span className="font-bold text-[#00ff41]">{st.solvedCount}/10</span>
                      <div className="w-24 bg-gray-800 h-1.5 mt-1 rounded overflow-hidden">
                        <div 
                          className="bg-[#00ff41] h-full" 
                          style={{ width: `${(st.solvedCount / 10) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(lvl => (
                          <span
                            key={lvl}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              st.solvedFlags.includes(lvl)
                                ? 'bg-[#00ff41] text-black font-extrabold'
                                : 'bg-[#1a1a1a] text-gray-600'
                            }`}
                          >
                            L{lvl}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-gray-400">
                      {st.lastActive ? new Date(st.lastActive).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
