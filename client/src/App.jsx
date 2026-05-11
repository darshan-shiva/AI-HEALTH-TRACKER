import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Meals from './pages/Meals';
import Workouts from './pages/Workouts';
import Water from './pages/Water';
import Sleep from './pages/Sleep';
import AiSuggestions from './pages/AiSuggestions';
import Profile from './pages/Profile';

const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-transparent">
    <Navbar />
    <div className="flex max-w-7xl mx-auto pt-6 px-4 gap-6">
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 pb-12 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ className: 'dark:bg-gray-800 dark:text-white border dark:border-gray-700 shadow-xl' }} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
          <Route path="/meals" element={<PrivateRoute><AppLayout><Meals /></AppLayout></PrivateRoute>} />
          <Route path="/workouts" element={<PrivateRoute><AppLayout><Workouts /></AppLayout></PrivateRoute>} />
          <Route path="/water" element={<PrivateRoute><AppLayout><Water /></AppLayout></PrivateRoute>} />
          <Route path="/sleep" element={<PrivateRoute><AppLayout><Sleep /></AppLayout></PrivateRoute>} />
          <Route path="/ai-suggestions" element={<PrivateRoute><AppLayout><AiSuggestions /></AppLayout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><AppLayout><Profile /></AppLayout></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
