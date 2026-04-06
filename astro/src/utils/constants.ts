/**
 * Shared constants for the site
 */

// Site configuration
export const SITE_URL = 'https://wangrui2025.github.io';
export const DEFAULT_LAST_UPDATED = '2026-04-06';

// Tag URLs for paper badges
export const TAG_URLS: Record<string, string> = {
  csranking: 'https://csrankings.org/#/index?vision&world',
  'CCF-A': 'https://www.ccf.org.cn/Academic_Evaluation/By_category/',
};

// Separator characters for i18n
export const SEPARATORS = {
  en: ' | ',
  zh: '丨',
} as const;

// Language options
export type Language = 'en' | 'zh';
