#!/usr/bin/env node

/**
 * Script to replace all console.log/error/warn statements with proper logger calls
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const replacements = [
  {
    // console.log statements
    pattern: /console\.log\(/g,
    replacement: 'log.info(',
  },
  {
    // console.error statements
    pattern: /console\.error\(/g,
    replacement: 'log.error(',
  },
  {
    // console.warn statements
    pattern: /console\.warn\(/g,
    replacement: 'log.warn(',
  },
  {
    // console.info statements
    pattern: /console\.info\(/g,
    replacement: 'log.info(',
  },
];

// Files to process
const filePatterns = [
  'lib/**/*.{ts,tsx,js,jsx}',
  'app/**/*.{ts,tsx,js,jsx}',
  'components/**/*.{ts,tsx,js,jsx}',
];

// Exclusions
const excludePatterns = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/build/**',
  '**/*.test.{ts,tsx,js,jsx}',
  '**/*.spec.{ts,tsx,js,jsx}',
  '**/logger.ts', // Don't modify the logger file itself
  'scripts/**/*', // Don't modify scripts
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let hasConsoleStatements = false;

    // Check if file has any console statements
    if (content.match(/console\.(log|error|warn|info)\(/)) {
      hasConsoleStatements = true;
    }

    if (!hasConsoleStatements) {
      return false;
    }

    // Check if logger import already exists
    const hasLoggerImport = content.includes("from '@/lib/logger'") ||
                           content.includes('from "@/lib/logger"') ||
                           content.includes("from './logger'") ||
                           content.includes('from "./logger"');

    // Apply replacements
    replacements.forEach(({ pattern, replacement }) => {
      if (content.match(pattern)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });

    if (modified && !hasLoggerImport) {
      // Add logger import at the top of the file
      const importStatement = "import { log } from '@/lib/logger'\n";

      // Find the right place to insert the import
      const firstImportMatch = content.match(/^import .* from/m);
      if (firstImportMatch) {
        // Add after the first import
        const firstImportIndex = content.indexOf(firstImportMatch[0]);
        const endOfLine = content.indexOf('\n', firstImportIndex);
        content = content.slice(0, endOfLine + 1) + importStatement + content.slice(endOfLine + 1);
      } else {
        // No imports found, add at the beginning
        content = importStatement + '\n' + content;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Processed: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
  return false;
}

function main() {
  console.log('🔍 Starting console statement replacement...\n');

  let totalFiles = 0;
  let modifiedFiles = 0;

  filePatterns.forEach(pattern => {
    const files = glob.sync(pattern, {
      ignore: excludePatterns,
      absolute: false,
    });

    files.forEach(file => {
      totalFiles++;
      if (processFile(file)) {
        modifiedFiles++;
      }
    });
  });

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Summary:`);
  console.log(`   Total files scanned: ${totalFiles}`);
  console.log(`   Files modified: ${modifiedFiles}`);
  console.log('='.repeat(50));

  if (modifiedFiles > 0) {
    console.log('\n✅ Console statements have been replaced with logger calls!');
    console.log('📝 Please review the changes and test your application.');
  } else {
    console.log('\n✅ No console statements found to replace!');
  }
}

// Run the script
main();