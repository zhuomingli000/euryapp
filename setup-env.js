#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Eury App Environment Setup');
console.log('============================\n');

const envPath = path.join(__dirname, '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('If you want to update it, please edit it manually or delete it first.\n');
  console.log('Current .env contents:');
  console.log('----------------------');
  console.log(fs.readFileSync(envPath, 'utf8'));
  process.exit(0);
}

// Create .env content
const envContent = `# Google OAuth Configuration
# Replace 'your-google-client-id-here' with your actual Google OAuth Client ID
# Get your Client ID from: https://console.cloud.google.com/apis/credentials
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here

# Backend URL (optional - can be overridden)
REACT_APP_BACKEND_URL=https://tnq4ievkmx1cx2-8888.proxy.runpod.net

# Instructions:
# 1. Go to https://console.cloud.google.com
# 2. Create a new project or select existing one
# 3. Enable Google+ API
# 4. Create OAuth 2.0 credentials
# 5. Set authorized origins to: http://localhost:3000
# 6. Replace 'your-google-client-id-here' with your actual Client ID
# 7. Restart your development server: npm start
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Get your Google OAuth Client ID from: https://console.cloud.google.com/apis/credentials');
  console.log('2. Replace "your-google-client-id-here" in the .env file with your actual Client ID');
  console.log('3. Restart your development server: npm start');
  console.log('\n📖 For detailed instructions, see: GOOGLE_OAUTH_SETUP.md');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('\n📝 Manual setup:');
  console.log('Create a .env file in the root directory with the following content:');
  console.log('----------------------');
  console.log(envContent);
} 