# CampusX - Round 2 Prototype Implementation Plan

## 📋 Project Analysis

### What We Promised (Based on PDFs & Existing Code)
1. **College-Verified Marketplace** - Students can only join with .edu emails
2. **Escrow Payment System** - Secure payment holding until delivery confirmation
3. **AI Negotiator** - Automated price negotiation between buyers and sellers
4. **AI Price Intelligence** - Market-based fair pricing suggestions
5. **College ID Verification** - AI-powered student ID verification
6. **Encrypted Chat** - End-to-end encrypted messaging
7. **Trust Scores & Reviews** - Reputation system for buyers/sellers
8. **Admin Dashboard** - Fraud detection and user verification

### What Exists (Frontend Only - Lovable Generated)
✅ Beautiful landing page with Hero, Features, How It Works sections
✅ User authentication UI (Login/Signup with email verification)
✅ Marketplace with filtering, search, categories
✅ Product detail pages with escrow flow simulation
✅ Chat interface (simulated responses)
✅ Sell page with image upload
✅ Admin dashboard with fraud detection UI
✅ Responsive design with Tailwind CSS + shadcn/ui

### What's Missing (Critical Gaps)
❌ **No Backend** - Everything is frontend simulation with Zustand stores
❌ **No Real Authentication** - No JWT, sessions, or password hashing
❌ **No Database** - No persistent data storage
❌ **No AI Integration** - AI features are just UI mockups
❌ **No Real Escrow** - Payment flow is simulated
❌ **No Image Storage** - Images are base64 in memory
❌ **No Email Service** - OTP/verification emails not sent
❌ **Lovable Branding** - Watermarks in index.html and README

---

## 🎯 Team Member Roles & Tasks

### 👨‍💼 Keshav Jha - Team Leader & Frontend Developer
**Email:** jhakeshav5892@gmail.com
**GitHub:** Repository owner (empty repo to be populated)

#### Your Tasks:
1. **GitHub Setup & Management**
   - Initialize repository with proper README
   - Set up branch protection rules (main, dev, feature branches)
   - Add all team members as collaborators
   - Create GitHub Projects board for task tracking

2. **Frontend Coordination**
   - Review and approve Asmita's frontend PRs
   - Integrate frontend with Ayush's backend APIs
   - Fix routing and navigation issues
   - Ensure responsive design works on all devices

3. **Components to Build/Fix:**
   - Navbar - Remove Lovable branding, add CampusX logo
   - Footer - Update links and social media handles
   - Error handling - Add proper error boundaries
   - Loading states - Add skeletons for better UX

**Git Commands You'll Use:**
```bash
# Initialize repo (first time only)
git init
git add .
git commit -m "Initial CampusX prototype"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main

# Daily workflow
git pull origin main
git checkout -b feature/your-feature-name
# Make changes
git add .
git commit -m "Description of changes"
git push origin feature/your-feature-name
# Then create Pull Request on GitHub
```

---

### 👩‍💻 Asmita Sahoo - Frontend Developer
**Email:** asmitasahoo31@gmail.com

#### Your Tasks:
1. **UI/UX Polish**
   - Remove all Lovable references from codebase
   - Improve mobile responsiveness
   - Add animations and transitions
   - Fix form validation errors

2. **Pages to Enhance:**
   - **Marketplace.tsx** - Connect to real API, add pagination
   - **Product.tsx** - Show real product data from backend
   - **Sell.tsx** - Connect image upload to backend storage
   - **Chat.tsx** - Integrate WebSocket for real-time chat

3. **API Integration:**
   ```typescript
   // Example: Fetch listings from backend
   const fetchListings = async () => {
     const response = await fetch('http://localhost:5000/api/listings');
     const data = await response.json();
     setListings(data);
   };
   ```

4. **Components to Create:**
   - `LoadingSpinner.tsx` - Reusable loading component
   - `ErrorBoundary.tsx` - Catch and display errors gracefully
   - `ImageUpload.tsx` - Better image upload component

**Files You'll Modify:**
- `src/pages/Marketplace.tsx`
- `src/pages/Product.tsx`
- `src/pages/Sell.tsx`
- `src/pages/Chat.tsx`
- `src/components/` (various UI components)

---

### 🤖 Tribhuwan Singh - AI Developer
**Email:** webosingh93@gmail.com

#### Your Tasks:
1. **AI Negotiator System**
   - Build negotiation engine using OpenAI GPT-4 or Google Gemini
   - Takes buyer offer, seller price, item condition → suggests fair price
   - Automate counter-offers in chat

2. **AI Price Intelligence**
   - Analyze market data to suggest fair prices
   - Consider: item condition, category, original price, time on market
   - Provide confidence score (e.g., "94% confident this is a good deal")

3. **College ID Verification**
   - Use OpenAI Vision API or Google Cloud Vision
   - Extract: Name, College, ID Number, Photo from uploaded ID
   - Verify authenticity (check for tampering)

4. **Fraud Detection**
   - Price anomaly detection (e.g., iPhone for ₹100)
   - Duplicate listing detection (image similarity)
   - Suspicious user behavior patterns

#### Implementation Structure:
```javascript
// Backend: /backend/services/ai/

// 1. negotiator.js
async function negotiatePrice(buyerOffer, sellerPrice, itemDetails) {
  const prompt = `As a fair marketplace negotiator:
  - Item: ${itemDetails.title}
  - Seller asking: ₹${sellerPrice}
  - Buyer offers: ₹${buyerOffer}
  - Condition: ${itemDetails.condition}
  - Original price: ₹${itemDetails.originalPrice}
  
  Suggest a fair middle ground and reasoning.`;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  });
  
  return response.choices[0].message.content;
}

// 2. priceIntelligence.js
async function suggestPrice(itemDetails) {
  // Fetch similar items from database
  // Use AI to analyze and suggest price
}

// 3. idVerification.js
async function verifyCollegeID(imageBase64) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Extract college name, student name, ID number from this ID card" },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` }}
      ]
    }]
  });
  
  return JSON.parse(response.choices[0].message.content);
}

// 4. fraudDetection.js
function detectPriceAnomaly(price, category, condition) {
  // Check if price is suspiciously low/high
  // Return risk score
}
```

**API Keys You'll Need:**
- OpenAI API Key (gpt-4, gpt-4-vision-preview)
- OR Google Cloud AI Platform (Gemini Pro)

**Files You'll Create:**
- `backend/services/ai/negotiator.js`
- `backend/services/ai/priceIntelligence.js`
- `backend/services/ai/idVerification.js`
- `backend/services/ai/fraudDetection.js`
- `backend/routes/ai.routes.js`

---

### 🔧 Ayush Raj Chourasia - Backend Developer (You)
**Email:** iter.student.alpha@gmail.com

#### Your Tasks:
1. **Backend Architecture Setup**
   - Node.js + Express.js server
   - MongoDB database (or PostgreSQL)
   - JWT authentication
   - File upload with Cloudinary/AWS S3

2. **API Endpoints to Build:**

**Authentication APIs**
```javascript
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/verify-email (send OTP)
POST /api/auth/verify-otp
POST /api/auth/logout
GET  /api/auth/me (get current user)
```

**Listings APIs**
```javascript
GET    /api/listings (with filters: category, price range, search)
GET    /api/listings/:id
POST   /api/listings (create new listing)
PUT    /api/listings/:id
DELETE /api/listings/:id
```

**Chat APIs**
```javascript
GET  /api/chats/:listingId (get chat messages)
POST /api/chats/:listingId/message (send message)
WebSocket: /ws/chat (real-time messaging)
```

**Escrow Payment APIs**
```javascript
POST /api/escrow/initiate
POST /api/escrow/confirm-delivery
POST /api/escrow/release-payment
GET  /api/escrow/:transactionId/status
```

**User/Profile APIs**
```javascript
GET  /api/users/:id
PUT  /api/users/:id (update profile)
POST /api/users/:id/verify-id (upload college ID)
GET  /api/users/:id/reviews
```

**Admin APIs**
```javascript
GET  /api/admin/pending-verifications
PUT  /api/admin/verify-user/:id
GET  /api/admin/fraud-alerts
PUT  /api/admin/ban-user/:id
```

3. **Database Schema Design:**

**MongoDB Collections:**
```javascript
// users
{
  _id: ObjectId,
  name: String,
  email: String (unique, validated .edu domain),
  password: String (hashed with bcrypt),
  college: String,
  year: String,
  department: String,
  isVerified: Boolean,
  collegeIdUrl: String,
  trustScore: Number (0-100),
  createdAt: Date
}

// listings
{
  _id: ObjectId,
  sellerId: ObjectId (ref: users),
  title: String,
  description: String,
  price: Number,
  originalPrice: Number,
  condition: String,
  category: String,
  images: [String], // Cloudinary URLs
  status: String (active/sold/removed),
  createdAt: Date
}

// chats
{
  _id: ObjectId,
  listingId: ObjectId,
  participants: [ObjectId], // buyer, seller
  messages: [{
    senderId: ObjectId,
    content: String,
    timestamp: Date
  }]
}

// escrow_transactions
{
  _id: ObjectId,
  listingId: ObjectId,
  buyerId: ObjectId,
  sellerId: ObjectId,
  amount: Number,
  status: String (initiated/held/delivered/released/disputed),
  paymentId: String (Razorpay/Stripe),
  createdAt: Date
}

// reviews
{
  _id: ObjectId,
  reviewerId: ObjectId,
  revieweeId: ObjectId,
  listingId: ObjectId,
  rating: Number (1-5),
  comment: String,
  createdAt: Date
}
```

4. **Tech Stack:**
```javascript
// package.json dependencies
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "multer": "^1.4.5-lts.1",
  "cloudinary": "^1.41.0",
  "nodemailer": "^6.9.7",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "socket.io": "^4.6.0",
  "razorpay": "^2.9.2" // or stripe
}
```

**Folder Structure You'll Create:**
```
backend/
├── server.js (entry point)
├── config/
│   ├── db.js (MongoDB connection)
│   └── cloudinary.js
├── models/
│   ├── User.js
│   ├── Listing.js
│   ├── Chat.js
│   ├── Escrow.js
│   └── Review.js
├── routes/
│   ├── auth.routes.js
│   ├── listing.routes.js
│   ├── chat.routes.js
│   ├── escrow.routes.js
│   ├── user.routes.js
│   └── admin.routes.js
├── controllers/
│   ├── authController.js
│   ├── listingController.js
│   └── ... (one per route file)
├── middleware/
│   ├── auth.middleware.js (JWT verification)
│   ├── upload.middleware.js (multer)
│   └── errorHandler.js
├── services/
│   ├── email.service.js (nodemailer)
│   ├── payment.service.js (Razorpay integration)
│   └── ai/ (Tribhuwan's AI services)
└── package.json
```

**Environment Variables (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campusx
JWT_SECRET=your-super-secret-key-change-this
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=campusx.noreply@gmail.com
EMAIL_PASSWORD=your-app-password
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
OPENAI_API_KEY=sk-... (for Tribhuwan)
```

---

### 🎤 Aanchal Nair - Pitching & Documentation
**Email:** nairaanchal98@gmail.com

#### Your Tasks:
1. **Presentation Materials**
   - Create pitch deck highlighting key features
   - Prepare demo script for Round 2 presentation
   - Document user flow with screenshots

2. **Documentation**
   - Write user guide (How to buy/sell on CampusX)
   - Create API documentation for backend
   - Document AI features and their benefits

3. **Marketing Content**
   - Write compelling product descriptions
   - Create social media content for launch
   - Design promotional graphics

**No coding required** - Focus on storytelling and presentation

---

## 📦 Implementation Timeline (Prototype Phase)

### Week 1: Foundation
**Days 1-2:** Setup & Branding
- [ ] Keshav: Initialize GitHub repo, add team members
- [ ] Asmita: Remove Lovable branding, update to CampusX
- [ ] Ayush: Setup backend folder structure, install dependencies

**Days 3-5:** Core Backend
- [ ] Ayush: Build authentication APIs (signup, login, JWT)
- [ ] Ayush: Setup MongoDB, create User model
- [ ] Ayush: Implement email verification with OTP

**Days 6-7:** Database & Basic APIs
- [ ] Ayush: Create Listing, Chat, Escrow models
- [ ] Ayush: Build GET/POST endpoints for listings
- [ ] Tribhuwan: Setup AI service structure

### Week 2: Integration & AI
**Days 8-10:** Frontend-Backend Connection
- [ ] Asmita: Connect Signup/Login to backend APIs
- [ ] Asmita: Replace Zustand mock data with API calls
- [ ] Keshav: Test authentication flow end-to-end

**Days 11-13:** AI Features
- [ ] Tribhuwan: Implement AI Price Intelligence
- [ ] Tribhuwan: Build College ID verification with GPT-4 Vision
- [ ] Tribhuwan: Create AI Negotiator for chat
- [ ] Ayush: Integrate AI services into backend routes

**Days 14-15:** Chat & Real-time
- [ ] Ayush: Implement WebSocket for real-time chat
- [ ] Asmita: Connect chat UI to WebSocket
- [ ] Tribhuwan: Add AI negotiator to chat flow

### Week 3: Polish & Demo
**Days 16-18:** Escrow & Payments
- [ ] Ayush: Integrate Razorpay (or Stripe) for payments
- [ ] Ayush: Build escrow flow APIs
- [ ] Asmita: Connect Product page to escrow APIs
- [ ] Keshav: Test full buy/sell flow

**Days 19-20:** Admin Dashboard
- [ ] Ayush: Build admin APIs (verify users, fraud alerts)
- [ ] Asmita: Connect Admin Dashboard to real data
- [ ] Tribhuwan: Implement fraud detection algorithms

**Days 21-23:** Testing & Bug Fixes
- [ ] All: End-to-end testing
- [ ] Keshav: Coordinate bug fixes
- [ ] Asmita: UI/UX polish
- [ ] Aanchal: Document features, prepare demo

**Days 24-25:** Deployment
- [ ] Ayush: Deploy backend to Railway/Render
- [ ] Keshav: Deploy frontend to Vercel/Netlify
- [ ] All: Final testing on production

**Days 26-28:** Demo Preparation
- [ ] Aanchal: Finalize pitch deck
- [ ] All: Practice demo presentation
- [ ] Keshav: Ensure GitHub shows all contributions

---

## 🔄 Git Workflow & Contribution Strategy

### Branch Strategy
```
main (production-ready code)
├── dev (integration branch)
    ├── feature/auth-system (Ayush)
    ├── feature/ai-negotiator (Tribhuwan)
    ├── feature/marketplace-ui (Asmita)
    └── feature/admin-dashboard (Keshav)
```

### Daily Workflow for Everyone
```bash
# Morning: Get latest code
git checkout dev
git pull origin dev

# Create your feature branch
git checkout -b feature/your-feature-name

# Work on your tasks
# ... make changes ...

# Commit frequently with clear messages
git add .
git commit -m "feat: Add user authentication API"
git commit -m "fix: Fix login form validation"
git commit -m "style: Improve marketplace card design"

# Push to your branch
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# Request review from team leader (Keshav)

# After approval, merge to dev
# Keshav will merge dev -> main periodically
```

### Commit Message Convention
```
feat: Add new feature
fix: Bug fix
style: UI/styling changes
refactor: Code restructuring
docs: Documentation updates
test: Add tests

Example:
feat: Add AI price suggestion API
fix: Resolve escrow payment flow bug
style: Improve mobile responsiveness on Marketplace
```

### Showing Individual Contributions
Since Keshav's repo is the main one, but Ayush (you) are managing it:

**Option 1: Git Commits with Proper Authors**
```bash
# When committing on behalf of team member
git commit -m "feat: Add AI negotiator" --author="Tribhuwan Singh <webosingh93@gmail.com>"
git commit -m "style: Polish marketplace UI" --author="Asmita Sahoo <asmitasahoo31@gmail.com>"
```

**Option 2: Each Member Works Locally & Pushes**
- Each team member clones the repo
- Everyone has write access (add as collaborators)
- Each pushes their own commits from their machine
- GitHub will show their profile pics and names

**Recommended: Option 2** - More authentic, shows real collaboration

### Adding Team Members as Collaborators
1. Go to GitHub repo: `Settings` → `Collaborators`
2. Add each email:
   - asmitasahoo31@gmail.com
   - webosingh93@gmail.com
   - iter.student.alpha@gmail.com
   - nairaanchal98@gmail.com

---

## 🚀 Deployment Plan

### Frontend Deployment (Keshav & Asmita)
**Platform:** Vercel (recommended) or Netlify

**Steps:**
1. Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

2. Update environment variables:
```bash
# .env.production
VITE_API_URL=https://your-backend.railway.app
```

3. Deploy:
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

### Backend Deployment (Ayush)
**Platform:** Railway (recommended) or Render

**Steps:**
1. Create `Procfile`:
```
web: node server.js
```

2. Set environment variables on Railway dashboard

3. Deploy:
```bash
# Push to GitHub, Railway auto-deploys
git push origin main
```

### Database Hosting
**MongoDB Atlas** (free tier available)
- Create cluster at mongodb.com/cloud/atlas
- Whitelist Railway's IP addresses
- Update MONGODB_URI in Railway env vars

---

## 📝 Critical Files to Update NOW

### 1. index.html - Remove Lovable Branding
```html
<!-- BEFORE -->
<title>Lovable App</title>
<meta name="description" content="Lovable Generated Project" />
<meta property="og:title" content="Lovable App" />

<!-- AFTER -->
<title>CampusX - Safe Student Marketplace</title>
<meta name="description" content="India's first verified student-only marketplace with escrow protection and AI-powered fair pricing" />
<meta property="og:title" content="CampusX" />
```

### 2. README.md - Complete Rewrite
See separate file: `README.md`

### 3. package.json - Update Project Name
```json
{
  "name": "campusx-marketplace",
  "version": "1.0.0",
  "description": "Verified student marketplace with escrow payments",
  // ...
}
```

### 4. .env.example - Document Environment Variables
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:5000

# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campusx
JWT_SECRET=change-this-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
OPENAI_API_KEY=sk-xxx
```

---

## 🎯 Minimum Viable Prototype (Must-Have Features)

### For Round 2 Demo, Focus On:
1. ✅ **User Signup/Login** - Working email verification
2. ✅ **Marketplace** - Real listings from database
3. ✅ **Sell Item** - Upload with image, stored in database
4. ✅ **Product Detail** - Show product with seller info
5. ✅ **Chat** - Real-time messaging (even without AI initially)
6. ✅ **AI Price Suggestion** - Working on Sell page
7. ✅ **College ID Verification** - AI extracts info from uploaded ID
8. ✅ **Escrow Payment** - At least simulated flow with Razorpay test mode
9. ✅ **Admin Dashboard** - Show pending verifications

### Nice-to-Have (If Time Permits):
- AI Negotiator in chat
- Complete fraud detection system
- Email notifications
- Review/rating system
- Advanced filters

---

## 🆘 Troubleshooting & Common Issues

### CORS Errors (Frontend can't reach Backend)
```javascript
// backend/server.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
```

### MongoDB Connection Issues
```javascript
// backend/config/db.js
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));
```

### JWT Authentication Not Working
```javascript
// Ensure token is sent in headers
// Frontend
fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Backend middleware
const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## 📞 Communication Plan

### Daily Standups (15 min)
- Time: 9:00 AM (or suitable time for all)
- Format: Quick updates
  - What I did yesterday
  - What I'm doing today
  - Any blockers?

### Weekly Sync (1 hour)
- Review progress
- Demo working features
- Adjust timeline if needed

### Tools
- **GitHub Discussions** - For technical Q&A
- **WhatsApp Group** - Quick communication
- **Google Meet** - Weekly sync calls

---

## 🏁 Success Criteria for Prototype

By end of Round 2:
1. ✅ User can signup with college email and get verified
2. ✅ User can list item with photo and AI suggests price
3. ✅ User can browse marketplace and search items
4. ✅ User can chat with seller in real-time
5. ✅ User can initiate payment (test mode)
6. ✅ Admin can verify pending users
7. ✅ GitHub repo shows all 4 tech members' contributions
8. ✅ Deployed live demo (frontend + backend)
9. ✅ At least 1 AI feature working (ID verification OR price intelligence)
10. ✅ Professional presentation deck by Aanchal

---

## 🎓 Learning Resources

### For Keshav (Team Leader & Frontend)
- React Router: https://reactrouter.com/
- API Integration: https://javascript.info/fetch
- Git Basics: https://www.youtube.com/watch?v=HVsySz-h9r4

### For Asmita (Frontend)
- Async/Await: https://javascript.info/async-await
- React Hooks: https://react.dev/reference/react
- Tailwind CSS: https://tailwindcss.com/docs

### For Tribhuwan (AI)
- OpenAI API: https://platform.openai.com/docs
- GPT-4 Vision: https://platform.openai.com/docs/guides/vision
- Prompt Engineering: https://www.promptingguide.ai/

### For Ayush (Backend)
- Express.js: https://expressjs.com/
- MongoDB: https://www.mongodb.com/docs/manual/
- JWT Auth: https://jwt.io/introduction

---

## 📧 Next Steps (IMMEDIATE)

### Today:
1. **Ayush**: Share this plan document with entire team
2. **Keshav**: Initialize GitHub repo and add collaborators
3. **All**: Read this document completely, ask questions
4. **All**: Set up local development environment

### Tomorrow:
1. **Ayush**: Start backend setup (server.js, folder structure)
2. **Asmita**: Remove Lovable branding from frontend
3. **Tribhuwan**: Sign up for OpenAI API, get key
4. **Keshav**: Create GitHub Projects board with tasks
5. **Aanchal**: Start pitch deck outline

### This Week:
- Complete Week 1 tasks from timeline
- First team sync call to review progress
- All: Make first commits to GitHub

---

## 🎉 Motivation

You've already built a beautiful frontend! Now let's add the backend and AI to make it real. 

**Remember:**
- This is a prototype, not a final product
- Focus on core features first
- Working > Perfect
- Help each other when stuck
- Document everything

**You got this! 🚀**

Team CampusX - Round 2
