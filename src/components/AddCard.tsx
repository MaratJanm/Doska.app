import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

interface AddCardProps {
  columnId: string;
}

export default function AddCard({ columnId }: AddCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const { addCard } = useBoardStore();
  
  const handleSubmit = () => {
    if (title.trim()) {
      addCard(columnId, title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };
  
  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full p-3 flex items-center gap-2 text-gray-600 hover:bg-gray-200 rounded-b-xl transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm">Добавить карточку</span>
      </button>
    );
  }
  
  return (
    <div className="p-3 pt-0">
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
          if (e.key === 'Escape') {
            setIsAdding(false);
            setTitle('');
          }
        }}
        placeholder="Введите заголовок карточки..."
        className="w-full p-3 rounded-lg border-2 border-blue-500 focus:outline-none resize-none text-sm"
        rows={3}
        autoFocus
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          Добавить
        </button>
        <button
          onClick={() => {
            setIsAdding(false);
            setTitle('');
          }}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}