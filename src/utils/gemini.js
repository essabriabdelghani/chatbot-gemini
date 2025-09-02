import axios from 'axios';

const API_KEY = "AIzaSyDw0pmHmM79DKsRqRSTpcln_5bP2ylXc3s";

// URL pour Gemini texte
const GEMINI_PRO_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// URL pour Gemini Vision (images)
const GEMINI_VISION_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-vision:generateContent?key=${API_KEY}`;


// ------------------ UTILS ------------------
// Fonction pour convertir une image en base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Simulation d'analyse d'image en attendant MFA
const simulateImageAnalysis = (imageFile) => {
  return `🖼️ **Analyse d'image simulée**\n\n• Fichier: ${imageFile.name}\n• Type: ${imageFile.type}\n• Taille: ${Math.round(imageFile.size/1024)}KB\n\n📋 **Description simulée:**\nCette image a été reçue avec succès ! Pour une analyse complète avec Gemini Vision, vous devez activer la validation en deux étapes sur Google Cloud.\n\n🔒 **Étapes requises:**\n1. Activez la validation 2 étapes sur votre compte Google\n2. Attendez 24-48 heures pour la propagation\n3. Les API Gemini Vision seront alors accessibles\n\n💡 En attendant, vous pouvez utiliser la fonctionnalité de chat textuel.`;
};

export const sendMessageToGemini = async (message) => {
  const headers = { "Content-Type": "application/json" };
  const data = {
    contents: [{
      parts: [{ text: message }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  };
  
  try {
    const response = await axios.post(GEMINI_PRO_URL, data, { headers });
    
    if (response.data && response.data.candidates && response.data.candidates[0]) {
      return response.data.candidates[0].content.parts[0].text;
    } else if (response.data.promptFeedback && response.data.promptFeedback.blockReason) {
      return `Message bloqué: ${response.data.promptFeedback.blockReason}`;
    } else {
      return "Erreur: Réponse inattendue de l'API";
    }
  } catch (error) {
    console.error('Erreur Gemini API:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      return "Erreur: Requête invalide. Vérifiez votre message.";
    } else if (error.response?.status === 403) {
      return "Erreur: Clé API invalide ou permissions insuffisantes.";
    } else if (error.response?.status === 429) {
      return "Erreur: Limite de requêtes dépassée. Veuillez réessayer plus tard.";
    } else if (error.response?.status === 500) {
      return "Erreur: Problème interne du serveur Gemini.";
    } else if (error.message === 'Network Error') {
      return "Erreur de connexion: Vérifiez votre accès internet.";
    } else {
      return `Erreur: ${error.message}`;
    }
  }
};

export const analyzeImageWithGemini = async (imageFile, prompt = "Analysez cette image et décrivez-la en détail en français.") => {
  // Simulation en attendant la résolution MFA
  return simulateImageAnalysis(imageFile);
};

// Fonction pour la recherche (simulation) - AJOUT DE L'EXPORT
export const searchAPI = async (query) => {
  try {
    // Simulation de recherche
    const mockResults = [
      {
        id: 1,
        title: `Résultats pour "${query}"`,
        content: `Voici les informations concernant "${query}". Cette fonctionnalité peut être connectée à une API de recherche externe.`
      },
      {
        id: 2,
        title: "Contexte supplémentaire",
        content: `Pour une implémentation complète, intégrez une API comme Google Search, Bing, ou votre propre base de données.`
      }
    ];
    
    return mockResults;
  } catch (error) {
    console.error('Erreur recherche:', error);
    throw new Error('Erreur lors de la recherche');
  }
};

// Analyse basique d'image côté client - AJOUT DE L'EXPORT
export const getBasicImageInfo = (imageFile) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function() {
      resolve({
        width: this.width,
        height: this.height,
        aspectRatio: (this.width / this.height).toFixed(2),
        description: `Image ${this.width}x${this.height} pixels - Analyse basique`
      });
    };
    img.onerror = () => {
      resolve({
        description: `Fichier: ${imageFile.name} (${imageFile.type}) - Taille: ${Math.round(imageFile.size/1024)}KB`
      });
    };
    img.src = URL.createObjectURL(imageFile);
  });
};

// Fonction utilitaire supplémentaire
export const testAPIConnection = async () => {
  try {
    const response = await sendMessageToGemini("Test de connexion");
    return { success: true, message: "API connectée avec succès" };
  } catch (error) {
    return { success: false, message: `Erreur de connexion: ${error.message}` };
  }
};