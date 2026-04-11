import { chromium } from 'playwright';

const URL = 'https://wangrui2025.github.io/zh/';
const GRAY_COLORS = [
  'rgb(94, 93, 89)',
  'rgb(135, 134, 127)',
  '#5e5d59',  // hex versions
  '#87867f',
];

async function getCssPath(element) {
  return await element.evaluate(el => {
    const path = [];
    let current = el;
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let selector = current.tagName.toLowerCase();
      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break;
      }
      if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\s+/).filter(c => c);
        if (classes.length > 0) {
          selector += '.' + classes.slice(0, 3).join('.');
        }
      }
      path.unshift(selector);
      current = current.parentElement;
    }
    return path.join(' > ');
  });
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto(URL, { waitUntil: 'networkidle' });

  // Toggle dark mode
  await page.evaluate(() => {
    document.documentElement.classList.toggle('dark', true);
  });
  await page.waitForTimeout(500);

  // Take screenshot
  await page.screenshot({ path: '/Users/myk/Repo/wangrui2025.github.io/astro/dark-mode-screenshot.png', fullPage: false });

  // Find elements with gray colors
  const grayElements = await page.evaluate((colors) => {
    const results = [];
    const allElements = document.querySelectorAll('*');

    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      const color = style.color;
      const bgColor = style.backgroundColor;

      if (colors.includes(color)) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && el.textContent.trim()) {
          results.push({
            tag: el.tagName.toLowerCase(),
            className: el.className,
            id: el.id,
            color: color,
            text: el.textContent.trim().substring(0, 100),
            cssPath: getCssPath(el),
          });
        }
      }
    });
    return results;
  }, GRAY_COLORS);

  // Get CSS paths using Playwright locator
  const detailedResults = [];
  for (const item of grayElements.slice(0, 30)) {
    try {
      const elements = await page.locator(`*:has-text("${item.text}")`).all();
      for (const el of elements) {
        const cssPath = await getCssPath(el);
        const tag = await el.evaluate(e => e.tagName.toLowerCase());
        const className = await el.evaluate(e => e.className);
        const text = await el.textContent();

        detailedResults.push({
          tag,
          className,
          cssPath,
          text: text?.trim().substring(0, 80),
          color: item.color,
        });
      }
    } catch (e) {}
  }

  // Deduplicate
  const seen = new Set();
  const unique = detailedResults.filter(r => {
    const key = r.cssPath;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log('\n=== GRAY TEXT ELEMENTS ===');
  console.log(`Found ${unique.length} unique elements with gray text:\n`);

  for (const el of unique) {
    console.log('---');
    console.log(`CSS Path: ${el.cssPath}`);
    console.log(`Tag: ${el.tag}`);
    console.log(`Class: ${el.className}`);
    console.log(`Text: ${el.text}`);
  }

  // Check news_items area specifically
  const newsArea = await page.locator('[class*="news"]').first();
  if (await newsArea.count() > 0) {
    console.log('\n=== NEWS ITEMS AREA ===');
    const newsHtml = await newsArea.innerHTML();
    console.log('News container HTML structure:');
    console.log(newsHtml.substring(0, 2000));
  }

  await browser.close();
  console.log('\nScreenshot saved to: /Users/myk/Repo/wangrui2025.github.io/astro/dark-mode-screenshot.png');
}

main().catch(console.error);
