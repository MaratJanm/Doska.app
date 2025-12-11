import { Clock, CheckSquare, AlignLeft } from 'lucide-react';
import { Card as CardType } from '../types';
import { useBoardStore } from '../store/boardStore';

interface CardProps {
  card: CardType;
  columnId: string;
}

export default function Card({ card }: CardProps) {
  const { selectCard } = useBoardStore();
  
  const completedChecklist = card.checklist.filter((item) => item.completed).length;
  const totalChecklist = card.checklist.length;
  const hasDescription = card.description.trim().length > 0;
  
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
  
  return (
    <div
      onClick={() => selectCard(card.id)}
      className="bg-white rounded-lg p-3 mb-2 shadow-sm hover:shadow-md cursor-pointer transition-shadow border border-gray-200 group"
    >
      {/* Labels */}
      {card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map((label) => (
            <span
              key={label.id}
              style={{ backgroundColor: label.color }}
              className="h-2 w-10 rounded-full"
              title={label.text}
            />
          ))}
        </div>
      )}
      
      {/* Title */}
      <h4 className="text-gray-800 text-sm font-medium mb-2">{card.title}</h4>
      
      {/* Badges */}
      <div className="flex items-center gap-3 text-gray-500">
        {card.dueDate && (
          <span
            className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${
              isOverdue ? 'bg-red-100 text-red-600' : 'bg-gray-100'
            }`}
          >
            <Clock className="w-3 h-3" />
            {new Date(card.dueDate).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        )}
        
        {hasDescription && (
          <span className="flex items-center gap-1 text-xs">
            <AlignLeft className="w-3 h-3" />
          </span>
        )}
        
        {totalChecklist > 0 && (
          <span
            className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${
              completedChecklist === totalChecklist ? 'bg-green-100 text-green-600' : 'bg-gray-100'
            }`}
          >
            <CheckSquare className="w-3 h-3" />
            {completedChecklist}/{totalChecklist}
          </span>
        )}
      </div>
    </div>
  );
}