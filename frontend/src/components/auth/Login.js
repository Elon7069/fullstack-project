import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="auth-container">
      <SignIn routing="path" path="/login" />
    </div>
  );
};

export default Login;