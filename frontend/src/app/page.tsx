"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to Note Board
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Organize your notes with our drag-and-drop interface. Create boards and easily move notes between them.
          </p>
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium mx-2 hover:bg-blue-700"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-md font-medium mx-2 hover:bg-green-700"
            >
              Register
            </Link>
          </div>
        </div>
        
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Create Boards</h2>
              <p className="text-gray-600">
                Organize your notes by creating multiple boards to categorize and manage your tasks efficiently.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add Notes</h2>
              <p className="text-gray-600">
                Add as many notes as you need to each board to keep track of your ideas, tasks, or reminders.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Drag & Drop</h2>
              <p className="text-gray-600">
                Easily move notes between boards with our intuitive drag-and-drop interface.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
