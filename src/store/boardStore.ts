import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { Board, Card, Column, Label } from '../types';
import { getBoards, saveBoards, createDefaultBoard } from '../utils/localStorage';

interface BoardState {
  boards: Board[];
  currentBoardId: string | null;
  selectedCardId: string | null;
  
  // Board actions
  setCurrentBoard: (boardId: string) => void;
  addBoard: (title: string, background: string) => void;
  updateBoardTitle: (boardId: string, title: string) => void;
  updateBoardBackground: (boardId: string, background: string) => void;
  deleteBoard: (boardId: string) => void;
  
  // Column actions
  addColumn: (title: string) => void;
  updateColumnTitle: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
  moveColumn: (fromIndex: number, toIndex: number) => void;
  
  // Card actions
  addCard: (columnId: string, title: string) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string, columnId: string) => void;
  moveCard: (
    cardId: string,
    sourceColumnId: string,
    destColumnId: string,
    sourceIndex: number,
    destIndex: number
  ) => void;
  
  // Card modal
  selectCard: (cardId: string | null) => void;
  
  // Checklist actions
  addChecklistItem: (cardId: string, text: string) => void;
  toggleChecklistItem: (cardId: string, itemId: string) => void;
  deleteChecklistItem: (cardId: string, itemId: string) => void;
  
  // Label actions
  addLabel: (cardId: string, label: Label) => void;
  removeLabel: (cardId: string, labelId: string) => void;
}

export const useBoardStore = create<BoardState>((set) => {
  const boards = getBoards();
  
  return {
    boards,
    currentBoardId: boards[0]?.id || null,
    selectedCardId: null,
    
    setCurrentBoard: (boardId) => {
      set({ currentBoardId: boardId });
    },
    
    addBoard: (title, background) => {
      const newBoard: Board = {
        id: nanoid(),
        title,
        background,
        columns: [
          { id: nanoid(), title: 'Сделать', cardIds: [] },
          { id: nanoid(), title: 'В процессе', cardIds: [] },
          { id: nanoid(), title: 'Готово', cardIds: [] },
        ],
        cards: {},
      };
      
      set((state) => {
        const newBoards = [...state.boards, newBoard];
        saveBoards(newBoards);
        return { boards: newBoards, currentBoardId: newBoard.id };
      });
    },
    
    updateBoardTitle: (boardId, title) => {
      set((state) => {
        const newBoards = state.boards.map((board) =>
          board.id === boardId ? { ...board, title } : board
        );
        saveBoards(newBoards);
        return { boards: newBoards };
      });
    },
    
    updateBoardBackground: (boardId, background) => {
      set((state) => {
        const newBoards = state.boards.map((board) =>
          board.id === boardId ? { ...board, background } : board
        );
        saveBoards(newBoards);
        return { boards: newBoards };
      });
    },
    
    deleteBoard: (boardId) => {
      set((state) => {
        let newBoards = state.boards.filter((b) => b.id !== boardId);
        if (newBoards.length === 0) {
          const defaultBoard = createDefaultBoard();
          newBoards = [defaultBoard];
        }
        saveBoards(newBoards);
        return {
          boards: newBoards,
          currentBoardId: state.currentBoardId === boardId ? newBoards[0].id : state.currentBoardId,
        };
      });
    },
    
    addColumn: (title) => {
      set((state) => {
        const newColumn: Column = {
          id: nanoid(),
          title,
          cardIds: [],
        };
        
        const newBoards = state.boards.map((board) =>
          board.id === state.currentBoardId
            ? { ...board, columns: [...board.columns, newColumn] }
            : board
        );
        saveBoards(newBoards);
        return { boards: newBoards };
      });
    },
    
    updateColumnTitle: (columnId, title) => {
      set((state) => {
        const newBoards = state.boards.map((board) =>
          board.id === state.currentBoardId
            ? {
                ...board,
                columns: board.columns.map((col) =>
                  col.id === columnId ? { ...col, title } : col
                ),
              }
            : board
        );
        saveBoards(newBoards);
        return { boards: newBoards };
      });
    },
    
    deleteColumn: (columnId) => {
      set((state) => {
        const board = state.boards.find((b) => b.id === state.currentBoardId);
        if (!board) return state;
        
        const column = board.columns.find((c) => c.id === columnId);
        if (!column) return state;
        
        // Remove cards from the column
        const newCards = { ...board.cards };
        column.cardIds.forEach((cardId) => {
          delete newCards[cardId];
        });
        
        const newBoards = state.boards.map((b) =>
          b.id === state.currentBoardId
            ? {
                ...b,
                columns: b.columns.filter((c) => c.id !== columnId),
                cards: newCards,
              }
            : b
        );
        saveBoards(newBoards);
        return { boards: newBoards };
      });
    },
    
    moveColumn: (fromIndex, toIndex) => {
      set((state) => {
        const board = state.boards.find((b) => b.id === state.currentBoardId);
        if (!board) return state;
        
        const newColumns = [...board.columns];
        const [removed] = newColumns.splice(fromIndex, 1);
        newColumns.splice(toIndex, 0, removed);
        
        const newBoards = state.boards.map((b) =>
          b.id === state.currentBoardId ? { ...b, columns: newColumns } : b
        );
        saveBoards(newBoards);
        return { boards: newBoards };
      });
    },
    
    addCard: (columnId, title) => {
      set((state) => {
        const newCard: Card = {
          id: nanoid(),
          title,
          description: '',
          labels: [],
          dueDate: null,
          createdAt: new Date().toISOString(),
          checklist: [],
        };
        
        const newBoards = state.boards.map((board) => {
          if (board.id !== state.currentBoardId) return board;
          
          return {
            ...board,
            columns: board.columns.map((col) =>
              col.id === columnId
                ? { ...col, cardIds: [...col.cardIds, newCard.id] }
                : col
            ),
            cards: { ...board.cards, [newCard.id]: newCard },
          };
        });
        
        saveBoards(newBoards);
        return { boards: newBoards };
      });
    },
    
    updateCard: (cardId, updates) => {
      set((state) => {
        const newBoards = state.boards.map((board) => {
          if (board.id !== state.currentBoardId) return board;
          if (!board.cards[cardId]) return board;
          
          return {
            ...board,
            cards: {
              ...board.cards,
              [cardId]: { ...board.cards[cardId], ...updates },
            },
          };
        });
        
        saveBoards(newBoards);
        return { boards: newBoards };
      });
    },
    
    deleteCard: (cardId, columnId) => {
      set((state) => {
        const newBoards = state.boards.map((board) => {
          if (board.id !== state.currentBoardId) return board;
          
          const newCards = { ...board.cards };
          delete newCards[cardId];
          
          return {
            ...board,
            columns: board.columns.map((col) =>
              col.id === columnId
                ? { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) }
                : col
            ),
            cards: newCards,
          };
        });
        
        saveBoards(newBoards);
        return { boards: newBoards, selectedCardId: null };
      });
    },
    
    moveCard: (cardId, sourceColumnId, destColumnId, sourceIndex, destIndex) => {
      set((state) => {
        const board = state.boards.find((b) => b.id === state.currentBoardId);
        if (!board) return state;
        
        const sourceColumn = board.columns.find((c) => c.id === sourceColumnId);
        const destColumn = board.columns.find((c) => c.id === destColumnId);
        if (!sourceColumn || !destColumn) return state;
        
        // Same column
        if (sourceColumnId === destColumnId) {
          const newCardIds = [...sourceColumn.cardIds];
          newCardIds.splice(sourceIndex, 1);
          newCardIds.splice(destIndex, 0, cardId);
          
          const newBoards = state.boards.map((b) =>
            b.id === state.currentBoardId
              ? {
                  ...b,
                  columns: b.columns.map((col) =>
                    col.id === sourceColumnId ? { ...col, cardIds: newCardIds } : col
                  ),
                }
              : b
          );
          saveBoards(newBoards);
          return { boards: newBoards };
        }
        
        // Different columns
        const sourceCardIds = [...sourceColumn.cardIds];
        sourceCardIds.splice(sourceIndex, 1);
        
        const destCardIds = [...destColumn.cardIds];
        destCardIds.splice(destIndex, 0, cardId);
        
        const newBoards = state.boards.map((b) =>
          b.id === state.currentBoardId
            ? {
                ...b,
                columns: b.columns.map((col) => {
                  if (col.id === sourceColumnId) return { ...col, cardIds: sourceCardIds };
                  if (col.id === destColumnId) return { ...col, cardIds: destCardIds };
                  return col;
                }),
              }
            : b
        );
        saveBoards(newBoards);
        return { boards: newBoards };
      });
    },
    
    selectCard: (cardId) => {
      set({ selectedCardId: cardId });
    },
    
    addChecklistItem: (cardId, text) => {
      set((state) => {
        const newBoards = state.boards.map((board) => {
          if (board.id !== state.currentBoardId) return board;
          if (!board.cards[cardId]) return board;
          
          const card = board.cards[cardId];
          return {
            ...board,
            cards: {
              ...board.cards,
              [cardId]: {
                ...card,
                checklist: [
                  ...card.checklist,
                  { id: nanoid(), text, completed: false },
                ],
              },
            },
          };
        });
        
        saveBoards(newBoards);
        return { boards: newBoards };
      });
    },
    
    toggleChecklistItem: (cardId, itemId) => {
      set((state) => {
        const newBoards = state.boards.map((board) => {
          if (board.id !== state.currentBoardId) return board;
          if (!board.cards[cardId]) return board;
          
          const card = board.cards[cardId];
          return {
            ...board,
            cards: {
              ...board.cards,
              [cardId]: {
                ...card,
                checklist: card.checklist.map((item) =>
                  item.id === itemId ? { ...item, completed: !item.completed } : item
                ),
              },
            },
          };
        });
        
        saveBoards(newBoards);
        return { boards: newBoards };
      });
    },
    
    deleteChecklistItem: (cardId, itemId) => {
      set((state) => {
        const newBoards = state.boards.map((board) => {
          if (board.id !== state.currentBoardId) return board;
          if (!board.cards[cardId]) return board;
          
          const card = board.cards[cardId];
          return {
            ...board,
            cards: {
              ...board.cards,
              [cardId]: {
                ...card,
                checklist: card.checklist.filter((item) => item.id !== itemId),
              },
            },
          };
        });
        
        saveBoards(newBoards);
        return { boards: newBoards };
      });
    },
    
    addLabel: (cardId, label) => {
      set((state) => {
        const newBoards = state.boards.map((board) => {
          if (board.id !== state.currentBoardId) return board;
          if (!board.cards[cardId]) return board;
          
          const card = board.cards[cardId];
          return {
            ...board,
            cards: {
              ...board.cards,
              [cardId]: {
                ...card,
                labels: [...card.labels, label],
              },
            },
          };
        });
        
        saveBoards(newBoards);
        return { boards: newBoards };
      });
    },
    
    removeLabel: (cardId, labelId) => {
      set((state) => {
        const newBoards = state.boards.map((board) => {
          if (board.id !== state.currentBoardId) return board;
          if (!board.cards[cardId]) return board;
          
          const card = board.cards[cardId];
          return {
            ...board,
            cards: {
              ...board.cards,
              [cardId]: {
                ...card,
                labels: card.labels.filter((l) => l.id !== labelId),
              },
            },
          };
        });
        
        saveBoards(newBoards);
        return { boards: newBoards };
      });
    },
  };
});