export const initialUser = {
  name: "Aurélie",
  level: 3,
  currentXp: 140,
  xpToNextLevel: 250,
};

export const initialQuests = [
  {
    id: "1",
    title: "Sécuriser l'API avec JWT",
    description: "Implémenter Spring Security et les filtres de vérification des tokens.",
    status: "TODO",
    difficulty: "HARD",
    xp: 50,
  },
  {
    id: "2",
    title: "Créer le composant Header",
    description: "Afficher le niveau du joueur et sa barre de progression d'XP.",
    status: "IN_PROGRESS",
    difficulty: "MEDIUM",
    xp: 25,
  },
  {
    id: "3",
    title: "Initialiser le projet React",
    description: "Installer Vite, Tailwind CSS et valider le serveur de dev.",
    status: "DONE",
    difficulty: "EASY",
    xp: 10,
  },
];