export function createTranslator(lang: 'en' | 'zh') {
  return function t<T>(obj: Record<'en' | 'zh', T>): T {
    return obj[lang];
  };
}