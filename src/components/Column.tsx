import { useState } from 'react';
import { Droppable, Draggable, DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { MoreHorizontal, GripVertical } from 'lucide-react';
import { Column as ColumnType, Card as CardType } from '../types';
import { useBoardStore } from '../store/boardStore';
import Card from './Card';
import AddCard from './AddCard';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  dragHandleProps: DraggableProvidedDragHandleProps | null;
}

export default function Column({ column, cards, dragHandleProps }: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);
  const { updateColumnTitle, deleteColumn } = useBoardStore();
  
  const handleTitleSubmit = () => {
    if (title.trim()) {
      updateColumnTitle(column.id, title.trim());
    } else {
      setTitle(column.title);
    }
    setIsEditing(false);
  };
  
  return (
    <div className="w-72 bg-gray-100 rounded-xl flex flex-col max-h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="p-3 flex items-center gap-2">
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            className="flex-1 px-2 py-1 rounded border-2 border-blue-500 focus:outline-none font-semibold"
            autoFocus
          />
        ) : (
          <h3
            onClick={() => setIsEditing(true)}
            className="flex-1 font-semibold text-gray-800 cursor-pointer px-2 py-1 rounded hover:bg-gray-200 transition-colors"
          >
            {column.title}
          </h3>
        )}
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border z-20">
                <button
                  onClick={() => {
                    deleteColumn(column.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Удалить колонку
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Cards */}
      <Droppable droppableId={column.id} type="card">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto px-3 pb-1 min-h-[4px] ${
              snapshot.isDraggingOver ? 'bg-gray-200/50' : ''
            }`}
          >
            {cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? 'card-dragging' : ''}
                  >
                    <Card card={card} columnId={column.id} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      {/* Add Card */}
      <AddCard columnId={column.id} />
    </div>
  );
}