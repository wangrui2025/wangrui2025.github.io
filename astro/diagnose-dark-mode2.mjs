import { chromium } from 'playwright';

const url = 'https://wangrui2025.github.io/zh/';

async function diagnose() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });

  // 开启暗黑模式
  await page.evaluate(() => {
    document.documentElement.classList.toggle('dark', true);
  });
  await page.waitForTimeout(500);

  // 检查 text-text-secondary-dark 类的元素
  console.log('=== text-text-secondary-dark 类元素 ===');
  const secondaryDarkElements = await page.evaluate(() => {
    const els = document.querySelectorAll('.text-text-secondary-dark');
    return Array.from(els).map(el => ({
      tag: el.tagName,
      class: el.className,
      color: getComputedStyle(el).color,
      text: el.textContent?.substring(0, 60).trim(),
    }));
  });
  console.log(`找到 ${secondaryDarkElements.length} 个元素`);
  secondaryDarkElements.forEach((el, i) => {
    console.log(`${i+1}. <${el.tag}> "${el.text}" | color: ${el.color} | class: ${el.class}`);
  });

  // 检查 timeline-period 和 timeline-description 在 dark 模式下的颜色
  console.log('\n=== timeline 类元素 (暗黑模式) ===');
  const timelineElements = await page.evaluate(() => {
    const periods = document.querySelectorAll('.timeline-period');
    const descriptions = document.querySelectorAll('.timeline-description');
    return {
      periods: Array.from(periods).map(el => ({
        tag: el.tagName,
        color: getComputedStyle(el).color,
        text: el.textContent?.substring(0, 60).trim(),
      })),
      descriptions: Array.from(descriptions).map(el => ({
        tag: el.tagName,
        color: getComputedStyle(el).color,
        text: el.textContent?.substring(0, 60).trim(),
      }))
    };
  });

  console.log('timeline-period:');
  timelineElements.periods.forEach((el, i) => {
    console.log(`  ${i+1}. "${el.text}" | color: ${el.color}`);
  });

  console.log('\ntimeline-description:');
  timelineElements.descriptions.forEach((el, i) => {
    console.log(`  ${i+1}. "${el.text}" | color: ${el.color}`);
  });

  // 搜索 "CVPR" 相关文字
  console.log('\n=== CVPR 相关文字 ===');
  const cvprElements = await page.locator('text=CVPR').all();
  for (const el of cvprElements) {
    const info = await el.evaluate(e => ({
      tag: e.tagName,
      class: e.className,
      color: getComputedStyle(e).color,
      text: e.textContent?.substring(0, 100).trim(),
    }));
    console.log(`<${info.tag}> "${info.text}" | color: ${info.color}`);
    console.log(`  class: ${info.class}`);
  }

  // 搜索 "OSA" 相关文字
  console.log('\n=== OSA 相关文字 ===');
  const osaElements = await page.locator('text=OSA').all();
  console.log(`找到 ${osaElements.length} 个匹配`);
  for (const el of osaElements) {
    const info = await el.evaluate(e => ({
      tag: e.tagName,
      class: e.className,
      color: getComputedStyle(e).color,
      text: e.textContent?.substring(0, 100).trim(),
    }));
    console.log(`<${info.tag}> "${info.text}" | color: ${info.color}`);
  }

  // 检查 CSS 变量
  console.log('\n=== CSS 变量检查 ===');
  const cssVars = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return {
      'text-secondary': style.getPropertyValue('--text-secondary'),
      'text-secondary-dark': style.getPropertyValue('--text-secondary-dark'),
      '--color-text-secondary': style.getPropertyValue('--color-text-secondary'),
      '--color-text-secondary-dark': style.getPropertyValue('--color-text-secondary-dark'),
    };
  });
  console.log('Root CSS 变量:', cssVars);

  // 检查 body 或 html 的 dark class 是否有定义
  console.log('\n=== 检查 dark 模式颜色定义 ===');
  const darkModeColors = await page.evaluate(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    return {
      htmlClass: root.className,
      color: style.color,
      backgroundColor: style.backgroundColor,
    };
  });
  console.log('HTML class:', darkModeColors.htmlClass);

  // 截图
  await page.screenshot({ path: '/Users/myk/Repo/wangrui2025.github.io/astro/dark-mode-diagnosis2.png', fullPage: true });
  console.log('\n截图已保存: dark-mode-diagnosis2.png');

  await browser.close();
}

diagnose().catch(console.error);
