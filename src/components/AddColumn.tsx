import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

export default function AddColumn() {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const { addColumn } = useBoardStore();
  
  const handleSubmit = () => {
    if (title.trim()) {
      addColumn(title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };
  
  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-72 shrink-0 p-3 flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white"
      >
        <Plus className="w-5 h-5" />
        <span>Добавить колонку</span>
      </button>
    );
  }
  
  return (
    <div className="w-72 shrink-0 p-3 bg-gray-100 rounded-xl">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
          if (e.key === 'Escape') {
            setIsAdding(false);
            setTitle('');
          }
        }}
        placeholder="Введите название колонки..."
        className="w-full p-2 rounded-lg border-2 border-blue-500 focus:outline-none text-sm"
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