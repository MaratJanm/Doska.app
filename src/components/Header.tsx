import { useState } from 'react';
import { Menu, Star, Users, MoreHorizontal } from 'lucide-react';
import { Board } from '../types';
import { useBoardStore } from '../store/boardStore';

interface HeaderProps {
  board: Board;
  onMenuClick: () => void;
}

export default function Header({ board, onMenuClick }: HeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const { updateBoardTitle } = useBoardStore();
  
  const handleTitleSubmit = () => {
    if (title.trim()) {
      updateBoardTitle(board.id, title.trim());
    } else {
      setTitle(board.title);
    }
    setIsEditing(false);
  };
  
  return (
    <header className="h-14 px-4 flex items-center justify-between bg-black/20 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-white/20 rounded transition-colors"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
        
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            className="bg-white px-3 py-1 rounded text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <h1
            onClick={() => setIsEditing(true)}
            className="text-white text-lg font-bold cursor-pointer hover:bg-white/20 px-3 py-1 rounded transition-colors"
          >
            {board.title}
          </h1>
        )}
        
        <button className="p-2 hover:bg-white/20 rounded transition-colors">
          <Star className="w-5 h-5 text-white" />
        </button>
        
        <span className="text-white/60">|</span>
        
        <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/20 rounded transition-colors text-white">
          <Users className="w-4 h-4" />
          <span className="text-sm">Доска</span>
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-white/20 rounded transition-colors">
          <MoreHorizontal className="w-5 h-5 text-white" />
        </button>
      </div>
    </header>
  );
}