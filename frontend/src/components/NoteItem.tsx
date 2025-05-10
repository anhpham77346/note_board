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

  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...(isEditing ? {} : attributes)}
        {...(isEditing ? {} : listeners)}
        className={`
          bg-white rounded-lg border border-gray-200 shadow-sm 
          hover:border-blue-300 hover:shadow transition-all
          ${!isEditing ? 'cursor-move' : ''}
        `}
      >
        {isEditing ? (
          <div className="p-3 flex flex-col">
            <textarea
              ref={editInputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-2 border border-gray-300 rounded-lg resize-none min-h-[90px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
              placeholder="Enter note content..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setContent(note.content);
                  setIsEditing(false);
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <div className="flex justify-between items-start">
              <p 
                className="text-gray-800 break-words whitespace-pre-wrap leading-snug mb-2"
                onDoubleClick={() => onUpdate && setIsEditing(true)}
              >
                {note.content}
              </p>
              <div className="flex ml-2 mt-0.5">
                {onUpdate && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit note"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteModal(true);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete note"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            {note.createdAt && (
              <div className="text-xs text-gray-400 mt-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDate(note.createdAt)}
              </div>
            )}
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