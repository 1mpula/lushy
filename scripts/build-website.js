/**
 * Lushy Website Build Script
 * Copies source files from website/ into website/dist/
 * Run with: node scripts/build-website.js
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'website');
const DIST = path.join(__dirname, '..', 'website', 'dist');

// Files to copy from website/ root into website/dist/
const FILES = [
    'index.html',
    'subscribe.html',
    'styles.css',
    'script.js',
    'lushy-logo.png',
    // Add any other assets here
];

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created: ${path.relative(process.cwd(), dir)}`);
    }
}

function copyFile(src, dest) {
    if (!fs.existsSync(src)) {
        console.warn(`⚠️  Skipped (not found): ${path.basename(src)}`);
        return;
    }
    fs.copyFileSync(src, dest);
    const size = (fs.statSync(dest).size / 1024).toFixed(1);
    console.log(`✅ Copied: ${path.basename(src)} (${size} KB)`);
}

console.log('\n🌸 Building Lushy Website...\n');

// Ensure dist directory exists
ensureDir(DIST);

// Copy each file
FILES.forEach(file => {
    const src = path.join(SRC, file);
    const dest = path.join(DIST, file);
    copyFile(src, dest);
});

console.log('\n✨ Build complete! Files are ready in website/dist/\n');
console.log('To preview: cd website && npx serve dist');
console.log('To deploy:  push website/dist/ to your hosting provider\n');
