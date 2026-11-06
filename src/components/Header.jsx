import React from 'react';
import { Trophy, Shield, Zap } from 'lucide-react';

export default function Header({ user }) {
  const percentage = Math.round((user.currentXp / user.xpToNextLevel) * 100);

  return (
    <header className="bg-slate-900 border-b border-slate-800 p-4 text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Titre */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              QuestBoard
            </h1>
            <p className="text-xs text-slate-400">Tableau de bord de quêtes</p>
          </div>
        </div>

        {/* Profil Joueur & Barre d'XP */}
        <div className="flex items-center gap-6 bg-slate-800/60 border border-slate-700/50 px-4 py-2 rounded-xl w-full md:w-auto">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500/20 text-amber-400 p-2 rounded-full border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase font-semibold">Niveau</span>
              <span className="text-lg font-bold text-amber-400">Niv. {user.level}</span>
            </div>
          </div>

          <div className="flex-1 md:w-48">
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span className="text-slate-300 flex items-center gap-1">
                <Zap className="w-3 h-3 text-indigo-400" /> XP
              </span>
              <span className="text-slate-400">{user.currentXp} / {user.xpToNextLevel}</span>
            </div>
            {/* Barre de progression */}
            <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}