// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Inscription from './components/Inscription';
import Connexion from './components/Connexion';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <AuthProvider>
      
        <div className="App">
          <Routes>
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/" element={<Navigate to="/connexion" />} />
          </Routes>
        </div>
    
    </AuthProvider>
  );
}

export default App;