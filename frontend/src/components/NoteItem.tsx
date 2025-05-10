"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Note } from '../types';

interface NoteItemProps {
  note: Note;
  onDelete: (id: string | number) => void;
}

export function NoteItem({ note, onDelete }: NoteItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: note.id,
    data: { type: 'note', note }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded shadow mb-2 cursor-move border border-gray-200 hover:border-blue-400"
    >
      <div className="flex justify-between items-start">
        <p className="text-gray-800">{note.content}</p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="text-red-500 hover:text-red-700 ml-2 text-sm"
        >
          ×
        </button>
      </div>
    </div>
  );
} 