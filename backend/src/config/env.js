require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB || 5),
};

if (!env.jwtSecret) {
  // eslint-disable-next-line no-console
  console.warn('[config] JWT_SECRET is not set. Set it in your .env file before running in production.');
}

module.exports = env;
