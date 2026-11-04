'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const errors = [];
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith('.html')).sort();
const sitemapPath = path.join(root, 'sitemap.xml');

function reportError(file, message) {
  errors.push(`${path.relative(root, file)}: ${message}`);
}

function localFilePath(pagePath, reference) {
  const pathname = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
  if (!pathname || pathname.startsWith('/_vercel/')) return null;

  const resolved = pathname.startsWith('/')
    ? path.resolve(root, `.${pathname}`)
    : path.resolve(path.dirname(pagePath), pathname);

  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    return false;
  }

  return resolved;
}

for (const filename of htmlFiles) {
  const pagePath = path.join(root, filename);
  const html = fs.readFileSync(pagePath, 'utf8');
  const ids = new Set();
  const duplicateIds = new Set();

  if (!/<title>\s*[^<]+\s*<\/title>/i.test(html)) {
    reportError(pagePath, 'missing a non-empty <title>');
  }
  if ((html.match(/<h1(?:\s|>)/gi) || []).length !== 1) {
    reportError(pagePath, 'expected exactly one <h1>');
  }
  if ((html.match(/<main(?:\s|>)/gi) || []).length !== 1) {
    reportError(pagePath, 'expected exactly one <main>');
  }

  for (const match of html.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)) {
    const id = match[2];
    if (ids.has(id)) duplicateIds.add(id);
    ids.add(id);
  }
  for (const id of duplicateIds) {
    reportError(pagePath, `duplicate id="${id}"`);
  }

  for (const tag of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attributes = tag[1];
    if (!/\balt\s*=\s*(["'])[\s\S]*?\1/i.test(attributes)) {
      reportError(pagePath, 'image is missing an alt attribute');
    }
    if (!/\bwidth\s*=\s*(["'])\d+\1/i.test(attributes)
      || !/\bheight\s*=\s*(["'])\d+\1/i.test(attributes)) {
      reportError(pagePath, 'image is missing explicit width and height');
    }
  }

  for (const tag of html.matchAll(/<[a-z][\w:-]*\b([^>]*)>/gi)) {
    for (const attribute of tag[1].matchAll(/\b(href|src)\s*=\s*(["'])(.*?)\2/gi)) {
      const reference = attribute[3].trim();
      if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) continue;

      const hashIndex = reference.indexOf('#');
      const fragment = hashIndex >= 0 ? decodeURIComponent(reference.slice(hashIndex + 1)) : '';
      const resolved = localFilePath(pagePath, reference);

      if (resolved === false) {
        reportError(pagePath, `local reference escapes the project: ${reference}`);
        continue;
      }

      if (resolved && !fs.existsSync(resolved)) {
        reportError(pagePath, `local reference does not exist: ${reference}`);
        continue;
      }

      if (fragment) {
        const targetPath = resolved || pagePath;
        if (targetPath.endsWith('.html')) {
          const targetHtml = targetPath === pagePath ? html : fs.readFileSync(targetPath, 'utf8');
          const targetIds = new Set(
            [...targetHtml.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)].map((match) => match[2])
          );
          if (!targetIds.has(fragment)) {
            reportError(pagePath, `fragment target does not exist: ${reference}`);
          }
        }
      }
    }
  }
}

if (!htmlFiles.includes('index.html')) {
  reportError(root, 'missing index.html');
}

const contactPagePath = path.join(root, 'contact.html');
if (!fs.existsSync(contactPagePath)) {
  reportError(root, 'missing contact.html');
} else {
  const contactHtml = fs.readFileSync(contactPagePath, 'utf8');
  for (const field of ['name', 'email', 'subject', 'message']) {
    const fieldPattern = new RegExp(`<input\\b(?=[^>]*\\bname=["']${field}["'])(?=[^>]*\\brequired\\b)[^>]*>|<textarea\\b(?=[^>]*\\bname=["']${field}["'])(?=[^>]*\\brequired\\b)[^>]*>`, 'i');
    if (!fieldPattern.test(contactHtml)) {
      reportError(contactPagePath, `contact form is missing a required ${field} field`);
    }
  }
  if (!/<form\b(?=[^>]*\bid=["']contact-form["'])(?=[^>]*\baction=["']mailto:info@akilisoft\.co\.tz["'])[^>]*>/i.test(contactHtml)) {
    reportError(contactPagePath, 'contact form must have an email fallback action');
  }
  if (!/href=["']mailto:info@akilisoft\.co\.tz["']/i.test(contactHtml)) {
    reportError(contactPagePath, 'contact page must retain a direct email link');
  }
}

if (!fs.existsSync(sitemapPath)) {
  reportError(root, 'missing sitemap.xml');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  if (!/<urlset\b[\s\S]*<\/urlset>/i.test(sitemap)) {
    reportError(sitemapPath, 'invalid sitemap urlset');
  }

  const sitemapPaths = new Set();
  for (const match of sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)) {
    try {
      const location = new URL(match[1].trim());
      const pathname = decodeURIComponent(location.pathname);
      sitemapPaths.add(pathname === '/' ? '/index.html' : pathname);
      const filePath = localFilePath(root, pathname);
      if (filePath === false || !filePath || !fs.existsSync(filePath)) {
        reportError(sitemapPath, `sitemap route does not exist: ${pathname}`);
      }
    } catch {
      reportError(sitemapPath, `invalid sitemap URL: ${match[1]}`);
    }
  }

  for (const filename of htmlFiles) {
    const route = filename === 'index.html' ? '/index.html' : `/${filename}`;
    if (!sitemapPaths.has(route)) {
      reportError(sitemapPath, `page is missing from sitemap: ${route}`);
    }
  }
}

if (errors.length) {
  console.error(`Site checks failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Site checks passed: ${htmlFiles.length} pages, local links, image dimensions, and sitemap routes.`);
}
