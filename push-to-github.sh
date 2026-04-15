#!/bin/bash

# ============================================
# JARVIS AI - GitHub Push Script
# ============================================

echo "🚀 Pushing JARVIS to GitHub..."
echo ""

# Repository URL
REPO_URL="https://github.com/yousefazama0-svg/J.A.R.V.I.S.git"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if user is logged in to GitHub
echo "📋 Checking GitHub authentication..."
echo "If prompted, enter your GitHub credentials or Personal Access Token"
echo ""

# Add remote if not exists
if ! git remote | grep -q "origin"; then
    git remote add origin $REPO_URL
    echo "✅ Added remote: $REPO_URL"
fi

# Set branch to main
git branch -M main

# Push to GitHub
echo ""
echo "📤 Uploading to GitHub..."
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Your project is now on GitHub!"
    echo "🔗 Visit: https://github.com/yousefazama0-svg/J.A.R.V.I.S"
else
    echo ""
    echo "❌ Push failed. You may need to:"
    echo "   1. Login to GitHub: gh auth login"
    echo "   2. Or use a Personal Access Token as password"
    echo "   3. Or use SSH: git remote set-url origin git@github.com:yousefazama0-svg/J.A.R.V.I.S.git"
fi
