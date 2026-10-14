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
