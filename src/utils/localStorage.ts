import { Board } from '../types';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'doska-boards';

export const getBoards = (): Board[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  // Return default board
  const defaultBoard = createDefaultBoard();
  saveBoards([defaultBoard]);
  return [defaultBoard];
};

export const saveBoards = (boards: Board[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
};

export const createDefaultBoard = (): Board => ({
  id: nanoid(),
  title: 'Моя первая доска',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  columns: [
    { id: nanoid(), title: 'Сделать', cardIds: [] },
    { id: nanoid(), title: 'В процессе', cardIds: [] },
    { id: nanoid(), title: 'Готово', cardIds: [] },
  ],
  cards: {},
});