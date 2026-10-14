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
