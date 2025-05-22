#!/bin/bash

# Create a new branch
git checkout -b clean-repo-new

# Remove all files from git tracking
git rm -r --cached .

# Add back only the files we want to keep
git add .gitignore
git add package.json
git add package-lock.json
git add tsconfig.json
git add tsconfig.app.json
git add tsconfig.node.json
git add vite.config.ts
git add server.js
git add README.md
git add index.html
git add src/
git add public/

# Commit the changes
git commit -m "Clean repository: remove unwanted files and macOS metadata"

# Force push to update the repository
git push origin clean-repo-new --force

echo "Repository cleaned. Please review the changes and merge the clean-repo-new branch into main." 