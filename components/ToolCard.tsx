'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ToolCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  onClick: () => void;
}

export function ToolCard({ title, icon, description, onClick }: ToolCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-900/40 transition hover:-translate-y-1 hover:shadow-xl"
      onClick={onClick}
    >
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-100">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
    </motion.div>
  );
}
