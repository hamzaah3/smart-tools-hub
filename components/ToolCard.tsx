'use client';

import { motion } from 'framer-motion';

interface ToolCardProps {
  title: string;
  icon: string;
  description: string;
  onClick: () => void;
}

export function ToolCard({ title, icon, description, onClick }: ToolCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-shadow hover:-translate-y-1 hover:shadow-xl"
      onClick={onClick}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </motion.div>
  );
}
