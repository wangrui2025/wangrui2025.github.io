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
  const entry = await getEntry('honors', 'honors');
  if (!entry) throw new Error('honors entry not found');
  return entry;
}

/**
 * Load education data
 */
export async function loadEducation() {
  const entry = await getEntry('education', 'education');
  if (!entry) throw new Error('education entry not found');
  return entry;
}

/**
 * Load homepage content for specific language
 */
export async function loadHomepageContent(lang: 'en' | 'zh') {
  const entry = await getEntry('homepage', lang);
  if (!entry) throw new Error(`homepage entry "${lang}" not found`);
  return entry;
}
