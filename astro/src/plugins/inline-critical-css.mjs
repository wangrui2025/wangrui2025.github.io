/**
 * Vite plugin: inline-critical-css
 *
 * Uses transformIndexHtml hook to inline CSS rules matching classes/ids
 * used in the page. This prevents FOUC in CI/CD environments where
 * external CSS files may not be cached on first visit.
 */
import fs from 'node:fs';
import path from 'node:path';

/** Parse a CSS string into an array of {selector, body} rule objects */
function parseCssRules(css) {
  const rules = [];
  // Split on top-level { } blocks
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
    return {
      selector: rule.slice(0, braceIdx).trim(),
      body: rule.slice(braceIdx),
    };
  });
}

export function inlineCriticalCSS() {
  return {
    name: 'inline-critical-css',
    enforce: 'post',

    transformIndexHtml(html, ctx) {
      // Skip in dev mode — only applies during build
      if (!ctx.bundle && !ctx.filename) return html;
      const bundle = ctx.bundle || {};

      // Collect all CSS file contents referenced in the page
      const cssHrefs = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)]
        .map((m) => m[1])
        .filter((h) => h.startsWith('/_astro/'));

      let allCss = '';
      const seenFiles = new Set();
      for (const href of cssHrefs) {
        const cssPath = path.join(process.cwd(), 'dist', href.replace(/^\//, ''));
        if (seenFiles.has(cssPath)) continue;
        seenFiles.add(cssPath);
        if (fs.existsSync(cssPath)) {
          allCss += fs.readFileSync(cssPath, 'utf-8') + '\n';
        }
      }

      if (!allCss) return html;

      // Extract all class names used in the HTML
      const htmlClasses = [
        ...html.matchAll(/class="([^"]+)"/g),
      ]
        .flatMap((m) => m[1].split(/\s+/))
        .filter((c) => c.length > 0);

      const htmlIds = [
        ...html.matchAll(/id="([^"]+)"/g),
      ].map((m) => m[1]);

      const htmlTags = [
        ...html.matchAll(/<([a-z][a-z0-9-]*)[^>]*>/gi),
      ]
        .map((m) => m[1].toLowerCase())
        .filter((t) => !['meta', 'link', 'title', 'html', 'head', 'body', 'script', 'style', 'noscript'].includes(t));

      const uniqueTags = [...new Set(htmlTags)];

      const parsedRules = parseCssRules(allCss);

      const criticalRules = [];

      for (const rule of parsedRules) {
        const { selector } = rule;

        // Always include @custom-variant and @layer directives
        if (selector.startsWith('@custom-variant') || selector.startsWith('@layer')) {
          criticalRules.push(selector + ' ' + rule.body);
          continue;
        }
        // Skip entire stylesheet reset rules
        if (selector === '*' || selector === '*, *::before, *::after' || selector === '*,*::before,*::after') continue;
        // Skip @keyframes
        if (selector.startsWith('@keyframes')) continue;
        // Skip @property
        if (selector.startsWith('@property')) continue;

        let matched = false;

        // Match rule if its selector references any used class
        const ruleClasses = [...selector.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
        if (!matched) {
          for (const rc of ruleClasses) {
            if (htmlClasses.includes(rc)) { matched = true; break; }
          }
        }

        // Match if it references any used ID
        if (!matched) {
          const ruleIds = [...selector.matchAll(/#([\w-]+)/g)].map((m) => m[1]);
          for (const ri of ruleIds) {
            if (htmlIds.includes(ri)) { matched = true; break; }
          }
        }

        // Match :root, html, html.dark (CSS variable declarations)
        if (!matched) {
          if (
            selector === ':root' ||
            selector === 'html' ||
            selector === ':root, :host' ||
            selector === 'html.dark' ||
            selector === 'html .dark' ||
            selector.startsWith('html.dark ') ||
            selector.startsWith(':root ') ||
            selector.startsWith('html ')
          ) {
            matched = true;
          }
        }

        // Match generic element selectors that appear in the page
        if (!matched) {
          const genericEl = uniqueTags.find(
            (t) =>
              selector === t ||
              selector.startsWith(t + ' ') ||
              selector.startsWith(t + ':') ||
              selector.startsWith(t + '.') ||
              selector.startsWith(t + '#') ||
              selector.startsWith(t + '[')
          );
          if (genericEl) matched = true;
        }

        if (matched) {
          criticalRules.push(selector + ' ' + rule.body);
        }
      }

      if (criticalRules.length === 0) return html;

      const criticalCSS = criticalRules.join('\n');

      // Remove any existing critical CSS block first
      html = html.replace(
        /<!-- critical-inlined-css -->\s*<style is:inline>\s*[\s\S]*?<\/style>\s*/g,
        ''
      );

      // Insert before </head>
      const headEnd = html.lastIndexOf('</head>');
      if (headEnd < 0) return html;

      const styleTag = `\n<!-- critical-inlined-css -->\n<style is:inline>\n${criticalCSS}\n</style>\n`;
      return html.slice(0, headEnd) + styleTag + html.slice(headEnd);
    },
  };
}
