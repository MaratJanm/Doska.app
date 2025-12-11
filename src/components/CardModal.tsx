import { useState } from 'react';
import {
  X,
  AlignLeft,
  Tag,
  Clock,
  CheckSquare,
  Trash2,
  Plus,
} from 'lucide-react';
import { Card, LABEL_COLORS } from '../types';
import { useBoardStore } from '../store/boardStore';
import { nanoid } from 'nanoid';

interface CardModalProps {
  card: Card;
  columnTitle: string;
  onClose: () => void;
}

export default function CardModal({ card, columnTitle, onClose }: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [showLabels, setShowLabels] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  
  const {
    updateCard,
    deleteCard,
    addLabel,
    removeLabel,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    boards,
    currentBoardId,
  } = useBoardStore();
  
  const currentBoard = boards.find((b) => b.id === currentBoardId);
  const columnId = currentBoard?.columns.find((col) => col.cardIds.includes(card.id))?.id;
  
  const handleTitleBlur = () => {
    if (title.trim() && title !== card.title) {
      updateCard(card.id, { title: title.trim() });
    }
  };
  
  const handleDescriptionBlur = () => {
    if (description !== card.description) {
      updateCard(card.id, { description });
    }
  };
  
  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      addChecklistItem(card.id, newChecklistItem.trim());
      setNewChecklistItem('');
    }
  };
  
  const handleDelete = () => {
    if (columnId && confirm('Удалить карточку?')) {
      deleteCard(card.id, columnId);
      onClose();
    }
  };
  
  const completedCount = card.checklist.filter((item) => item.completed).length;
  const totalCount = card.checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-100 rounded-xl w-full max-w-2xl max-h-[calc(100vh-100px)] overflow-y-auto shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        
        <div className="p-6">
          {/* Labels */}
          {card.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {card.labels.map((label) => (
                <span
                  key={label.id}
                  style={{ backgroundColor: label.color }}
                  className="px-3 py-1 rounded text-white text-sm font-medium"
                >
                  {label.text || '\u00A0'}
                </span>
              ))}
            </div>
          )}
          
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="w-full text-xl font-bold bg-transparent border-none focus:outline-none focus:bg-white focus:rounded px-2 py-1 -ml-2 mb-1"
          />
          
          <p className="text-sm text-gray-500 mb-6 ml-0.5">
            в колонке <span className="font-medium text-gray-700">{columnTitle}</span>
          </p>
          
          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Description */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlignLeft className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-800">Описание</h3>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleDescriptionBlur}
                  placeholder="Добавить описание..."
                  className="w-full p-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px]"
                />
              </div>
              
              {/* Checklist */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckSquare className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-800">Чек-лист</h3>
                  {totalCount > 0 && (
                    <span className="text-sm text-gray-500">
                      {completedCount}/{totalCount}
                    </span>
                  )}
                </div>
                
                {/* Progress bar */}
                {totalCount > 0 && (
                  <div className="h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                
                {/* Items */}
                <div className="space-y-2 mb-3">
                  {card.checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 group">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(card.id, item.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span
                        className={`flex-1 text-sm ${
                          item.completed ? 'line-through text-gray-400' : 'text-gray-700'
                        }`}
                      >
                        {item.text}
                      </span>
                      <button
                        onClick={() => deleteChecklistItem(card.id, item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Add item */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                    placeholder="Добавить пункт..."
                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={handleAddChecklistItem}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="w-44 space-y-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">
                Добавить
              </p>
              
              {/* Labels button */}
              <div className="relative">
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm text-gray-700"
                >
                  <Tag className="w-4 h-4" />
                  Метки
                </button>
                
                {showLabels && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowLabels(false)} />
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border z-20 p-3">
                      <h4 className="font-medium text-gray-800 mb-3">Метки</h4>
                      <div className="space-y-2">
                        {LABEL_COLORS.map((labelColor) => {
                          const existingLabel = card.labels.find((l) => l.color === labelColor.color);
                          return (
                            <button
                              key={labelColor.color}
                              onClick={() => {
                                if (existingLabel) {
                                  removeLabel(card.id, existingLabel.id);
                                } else {
                                  addLabel(card.id, {
                                    id: nanoid(),
                                    color: labelColor.color,
                                    text: labelColor.name,
                                  });
                                }
                              }}
                              className={`w-full h-8 rounded flex items-center justify-between px-3 transition-transform hover:scale-105 ${
                                existingLabel ? 'ring-2 ring-blue-500 ring-offset-2' : ''                              }`}
                              style={{ backgroundColor: labelColor.color }}
                            >
                              <span className="text-white text-sm font-medium">{labelColor.name}</span>
                              {existingLabel && (
                                <span className="text-white">✓</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Due date button */}
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm text-gray-700"
                >
                  <Clock className="w-4 h-4" />
                  Срок
                </button>
                
                {showDatePicker && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDatePicker(false)} />
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border z-20 p-3">
                      <h4 className="font-medium text-gray-800 mb-3">Срок выполнения</h4>
                      <input
                        type="date"
                        value={card.dueDate || ''}
                        onChange={(e) => {
                          updateCard(card.id, { dueDate: e.target.value || null });
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {card.dueDate && (
                        <button
                          onClick={() => {
                            updateCard(card.id, { dueDate: null });
                            setShowDatePicker(false);
                          }}
                          className="w-full mt-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                        >
                          Удалить срок
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <hr className="my-3 border-gray-300" />
              
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">
                Действия
              </p>
              
              {/* Delete button */}
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors text-sm text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}