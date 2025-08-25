// Verify email with OTP template
export function verifyEmailTemplate(name, otp) {
  return {
    subject: "Verify Your Email - OTP Required",
    htmlBody: `
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
                    <p><em>This code will expire in 10 minutes</em></p>
                </div>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                
                <p><strong>Security Note:</strong></p>
                <ul>
                    <li>This OTP is valid for 10 minutes only</li>
                    <li>Don't share this code with anyone</li>
                    <li>If you didn't request this verification, please ignore this email</li>
                </ul>
            </div>
        </div>`,
    text: `
Welcome ${name}!

Thank you for registering with us! To complete your registration, please verify your email address using the OTP below:

Your OTP Code: ${otp}

This OTP will expire in 10 minutes.

Security Note:
- This OTP is valid for 10 minutes only
- Don't share this code with anyone
- If you didn't request this verification, please ignore this email

This is an automated message, please do not reply to this email.
`,
  };
}
