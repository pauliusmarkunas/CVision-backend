const registerValidationHtmlTemplate = (validationCode) => {
  return `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CVision Verification Code</title>
  <style>
    /* Reset */
    body, table, td, a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-rspace: 0pt;
      mso-table-lspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #333333;
    }
    table {
      border-collapse: collapse !important;
    }
    /* Container */
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 40px 30px;
    }
    /* Header */
    .header {
      text-align: center;
      font-size: 28px;
      font-weight: 700;
      color: #0a84ff;
      margin-bottom: 24px;
    }
    /* Code box */
    .code-box {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 8px;
      background: #e0f0ff;
      color: #0a84ff;
      padding: 16px 0;
      border-radius: 6px;
      text-align: center;
      margin: 24px 0;
      user-select: all;
    }
    /* Message */
    .message {
      font-size: 16px;
      line-height: 1.5;
      color: #555555;
      margin-bottom: 32px;
    }
    /* Footer */
    .footer {
      font-size: 12px;
      color: #999999;
      text-align: center;
      margin-top: 40px;
    }
    a.button {
      background-color: #0a84ff;
      color: white !important;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      display: inline-block;
      margin-top: 8px;
    }
    @media screen and (max-width: 480px) {
      .email-container {
        padding: 30px 20px;
      }
      .code-box {
        font-size: 28px;
        letter-spacing: 6px;
        padding: 12px 0;
      }
      .header {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <center>
    <table role="presentation" class="email-container" width="100%">
      <tr>
        <td>
          <div class="header">CVision Verification Code</div>
          <div class="message">
            Hi,<br />
            Thank you for choosing CVision. Use the verification code below to complete your registration process.
          </div>
          <div class="code-box">${validationCode}</div>
          <div class="message">
            If you did not request this code, please ignore this email or contact support.
          </div>
          <div style="text-align:center;">
            <a href="https://cvision.com/login" class="button" target="_blank" rel="noopener">Go to CVision</a>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} CVision. All rights reserved.
          </div>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
`;
};

export default registerValidationHtmlTemplate;
