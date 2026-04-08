import { getCollection, getEntry } from 'astro:content';

/**
 * Load papers for CV display
 */
export async function loadPapersForCV() {
  return await getCollection('papers', (p) => p.data.show_on_cv);
}

/**
 * Load honors data
 */
export async function loadHonors() {
  return await getEntry('honors', 'honors');
}

/**
 * Load education data
 */
export async function loadEducation() {
  return await getEntry('education', 'education');
}

/**
 * Load homepage content for specific language
 */
export async function loadHomepageContent(lang: 'en' | 'zh') {
  return await getEntry('homepage', lang);
}
