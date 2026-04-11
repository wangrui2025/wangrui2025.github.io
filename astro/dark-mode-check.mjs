import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  await page.goto('https://wangrui2025.github.io/zh/', { waitUntil: 'networkidle' });
  console.log('Page loaded');

  // Toggle dark mode
  await page.evaluate(() => {
    document.documentElement.classList.toggle('dark', true);
  });
  await page.waitForTimeout(500);
  console.log('Dark mode toggled');

  // Check colors of specific elements
  const results = await page.evaluate(() => {
    const getColor = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return { selector, found: false };
      const style = getComputedStyle(el);
      return {
        selector,
        found: true,
        color: style.color,
        bgColor: style.backgroundColor
      };
    };

    return {
      textSecondary: getColor('.text-text-secondary'),
      mainBg: getColor('main'),
      bodyBg: getColor('body'),
      darkModeActive: document.documentElement.classList.contains('dark')
    };
  });

  console.log('\n=== Dark Mode Color Check ===');
  console.log('Dark mode active:', results.darkModeActive);
  console.log('\nElement colors:');
  console.log(JSON.stringify(results, null, 2));

  if (results.textSecondary.found) {
    const color = results.textSecondary.color;
    const isLightGray = color === 'rgb(176, 174, 165)' || color === '#b0aea5';
    console.log('\n✓ text-text-secondary color:', color);
    console.log(isLightGray ? '✓ PASS: Color is light gray (#b0aea5) for dark mode readability' : '✗ FAIL: Color may not be readable in dark mode');
  }

  const darkTextOverrides = await page.evaluate(() => {
    const elements = document.querySelectorAll('[class*="dark:text-"]');
    return Array.from(elements).map(el => ({
      class: el.className,
      color: getComputedStyle(el).color
    }));
  });

  if (darkTextOverrides.length > 0) {
    console.log('\nElements with dark:text-* classes:');
    darkTextOverrides.forEach(el => console.log(`  ${el.class}: ${el.color}`));
  }

  await page.screenshot({ path: '/tmp/dark-mode-check.png', fullPage: true });
  console.log('\nScreenshot saved to /tmp/dark-mode-check.png');

} finally {
  await browser.close();
}
