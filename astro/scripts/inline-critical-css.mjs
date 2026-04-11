#!/usr/bin/env node
/**
 * Post-build script: inline critical CSS into HTML pages.
 *
 * Reads all CSS files referenced in each HTML page, extracts rules
 * matching classes/IDs used in that page, and inlines them as
 * <style is:inline> before </head>.
 *
 * This prevents FOUC (Flash of Unstyled Content) in CI/CD environments
 * where external CSS files are loaded asynchronously.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.join(process.cwd(), 'dist');
const MARKER = '<!-- critical-inlined-css -->';

/** Parse CSS text into array of {selector, body} rules */
function parseCssRules(css) {
  const rules = [];
  let depth = 0;
  let current = '';
  for (const ch of css) {
    if (ch === '{') { depth++; current += ch; }
    else if (ch === '}') { depth--; current += ch; if (depth === 0) { rules.push(current.trim()); current = ''; } }
    else if (depth === 0 && ch === ';') { if (current.trim()) rules.push(current.trim()); current = ''; }
    else current += ch;
  }
  if (current.trim()) rules.push(current.trim());
  return rules.map((rule) => {
    const braceIdx = rule.indexOf('{');
    if (braceIdx < 0) return { selector: rule.trim(), body: '' };
    return { selector: rule.slice(0, braceIdx).trim(), body: rule.slice(braceIdx) };
  });
}

/** Recursively find all HTML files in a directory */
function findHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findHtmlFiles(full));
    else if (entry.name.endsWith('.html')) results.push(full);
  }
  return results;
}

const htmlFiles = findHtmlFiles(DIST_DIR);
console.log(`[inline-critical-css] Found ${htmlFiles.length} HTML files`);

for (const htmlPath of htmlFiles) {
  let html = fs.readFileSync(htmlPath, 'utf-8');

  // Collect all CSS files referenced in this page
  const cssHrefs = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)]
    .map((m) => m[1])
    .filter((h) => h.startsWith('/_astro/'));

  const seenFiles = new Set();
  let allCss = '';
  for (const href of cssHrefs) {
    const cssPath = path.join(DIST_DIR, href.replace(/^\//, ''));
    if (seenFiles.has(cssPath)) continue;
    seenFiles.add(cssPath);
    if (fs.existsSync(cssPath)) {
      allCss += fs.readFileSync(cssPath, 'utf-8') + '\n';
    }
  }

  if (!allCss) {
    console.log(`[inline-critical-css] No CSS files for ${path.relative(DIST_DIR, htmlPath)}`);
    continue;
  }

  // Extract classes and IDs used in the HTML
  const htmlClasses = [...html.matchAll(/class="([^"]+)"/g)]
    .flatMap((m) => m[1].split(/\s+/))
    .filter((c) => c.length > 0);

  const htmlIds = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);

  // Collect used HTML tags (for generic element rules)
  const htmlTagSet = new Set(
    [...html.matchAll(/<([a-z][a-z0-9-]*)/gi)]
      .map((m) => m[1].toLowerCase())
      .filter((t) => !['meta', 'link', 'title', 'html', 'head', 'body', 'script', 'style', 'noscript', 'a'].includes(t))
  );

  const parsedRules = parseCssRules(allCss);
  const criticalRules = new Set();

  for (const rule of parsedRules) {
    const { selector } = rule;

    // Always include @custom-variant and @layer
    if (selector.startsWith('@custom-variant') || selector.startsWith('@layer')) {
      criticalRules.add(selector + ' ' + rule.body);
      continue;
    }
    // Skip reset and animation rules
    if (
      selector === '*' ||
      selector.startsWith('*,') ||
      selector.startsWith('@keyframes') ||
      selector.startsWith('@font-face') ||
      selector.startsWith('@property')
    ) continue;

    let matched = false;

    // Match by class
    if (!matched) {
      const ruleClasses = [...selector.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
      for (const rc of ruleClasses) {
        if (htmlClasses.includes(rc)) { matched = true; break; }
      }
    }

    // Match by ID
    if (!matched) {
      const ruleIds = [...selector.matchAll(/#([\w-]+)/g)].map((m) => m[1]);
      for (const ri of ruleIds) {
        if (htmlIds.includes(ri)) { matched = true; break; }
      }
    }

    // Match :root / html.dark (CSS variable rules)
    if (!matched) {
      const cssVarSelectors = [
        ':root', 'html', ':root, :host', 'html.dark', 'html .dark',
        'html.dark ', ':root ', 'html '
      ];
      if (cssVarSelectors.some((s) => selector === s || selector.startsWith(s))) {
        matched = true;
      }
    }

    // Match generic element selectors
    if (!matched && htmlTagSet.size > 0) {
      for (const tag of htmlTagSet) {
        if (
          selector === tag ||
          selector.startsWith(tag + ' ') ||
          selector.startsWith(tag + ':') ||
          selector.startsWith(tag + '.') ||
          selector.startsWith(tag + '#') ||
          selector.startsWith(tag + '[')
        ) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      criticalRules.add(selector + ' ' + rule.body);
    }
  }

  if (criticalRules.size === 0) {
    console.log(`[inline-critical-css] No matching rules for ${path.relative(DIST_DIR, htmlPath)}`);
    continue;
  }

  const criticalCSS = [...criticalRules].join('\n');

  // Remove existing inlined critical CSS
  html = html.replace(
    /<!-- critical-inlined-css -->\s*<style is:inline>\s*[\s\S]*?<\/style>\s*/g,
    ''
  );

  const headEnd = html.lastIndexOf('</head>');
  if (headEnd < 0) {
    console.warn(`[inline-critical-css] No </head> in ${path.relative(DIST_DIR, htmlPath)}`);
    continue;
  }

  const styleTag = `\n${MARKER}\n<style is:inline>\n${criticalCSS}\n</style>\n`;
  html = html.slice(0, headEnd) + styleTag + html.slice(headEnd);

  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(
    `[inline-critical-css] Inlined ${criticalRules.size} CSS rules into ${path.relative(DIST_DIR, htmlPath)}`
  );
}

console.log('[inline-critical-css] Done');
