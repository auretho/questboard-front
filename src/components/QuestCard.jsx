import React from 'react';
import { Award, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const difficultyStyles = {
  EASY: { label: 'Facile', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  MEDIUM: { label: 'Moyen', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  HARD: { label: 'Difficile', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

export default function QuestCard({ quest, onMove }) {
  const badge = difficultyStyles[quest.difficulty] || difficultyStyles.EASY;

  return (
    <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-4 flex flex-col gap-3 shadow-lg hover:border-slate-600 transition-all">
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-semibold text-slate-100 text-sm">{quest.title}</h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      <p className="text-xs text-slate-400 line-clamp-2">{quest.description}</p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-700/40 text-xs">
        <span className="flex items-center gap-1 font-bold text-indigo-400">
          <Award className="w-3.5 h-3.5" /> +{quest.xp} XP
        </span>

        {/* Boutons pour déplacer la carte sans drag-and-drop pour le moment */}
        <div className="flex items-center gap-1">
          {quest.status !== 'TODO' && (
            <button
              onClick={() => onMove(quest.id, quest.status === 'DONE' ? 'IN_PROGRESS' : 'TODO')}
              className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded"
              title="Reculer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          {quest.status !== 'DONE' && (
            <button
              onClick={() => onMove(quest.id, quest.status === 'TODO' ? 'IN_PROGRESS' : 'DONE')}
              className="p-1 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 rounded"
              title="Avancer"
            >
              {quest.status === 'IN_PROGRESS' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}