// data/resources.ts
export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'Math' | 'Science' | 'Literature' | 'History' | 'Computer Science';
  language: 'en' | 'fr' | 'es' | 'sw';
  link: string;
}

export const resourcesData: Resource[] = [
  {
    id: "r1",
    title: "Advanced Calculus for Public Institutes",
    description: "A comprehensive guide on advanced calculus techniques, created by the Open Math Foundation.",
    category: "Math",
    language: "en",
    link: "#resource/r1"
  },
  {
    id: "r2",
    title: "Biology: The Cellular Level",
    description: "Detailed interactive diagrams and chapters explaining cellular biology for secondary education.",
    category: "Science",
    language: "en",
    link: "#resource/r2"
  },
  {
    id: "r3",
    title: "Introduction à l'Informatique",
    description: "An introductory course on computer science and algorithmic thinking, adapted for French-speaking schools.",
    category: "Computer Science",
    language: "fr",
    link: "#resource/r3"
  },
  {
    id: "r4",
    title: "World History: Ancient Civilizations",
    description: "Exploration of early human societies and their structural innovations.",
    category: "History",
    language: "en",
    link: "#resource/r4"
  },
  {
    id: "r5",
    title: "Literatura Española: Siglo de Oro",
    description: "A deep dive into the Spanish Golden Age of literature with annotated texts.",
    category: "Literature",
    language: "es",
    link: "#resource/r5"
  },
  {
    id: "r6",
    title: "Physics: Principles of Mechanics",
    description: "Open source simulations and textbook chapters covering classical mechanics.",
    category: "Science",
    language: "en",
    link: "#resource/r6"
  },
  {
    id: "r7",
    title: "Swahili Basic Grammar",
    description: "Introductory module for learning Swahili grammar structures for primary educators.",
    category: "Literature",
    language: "sw",
    link: "#resource/r7"
  },
]
