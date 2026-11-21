import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  CLIENT_URL: z.string().optional().default('http://localhost:5173'),
});

export const validateEnv = (): void => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ CRITICAL ENVIRONMENT CONFIGURATION ERROR:');
    (result.error.issues || []).forEach((err) => {
      console.error(`   - [${err.path.join('.')}]: ${err.message}`);
    });

    if (process.env.NODE_ENV === 'production') {
      console.error('Fatal: Refusing to start server in production with invalid or insecure environment variables.');
      process.exit(1);
    } else {
      console.warn('⚠️ Server starting in development mode with fallback environment settings.');
    }
  }
};
