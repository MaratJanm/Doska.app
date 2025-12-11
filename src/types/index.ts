export interface Card {
  id: string;
  title: string;
  description: string;
  labels: Label[];
  dueDate: string | null;
  createdAt: string;
  checklist: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Label {
  id: string;
  color: string;
  text: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface Board {
  id: string;
  title: string;
  background: string;
  columns: Column[];
  cards: Record<string, Card>;
}

export const LABEL_COLORS = [
  { color: '#61bd4f', name: 'Зелёный' },
  { color: '#f2d600', name: 'Жёлтый' },
  { color: '#ff9f1a', name: 'Оранжевый' },
  { color: '#eb5a46', name: 'Красный' },
  { color: '#c377e0', name: 'Фиолетовый' },
  { color: '#0079bf', name: 'Синий' },
  { color: '#00c2e0', name: 'Голубой' },
  { color: '#51e898', name: 'Мятный' },
  { color: '#ff78cb', name: 'Розовый' },
  { color: '#344563', name: 'Тёмный' },
];

export const BACKGROUNDS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
];