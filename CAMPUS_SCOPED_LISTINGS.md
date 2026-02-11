# 🏫 Campus-Scoped Listings Feature

## Overview
The **Campus-Scoped Listings** feature ensures that all transactions remain within a trusted campus community. Users can only see and create listings for their own college/institute - **no cross-institute listings are visible**.

## 🔒 Security & Privacy

### Backend Enforcement
1. **College-Based Filtering** (Backend: `listing.controller.js`)
   - Every API request extracts the user's college from their authenticated session
   - Listings are filtered: `listing.seller.college === userCollege`
   - Users from College A **cannot see** listings from College B

2. **Access Control**
   - `GET /api/listings` - Returns only listings from user's college
   - `GET /api/listings/:id` - Rejects access if listing is from different college (403 Forbidden)
   - `POST /api/listings` - Automatically associates new listing with user's college

### Database Schema
```javascript
// User Model
{
  email: "student@iitdelhi.ac.in",
  college: "IIT Delhi",  // Extracted from email domain
  verified: true
}

// Listing Model
{
  seller: ObjectId,  // References User
  title: "MacBook Air M1",
  // ... other fields
}
```

## 🎨 Frontend UI Enhancements

### 1. Marketplace Banner
- **Dynamic College Name**: Shows user's college instead of hardcoded value
- **Campus-Only Badge**: Clearly indicates listings are campus-restricted
- **Live Listing Count**: Displays number of active listings from the college

```tsx
<h2>{currentUser?.college || 'Your College'} Marketplace</h2>
<Badge>Campus Only</Badge>
```

### 2. Sell Page
- **Campus-Scoped Info Banner**: Informs sellers that only their college peers can see the listing
- **Visual Indicator**: Shield icon with "Campus-Only Listing" message

### 3. Product Details
- **Seller College Badge**: Shows seller's college with verification icon
- **Same-Campus Guarantee**: Visual confirmation that seller is from the same institute

## 🚀 How It Works

### For Buyers
1. Login with verified college email (e.g., `student@iitdelhi.ac.in`)
2. Backend extracts college: "IIT Delhi"
3. Marketplace shows only listings where `seller.college === "IIT Delhi"`
4. Clicking on any listing verified as same-college

### For Sellers
1. Create listing on Sell page
2. Listing automatically tagged with seller's college
3. Only students from the same college can:
   - See the listing in marketplace
   - Access the product detail page
   - Contact the seller

### Cross-College Prevention
```javascript
// Example: User from IIT Delhi tries to access IIT Bombay listing
GET /api/listings/ABC123

// Backend checks:
if (listing.seller.college !== user.college) {
  return res.status(403).json({
    message: 'You can only view listings from your college'
  });
}
```

## ✅ Testing the Feature

### Test Scenario 1: Same College
1. Login as `student1@iitdelhi.ac.in`
2. Create listing "Laptop for sale"
3. Login as `student2@iitdelhi.ac.in`
4. **Expected**: Listing visible in marketplace ✅

### Test Scenario 2: Different Colleges
1. Login as `student@iitdelhi.ac.in`
2. Create listing "Laptop for sale"
3. Login as `student@iitbombay.ac.in`
4. **Expected**: Listing NOT visible in marketplace ✅

### Test Scenario 3: Direct Access Prevention
1. Get listing ID from IIT Delhi student
2. Login as IIT Bombay student
3. Try accessing `/product/{listingId}`
4. **Expected**: 403 Forbidden error ✅

## 🔧 Technical Implementation

### Backend Controller (`getListings`)
```javascript
const getListings = async (req, res) => {
  // Get user's college
  const user = await User.findById(req.user.id);
  const userCollege = user.college;
  
  // Fetch all active listings
  const listings = await Listing.find({ status: 'active' })
    .populate('seller', 'name email college verified');
  
  // Filter to same college only
  const collegeListings = listings.filter(listing => 
    listing.seller.college === userCollege
  );
  
  return collegeListings;
};
```

### Backend Controller (`getListingById`)
```javascript
const getListingById = async (req, res) => {
  const user = await User.findById(req.user.id);
  const listing = await Listing.findById(req.params.id)
    .populate('seller', 'college');
  
  // Verify same college
  if (listing.seller.college !== user.college) {
    return res.status(403).json({
      message: 'You can only view listings from your college'
    });
  }
  
  return listing;
};
```

### Frontend (`Marketplace.tsx`)
```tsx
// Fetch listings (automatically filtered by backend)
const response = await fetch(`${API_URL}/api/listings`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Display college name dynamically
<h2>{currentUser?.college} Marketplace</h2>
<Badge>Campus Only</Badge>
```

## 📊 Benefits

1. **Trust & Safety**: Transactions limited to known campus community
2. **Accountability**: Both parties from same institute, easier to resolve disputes
3. **Relevance**: Only see items from nearby students (easy meetup)
4. **Privacy**: No exposure to external users or other colleges
5. **Verification**: College email verification ensures genuine students only

## 🎯 Future Enhancements

- [ ] Add campus delivery zones (hostel blocks, academic buildings)
- [ ] Campus-wide announcements for high-value items
- [ ] College-specific payment methods (campus wallet integration)
- [ ] Inter-college trading with explicit opt-in
- [ ] Analytics: Most active colleges, trending categories per campus

## 📝 Important Notes

- **College field is immutable**: Users cannot change their college after signup
- **Email verification required**: Unverified users cannot access marketplace
- **Backend enforcement**: Frontend restrictions are cosmetic; backend is the source of truth
- **Performance**: College filtering happens in-memory after DB query (future: DB-level filtering)

---

**Status**: ✅ Fully Implemented and Deployed
**Last Updated**: December 18, 2024
