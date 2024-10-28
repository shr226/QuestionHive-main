import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, SignUp as ClerkSignUp } from '@clerk/clerk-react';

function SignUpPage() {
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
        <ClerkSignUp redirectUrl="/dashboard" />
      </div>
    </div>
  );
}

export default SignUpPage;