import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Board as BoardType } from '../types';
import Column from './Column';
import AddColumn from './AddColumn';

interface BoardProps {
  board: BoardType;
}

export default function Board({ board }: BoardProps) {
  return (
    <Droppable droppableId="board" type="column" direction="horizontal">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex-1 flex gap-4 p-6 overflow-x-auto items-start"
        >
          {board.columns.map((column, index) => (
            <Draggable key={column.id} draggableId={column.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  className={snapshot.isDragging ? 'column-dragging' : ''}
                >
                  <Column
                    column={column}
                    cards={column.cardIds.map((id) => board.cards[id]).filter(Boolean)}
                    dragHandleProps={provided.dragHandleProps}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
          <AddColumn />
        </div>
      )}
    </Droppable>
  );
}