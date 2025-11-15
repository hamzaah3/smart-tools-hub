// File size limits (in MB)
export const FILE_SIZE_LIMITS = {
  IMAGE: 25,
  PDF: 50,
  CSV: 25,
  GENERAL: 50,
};

// Allowed file types
export const ALLOWED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
  PDF: ['application/pdf'],
  CSV: ['text/csv', 'application/vnd.ms-excel'],
};

// Image quality presets
export const IMAGE_QUALITY = {
  LOW: 60,
  MEDIUM: 80,
  HIGH: 90,
  MAXIMUM: 95,
};

// API rate limits
export const RATE_LIMITS = {
  REQUESTS_PER_MINUTE: 30,
  REQUESTS_PER_HOUR: 100,
};

// Tool categories
export const TOOL_CATEGORIES = {
  PDF: 'pdf',
  IMAGE: 'image',
  CSV: 'csv',
  TEXT: 'text',
  UTILITY: 'utility',
} as const;

// Contact form limits
export const CONTACT_FORM = {
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
  MAX_MESSAGE_LENGTH: 2000,
};

// Blog post metadata
export const BLOG_CONFIG = {
  POSTS_PER_PAGE: 9,
  EXCERPT_LENGTH: 150,
  READING_SPEED: 200, // words per minute
};

// SEO constants
export const SEO = {
  SITE_NAME: 'SmartToolsHub',
  SITE_URL: 'https://smarttoolshub.com',
  SITE_DESCRIPTION: 'Free online tools for PDF, image, CSV conversion, text utilities, and more. Fast, secure, and mobile-friendly.',
  DEFAULT_OG_IMAGE: '/og-image.png',
};

// Social media links (optional)
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/smarttoolshub',
  FACEBOOK: 'https://facebook.com/smarttoolshub',
  GITHUB: 'https://github.com/smarttoolshub',
};

// Analytics IDs (replace with your actual IDs)
export const ANALYTICS = {
  GOOGLE_ANALYTICS_ID: 'G-XXXXXXXXXX',
  GOOGLE_ADSENSE_ID: 'ca-pub-XXXXXXXXXXXXXXXX',
};
