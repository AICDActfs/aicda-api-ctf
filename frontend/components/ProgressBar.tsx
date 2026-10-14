'use client';
import React from 'react';

export default function ProgressBar(props: any) {
  const count = props.solvedCount ?? props.current ?? 0;
  const total = props.total ?? 10;
  const percentage = Math.min(100, Math.round((count / total) * 100));

  return (
    <div className="w-full bg-[#111111] border border-[#00ff4144] rounded-full h-3 sm:h-4 overflow-hidden p-0.5 shadow-[inset_0_0_10px_#000000]">
      <div
        className="bg-gradient-to-r from-[#00ff41] via-[#00ffff] to-[#00ff41] h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_#00ff41]"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
