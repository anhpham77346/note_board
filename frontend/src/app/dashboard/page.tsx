"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { NoteBoard } from '../../components/NoteBoard';

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="w-full h-full">
        <NoteBoard />
      </main>
    </div>
  );
}