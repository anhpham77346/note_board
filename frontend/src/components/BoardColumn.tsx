"use client";

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Board, Note } from '../types';
import { NoteItem } from './NoteItem';

interface BoardColumnProps {
  board: Board;
  onAddNote: (boardId: string, content: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export function BoardColumn({ board, onAddNote, onDeleteNote }: BoardColumnProps) {
  const [newNoteContent, setNewNoteContent] = useState('');
  const { setNodeRef } = useDroppable({
    id: board.id,
    data: { type: 'board', board }
  });

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote(board.id, newNoteContent);
      setNewNoteContent('');
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow min-w-[300px] max-w-[300px] h-full">
      <h2 className="text-lg font-bold mb-4 text-gray-700">{board.title}</h2>
      
      <div className="mb-4">
        <input
          type="text"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder="Add a new note..."
          className="w-full p-2 border border-gray-300 rounded mb-2"
          onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
        />
        <button
          onClick={handleAddNote}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-full"
        >
          Add Note
        </button>
      </div>
      
      <div ref={setNodeRef} className="min-h-[200px]">
        <SortableContext items={board.notes.map(note => note.id)} strategy={verticalListSortingStrategy}>
          {board.notes.map((note) => (
            <NoteItem key={note.id} note={note} onDelete={onDeleteNote} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
} 