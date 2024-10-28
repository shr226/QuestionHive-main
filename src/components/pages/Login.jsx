import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, SignIn } from '@clerk/clerk-react';

function Login() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <SignIn redirectUrl="/dashboard" />
      </div>
    </div>
  );
}

export default Login;