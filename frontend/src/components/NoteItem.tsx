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
  isNewNote?: boolean;
}

export function NoteItem({ note, onDelete, onUpdate, isNewNote }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(isNewNote || false);
  const [content, setContent] = useState(note.content);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const editInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Generate a random rotation between -2 and 2 degrees for a more natural look
  const randomRotation = useRef(Math.floor(Math.random() * 5) - 2);
  
  // Generate a random color for the note
  const colors = [
    '#fffacd', // lemon chiffon
    '#fff8dc', // cornsilk
    '#ffecb3', // light yellow
    '#e6ee9c', // light green
    '#b2dfdb', // light teal
    '#b3e5fc', // light blue
    '#d1c4e9', // light purple
    '#f8bbd0', // light pink
  ];
  const noteColor = useRef(colors[Math.floor(Math.random() * colors.length)]);
  
  // Choose a random paper style (plain, lined, or grid)
  const paperStyles = ['plain', 'lined', 'grid'];
  const paperStyle = useRef(paperStyles[Math.floor(Math.random() * paperStyles.length)]);

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
      
      // If this is a new note, delete it when Escape is pressed
      if (isNewNote && note.isTemporary) {
        onDelete(note.id);
      }
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

  // Paper texture base64 - a light subtle texture
  const paperTextureBase64 = "data:image/png;base64,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";

  // Lined paper pattern CSS
  const getLinedPattern = () => {
    if (paperStyle.current === 'lined') {
      return `
        background-image: linear-gradient(#0000 calc(100% - 1px), #8884 calc(100% - 1px));
        background-size: 100% 24px;
      `;
    }
    if (paperStyle.current === 'grid') {
      return `
        background-image: 
          linear-gradient(#8883 1px, transparent 1px),
          linear-gradient(90deg, #8883 1px, transparent 1px);
        background-size: 24px 24px;
      `;
    }
    return '';
  };

  // Determine which pin to use
  const pinColors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500'];
  const pinColor = useRef(pinColors[Math.floor(Math.random() * pinColors.length)]);

  return (
    <>
      <div
        ref={setNodeRef}
        style={{
          ...style,
          transform: `${style.transform || ''} rotate(${randomRotation.current}deg)`,
          backgroundColor: isEditing ? 'white' : noteColor.current,
          ...(paperStyle.current !== 'plain' && !isEditing ? { 
            backgroundImage: paperStyle.current === 'lined' 
              ? 'linear-gradient(0deg, #8882 1px, transparent 1px)'
              : 'linear-gradient(#8882 1px, transparent 1px), linear-gradient(90deg, #8882 1px, transparent 1px)',
            backgroundSize: paperStyle.current === 'lined' 
              ? '100% 24px' 
              : '24px 24px'
          } : {})
        }}
        {...(isEditing ? {} : attributes)}
        {...(isEditing ? {} : listeners)}
        className={`
          rounded-lg
          ${!isEditing ? 'cursor-move' : ''}
          h-[180px] flex flex-col
          relative overflow-hidden
          transition-all duration-200
          ${isEditing ? 'bg-white shadow-md' : 'shadow-[2px_3px_10px_rgba(0,0,0,0.2)]'}
          hover:shadow-[2px_4px_12px_rgba(0,0,0,0.25)]
        `}
      >
        {/* Paper texture overlay */}
        {!isEditing && (
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none z-0" 
            style={{ backgroundImage: `url(${paperTextureBase64})` }}
          ></div>
        )}
        
        {/* Pin decoration */}
        <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full ${pinColor.current} shadow-sm z-10`}></div>
        
        {isEditing ? (
          <div className="p-4 flex flex-col h-full relative z-1">
            <textarea
              ref={editInputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-2 border border-gray-300 rounded-lg resize-none flex-grow focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2 bg-white"
              placeholder="Enter note content..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setContent(note.content);
                  setIsEditing(false);
                  // If this is a new note, delete it when canceling
                  if (isNewNote && note.isTemporary) {
                    onDelete(note.id);
                  }
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
          <div className="p-4 flex flex-col h-full relative group z-1">
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2 bg-white/90 backdrop-blur-sm rounded-md p-1 shadow-sm z-20">
              {onUpdate && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                  title="Edit note"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                title="Delete note"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <p 
              className="text-gray-800 font-handwriting break-words whitespace-pre-wrap leading-snug line-clamp-6 text-sm flex-grow z-10"
              onDoubleClick={() => onUpdate && setIsEditing(true)}
            >
              {note.content}
            </p>
            
            <div className="text-xs text-gray-600 mt-auto flex items-center pt-1 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDate(note.createdAt)}
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