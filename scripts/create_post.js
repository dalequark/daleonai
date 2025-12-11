const fs = require('fs');
const path = require('path');
const { DateTime } = require('luxon');
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const { gfm } = require('turndown-plugin-gfm');

// Initialize Turndown
const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});
turndownService.use(gfm);

// Parsing Arguments
const args = process.argv.slice(2);
let title = '';
let importPath = '';

// Simple heuristic: If arg 0 is a directory, it's the import path.
// Otherwise, arg 0 is title, and arg 1 (if exists) is import path.
if (args.length > 0) {
    if (fs.existsSync(args[0]) && fs.statSync(args[0]).isDirectory()) {
        importPath = args[0];
        // Try to infer title from folder name if not provided? 
        // Actually, let's look for HTML file title later, or default to folder name
        // But usually Title is explicit. 
        // Let's stick to: if 1 arg and it's dir -> Title = Folder Name
        title = path.basename(args[0]);
    } else {
        title = args[0];
        if (args[1]) {
            importPath = args[1];
        }
    }
}

if (!title) {
    console.error('Please provide a post title or a folder path.');
    console.error('Usage: npm run new-post -- "My Post Title" [path/to/google/docs/folder]');
    process.exit(1);
}

// Helpers
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Setup Paths
const now = DateTime.now();
const dateStr = now.toISODate();
const isoDate = now.toISO();
const slug = slugify(title);
const filename = `${dateStr}-${slug}.md`;
const filepath = path.join(__dirname, '..', 'posts', filename);
const imageDirName = `${dateStr}-${slug}`;
const targetImageDir = path.join(__dirname, '..', 'images', imageDirName);

// Content Generation Variables
let markdownContent = 'Write your content here...';
let featureImage = `/ images / ${imageDirName}/TODO.jpg`;

// --- IMPORT LOGIC ---
if (importPath) {
    console.log(`Importing from folder: ${importPath}`);

    // Find HTML file
    const files = fs.readdirSync(importPath);
    const htmlFile = files.find(f => f.endsWith('.html'));

    if (!htmlFile) {
        console.error('No .html file found in the provided folder!');
        process.exit(1);
    }

    const htmlContent = fs.readFileSync(path.join(importPath, htmlFile), 'utf-8');
    const $ = cheerio.load(htmlContent);

    // 1. PARSE STYLES for Bold/Italic
    // Google Docs uses classes like .c1 { font-weight: 700 }
    const styleContent = $('style').html() || '';
    const boldClasses = new Set();
    const italicClasses = new Set();

    // Simple regex to find classes with font-weight: 700 or font-style: italic
    // Format: .c1{...} or .c1 { ... }
    // We split by '}' to get blocks
    styleContent.split('}').forEach(block => {
        const parts = block.split('{');
        if (parts.length === 2) {
            const selector = parts[0].trim();
            const rules = parts[1];

            // Check for bold
            if (/font-weight\s*:\s*700/.test(rules) || /font-weight\s*:\s*bold/.test(rules)) {
                // Selector might be .c1, .c2
                // Remove leading dot
                const cls = selector.replace(/^\./, '');
                boldClasses.add(cls);
            }

            // Check for italic
            if (/font-style\s*:\s*italic/.test(rules)) {
                const cls = selector.replace(/^\./, '');
                italicClasses.add(cls);
            }
        }
    });

    // 2. APPLY FORMATTING
    $('*').each((i, el) => {
        const classes = $(el).attr('class');
        if (classes) {
            classes.split(/\s+/).forEach(cls => {
                if (boldClasses.has(cls)) {
                    $(el).wrap('<strong></strong>');
                }
                if (italicClasses.has(cls)) {
                    $(el).wrap('<em></em>');
                }
            });
        }
    });

    // 3. HANDLE IMAGES
    // Create target directory
    if (!fs.existsSync(targetImageDir)) {
        fs.mkdirSync(targetImageDir, { recursive: true });
        console.log(`Created image directory: images/${imageDirName}`);
    }

    $('img').each((i, el) => {
        const src = $(el).attr('src');
        if (src) {
            // Source path likely 'images/image1.png' relative to HTML file
            // We need to resolve it relative to importPath
            const srcPath = path.join(importPath, src);

            if (fs.existsSync(srcPath)) {
                const imgFilename = path.basename(src);
                const destPath = path.join(targetImageDir, imgFilename);

                fs.copyFileSync(srcPath, destPath);

                // Update src to new relative path for Eleventy
                $(el).attr('src', `/images/${imageDirName}/${imgFilename}`);

                // Set first image as feature image
                if (i === 0) {
                    featureImage = `/images/${imageDirName}/${imgFilename}`;
                }
            } else {
                console.warn(`Warning: Image not found at ${srcPath}`);
            }
        }
    });

    // 4. CLEAN GOOGLE LINKS
    // Google links are like https://www.google.com/url?q=REAL_URL&sa=...
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.startsWith('https://www.google.com/url')) {
            try {
                const urlObj = new URL(href);
                const realUrl = urlObj.searchParams.get('q');
                if (realUrl) {
                    $(el).attr('href', realUrl);
                }
            } catch (e) {
                // ignore parse errors
            }
        }
    });

    // 4.5 REMOVE GOOGLE DOCS COMMENTS
    // Remove markers: <sup><a href="#cmnt_ref1">[a]</a></sup>
    $('sup').each((i, el) => {
        if ($(el).find('a[href^="#cmnt"]').length > 0) {
            $(el).remove();
        }
    });
    // Remove comment bodies: <div>...<a id="cmnt1">...</div>
    $('div').each((i, el) => {
        if ($(el).find('a[id^="cmnt"]').length > 0) {
            $(el).remove();
        }
    });

    // 4.6 FLATTEN TABLE CELLS
    // Turndown GFM tables don't support block elements (like <p>) inside cells.
    // We need to unwrap them or replace with <br>
    $('td, th').each((i, el) => {
        $(el).find('p').each((j, p) => {
            // If it's not the last paragraph, append a break
            if (j < $(el).find('p').length - 1) {
                $(p).append('<br>');
            }
            $(p).replaceWith($(p).html());
        });
    });

    // 4.7 CLEAN TABLE ATTRIBUTES
    // Remove attributes that might cause Turndown to keep it as HTML (colspan, rowspan, etc.)
    $('table, thead, tbody, tfoot, tr, th, td').removeAttr('style').removeAttr('class').removeAttr('width').removeAttr('height');
    $('td, th').removeAttr('colspan').removeAttr('rowspan');

    // Ensure table has thead (required for GFM tables)
    $('table').each((i, table) => {
        const $table = $(table);
        if ($table.find('thead').length === 0) {
            const $firstRow = $table.find('tr').first();
            if ($firstRow.length > 0) {
                const $thead = $('<thead></thead>');
                $thead.append($firstRow);
                $table.prepend($thead);
            }
        }
    });

    // 5. EXTRACT BODY CONTENT
    // We generally want content inside <body> or a specific container. 
    // Google Docs usually wraps everything in class "doc-content" usually on body.
    const bodyHtml = $('body').html();

    // Convert
    markdownContent = turndownService.turndown(bodyHtml);

} else {
    // Standard empty post creation
    if (!fs.existsSync(targetImageDir)) {
        fs.mkdirSync(targetImageDir, { recursive: true });
        console.log(`Created image directory: images/${imageDirName}`);
    }
}


// YAML Content
const content = `---
layout: post
title: ${title}
date: ${isoDate}
author: Dale Markowitz
description: 
feature_image: ${featureImage}
thumbnail_image: ${featureImage}
tags:
  - 
permalink: ${slug}/
---

${markdownContent}
`;

// Write file
fs.writeFileSync(filepath, content);

console.log(`Created new post: posts/${filename}`);
if (importPath) console.log('Import and conversion completed successfully.');
