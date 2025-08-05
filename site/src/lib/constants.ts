// Environment variables с fallback значениями
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  APP_NAME: process.env.APP_NAME || 'News Website',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL!,
  
  // Auth
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
  
  // Email
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  FROM_EMAIL: process.env.FROM_EMAIL || 'onboarding@resend.dev',
  REPLY_TO_EMAIL: process.env.REPLY_TO_EMAIL || 'noreply@yourdomain.com',
  
  // Admin
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123456',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Администратор',
  
  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
  ALLOWED_IMAGE_TYPES: process.env.ALLOWED_IMAGE_TYPES?.split(',') || [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif'
  ],
  UPLOAD_DIR: process.env.UPLOAD_DIR || '/uploads',
  
  // Pagination
  POSTS_PER_PAGE: parseInt(process.env.POSTS_PER_PAGE || '12'),
  HOME_NEWS_LIMIT: parseInt(process.env.HOME_NEWS_LIMIT || '6'),
  ADMIN_ITEMS_PER_PAGE: parseInt(process.env.ADMIN_ITEMS_PER_PAGE || '10'),
  
  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  SESSION_MAX_AGE: parseInt(process.env.SESSION_MAX_AGE || '604800'),
  
  // Development
  DEBUG_MODE: process.env.DEBUG_MODE === 'true',
  ENABLE_QUERY_LOGGING: process.env.ENABLE_QUERY_LOGGING === 'true',
} as const

// Проверка обязательных переменных
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'RESEND_API_KEY'
] as const

export function validateEnv() {
  const missing = requiredEnvVars.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(
      `Отсутствуют обязательные переменные окружения: ${missing.join(', ')}`
    )
  }
}

// Вызываем проверку при импорте
if (typeof window === 'undefined') {
  validateEnv()
}