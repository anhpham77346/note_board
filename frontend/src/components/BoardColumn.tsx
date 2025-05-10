"use client";

import { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
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
      <div className="bg-white p-4 rounded-xl shadow-md min-w-[480px] max-w-[480px] h-[calc(100vh-100px)] flex flex-col border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="pb-3 mb-3 border-b border-gray-100">
          {isEditing ? (
            <div className="flex flex-col w-full">
              <input
                ref={editInputRef}
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-2 text-lg font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveBoard();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-200 text-gray-700 px-2 py-1.5 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                  title="Cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBoard}
                  className="flex-1 bg-blue-600 text-white px-2 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 truncate">{board.title || board.name}</h2>
                <div className="flex space-x-1">
                  <button
                    onClick={handleEditBoard}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit board"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete board"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {board.notes.length} {board.notes.length === 1 ? 'note' : 'notes'}
              </div>
            </>
          )}
        </div>
        
        <div className="mb-4">
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Add a new note..."
            className="w-full p-2 border border-gray-300 rounded-lg mb-2 resize-none min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddNote()}
          />
          <button
            onClick={handleAddNote}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 w-full flex items-center justify-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Note
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div ref={setNodeRef} className="min-h-[100px]">
            <SortableContext items={board.notes.map(note => note.id)} strategy={rectSortingStrategy}>
              {board.notes.length === 0 ? (
                <div className="text-gray-400 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No notes yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 pb-4">
                  {board.notes.map((note) => (
                    <NoteItem key={note.id} note={note} onDelete={onDeleteNote} onUpdate={onUpdateNote} />
                  ))}
                </div>
              )}
            </SortableContext>
          </div>
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