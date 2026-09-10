const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

async function start() {
  await connectDB();

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] AI Resume Analyzer API listening on port ${env.port} (${env.nodeEnv})`);
  });
}

start();
