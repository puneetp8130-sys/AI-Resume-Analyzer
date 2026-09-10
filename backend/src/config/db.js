const mongoose = require('mongoose');
const env = require('./env');

async function connectDB() {
  if (!env.mongodbUri) {
    // eslint-disable-next-line no-console
    console.warn('[db] MONGODB_URI is not set. The API will start but database operations will fail.');
    return;
  }

  try {
    await mongoose.connect(env.mongodbUri);
    // eslint-disable-next-line no-console
    console.log('[db] MongoDB connected');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[db] MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
