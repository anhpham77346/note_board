import { LoginForm } from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-blue-600 to-indigo-700 justify-center items-center">
        <div className="max-w-md text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Note Board</h1>
          <p className="text-xl mb-6">
            Organize your thoughts with our intuitive drag-and-drop note board application.
          </p>
          <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Create multiple boards</span>
            </div>
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Organize notes with drag and drop</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Access from anywhere</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
} 