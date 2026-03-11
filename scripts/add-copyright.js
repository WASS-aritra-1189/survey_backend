#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const COPYRIGHT_HEADER = `/**
 * Copyright (c) ${new Date().getFullYear()} Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

`;

function addCopyrightHeader(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');

  // Skip if copyright already exists
  if (content.includes('Webapp Software Solutions. All rights reserved.')) {
    return false;
  }

  // Add copyright header at the top
  const newContent = COPYRIGHT_HEADER + content;
  fs.writeFileSync(filePath, newContent, 'utf8');
  return true;
}

// If called with file argument, process single file
if (process.argv[2]) {
  const filePath = process.argv[2];
  if (filePath.endsWith('.ts') && !filePath.endsWith('.d.ts')) {
    if (addCopyrightHeader(filePath)) {
      console.log(`Added copyright to: ${filePath}`);
    }
  }
} else {
  console.log('Usage: node add-copyright.js <file-path>');
}

module.exports = { addCopyrightHeader, COPYRIGHT_HEADER };
