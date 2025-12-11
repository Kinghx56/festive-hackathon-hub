import { createTransport } from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  return createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send confirmation email to team
export const sendConfirmationEmail = async (
  teamEmail,
  teamName,
  teamId,
  teamLeadName
) => {
  try {
    console.log('📧 Creating email transporter...');
    console.log('Email config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASSWORD
    });
    
    const transporter = createTransporter();

    const mailOptions = {
      from: `"NumrenoHacks 2025" <${process.env.EMAIL_USER}>`,
      to: teamEmail,
      subject: '🎄 Registration Confirmed - NumrenoHacks 2025',
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #c41e3a 0%, #165b33 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .team-id {
      background: #fff;
      border-left: 4px solid #c41e3a;
      padding: 15px;
      margin: 20px 0;
      font-size: 18px;
      font-weight: bold;
      color: #c41e3a;
    }
    .button {
      display: inline-block;
      background: #c41e3a;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎄 NumrenoHacks 2025 🎅</h1>
    <p>Registration Confirmed!</p>
  </div>
  
  <div class="content">
    <h2>Welcome, ${teamLeadName}! 🎉</h2>
    
    <p>Congratulations! Your team <strong>${teamName}</strong> has been successfully registered for NumrenoHacks 2025 - The Most Wonderful Hackathon of the Year!</p>
    
    <div class="team-id">
      Your Team ID: ${teamId}
    </div>
    
    <p><strong>What happens next?</strong></p>
    <ul>
      <li>Our team will review your registration</li>
      <li>You'll receive a status update within 24-48 hours</li>
      <li>Check your dashboard for real-time status updates</li>
      <li>Approved teams will receive further instructions via email</li>
    </ul>
    
    <p><strong>Important Credentials:</strong></p>
    <ul>
      <li><strong>Email:</strong> ${teamEmail}</li>
      <li><strong>Password:</strong> Your registered phone number</li>
    </ul>
    
    <p style="text-align: center;">
      <a href="http://localhost:8081/login" class="button">Login to Dashboard</a>
    </p>
    
    <p><strong>Need Help?</strong></p>
    <p>If you have any questions, feel free to reach out to us at support@numrenohacks.com</p>
    
    <p>Best wishes for your hackathon journey! 🚀</p>
    
    <p>
      Warm regards,<br>
      <strong>Team NumrenoHacks</strong>
    </p>
  </div>
  
  <div class="footer">
    <p>© 2025 NumrenoHacks. All rights reserved.</p>
    <p>This is an automated email. Please do not reply to this message.</p>
  </div>
</body>
</html>
      `,
    };

    console.log(`📤 Sending email to ${teamEmail}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${teamEmail}`);
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    return { success: true, message: 'Email sent successfully', messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    console.error('Error command:', error.command);
    return { success: false, message: `Failed to send email: ${error.message}`, error: error.code };
  }
};

// Send status update email (approval/rejection)
export const sendStatusUpdateEmail = async (
  teamEmail,
  teamName,
  teamId,
  teamLeadName,
  status
) => {
  try {
    const transporter = createTransporter();

    const isApproved = status === 'approved';

    const mailOptions = {
      from: `"NumrenoHacks 2025" <${process.env.EMAIL_USER}>`,
      to: teamEmail,
      subject: `${isApproved ? '🎉 Congratulations!' : '📝 Registration Update'} - NumrenoHacks 2025`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: ${isApproved ? 'linear-gradient(135deg, #165b33 0%, #c41e3a 100%)' : 'linear-gradient(135deg, #666 0%, #999 100%)'};
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .status-box {
      background: ${isApproved ? '#d4edda' : '#f8d7da'};
      border-left: 4px solid ${isApproved ? '#28a745' : '#dc3545'};
      padding: 15px;
      margin: 20px 0;
      font-size: 16px;
      color: ${isApproved ? '#155724' : '#721c24'};
    }
    .button {
      display: inline-block;
      background: ${isApproved ? '#165b33' : '#666'};
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎄 NumrenoHacks 2025 🎅</h1>
    <p>Registration Status Update</p>
  </div>
  
  <div class="content">
    <h2>Hello, ${teamLeadName}!</h2>
    
    <div class="status-box">
      <strong>Team ${teamName} (${teamId})</strong><br>
      Status: <strong>${isApproved ? 'APPROVED ✅' : 'PENDING REVIEW 📝'}</strong>
    </div>
    
    ${
      isApproved
        ? `
      <p><strong>🎉 Congratulations! Your team has been approved!</strong></p>
      
      <p>We're thrilled to have you participate in NumrenoHacks 2025! Here's what you need to know:</p>
      
      <ul>
        <li><strong>Hackathon Dates:</strong> [Insert Dates Here]</li>
        <li><strong>Venue:</strong> [Insert Venue Here]</li>
        <li><strong>Check-in Time:</strong> [Insert Time Here]</li>
      </ul>
      
      <p><strong>Next Steps:</strong></p>
      <ul>
        <li>Login to your dashboard for detailed schedule</li>
        <li>Review the problem statements</li>
        <li>Start brainstorming with your team</li>
        <li>Join our Discord/Slack community</li>
      </ul>
      
      <p style="text-align: center;">
        <a href="http://localhost:8081/dashboard" class="button">View Dashboard</a>
      </p>
      
      <p>Get ready for an amazing hackathon experience! 🚀</p>
    `
        : `
      <p>Thank you for your interest in NumrenoHacks 2025.</p>
      
      <p>After careful review, we regret to inform you that your team registration is currently on hold. This could be due to:</p>
      
      <ul>
        <li>Incomplete information in the registration form</li>
        <li>Capacity limitations</li>
        <li>Other administrative reasons</li>
      </ul>
      
      <p>However, this doesn't mean the end of the road! You can:</p>
      <ul>
        <li>Update your registration details</li>
        <li>Reach out to us for clarification</li>
        <li>Apply for future hackathons</li>
      </ul>
      
      <p>We appreciate your enthusiasm and hope to see you in future events! 💚</p>
    `
    }
    
    <p>
      Best regards,<br>
      <strong>Team NumrenoHacks</strong>
    </p>
  </div>
  
  <div class="footer">
    <p>© 2025 NumrenoHacks. All rights reserved.</p>
    <p>Questions? Contact us at support@numrenohacks.com</p>
  </div>
</body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Status update email sent to ${teamEmail}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending status email:', error);
    return { success: false, message: 'Failed to send email' };
  }
};
