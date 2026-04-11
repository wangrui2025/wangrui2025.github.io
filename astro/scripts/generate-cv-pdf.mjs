#!/usr/bin/env node
/**
 * generate-cv-pdf.mjs — Playwright-based CV PDF generator
 *
 * Usage:
 *   1. Terminal 1: pnpm dev
 *   2. Terminal 2: node scripts/generate-cv-pdf.mjs
 *
 * Output: public/cv-en.pdf and public/cv-zh.pdf
 *
 * Requires: playwright (devDependency)
 * Install:   npx playwright install chromium
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(ROOT, 'public');

// A4 dimensions
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const A4_HEIGHT_PX = Math.round((A4_HEIGHT_MM * 96) / 25.4); // ~1123px at 96dpi

const PAGES = [
  { url: 'https://wangrui2025.github.io/cv',    outFile: 'cv-en.pdf' },
  { url: 'https://wangrui2025.github.io/zh/cv', outFile: 'cv-zh.pdf' },
];

async function generatePDF(page, url, outFile) {
  const outPath = join(PUBLIC_DIR, outFile);

  console.log(`\n[${outFile}] Launching browser...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 900, height: 1200 } });
  const p = await context.newPage();

  console.log(`[${outFile}] Loading ${url} ...`);
  await p.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for fonts + a full paint cycle
  await p.evaluateHandle('document.fonts.ready');
  await p.waitForTimeout(800);

  // Measure rendered content height
  const contentHeight = await p.evaluate(() => {
    const el = document.querySelector('.cv-page');
    return el ? el.scrollHeight : document.body.scrollHeight;
  });

  // Scale to fit exactly 1 page (cap at 1.0, never upscale)
  const scale = Math.min(1.0, A4_HEIGHT_PX / contentHeight);
  const scalePct = (scale * 100).toFixed(1);
  console.log(`[${outFile}] Content: ${contentHeight}px | A4: ${A4_HEIGHT_PX}px | Scale: ${scalePct}%`);

  if (scale < 0.7) {
    console.warn(`[${outFile}] WARNING: Scale is very low (${scalePct}%). Content may be cramped.`);
  }

  await p.pdf({
    path: outPath,
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    printBackground: true,
    scale,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    pageRanges: '1-1',
  });

  await browser.close();
  console.log(`[${outFile}] Saved -> ${outPath}`);
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  for (const { url, outFile } of PAGES) {
    try {
      await generatePDF(null, url, outFile);
    } catch (err) {
      console.error(`[${outFile}] ERROR: ${err.message}`);
    }
  }

  console.log('\nDone.');
}

main();
