import React, { useState } from 'react';
import { X, PlusCircle, Award } from 'lucide-react';

const difficultyMap = {
  EASY: { label: 'Facile', xp: 10 },
  MEDIUM: { label: 'Moyen', xp: 25 },
  HARD: { label: 'Difficile', xp: 50 },
};

export default function NewQuestModal({ isOpen, onClose, onAddQuest }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newQuest = {
      id: Date.now().toString(),
      title,
      description,
      status: 'TODO',
      difficulty,
      xp: difficultyMap[difficulty].xp,
    };

    onAddQuest(newQuest);
    setTitle('');
    setDescription('');
    setDifficulty('MEDIUM');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-5">
        
        {/* Header de la modale */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600/20 text-indigo-400 p-2 rounded-lg">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-100">Créer une nouvelle quête</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Titre de la quête
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Configurer Spring Security..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails de la tâche..."
              rows="3"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Difficulté & Récompense
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(difficultyMap).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDifficulty(key)}
                  className={`border rounded-xl p-2.5 flex flex-col items-center gap-1 transition-all text-xs font-medium ${
                    difficulty === key
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span>{val.label}</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <Award className="w-3 h-3" /> +{val.xp} XP
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
            >
              Créer la quête
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}