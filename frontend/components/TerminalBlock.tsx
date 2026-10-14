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
