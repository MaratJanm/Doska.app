import { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useBoardStore } from './store/boardStore';
import Header from './components/Header';
import Board from './components/Board';
import CardModal from './components/CardModal';
import BoardSidebar from './components/BoardSidebar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { boards, currentBoardId, selectedCardId, selectCard, moveCard, moveColumn } = useBoardStore();
  
  const currentBoard = boards.find((b) => b.id === currentBoardId);
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    
    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    if (type === 'column') {
      moveColumn(source.index, destination.index);
      return;
    }
    
    moveCard(
      draggableId,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };
  
  if (!currentBoard) {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl">Загрузка...</div>;
  }
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ background: currentBoard.background }}
    >
      <Header 
        board={currentBoard} 
        onMenuClick={() => setSidebarOpen(true)} 
      />
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Board board={currentBoard} />
      </DragDropContext>
      
      {selectedCardId && currentBoard.cards[selectedCardId] && (
        <CardModal
          card={currentBoard.cards[selectedCardId]}
          columnTitle={
            currentBoard.columns.find((col) => col.cardIds.includes(selectedCardId))?.title || ''
          }
          onClose={() => selectCard(null)}
        />
      )}
      
      <BoardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentBoard={currentBoard}
      />
    </div>
  );
}

export default App;