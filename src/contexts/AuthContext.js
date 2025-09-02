import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData, token = null) => {
    setIsAuthenticated(true);
    setUser(userData);
    
    if (token) {
      localStorage.setItem('authToken', token);
    }
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const register = (userData, token = null) => {
    setIsAuthenticated(true);
    setUser(userData);
    
    if (token) {
      localStorage.setItem('authToken', token);
    }
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout
  };
  // Dans votre AuthContext.js
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  const register = async (userData, token) => {
    // Vérifier si l'email existe déjà
    const emailExists = users.some(user => user.email === userData.email);
    if (emailExists) {
      return { error: "Cet email est déjà utilisé. Veuillez utiliser un autre email." };
    }
    
    // Ajouter le nouvel utilisateur
    setUsers(prevUsers => [...prevUsers, userData]);
    
    // Stocker dans localStorage
    localStorage.setItem('users', JSON.stringify([...users, userData]));
    localStorage.setItem('authToken', token);
    setCurrentUser(userData);
    
    return { success: true };
  };

  // ... autres fonctions et valeurs du contexte
};

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};