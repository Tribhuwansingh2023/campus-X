# 🚀 GitHub Setup Guide for CampusX Team

## For Team Leader (Keshav Jha)

### Step 1: Initialize Repository

```bash
# Open PowerShell in the campusX folder
cd "C:\Users\iters\Downloads\campusX"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: CampusX prototype with updated branding"

# Rename branch to main
git branch -M main

# Add your GitHub repository as remote
# Replace with your actual GitHub repo URL
git remote add origin https://github.com/jhakeshav5892/campusx.git

# Push to GitHub
git push -u origin main
```

### Step 2: Add Team Members as Collaborators

1. Go to your GitHub repository
2. Click **Settings** → **Collaborators**
3. Click **Add people**
4. Add each team member by email:
   - asmitasahoo31@gmail.com (Asmita - Frontend)
   - webosingh93@gmail.com (Tribhuwan - AI)
   - iter.student.alpha@gmail.com (Ayush - Backend)
   - nairaanchal98@gmail.com (Aanchal - Documentation)

### Step 3: Create Branch Protection Rules

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
5. Save changes

---

## For All Team Members

### First Time Setup

```bash
# 1. Clone the repository
git clone https://github.com/jhakeshav5892/campusx.git
cd campusx

# 2. Configure your git identity (use your own name and email)
git config user.name "Your Name"
git config user.email "your.email@gmail.com"

# 3. Install dependencies
npm install

# 4. Create your .env file
cp .env.example .env
# Edit .env with your local settings
```

### Daily Workflow

```bash
# Morning: Get latest code
git checkout main
git pull origin main

# Create your feature branch (use descriptive name)
git checkout -b feature/your-feature-name

# Examples:
# git checkout -b feature/ai-negotiator
# git checkout -b feature/marketplace-filters
# git checkout -b feature/payment-integration

# Work on your tasks...
# Make changes to files

# Check what you changed
git status

# Stage your changes
git add .
# Or stage specific files: git add src/pages/Chat.tsx

# Commit with clear message
git commit -m "feat: Add AI price suggestion API"

# Push to GitHub
git push origin feature/your-feature-name

# If this is first push on this branch:
git push -u origin feature/your-feature-name
```

### Creating Pull Request

1. Go to GitHub repository
2. You'll see banner: "Compare & pull request"
3. Click it
4. Fill in:
   - **Title**: Clear description (e.g., "Add AI negotiator feature")
   - **Description**: What you changed, why, how to test
5. Request review from **Keshav Jha** (team leader)
6. Click **Create pull request**

### After PR is Approved

```bash
# Switch back to main
git checkout main

# Pull latest (includes your merged changes)
git pull origin main

# Delete your feature branch (optional)
git branch -d feature/your-feature-name
```

---

## Commit Message Convention

Use these prefixes for clear git history:

```bash
feat:     # New feature
fix:      # Bug fix
style:    # UI/styling changes
refactor: # Code restructuring without changing functionality
docs:     # Documentation updates
test:     # Add or update tests

# Examples:
git commit -m "feat: Add college ID verification API"
git commit -m "fix: Resolve escrow payment bug"
git commit -m "style: Improve marketplace mobile layout"
git commit -m "refactor: Extract chat logic to separate hook"
git commit -m "docs: Update API documentation"
```

---

## Who Works on What?

### Asmita Sahoo - Frontend Developer
**Your branches will be:**
```bash
git checkout -b feature/marketplace-filters
git checkout -b feature/product-detail-ui
git checkout -b feature/chat-ui-improvements
git checkout -b style/mobile-responsive-fixes
```

**Your commits:**
```bash
git commit -m "feat: Add advanced marketplace filters"
git commit -m "style: Improve product card design"
git commit -m "fix: Fix chat scroll behavior"
```

---

### Tribhuwan Singh - AI Developer
**Your branches:**
```bash
git checkout -b feature/ai-negotiator
git checkout -b feature/ai-price-intelligence
git checkout -b feature/id-verification-ai
git checkout -b feature/fraud-detection
```

**Your commits:**
```bash
git commit -m "feat: Implement AI negotiation engine"
git commit -m "feat: Add GPT-4 Vision for ID verification"
git commit -m "feat: Build price prediction algorithm"
```

**Your work location:**
```
backend/services/ai/
├── negotiator.js
├── priceIntelligence.js
├── idVerification.js
└── fraudDetection.js
```

---

### Ayush Raj Chourasia - Backend Developer
**Your branches:**
```bash
git checkout -b feature/auth-system
git checkout -b feature/listing-apis
git checkout -b feature/chat-websocket
git checkout -b feature/escrow-payment
git checkout -b feature/admin-apis
```

**Your commits:**
```bash
git commit -m "feat: Implement JWT authentication"
git commit -m "feat: Add listing CRUD APIs"
git commit -m "feat: Setup WebSocket for real-time chat"
git commit -m "feat: Integrate Razorpay payment gateway"
```

**Your work location:**
```
backend/
├── server.js
├── config/
├── models/
├── routes/
├── controllers/
└── middleware/
```

---

### Keshav Jha - Team Leader & Frontend
**Your branches:**
```bash
git checkout -b feature/navbar-improvements
git checkout -b feature/error-handling
git checkout -b fix/routing-issues
git checkout -b style/landing-page-polish
```

**Your commits:**
```bash
git commit -m "feat: Add loading states to all pages"
git commit -m "fix: Resolve navigation bugs"
git commit -m "style: Polish landing page animations"
```

**Your role:**
- Review all pull requests
- Merge approved PRs to main
- Coordinate team
- Resolve merge conflicts

---

## Common Git Scenarios

### Scenario 1: You Made Changes but Want to Pull Latest
```bash
# Save your work temporarily
git stash

# Pull latest
git pull origin main

# Restore your work
git stash pop
```

### Scenario 2: Merge Conflicts
```bash
# When pulling/merging shows conflicts
# Open the conflicting files
# Look for markers: <<<<<<< HEAD, =======, >>>>>>>
# Edit to keep what you want
# Remove the markers

# After resolving:
git add .
git commit -m "fix: Resolve merge conflicts"
```

### Scenario 3: Wrong Commit Message
```bash
# If you haven't pushed yet
git commit --amend -m "Corrected message"

# If you already pushed, DON'T amend
# Just make a new commit
```

### Scenario 4: Forgot to Create Branch
```bash
# You made changes on main by mistake
# Create branch with your current changes
git checkout -b feature/your-feature

# Your changes are now on new branch
```

---

## GitHub Desktop (Alternative - Easier for Non-Git Users)

### For Keshav (if command line is confusing):

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. Clone repository
4. Make changes in VSCode
5. Go to GitHub Desktop:
   - See your changes listed
   - Write commit message
   - Click "Commit to main"
   - Click "Push origin"

---

## Showing Your Contributions

### Each Member Should:
1. Clone the repo to YOUR computer
2. Work on YOUR tasks
3. Commit with YOUR name configured
4. Push from YOUR computer

GitHub will automatically show:
- Your profile picture
- Your commit count
- Your lines added/deleted
- Your contribution graph

### To Verify Your Identity:
```bash
# Check current git config
git config user.name
git config user.email

# If wrong, set correct ones
git config user.name "Asmita Sahoo"
git config user.email "asmitasahoo31@gmail.com"
```

---

## Important Reminders

### DO:
✅ Pull before you start working
✅ Create branches for features
✅ Commit frequently with clear messages
✅ Push at end of day
✅ Request reviews for PRs
✅ Ask for help in team WhatsApp if stuck

### DON'T:
❌ Work directly on main branch
❌ Force push (`git push -f`)
❌ Commit large files (images > 1MB, node_modules)
❌ Commit .env files with secrets
❌ Delete others' branches

---

## Emergency Contacts

**Git Issues:** Ask Ayush (iter.student.alpha@gmail.com)
**GitHub PR Issues:** Ask Keshav (jhakeshav5892@gmail.com)
**Merge Conflicts:** Team call

---

## Quick Reference

```bash
# Check status
git status

# See commit history
git log --oneline

# See your branches
git branch

# Switch branch
git checkout branch-name

# Create and switch to new branch
git checkout -b new-branch-name

# See differences
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes (CAREFUL!)
git reset --hard HEAD
```

---

## GitHub Repository URL

**Main Repo:** https://github.com/jhakeshav5892/campusx

**Clone Command:**
```bash
git clone https://github.com/jhakeshav5892/campusx.git
```

---

**Need Help?** Don't hesitate to ask in the team group!

**Practice Makes Perfect** - You'll get comfortable with git in a few days 🚀
