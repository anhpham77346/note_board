"use client";

import { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Board, Note } from '../types';
import { NoteItem } from './NoteItem';
import { Modal } from './ui/Modal';

interface BoardColumnProps {
  board: Board;
  onAddNote: (boardId: string | number, content: string) => void;
  onDeleteNote: (noteId: string | number) => void;
  onUpdateBoard: (boardId: string | number, name: string) => void;
  onDeleteBoard: (boardId: string | number) => void;
  onUpdateNote?: (noteId: string | number, content: string) => void;
}

export function BoardColumn({ 
  board, 
  onAddNote, 
  onDeleteNote, 
  onUpdateBoard, 
  onDeleteBoard,
  onUpdateNote 
}: BoardColumnProps) {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [boardName, setBoardName] = useState(board.title || board.name || '');
  const [originalBoardName, setOriginalBoardName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const { setNodeRef } = useDroppable({
    id: board.id,
    data: { type: 'board', board }
  });

  // Focus input when editing
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote(board.id, newNoteContent);
      setNewNoteContent('');
    }
  };

  const handleEditBoard = () => {
    // Store original name to restore if canceled
    setOriginalBoardName(board.title || board.name || '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Restore original name
    setBoardName(originalBoardName);
    setIsEditing(false);
  };

  const handleSaveBoard = () => {
    if (boardName.trim()) {
      onUpdateBoard(board.id, boardName);
      setIsEditing(false);
    }
  };

  const handleDeleteBoardConfirm = () => {
    onDeleteBoard(board.id);
  };

  return (
    <>
      <div className="bg-gray-100 p-4 rounded-md shadow min-w-[300px] max-w-[300px] h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          {isEditing ? (
            <div className="flex items-center w-full">
              <input
                ref={editInputRef}
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                className="flex-grow p-1 border border-gray-300 rounded mr-2 text-lg font-bold text-gray-700"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveBoard();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
              />
              <button
                onClick={handleCancelEdit}
                className="bg-gray-300 text-gray-700 px-2 py-1 text-sm rounded hover:bg-gray-400 mr-1"
                title="Cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBoard}
                className="bg-green-500 text-white px-2 py-1 text-sm rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-gray-700">{board.title || board.name}</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleEditBoard}
                  className="text-gray-600 hover:text-blue-600"
                  title="Edit board"
                >
                  ✏️
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="text-gray-600 hover:text-red-600"
                  title="Delete board"
                >
                  🗑️
                </button>
              </div>
            </>
          )}
        </div>
        
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
        
        <div ref={setNodeRef} className="flex-grow min-h-[200px] overflow-y-auto">
          <SortableContext items={board.notes.map(note => note.id)} strategy={verticalListSortingStrategy}>
            {board.notes.length === 0 ? (
              <div className="text-gray-400 text-center mt-4">No notes yet</div>
            ) : (
              board.notes.map((note) => (
                <NoteItem key={note.id} note={note} onDelete={onDeleteNote} onUpdate={onUpdateNote} />
              ))
            )}
          </SortableContext>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteBoardConfirm}
        title="Delete Board"
        message={`Are you sure you want to delete the board "${board.title || board.name}"? All notes in this board will also be deleted. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
} 