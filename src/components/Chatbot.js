import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { sendMessageToGemini, analyzeImageWithGemini, searchAPI, getBasicImageInfo } from '../utils/gemini';

const Chatbot = () => {
  // État pour gérer les multiples chats
  const [chats, setChats] = useState({
    'chat-1': {
      id: 'chat-1',
      name: 'Chat 1',
      messages: [
        {
          id: 1,
          text: "Bonjour ! Je suis votre assistant Gemini. Comment puis-je vous aider ?",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
      createdAt: new Date()
    }
  });
  
  const [currentChatId, setCurrentChatId] = useState('chat-1');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Récupérer le chat actuel
  const currentChat = chats[currentChatId];
  const messages = currentChat?.messages || [];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, searchResults]);

  // Sauvegarder les chats dans le localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem('gemini-chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gemini-chats', JSON.stringify(chats));
  }, [chats]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    // Ajouter le message au chat actuel
    const updatedChats = {
      ...chats,
      [currentChatId]: {
        ...currentChat,
        messages: [...currentChat.messages, userMessage]
      }
    };
    setChats(updatedChats);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };

      // Ajouter la réponse du bot
      const finalChats = {
        ...updatedChats,
        [currentChatId]: {
          ...currentChat,
          messages: [...updatedChats[currentChatId].messages, botMessage]
        }
      };
      setChats(finalChats);

      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = 'fr-FR';
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Erreur de connexion au service',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      const errorChats = {
        ...chats,
        [currentChatId]: {
          ...currentChat,
          messages: [...currentChat.messages, errorMessage]
        }
      };
      setChats(errorChats);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    const newChat = {
      id: newChatId,
      name: `Chat ${Object.keys(chats).length + 1}`,
      messages: [
        {
          id: 1,
          text: "Bonjour ! Je suis votre assistant Gemini. Comment puis-je vous aider ?",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
      createdAt: new Date()
    };

    setChats(prev => ({
      ...prev,
      [newChatId]: newChat
    }));
    setCurrentChatId(newChatId);
    setActiveTab('chat');
    setSearchQuery('');
    setSearchResults([]);
    clearImage();
  };

  const switchChat = (chatId) => {
    setCurrentChatId(chatId);
    setActiveTab('chat');
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    if (Object.keys(chats).length <= 1) {
      alert("Vous ne pouvez pas supprimer le dernier chat");
      return;
    }

    const updatedChats = { ...chats };
    delete updatedChats[chatId];
    setChats(updatedChats);

    // Si on supprime le chat actuel, passer au premier chat disponible
    if (chatId === currentChatId) {
      const remainingChatIds = Object.keys(updatedChats);
      setCurrentChatId(remainingChatIds[0]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const results = await searchAPI(searchQuery);
      setSearchResults(results);
    } catch (error) {
      alert("Erreur lors de la recherche");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setActiveTab('image');
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage || isLoading) return;

    setIsLoading(true);
    try {
      const analysis = await analyzeImageWithGemini(selectedImage);
      
      const botMessage = {
        id: Date.now(),
        text: analysis,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      
      const updatedChats = {
        ...chats,
        [currentChatId]: {
          ...currentChat,
          messages: [...currentChat.messages, botMessage]
        }
      };
      setChats(updatedChats);
      setActiveTab('chat');
      
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(analysis);
        utterance.lang = 'fr-FR';
        speechSynthesis.speak(utterance);
      }

    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        text: `Erreur: ${error.message}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      const errorChats = {
        ...chats,
        [currentChatId]: {
          ...currentChat,
          messages: [...currentChat.messages, errorMessage]
        }
      };
      setChats(errorChats);
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && activeTab === 'chat') {
      handleSendMessage();
    } else if (e.key === 'Enter' && activeTab === 'search') {
      handleSearch();
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (activeTab === 'chat') {
          setInputMessage(transcript);
        } else if (activeTab === 'search') {
          setSearchQuery(transcript);
        }
      };
      recognition.start();
    } else {
      alert("La reconnaissance vocale n'est pas supportée par votre navigateur");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar verticale à gauche */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-80'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        {/* Header de la sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h2 className="text-lg font-bold text-gray-800">Gemini Chat</h2>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition duration-200"
              title={sidebarCollapsed ? "Agrandir" : "Réduire"}
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
          
          {!sidebarCollapsed && (
            <button
              onClick={handleNewChat}
              className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
            >
              <span className="mr-2">+</span> Nouveau Chat
            </button>
          )}
        </div>

        {/* Navigation verticale */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-700 mb-2">Navigation</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('chat')}
                className={`w-full text-left p-3 rounded-lg transition duration-200 flex items-center ${
                  activeTab === 'chat' 
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">💬</span>
                Chat
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`w-full text-left p-3 rounded-lg transition duration-200 flex items-center ${
                  activeTab === 'search' 
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">🔍</span>
                Recherche
              </button>
              <button
                onClick={handleImageUpload}
                className={`w-full text-left p-3 rounded-lg transition duration-200 flex items-center ${
                  activeTab === 'image' 
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">📷</span>
                Upload Image
              </button>
            </div>
          </div>
        )}

        {/* Liste des chats */}
        <div className="flex-1 overflow-y-auto p-4">
          {!sidebarCollapsed ? (
            <>
              <h3 className="font-medium text-gray-700 mb-3">Conversations</h3>
              <div className="space-y-2">
                {Object.values(chats)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => switchChat(chat.id)}
                      className={`p-3 rounded-lg cursor-pointer transition duration-200 group ${
                        chat.id === currentChatId
                          ? 'bg-indigo-100 border-2 border-indigo-500'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm">{chat.name}</h4>
                          <p className="text-xs text-gray-500">
                            {formatDate(chat.createdAt)}
                          </p>
                          {chat.messages.length > 1 && (
                            <p className="text-xs text-gray-600 truncate mt-1">
                              {chat.messages[chat.messages.length - 1].text}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => deleteChat(chat.id, e)}
                          className="ml-2 p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition duration-200"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            // Sidebar réduite - icônes seulement
            <div className="space-y-4">
              <button
                onClick={handleNewChat}
                className="w-full p-3 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition duration-200"
                title="Nouveau Chat"
              >
                +
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`w-full p-3 rounded-lg transition duration-200 ${
                  activeTab === 'chat' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Chat"
              >
                💬
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`w-full p-3 rounded-lg transition duration-200 ${
                  activeTab === 'search' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Recherche"
              >
                🔍
              </button>
              <button
                onClick={handleImageUpload}
                className={`w-full p-3 rounded-lg transition duration-200 ${
                  activeTab === 'image' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Upload Image"
              >
                📷
              </button>
            </div>
          )}
        </div>

        {/* Footer de la sidebar */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center">
                <button
                  onClick={toggleVoice}
                  className={`p-2 rounded-full ${voiceEnabled ? 'bg-green-500' : 'bg-gray-300'} transition duration-300`}
                  title={voiceEnabled ? 'Voix activée' : 'Voix désactivée'}
                >
                  {voiceEnabled ? '🔊' : '🔇'}
                </button>
                <span className="ml-2 text-sm text-gray-600">
                  {voiceEnabled ? 'Son ON' : 'Son OFF'}
                </span>
              </div>
            )}
            <div className="text-xs text-gray-500">
              {Object.keys(chats).length} chats
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">{currentChat?.name || 'Chatbot Gemini'}</h1>
              {user && (
                <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full">
                  {user.avatar} {user.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm opacity-80">
                {formatDate(new Date())}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-300 ml-2"
                title="Déconnexion"
              >
                🚪
              </button>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white text-gray-800 shadow-md'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-lg p-3 shadow-md">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Entrez votre recherche..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchQuery.trim()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
                >
                  🔍
                </button>
                <button
                  onClick={handleVoiceInput}
                  className="bg-indigo-100 text-indigo-600 p-2 rounded-lg hover:bg-indigo-200 transition duration-300"
                  title="Recherche vocale"
                >
                  🎙️
                </button>
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <div key={result.id} className="bg-white rounded-lg p-4 shadow-md">
                      <h3 className="font-bold text-lg text-indigo-600">{result.title}</h3>
                      <p className="text-gray-700">{result.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Recherche</h2>
                  <p className="text-gray-600">Entrez un terme de recherche pour commencer</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'image' && (
            <div className="space-y-4">
              {imagePreview ? (
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h3 className="font-bold text-lg mb-3">Image sélectionnée</h3>
                  <div className="flex flex-col items-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full h-64 object-contain rounded-lg mb-4"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={analyzeImage}
                        disabled={isLoading}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition duration-300"
                      >
                        {isLoading ? 'Analyse en cours...' : 'Analyser l\'image'}
                      </button>
                      <button
                        onClick={clearImage}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                      >
                        Changer d'image
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <div className="text-4xl mb-4">📷</div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Upload d'Image</h2>
                  <p className="text-gray-600 mb-4">Sélectionnez une image pour l'analyser</p>
                  <button
                    onClick={handleImageUpload}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                  >
                    Choisir une image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area - seulement visible en mode chat */}
        {activeTab === 'chat' && (
          <div className="bg-white border-t p-4">
            <div className="flex space-x-2">
              <button
                onClick={handleVoiceInput}
                className="bg-indigo-100 text-indigo-600 p-2 rounded-full hover:bg-indigo-200 transition duration-300"
                title="Parler"
              >
                🎙️
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
                title="Envoyer"
              >
                📤
              </button>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default Chatbot;