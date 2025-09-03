const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chat_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Middleware pour vérifier le token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requis' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'votre_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// ✅ Route de santé de l'API
app.get('/api/health', (req, res) => {
  res.json({ message: 'Serveur fonctionnel', timestamp: new Date().toISOString() });
});

// ✅ Route d'inscription
app.post('/api/register', async (req, res) => {
  let connection;
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    connection = await pool.getConnection();
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const token = jwt.sign(
      { userId: result.insertId, email },
      process.env.JWT_SECRET || 'votre_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: {
        id: result.insertId,
        name,
        email,
        avatar: '👤'
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  } finally {
    if (connection) connection.release();
  }
});

// ✅ Route de connexion - SÉCURISÉE
app.post('/api/login', async (req, res) => {
  let connection;
  try {
    const { email, password } = req.body;

    // Validation stricte des données
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Données invalides' });
    }

    connection = await pool.getConnection();
    
    // 🔍 Vérification STRICTE de l'email
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email.trim().toLowerCase()] // Normalisation de l'email
    );

    // 🚨 Email non trouvé - Refus strict
    if (users.length === 0) {
      return res.status(401).json({ 
        error: 'Identifiants incorrects',
        message: 'Email ou mot de passe invalide'
      });
    }

    const user = users[0];

    // 🔐 Vérification STRICTE du mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    
    // 🚨 Mot de passe incorrect - Refus strict
    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Identifiants incorrects',
        message: 'Email ou mot de passe invalide'
      });
    }

    // ✅ Validation réussie - Génération du token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET || 'votre_secret_tres_securise',
      { expiresIn: '24h' }
    );

    // 🎉 Connexion autorisée
    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '👤'
      }
    });

  } catch (error) {
    console.error('Erreur de sécurité lors de la connexion:', error);
    res.status(500).json({ 
      error: 'Erreur de sécurité',
      message: 'Impossible de traiter la demande'
    });
  } finally {
    if (connection) connection.release();
  }
});

// ✅ Route pour récupérer le profil
app.get('/api/profile', authenticateToken, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [users] = await connection.execute(
      'SELECT id, name, email, avatar, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du profil' });
  } finally {
    if (connection) connection.release();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 API disponible sur: http://localhost:${PORT}/api`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});