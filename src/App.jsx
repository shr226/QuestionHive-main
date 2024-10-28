 import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import ExamManagementLandingPage from './components/pages/LandingPage';
import Login from './components/pages/Login';
import SignUpPage from './components/pages/SignUp';
import Profile from './components/pages/Profile';
import DashBoard from './components/pages/DashBoard';
import CreateExam from './components/pages/CreateExam';
import SelectQuestions from './components/pages/SelectQuestions';
import AddedQuestions from './components/pages/AddedQuestions';
import Preview from './components/pages/Preview';

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
              <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>)
  }

  return isSignedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
    <ClerkLoading>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
              <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    </ClerkLoading>
    <ClerkLoaded>
      <Router>
        <Routes>
          <Route path="/" element={<ExamManagementLandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
          <Route path="/exam" element={<ProtectedRoute><CreateExam /></ProtectedRoute>} />
          <Route path="/questions" element={<ProtectedRoute><SelectQuestions /></ProtectedRoute>} />
          <Route path="/addedQuestions" element={<ProtectedRoute><AddedQuestions /></ProtectedRoute>} />
          <Route path="/preview" element={<ProtectedRoute><Preview /></ProtectedRoute>} />
        </Routes>
      </Router>
    </ClerkLoaded>
    </>
  );
}

export default App;
