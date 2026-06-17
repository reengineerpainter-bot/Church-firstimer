import { motion } from 'motion/react';
import { Users, AlertCircle, CheckCircle, Percent } from 'lucide-react';
import { TempleRecord } from '../types';

interface StatsGridProps {
  records: TempleRecord[];
}

export default function StatsGrid({ records }: StatsGridProps) {
  const totalEntries = records.length;
  
  const pendingCount = records.filter(r => r.status === 'Pending Follow-up' || r.status === 'In Progress').length;
  const completedCount = records.filter(r => r.status === 'Completed & Closed').length;
  const completionRate = totalEntries > 0 ? Math.round((completedCount / totalEntries) * 100) : 0;

  const stats = [
    {
      id: "stat-total-entries",
      title: "Total Records",
      value: totalEntries,
      description: "Registered follow-up rows",
      icon: Users
    },
    {
      id: "stat-pending-followups",
      title: "Active Follow-ups",
      value: pendingCount,
      description: "Pending or in progress status",
      icon: AlertCircle
    },
    {
      id: "stat-completed-followups",
      title: "Completed & Closed",
      value: completedCount,
      description: "Successfully addressed cases",
      icon: CheckCircle
    },
    {
      id: "stat-completion-rate",
      title: "Completion Rate",
      value: `${completionRate}%`,
      description: "Ratio of closed followups",
      icon: Percent
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.id}
            id={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="p-5 bg-white border border-ink-dark/15 rounded-none hover:border-ink-dark/40 transition-colors duration-250 flex flex-col justify-between relative"
          >
            <div className="flex items-start justify-between">
              <span className="text-stone-500 text-[10px] font-bold tracking-widest font-sans uppercase">
                {stat.title}
              </span>
              <span className="text-ink-dark/30">
                <Icon size={14} className="stroke-[1.5]" />
              </span>
            </div>

            <div className="mt-4">
              <span className="text-3xl font-serif font-light text-ink-dark tracking-tight block">
                {stat.value}
              </span>
              <span className="text-stone-400 text-[10px] font-sans uppercase tracking-wider block mt-1">
                {stat.description}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
