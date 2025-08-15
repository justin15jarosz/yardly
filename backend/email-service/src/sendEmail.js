import { transporter, emailConfig } from "./server.js";

// Generate OTP email template
function generateOTPEmail(name, otp, otpToken, websiteUrl) {
  const verifyUrl = `${websiteUrl}/verify?token=${otpToken}&email=`;

  return {
    subject: "Verify Your Email - OTP Required",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .otp-box { background-color: #fff; border: 2px solid #4CAF50; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; }
            .verify-button { display: inline-block; background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome ${name}!</h1>
                <p>Please verify your email address</p>
            </div>
            <div class="content">
                <p>Thank you for registering with us! To complete your registration, please verify your email address using the OTP below:</p>
                
                <div class="otp-box">
                    <p><strong>Your OTP Code:</strong></p>
                    <div class="otp-code">${otp}</div>
                    <p><em>This code will expire in 15 minutes</em></p>
                </div>
                
                <p>You can also click the button below to verify directly:</p>
                <div style="text-align: center;">
                    <a href="${verifyUrl}" class="verify-button">Verify Email Address</a>
                </div>
                
                <p><strong>Alternative verification:</strong></p>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background-color: #eee; padding: 10px; border-radius: 4px;">
                    ${verifyUrl}
                </p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                
                <p><strong>Security Note:</strong></p>
                <ul>
                    <li>This OTP is valid for 15 minutes only</li>
                    <li>Don't share this code with anyone</li>
                    <li>If you didn't request this verification, please ignore this email</li>
                </ul>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>&copy; 2024 Your Company Name. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`,
    text: `
Welcome ${name}!

Thank you for registering with us! To complete your registration, please verify your email address using the OTP below:

Your OTP Code: ${otp}

You can also verify by visiting: ${verifyUrl}

This OTP will expire in 15 minutes.

Security Note:
- This OTP is valid for 15 minutes only
- Don't share this code with anyone
- If you didn't request this verification, please ignore this email

This is an automated message, please do not reply to this email.
`,
  };
}

// Send OTP email
export async function sendOTPEmail(userEmail, name, otp, otpToken, websiteUrl) {
  try {
    const emailContent = generateOTPEmail(name, otp, otpToken, websiteUrl);

    const mailOptions = {
      from: `"Your App Name" <${emailConfig.auth.user}>`,
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };

    // In development, log email instead of sending
    if (process.env.NODE_ENV === "development") {
      console.log("📧 [DEVELOPMENT MODE] Email would be sent:");
      console.log("To:", userEmail);
      console.log("Subject:", emailContent.subject);
      console.log("OTP:", otp);
      console.log(
        "Verification URL:",
        `${websiteUrl}/verify?token=${otpToken}&email=${userEmail}`
      );
      return { success: true, messageId: "dev-mode", development: true };
    }

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent successfully:", result.messageId);

    return {
      success: true,
      messageId: result.messageId,
      development: false,
    };
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw error;
  }
}
