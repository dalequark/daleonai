const fs = require('fs');
const path = require('path');
const { DateTime } = require('luxon');

// Get title from arguments
const title = process.argv.slice(2).join(' ');

if (!title) {
    console.error('Please provide a post title.');
    console.error('Usage: npm run new-post -- "My New Post Title"');
    process.exit(1);
}

// Helper to slugify string
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start
        .replace(/-+$/, '');      // Trim - from end
}

// Generate dates
const now = DateTime.now();
const dateStr = now.toISODate(); // YYYY-MM-DD
const isoDate = now.toISO();     // ISO 8601 string

const slug = slugify(title);
const filename = `${dateStr}-${slug}.md`;
const filepath = path.join(__dirname, '..', 'posts', filename);

// Create image directory
const imageDirName = `${dateStr}-${slug}`;
const imageDirPath = path.join(__dirname, '..', 'images', imageDirName);
fs.mkdirSync(imageDirPath, { recursive: true });

// YAML Content
const content = `---
layout: post
title: ${title}
date: ${isoDate}
author: Dale Markowitz
description: 
feature_image: /images/${imageDirName}/TODO.jpg
thumbnail_image: /images/${imageDirName}/TODO.jpg
tags:
  - 
permalink: ${slug}/
---

Write your content here...
`;

// Write file
fs.writeFileSync(filepath, content);

console.log(`Created new post: posts/${filename}`);
console.log(`Created image directory: images/${imageDirName}`);
