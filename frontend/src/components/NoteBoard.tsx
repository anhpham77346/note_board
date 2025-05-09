"use client";

import { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverEvent, 
  DragOverlay, 
  DragStartEvent, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Board, Note } from '../types';
import { BoardColumn } from './BoardColumn';
import { NoteItem } from './NoteItem';

export function NoteBoard() {
  const [boards, setBoards] = useState<Board[]>([
    { id: 'board-1', title: 'To Do', notes: [] },
    { id: 'board-2', title: 'In Progress', notes: [] },
    { id: 'board-3', title: 'Done', notes: [] },
  ]);
  
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'note') {
      setActiveNote(event.active.data.current.note);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    // Find the source note
    const activeNote = active.data.current?.note as Note;
    if (!activeNote) return;
    
    // If dropping over a board
    if (over.data.current?.type === 'board') {
      const targetBoardId = over.id as string;
      
      // If the note is already in this board, do nothing
      if (activeNote.boardId === targetBoardId) return;
      
      setBoards(boards => {
        // Remove from source board
        const updatedBoards = boards.map(board => {
          if (board.id === activeNote.boardId) {
            return {
              ...board,
              notes: board.notes.filter(note => note.id !== activeNote.id)
            };
          }
          return board;
        });
        
        // Add to target board
        return updatedBoards.map(board => {
          if (board.id === targetBoardId) {
            return {
              ...board,
              notes: [...board.notes, { ...activeNote, boardId: targetBoardId }]
            };
          }
          return board;
        });
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveNote(null);
    
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    // Find the source note
    const activeNote = active.data.current?.note as Note;
    if (!activeNote) return;
    
    // If dropping over a note (reordering within the same board)
    if (over.data.current?.type === 'note') {
      const overNote = over.data.current.note as Note;
      
      // Only reorder if they're in the same board
      if (activeNote.boardId === overNote.boardId) {
        setBoards(boards => {
          return boards.map(board => {
            if (board.id === activeNote.boardId) {
              const oldIndex = board.notes.findIndex(note => note.id === activeId);
              const newIndex = board.notes.findIndex(note => note.id === overId);
              
              return {
                ...board,
                notes: arrayMove(board.notes, oldIndex, newIndex)
              };
            }
            return board;
          });
        });
      }
    }
  };

  const handleAddNote = (boardId: string, content: string) => {
    setBoards(boards => {
      return boards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            notes: [
              ...board.notes,
              { id: `note-${Date.now()}`, content, boardId }
            ]
          };
        }
        return board;
      });
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setBoards(boards => {
      return boards.map(board => {
        return {
          ...board,
          notes: board.notes.filter(note => note.id !== noteId)
        };
      });
    });
  };

  const handleAddBoard = () => {
    if (newBoardTitle.trim()) {
      setBoards([
        ...boards,
        { id: `board-${Date.now()}`, title: newBoardTitle, notes: [] }
      ]);
      setNewBoardTitle('');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Note Board</h1>
      
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="Enter board title..."
            className="p-2 border border-gray-300 rounded"
            onKeyDown={(e) => e.key === 'Enter' && handleAddBoard()}
          />
          <button
            onClick={handleAddBoard}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Board
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {boards.map(board => (
            <BoardColumn
              key={board.id}
              board={board}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
          ))}
        </div>

        <DragOverlay>
          {activeNote ? <NoteItem note={activeNote} onDelete={() => {}} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
} 