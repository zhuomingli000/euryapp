#!/usr/bin/env node

/**
 * Ngrok Setup Script for Eury App
 * 
 * This script helps you set up ngrok and update the configuration automatically.
 * 
 * Usage:
 * node setup-ngrok.js [ngrok-url]
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function updateConfigFile(ngrokUrl) {
  const configPath = path.join(__dirname, 'src', 'config.js');
  
  try {
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Update the BACKEND_URL
    configContent = configContent.replace(
      /export const BACKEND_URL = "[^"]*";/,
      `export const BACKEND_URL = "${ngrokUrl}";`
    );
    
    fs.writeFileSync(configPath, configContent);
    log(`✅ Updated config.js with ngrok URL: ${ngrokUrl}`, 'green');
    
    return true;
  } catch (error) {
    log(`❌ Error updating config file: ${error.message}`, 'red');
    return false;
  }
}

function createEnvFile(ngrokUrl) {
  const envPath = path.join(__dirname, '.env');
  const envContent = `REACT_APP_BACKEND_URL=${ngrokUrl}\n`;
  
  try {
    fs.writeFileSync(envPath, envContent);
    log(`✅ Created .env file with ngrok URL`, 'green');
    return true;
  } catch (error) {
    log(`❌ Error creating .env file: ${error.message}`, 'red');
    return false;
  }
}

function updateGitignore() {
  const gitignorePath = path.join(__dirname, '.gitignore');
  const envEntries = [
    '',
    '# Environment variables',
    '.env',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local'
  ];
  
  try {
    let gitignoreContent = '';
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }
    
    // Check if .env entries already exist
    if (!gitignoreContent.includes('.env')) {
      gitignoreContent += envEntries.join('\n');
      fs.writeFileSync(gitignorePath, gitignoreContent);
      log(`✅ Updated .gitignore with environment variables`, 'green');
    } else {
      log(`ℹ️  .env entries already exist in .gitignore`, 'blue');
    }
    
    return true;
  } catch (error) {
    log(`❌ Error updating .gitignore: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  log('🚀 Eury App Ngrok Setup Script', 'cyan');
  log('================================', 'cyan');
  
  const ngrokUrl = process.argv[2];
  
  if (!ngrokUrl) {
    log('❌ Please provide your ngrok URL as an argument', 'red');
    log('Usage: node setup-ngrok.js https://your-ngrok-url.ngrok.io', 'yellow');
    process.exit(1);
  }
  
  // Validate ngrok URL format
  if (!ngrokUrl.startsWith('https://') || !ngrokUrl.includes('.ngrok.io')) {
    log('❌ Invalid ngrok URL format. Expected: https://xxx.ngrok.io', 'red');
    process.exit(1);
  }
  
  log(`📝 Setting up ngrok URL: ${ngrokUrl}`, 'blue');
  
  // Update configuration files
  const configUpdated = updateConfigFile(ngrokUrl);
  const envCreated = createEnvFile(ngrokUrl);
  const gitignoreUpdated = updateGitignore();
  
  if (configUpdated && envCreated && gitignoreUpdated) {
    log('\n🎉 Setup completed successfully!', 'green');
    log('\nNext steps:', 'yellow');
    log('1. Start your backend server: cd ../backend && python main.py', 'blue');
    log('2. Start ngrok: ngrok http 8000', 'blue');
    log('3. Start your React app: npm start', 'blue');
    log('4. Test the connection by running a training session', 'blue');
    log('\nFor deployment to GitHub Pages:', 'yellow');
    log('1. Build the app: npm run build', 'blue');
    log('2. Push to GitHub: git add . && git commit -m "Update ngrok config" && git push', 'blue');
    log('3. Enable GitHub Pages in your repository settings', 'blue');
  } else {
    log('\n❌ Setup completed with errors. Please check the output above.', 'red');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { updateConfigFile, createEnvFile, updateGitignore }; 