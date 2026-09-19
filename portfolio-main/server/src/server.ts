import 'dotenv/config';
import app from './app';
import { reconcileInitialTranslations } from './utils/translationSync';

const PORT = process.env.PORT || 5000;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      reconcileInitialTranslations().catch((err) => {
        console.warn('Initial translation reconciliation notice:', err);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
