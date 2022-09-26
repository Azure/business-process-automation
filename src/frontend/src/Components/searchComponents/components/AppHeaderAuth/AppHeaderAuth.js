import React from 'react';

// React Context for Auth
import { useAuth } from '../../contexts/AuthContext';

export default function AppHeaderAuth() {
  // React Context: User Authentication
  const user = useAuth();
  
  console.log(`user = ${JSON.stringify(user)}`);

  // Dynamically update auth div based on user context
  const authElement = document.querySelector('.auth');
  if (authElement) {
    // Default sign in
    let html = '<a href="/login" class="auth-link">Sign In</a>';
    
    // User profile and sign out
    let clientPrincipal = (user && user.clientPrincipal) || null,
        userDetails     = (clientPrincipal && clientPrincipal.userDetails) || null;

    if (userDetails) {
      html = `${userDetails} | <a href="/logout" class="auth-link">Sign Out</a>`;
    }

    authElement.innerHTML = html;
  }

  return (
    <div className="auth"></div>
  );
};
