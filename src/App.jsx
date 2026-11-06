import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Header from './components/Header';
import QuestCard from './components/QuestCard';
import NewQuestModal from './components/NewQuestModal';
import { Plus } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

const columns = [
  { id: 'TODO', title: 'À faire', color: 'border-slate-700' },
  { id: 'IN_PROGRESS', title: 'En cours', color: 'border-indigo-500/50' },
  { id: 'DONE', title: 'Terminé', color: 'border-emerald-500/50' },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [quests, setQuests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Charger les données de l'API au démarrage
  useEffect(() => {
    fetch(`${API_URL}/user`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Erreur chargement user:", err));

    fetch(`${API_URL}/quests`)
      .then((res) => res.json())
      .then((data) => setQuests(data))
      .catch((err) => console.error("Erreur chargement quests:", err));
  }, []);

  // Synchroniser l'utilisateur avec l'API
  const updateUserOnApi = (updatedUser) => {
    fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    }).catch((err) => console.error("Erreur maj user:", err));
  };

  const updateQuestStatusOnApi = (questId, newStatus) => {
    fetch(`${API_URL}/quests/${questId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    }).catch((err) => console.error("Erreur maj quête:", err));
  };

  // Gestion du Drag-and-Drop
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const oldStatus = source.droppableId;
    const newStatus = destination.droppableId;

    const targetQuest = quests.find((q) => q.id.toString() === draggableId);
    if (!targetQuest) return;

    // Gestion de l'XP
    if (oldStatus !== 'DONE' && newStatus === 'DONE') {
      updateUserXp(targetQuest.xp);
    } else if (oldStatus === 'DONE' && newStatus !== 'DONE') {
      updateUserXp(-targetQuest.xp);
    }

    // Mise à jour visuelle et en BDD
    setQuests((prevQuests) =>
      prevQuests.map((q) =>
        q.id.toString() === draggableId ? { ...q, status: newStatus } : q
      )
    );

    updateQuestStatusOnApi(draggableId, newStatus);
  };

  const handleMoveQuest = (questId, newStatus) => {
    const targetQuest = quests.find((q) => q.id === questId);
    if (!targetQuest || targetQuest.status === newStatus) return;

    const oldStatus = targetQuest.status;

    if (oldStatus !== 'DONE' && newStatus === 'DONE') {
      updateUserXp(targetQuest.xp);
    } else if (oldStatus === 'DONE' && newStatus !== 'DONE') {
      updateUserXp(-targetQuest.xp);
    }

    setQuests((prevQuests) =>
      prevQuests.map((q) =>
        q.id === questId ? { ...q, status: newStatus } : q
      )
    );

    updateQuestStatusOnApi(questId, newStatus);
  };

  const handleAddQuest = (newQuestData) => {
    // On retire l'id temporaire basé sur le timestamp pour laisser Spring Boot générer l'ID auto-incrémenté
    const { id, ...questPayload } = newQuestData;

    fetch(`${API_URL}/quests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questPayload),
    })
      .then((res) => res.json())
      .then((savedQuest) => {
        setQuests((prev) => [savedQuest, ...prev]);
      })
      .catch((err) => console.error("Erreur création quête:", err));
  };

  const updateUserXp = (amount) => {
    setUser((prevUser) => {
      let newXp = prevUser.currentXp + amount;
      let newLevel = prevUser.level;
      let nextLevelXp = prevUser.xpToNextLevel;

      if (newXp >= nextLevelXp) {
        newLevel += 1;
        newXp -= nextLevelXp;
        nextLevelXp = Math.round(nextLevelXp * 1.5);
      } else if (newXp < 0 && newLevel > 1) {
        newLevel -= 1;
        nextLevelXp = Math.round(nextLevelXp / 1.5);
        newXp = Math.max(0, nextLevelXp + newXp);
      } else if (newXp < 0) {
        newXp = 0;
      }

      const updated = {
        ...prevUser,
        level: newLevel,
        currentXp: newXp,
        xpToNextLevel: nextLevelXp,
      };

      updateUserOnApi(updated);
      return updated;
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400 animate-pulse">Connexion au serveur QuestBoard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header user={user} />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Tableau des Quêtes</h2>
            <p className="text-xs text-slate-400">Synchronisé en temps réel avec ton API Spring Boot.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nouvelle Quête
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((col) => {
              const colQuests = quests.filter((q) => q.status === col.id);
              return (
                <div
                  key={col.id}
                  className={`bg-slate-900/50 border ${col.color} rounded-2xl p-4 flex flex-col gap-4 min-h-[500px]`}
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <h3 className="font-bold text-sm tracking-wide text-slate-200">{col.title}</h3>
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                      {colQuests.length}
                    </span>
                  </div>

                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex flex-col gap-3 flex-1 transition-colors rounded-xl p-1 ${
                          snapshot.isDraggingOver ? 'bg-slate-800/40' : ''
                        }`}
                      >
                        {colQuests.map((quest, index) => (
                          <Draggable key={quest.id.toString()} draggableId={quest.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${snapshot.isDragging ? 'opacity-75 rotate-1' : ''}`}
                              >
                                <QuestCard quest={quest} onMove={handleMoveQuest} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </main>

      <NewQuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddQuest={handleAddQuest}
      />
    </div>
  );
}