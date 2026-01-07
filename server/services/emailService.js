// server/services/emailService.js

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.FROM_EMAIL || 'ProjectFlow <onboarding@resend.dev>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Send verification email
async function sendVerificationEmail(user, verificationToken) {
  const verificationUrl = `${FRONTEND_URL}/verify-email/${verificationToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: 'Verify your ProjectFlow account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">⚡ ProjectFlow</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 20px;">Welcome, ${user.name}! 👋</h2>
              
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 25px;">
                Thanks for signing up for ProjectFlow! Please verify your email address to get started.
              </p>
              
              <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Verify Email Address
              </a>
              
              <p style="color: #9ca3af; font-size: 14px; margin: 25px 0 0;">
                This link will expire in 24 hours.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                If you didn't create an account, you can safely ignore this email.
              </p>
              
              <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0;">
                Button not working? Copy this link:<br>
                <a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      throw new Error('Failed to send verification email');
    }

    console.log('Verification email sent:', data.id);
    return data;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
}

// Send password reset email
async function sendPasswordResetEmail(user, resetToken) {
  const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: 'Reset your ProjectFlow password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">⚡ ProjectFlow</h1>
            </div>
            
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 20px;">Reset Your Password</h2>
              
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 25px;">
                We received a request to reset your password. Click the button below to choose a new password.
              </p>
              
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Reset Password
              </a>
              
              <p style="color: #9ca3af; font-size: 14px; margin: 25px 0 0;">
                This link will expire in 10 minutes.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      throw new Error('Failed to send password reset email');
    }

    return data;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
}

// Send welcome email after verification
async function sendWelcomeEmail(user) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: 'Welcome to ProjectFlow! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">⚡ ProjectFlow</h1>
            </div>
            
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 20px;">You're all set, ${user.name}! 🎉</h2>
              
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 25px;">
                Your email has been verified and your account is ready. Here's what you can do:
              </p>
              
              <ul style="color: #6b7280; line-height: 1.8; padding-left: 20px; margin: 0 0 25px;">
                <li>Create your first project</li>
                <li>Get AI-powered task suggestions</li>
                <li>Invite team members to collaborate</li>
                <li>Track your progress in real-time</li>
              </ul>
              
              <a href="${FRONTEND_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Go to Dashboard
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Welcome email error:', error);
    }

    return data;
  } catch (error) {
    console.error('Welcome email error:', error);
    // Don't throw - welcome email is not critical
  }
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
