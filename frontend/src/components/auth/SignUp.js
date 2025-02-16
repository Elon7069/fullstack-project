import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div className="auth-container">
      <SignUp routing="path" path="/signup" />
    </div>
  );
};

export default SignUpPage;