import { chromium } from 'playwright';

const url = 'https://wangrui2025.github.io/zh/';

async function diagnose() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('=== 访问页面 ===');
  await page.goto(url, { waitUntil: 'networkidle' });

  // 开启暗黑模式
  await page.evaluate(() => {
    document.documentElement.classList.toggle('dark', true);
  });
  console.log('已开启暗黑模式\n');

  // 等待一点让样式应用
  await page.waitForTimeout(500);

  // 搜索包含 "OSA: Echocardiography" 的元素
  console.log('=== 搜索 "OSA: Echocardiography" 元素 ===');
  const elements = await page.locator('text=OSA: Echocardiography').all();

  if (elements.length === 0) {
    console.log('未找到包含 "OSA: Echocardiography" 的元素');
  } else {
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const tagName = await el.evaluate(e => e.tagName);
      const className = await el.evaluate(e => e.className);
      const id = await el.evaluate(e => e.id);

      console.log(`\n--- 匹配元素 ${i + 1} ---`);
      console.log(`Tag: ${tagName}, Class: ${className}, ID: ${id}`);

      // 获取计算后的颜色
      const color = await el.evaluate(e => {
        const style = getComputedStyle(e);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor,
          opacity: style.opacity,
        };
      });
      console.log(`颜色: ${color.color}, 背景: ${color.backgroundColor}, 透明度: ${color.opacity}`);

      // 检查父元素
      const parentInfo = await el.evaluate(e => {
        const parent = e.parentElement;
        return {
          tag: parent?.tagName,
          class: parent?.className,
          color: parent ? getComputedStyle(parent).color : null,
        };
      });
      console.log(`父元素: ${parentInfo.tag}, class: ${parentInfo.class}, color: ${parentInfo.color}`);

      // 检查是否有 opacity 相关样式
      const opacityCheck = await el.evaluate(e => {
        const style = getComputedStyle(e);
        return {
          opacity: style.opacity,
          color: style.color,
          fill: style.fill,
        };
      });
      console.log(`Opacity 检查: opacity=${opacityCheck.opacity}, fill=${opacityCheck.fill}`);
    }
  }

  // 搜索页面上所有灰色文字（rgb(128, 128, 128) 或相近）
  console.log('\n=== 搜索页面上所有灰色文字 ===');
  const grayElements = await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    const gray = [];
    const seen = new Set();

    all.forEach(el => {
      const style = getComputedStyle(el);
      const color = style.color;
      // 检测灰色 (r≈g≈b 且在 100-160 范围内)
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const [, r, g, b] = match.map(Number);
        if (Math.abs(r - g) < 20 && Math.abs(r - b) < 20 && r >= 80 && r <= 180) {
          if (!seen.has(el)) {
            seen.add(el);
            gray.push({
              tag: el.tagName,
              class: el.className.substring(0, 100),
              color: color,
              text: el.textContent?.substring(0, 80).trim(),
            });
          }
        }
      }
    });
    return gray;
  });

  console.log(`找到 ${grayElements.length} 个灰色文字元素`);
  grayElements.slice(0, 20).forEach((el, i) => {
    console.log(`${i + 1}. <${el.tag}> "${el.text}" | color: ${el.color} | class: ${el.class}`);
  });

  // 特别检查 svg 元素的 fill 属性
  console.log('\n=== 检查 SVG 元素 ===');
  const svgElements = await page.evaluate(() => {
    const svgs = document.querySelectorAll('svg');
    const results = [];
    svgs.forEach(svg => {
      const style = getComputedStyle(svg);
      const fill = style.fill;
      const color = style.color;
      if (fill && fill !== 'rgb(0, 0, 0)' && fill !== 'rgb(255, 255, 255)' && fill !== 'none') {
        results.push({
          tag: 'svg',
          fill,
          color,
          class: svg.className,
        });
      }
      // 检查子元素
      svg.querySelectorAll('*').forEach(child => {
        const childStyle = getComputedStyle(child);
        if (childStyle.fill && childStyle.fill !== 'rgb(0, 0, 0)' && childStyle.fill !== 'rgb(255, 255, 255)' && childStyle.fill !== 'none') {
          results.push({
            tag: child.tagName,
            fill: childStyle.fill,
            color: childStyle.color,
            class: child.className,
          });
        }
      });
    });
    return results;
  });

  if (svgElements.length > 0) {
    console.log('SVG 填充色:');
    svgElements.forEach((el, i) => {
      console.log(`${i + 1}. <${el.tag}> fill: ${el.fill}, color: ${el.color}, class: ${el.class}`);
    });
  } else {
    console.log('未发现异常 SVG 填充色');
  }

  // 截图保存
  await page.screenshot({ path: '/Users/myk/Repo/wangrui2025.github.io/astro/dark-mode-diagnosis.png', fullPage: true });
  console.log('\n截图已保存: dark-mode-diagnosis.png');

  await browser.close();
  console.log('\n诊断完成');
}

diagnose().catch(console.error);
