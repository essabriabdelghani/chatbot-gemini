import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ConnexionGoogle = () => {
  const [googleEmail, setGoogleEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  // Votre email Google autorisé
  const MON_EMAIL_GOOGLE = 'essabriabdelghani13@gmail.com'; // Remplacez par votre vrai email

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!googleEmail.trim()) {
      setError('Veuillez entrer votre email Google');
      return;
    }

    setIsLoading(true);
    
    try {
      // Vérifier si l'email est un email Google valide
      const isGoogleEmail = googleEmail.includes('@gmail.com') || googleEmail.includes('@googlemail.com');
      
      if (!isGoogleEmail) {
        setError('Veuillez utiliser une adresse Google (Gmail) valide');
        setIsLoading(false);
        return;
      }

      // Vérifier si l'email correspond exactement à votre email autorisé
      if (googleEmail.toLowerCase() !== MON_EMAIL_GOOGLE.toLowerCase()) {
        setError(`Accès refusé. Seul l'email ${MON_EMAIL_GOOGLE} est autorisé.`);
        setIsLoading(false);
        return;
      }

      // Si l'email est correct, procéder à la connexion
      const userData = {
        id: Date.now(),
        email: googleEmail,
        name: googleEmail.split('@')[0],
        avatar: '🔵',
        provider: 'google'
      };
      
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikdvb2dsZSBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      await login(userData, fakeToken);
      navigate('/chat');
      
    } catch (err) {
      setError('Erreur lors de la connexion Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/connexion');
  };

  // Fonction pour masquer partiellement l'email dans le message
  const maskEmail = (email) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.length > 2 
      ? username.substring(0, 2) + '*'.repeat(username.length - 2)
      : '*'.repeat(username.length);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-chatbot-pattern">
      <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Bouton retour */}
          <button
            onClick={handleBack}
            className="mb-6 flex items-center text-indigo-600 hover:text-indigo-500 transition duration-200"
          >
            <span className="mr-2">←</span>
            Retour
          </button>

          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl text-white">🔵</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Connexion Google</h1>
            <p className="text-gray-600">Authentification sécurisée requise</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="googleEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email Google autorisé
              </label>
              <input
                id="googleEmail"
                type="email"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Entrez l'email autorisé"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Seul l'email {maskEmail(MON_EMAIL_GOOGLE)} est autorisé pour cette démo
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Vérification...
                </>
              ) : (
                'Se connecter avec Google'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">🔒 Accès restreint</h3>
            <p className="text-sm text-blue-700">
              Cette démo a un accès restreint. Seul l'email <strong>{MON_EMAIL_GOOGLE}</strong> est autorisé à se connecter.
            </p>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note :</strong> En production, cette page serait remplacée par l'authentification officielle de Google OAuth.
            </p>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Pas l'email autorisé?{' '}
              <Link
                to="/connexion"
                className="text-indigo-600 hover:text-indigo-500 font-medium transition duration-200"
              >
                Retour à la connexion standard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnexionGoogle;