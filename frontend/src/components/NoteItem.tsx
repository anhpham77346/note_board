"use client";

import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Note } from '../types';
import { Modal } from './ui/Modal';

interface NoteItemProps {
  note: Note;
  onDelete: (id: string | number) => void;
  onUpdate?: (id: string | number, content: string) => void;
}

export function NoteItem({ note, onDelete, onUpdate }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: note.id,
    data: { type: 'note', note }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      // Place cursor at the end
      const length = editInputRef.current.value.length;
      editInputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleSave = () => {
    if (content.trim() && onUpdate) {
      onUpdate(note.id, content);
      setIsEditing(false);
    } else if (!content.trim()) {
      // Revert to original content if empty
      setContent(note.content);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setContent(note.content); // Revert changes
      setIsEditing(false);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...(isEditing ? {} : attributes)}
        {...(isEditing ? {} : listeners)}
        className={`bg-white p-3 rounded shadow mb-2 ${!isEditing ? 'cursor-move' : ''} border border-gray-200 hover:border-blue-400`}
      >
        {isEditing ? (
          <div className="flex flex-col">
            <textarea
              ref={editInputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-1 border border-gray-300 rounded resize-none min-h-[80px]"
              onBlur={handleSave}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={() => {
                  setContent(note.content);
                  setIsEditing(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-sm mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <p 
              className="text-gray-800 break-words whitespace-pre-wrap w-full"
              onDoubleClick={() => onUpdate && setIsEditing(true)}
            >
              {note.content}
            </p>
            <div className="flex ml-2">
              {onUpdate && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="text-gray-500 hover:text-blue-600 text-sm mr-1"
                  title="Edit note"
                >
                  ✏️
                </button>
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
                className="text-gray-500 hover:text-red-600 text-sm"
                title="Delete note"
              >
                🗑️
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(note.id)}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
} 