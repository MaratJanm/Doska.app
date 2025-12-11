import { useState } from 'react';
import { X, Plus, Trash2, Palette } from 'lucide-react';
import { Board, BACKGROUNDS } from '../types';
import { useBoardStore } from '../store/boardStore';

interface BoardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentBoard: Board;
}

export default function BoardSidebar({ isOpen, onClose, currentBoard }: BoardSidebarProps) {
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0]);
  const [showBgPicker, setShowBgPicker] = useState(false);
  
  const {
    boards,
    setCurrentBoard,
    addBoard,
    deleteBoard,
    updateBoardBackground,
  } = useBoardStore();
  
  const handleCreateBoard = () => {
    if (newBoardTitle.trim()) {
      addBoard(newBoardTitle.trim(), selectedBg);
      setNewBoardTitle('');
      setShowNewBoard(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-lg text-gray-800">Мои доски</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Boards list */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {boards.map((board) => (
              <div
                key={board.id}
                className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  board.id === currentBoard.id
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'hover:bg-gray-100 border-2 border-transparent'
                }`}
                onClick={() => {
                  setCurrentBoard(board.id);
                  onClose();
                }}
              >
                <div
                  className="w-10 h-8 rounded"
                  style={{ background: board.background }}
                />
                <span className="flex-1 font-medium text-gray-800 truncate">
                  {board.title}
                </span>
                {boards.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Удалить доску "${board.title}"?`)) {
                        deleteBoard(board.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* New board form */}
          {showNewBoard ? (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
                placeholder="Название доски..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                autoFocus
              />
              
              <p className="text-sm text-gray-600 mb-2">Фон:</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {BACKGROUNDS.map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBg(bg)}
                    className={`h-8 rounded transition-transform hover:scale-110 ${
                      selectedBg === bg ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                    style={{ background: bg }}
                  />
                ))}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleCreateBoard}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Создать
                </button>
                <button
                  onClick={() => {
                    setShowNewBoard(false);
                    setNewBoardTitle('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewBoard(true)}
              className="w-full mt-4 flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
            >
              <Plus className="w-5 h-5" />
              Создать доску
            </button>
          )}
        </div>
        
        {/* Background picker for current board */}
        <div className="p-4 border-t">
          <button
            onClick={() => setShowBgPicker(!showBgPicker)}
            className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
          >
            <Palette className="w-5 h-5" />
            Изменить фон доски
          </button>
          
          {showBgPicker && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg}
                  onClick={() => {
                    updateBoardBackground(currentBoard.id, bg);
                  }}
                  className={`h-10 rounded transition-transform hover:scale-110 ${
                    currentBoard.background === bg ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  }`}
                  style={{ background: bg }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}