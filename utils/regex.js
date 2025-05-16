const regex = {
  // ✅ Password: 8–30 chars, must contain at least one lowercase letter, one uppercase letter, one number, and one special character
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,30}$/,
  // ✅ Email: simple email pattern
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
};

export default regex;
