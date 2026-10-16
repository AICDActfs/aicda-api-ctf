'use client';
import Link from 'next/link';

interface LabCardProps {
  level: number;
  slug: string;
  title: string;
  owasp: string;
  points: number;
  isSolved: boolean;
}

export default function LabCard({ level, slug, title, owasp, points, isSolved }: LabCardProps) {
  return (
    <div
      className={`border rounded-lg p-5 font-mono flex flex-col justify-between transition-all duration-300 ${
        isSolved
          ? 'border-[#00ff41] bg-[#001a05] shadow-[0_0_20px_#00ff4133]'
          : 'border-[#00ff4133] bg-[#050505] hover:border-[#00ff4188]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#00ffff88] tracking-widest">
            LEVEL {level}
          </span>
          {isSolved ? (
            <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-[#00ff41] text-black shadow-[0_0_10px_#00ff41]">
              ✓ PWNED
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-[#ffaa0055] text-[#ffaa00] bg-[#ffaa0011]">
              ⚡ ACTIVE
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-white mb-2 leading-snug">
          {title}
        </h3>

        <p className="text-[11px] text-gray-400 mb-4 line-clamp-1">
          {owasp}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-[#00ff4122] pt-3 mt-2">
        <span className={`text-xs font-bold ${isSolved ? 'text-[#00ff41]' : 'text-[#00ffff]'}`}>
          {points} PTS
        </span>
        <Link
          href={`/labs/${slug}`}
          className={`text-xs flex items-center gap-1 transition-colors ${
            isSolved ? 'text-gray-400 hover:text-white' : 'text-[#00ff41] hover:text-[#00ffff]'
          }`}
        >
          {isSolved ? 'REVIEW LAB →' : 'ACCESS TERMINAL →'}
        </Link>
      </div>
    </div>
  );
}
