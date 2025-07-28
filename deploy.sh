#!/bin/bash

# DWL App GitHub Pages Deployment Script

set -e  # Exit on any error

echo "🚀 Starting DWL App deployment to GitHub Pages..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Check if ngrok URL is provided
if [ -z "$1" ]; then
    print_error "Please provide your ngrok URL as an argument"
    echo "Usage: ./deploy.sh https://your-ngrok-url.ngrok.io"
    exit 1
fi

NGROK_URL=$1

print_status "Setting up ngrok URL: $NGROK_URL"

# Update configuration using the setup script
if [ -f "setup-ngrok.js" ]; then
    print_status "Updating configuration files..."
    node setup-ngrok.js "$NGROK_URL"
else
    print_warning "setup-ngrok.js not found. Please update config.js manually."
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build the application
print_status "Building the application..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    print_error "Build failed. Please check for errors above."
    exit 1
fi

print_success "Build completed successfully!"

# Initialize git if not already done
if [ ! -d ".git" ]; then
    print_status "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: DWL App with ngrok configuration"
else
    print_status "Git repository already exists. Adding changes..."
    git add .
    git commit -m "Update DWL App with ngrok configuration: $NGROK_URL"
fi

print_success "Git changes committed!"

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    print_warning "No remote origin found. Please add your GitHub repository:"
    echo "git remote add origin https://github.com/yourusername/your-repo-name.git"
    echo "git branch -M main"
    echo "git push -u origin main"
else
    print_status "Pushing to GitHub..."
    git push origin main
    print_success "Code pushed to GitHub!"
fi

echo ""
print_success "🎉 Deployment script completed!"
echo ""
print_status "Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Click 'Settings' → 'Pages'"
echo "3. Select 'Deploy from a branch'"
echo "4. Choose 'main' branch and '/ (root)' folder"
echo "5. Click 'Save'"
echo ""
print_warning "Remember to keep your backend server and ngrok running!"
echo "Backend: cd ../backend && python main.py"
echo "Ngrok: ngrok http 8000"
echo ""
print_status "Your app will be available at: https://yourusername.github.io/your-repo-name" 