
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to clean the dist directory
function cleanDist() {
  console.log('Cleaning dist directory...');
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    try {
      fs.rmSync(distPath, { recursive: true, force: true });
      console.log('Dist directory removed successfully');
    } catch (err) {
      console.error('Error removing dist directory:', err);
    }
  } else {
    console.log('Dist directory does not exist, nothing to clean');
  }
}

// Function to clean Vite cache
function cleanCache() {
  console.log('Cleaning Vite cache...');
  const cachePath = path.join(__dirname, 'node_modules', '.vite');
  if (fs.existsSync(cachePath)) {
    try {
      fs.rmSync(cachePath, { recursive: true, force: true });
      console.log('Vite cache removed successfully');
    } catch (err) {
      console.error('Error removing Vite cache:', err);
    }
  } else {
    console.log('Vite cache directory does not exist, nothing to clean');
  }
}

// Main function
function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const shouldClean = args.includes('--clean');
  
  if (shouldClean) {
    cleanDist();
    cleanCache();
  }
  
  // Run the build command
  console.log('Building the application...');
  try {
    execSync('vite build', { stdio: 'inherit' });
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
