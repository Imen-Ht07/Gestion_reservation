const nodemailer = require('nodemailer');
require('dotenv').config();

// Vérification des variables d'environnement nécessaires
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn(`WARNING: Variables d'environnement manquantes pour l'email: ${missingVars.join(', ')}`);
}

// Configuration avec valeurs par défaut pour éviter les erreurs
const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || 587, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};

// Création du transporteur avec gestion d'erreur
let transporter;
try {
  transporter = nodemailer.createTransport(smtpConfig);
} catch (error) {
  console.error('Erreur lors de la création du transporteur SMTP:', error);
  // Créer un transporteur factice qui journalise au lieu d'envoyer
  transporter = {
    sendMail: (mailOptions) => {
      console.warn('Email non envoyé (problème de configuration):', mailOptions);
      return Promise.resolve({ sent: false, error: 'Configuration SMTP invalide' });
    }
  };
}

/**
 * Envoie un email avec gestion d'erreur robuste
 * @param {Object} options - Options d'email
 * @param {string} options.to - Destinataire de l'email
 * @param {string} options.subject - Sujet de l'email
 * @param {string} options.text - Contenu texte de l'email
 * @param {string} [options.html] - Contenu HTML de l'email (optionnel)
 * @returns {Promise<Object>} - Résultat de l'opération d'envoi
 */
const sendEmail = async (options) => {
  // Validation des paramètres
  if (!options || !options.to || !options.subject || (!options.text && !options.html)) {
    console.error('Paramètres d\'email invalides:', options);
    return { sent: false, error: 'Paramètres invalides' };
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || 'Système de Réservation <noreply@example.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    // Vérifier si le transporteur est correctement configuré
    if (!transporter.sendMail) {
      throw new Error('Transporteur email non initialisé');
    }
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email envoyé → To: ${options.to} | Sujet: ${options.subject}`);
    return { sent: true, info };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
    // Ne pas faire échouer le flux principal en cas d'erreur d'email
    return { sent: false, error: error.message };
  }
};

// Test initial de la connexion SMTP
const testConnection = async () => {
  try {
    if (transporter.verify) {
      await transporter.verify();
      console.log('Connexion SMTP vérifiée avec succès');
    }
  } catch (error) {
    console.error('Erreur de connexion SMTP:', error.message);
  }
};

// Exécuter le test si ce n'est pas un import
if (require.main === module) {
  testConnection();
}

module.exports = sendEmail;