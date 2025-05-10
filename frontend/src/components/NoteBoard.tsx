"use client";

import { useState, useEffect, useCallback } from 'react';
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
import { boardsApi, notesApi, ApiBoard, ApiNote } from '../services/api';
import { toast } from 'react-hot-toast';

export function NoteBoard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Chuyển đổi từ API Board sang dạng Board trong UI
  const mapApiToBoard = (apiBoard: ApiBoard): Board => ({
    id: apiBoard.id,
    title: apiBoard.name,
    name: apiBoard.name,
    notes: [],
    createdAt: apiBoard.createdAt
  });

  // Chuyển đổi từ API Note sang dạng Note trong UI
  const mapApiToNote = (apiNote: ApiNote): Note => ({
    id: apiNote.id,
    content: apiNote.content,
    boardId: apiNote.boardId,
    createdAt: apiNote.createdAt
  });

  // Tải tất cả boards và notes
  const fetchBoardsAndNotes = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch tất cả boards
      const apiBoards = await boardsApi.getAll();
      
      // Khởi tạo boards với mảng notes rỗng
      let mappedBoards = apiBoards.map(mapApiToBoard);
      
      // Cho mỗi board, fetch notes
      for (const board of mappedBoards) {
        try {
          const apiNotes = await notesApi.getByBoardId(Number(board.id));
          board.notes = apiNotes.map(mapApiToNote);
        } catch (error) {
          console.error(`Failed to load notes for board ${board.id}:`, error);
        }
      }
      
      setBoards(mappedBoards);
    } catch (error) {
      console.error('Failed to load boards:', error);
      toast.error('Failed to load boards. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data khi component mount
  useEffect(() => {
    fetchBoardsAndNotes();
  }, [fetchBoardsAndNotes]);

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
      const targetBoardId = over.id as string | number;
      
      // If the note is already in this board, do nothing
      if (activeNote.boardId === targetBoardId) return;
      
      // Update UI optimistically
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
        
        // Add to target board with updated boardId
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

      // Use the new moveNote API
      notesApi.moveNote(Number(activeNote.id), Number(targetBoardId))
        .catch(error => {
          console.error('Failed to move note:', error);
          toast.error('Failed to move note. Please try again.');
          // Revert optimistic update
          fetchBoardsAndNotes();
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

  const handleAddNote = async (boardId: string | number, content: string) => {
    if (!content.trim()) return;

    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const newNote: Note = {
        id: tempId,
        content,
        boardId
      };

      setBoards(boards => {
        return boards.map(board => {
          if (board.id === boardId) {
            return {
              ...board,
              notes: [...board.notes, newNote]
            };
          }
          return board;
        });
      });

      // Call API
      const createdNote = await notesApi.create(Number(boardId), content);
      
      // Update with actual data from server
      setBoards(boards => {
        return boards.map(board => {
          if (board.id === boardId) {
            return {
              ...board,
              notes: [
                ...board.notes.filter(note => note.id !== tempId),
                mapApiToNote(createdNote)
              ]
            };
          }
          return board;
        });
      });

      toast.success('Note added successfully');
    } catch (error) {
      console.error('Failed to create note:', error);
      toast.error('Failed to add note. Please try again.');
      
      // Remove the optimistic note on error
      setBoards(boards => {
        return boards.map(board => {
          if (board.id === boardId) {
            return {
              ...board,
              notes: board.notes.filter(note => note.id !== `temp-${Date.now()}`)
            };
          }
          return board;
        });
      });
    }
  };

  const handleDeleteNote = async (noteId: string | number) => {
    try {
      // Optimistic update
      let deletedNote: Note | null = null;
      let sourceBoardId: string | number | null = null;

      setBoards(boards => {
        return boards.map(board => {
          const noteToDelete = board.notes.find(note => note.id === noteId);
          if (noteToDelete) {
            deletedNote = noteToDelete;
            sourceBoardId = board.id;
          }
          return {
            ...board,
            notes: board.notes.filter(note => note.id !== noteId)
          };
        });
      });

      // Call API
      await notesApi.delete(Number(noteId));
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast.error('Failed to delete note. Please try again.');
      
      // Refresh data on error
      fetchBoardsAndNotes();
    }
  };

  const handleAddBoard = async () => {
    if (!newBoardTitle.trim()) return;

    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const newBoard: Board = {
        id: tempId,
        title: newBoardTitle,
        name: newBoardTitle,
        notes: []
      };

      setBoards([...boards, newBoard]);
      setNewBoardTitle('');

      // Call API
      const createdBoard = await boardsApi.create(newBoardTitle);
      
      // Update with actual data from server
      setBoards(boards => [
        ...boards.filter(board => board.id !== tempId),
        mapApiToBoard(createdBoard)
      ]);

      toast.success('Board added successfully');
    } catch (error) {
      console.error('Failed to create board:', error);
      toast.error('Failed to add board. Please try again.');
      
      // Remove the optimistic board on error
      setBoards(boards => boards.filter(board => board.id !== `temp-${Date.now()}`));
    }
  };

  // Thêm chức năng cập nhật board
  const handleUpdateBoard = async (boardId: string | number, name: string) => {
    if (!name.trim()) return;

    try {
      // Cập nhật UI trước (optimistic update)
      setBoards(boards => {
        return boards.map(board => {
          if (board.id === boardId) {
            return {
              ...board,
              title: name,
              name: name
            };
          }
          return board;
        });
      });

      // Gọi API
      await boardsApi.update(Number(boardId), name);
      toast.success('Board updated successfully');
    } catch (error) {
      console.error('Failed to update board:', error);
      toast.error('Failed to update board. Please try again.');
      
      // Nếu có lỗi, tải lại dữ liệu
      fetchBoardsAndNotes();
    }
  };

  // Thêm chức năng xóa board
  const handleDeleteBoard = async (boardId: string | number) => {
    try {
      // Lưu dữ liệu board để khôi phục nếu cần
      const boardToDelete = boards.find(board => board.id === boardId);
      
      // Cập nhật UI trước (optimistic update)
      setBoards(boards => boards.filter(board => board.id !== boardId));

      // Gọi API
      await boardsApi.delete(Number(boardId));
      toast.success('Board deleted successfully');
    } catch (error) {
      console.error('Failed to delete board:', error);
      toast.error('Failed to delete board. Please try again.');
      
      // Nếu có lỗi, tải lại dữ liệu
      fetchBoardsAndNotes();
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

      {boards.length === 0 ? (
        <div className="text-center p-10 bg-gray-100 rounded-lg">
          <p className="text-gray-600">No boards yet. Create your first board to get started!</p>
        </div>
      ) : (
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
                onUpdateBoard={handleUpdateBoard}
                onDeleteBoard={handleDeleteBoard}
              />
            ))}
          </div>

          <DragOverlay>
            {activeNote ? <NoteItem note={activeNote} onDelete={() => {}} /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
} 