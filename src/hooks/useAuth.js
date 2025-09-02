import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const savedUser = localStorage.getItem('chatbot_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('chatbot_user', JSON.stringify(userData));
  };

  const register = (userData) => {
    setUser(userData);
    localStorage.setItem('chatbot_user', JSON.stringify(userData));
    // Simuler l'enregistrement dans une "base de données" locale
    const users = JSON.parse(localStorage.getItem('chatbot_users') || '[]');
    users.push(userData);
    localStorage.setItem('chatbot_users', JSON.stringify(users));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatbot_user');
  };

  const checkEmailExists = (email) => {
    const users = JSON.parse(localStorage.getItem('chatbot_users') || '[]');
    return users.some(user => user.email === email);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    checkEmailExists
  };
};