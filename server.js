import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendConfirmationEmail, sendStatusUpdateEmail } from './email-service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true
}));

// Your reCAPTCHA Secret Key
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || 'YOUR_SECRET_KEY_HERE';

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { recaptchaToken, ...formData } = req.body;

    // Verify reCAPTCHA token with Google
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    
    const verifyResponse = await axios.post(verifyUrl, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
        remoteip: req.ip
      }
    });

    const { success, score, 'error-codes': errorCodes } = verifyResponse.data;

    // Check if reCAPTCHA verification failed
    if (!success) {
      console.error('❌ reCAPTCHA verification failed:', errorCodes);
      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA verification failed. Please try again.',
        errors: errorCodes
      });
    }

    // reCAPTCHA v3 score check (0.0 - 1.0, higher is more likely human)
    const MIN_SCORE = 0.5;
    if (score < MIN_SCORE) {
      console.error(`❌ reCAPTCHA score too low: ${score} (minimum: ${MIN_SCORE})`);
      return res.status(400).json({
        success: false,
        message: 'Security verification failed. Please try again later.',
      });
    }

    // reCAPTCHA verified successfully
    console.log(`✅ reCAPTCHA verified for: ${formData.teamLeadEmail} (score: ${score})`);
    console.log('📋 Registration data:', {
      teamName: formData.teamName,
      institution: formData.institutionName,
      members: formData.numberOfMembers,
      track: formData.projectTrack
    });

    // NOTE: Firebase operations are handled on the frontend
    // This endpoint is primarily for reCAPTCHA verification
    // The actual team registration is done in the frontend using Firestore

    // Generate team ID for response (actual ID generated in frontend)
    const teamId = 'NH-2025-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    // Send confirmation email
    try {
      console.log('📧 Attempting to send confirmation email...');
      const emailResult = await sendConfirmationEmail(
        formData.teamLeadEmail,
        formData.teamName,
        teamId,
        formData.teamLeadName
      );
      console.log('📧 Email result:', emailResult);
    } catch (emailError) {
      console.error('⚠️ Email sending failed, but registration succeeded:');
      console.error('Error details:', emailError);
    }

    // Send success response
    return res.status(200).json({
      success: true,
      message: 'Registration successful!',
      teamId: teamId,
      data: {
        teamName: formData.teamName,
        teamLeadEmail: formData.teamLeadEmail
      }
    });

  } catch (error) {
    console.error('💥 Registration error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// Admin password validation endpoint
app.post('/api/admin/validate', (req, res) => {
  try {
    const { password } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (password === ADMIN_PASSWORD) {
      console.log('✅ Admin login successful');
      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
      });
    } else {
      console.log('❌ Admin login failed - incorrect password');
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }
  } catch (error) {
    console.error('💥 Admin auth error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
});

// Send status update email endpoint
app.post('/api/send-status-email', async (req, res) => {
  try {
    const { teamEmail, teamName, teamId, teamLeadName, status } = req.body;

    if (!teamEmail || !teamName || !teamId || !teamLeadName || !status) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    await sendStatusUpdateEmail(teamEmail, teamName, teamId, teamLeadName, status);

    return res.status(200).json({
      success: true,
      message: 'Status update email sent successfully',
    });
  } catch (error) {
    console.error('💥 Email error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NumrenoHacks API is running',
    timestamp: new Date().toISOString()
  });
});

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    console.log('📧 Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET');

    const result = await sendConfirmationEmail(
      email,
      'Test Team',
      'TEST-001',
      'Test User'
    );

    return res.json({
      success: result.success,
      message: result.message,
      config: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        passwordSet: !!process.env.EMAIL_PASSWORD
      }
    });
  } catch (error) {
    console.error('❌ Test email error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('🎄========================================🎄');
  console.log('🎅  NumrenoHacks Backend Server Started  🎅');
  console.log('🎄========================================🎄');
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Registration endpoint: http://localhost:${PORT}/api/register`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('⚠️  Don\'t forget to:');
  console.log('   1. Add your reCAPTCHA Secret Key to .env file');
  console.log('   2. Update frontend Site Key in Register.tsx');
  console.log('');
  console.log('🎄========================================🎄');
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Try a different port.`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
