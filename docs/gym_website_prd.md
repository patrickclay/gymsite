# Product Requirements Document: Local Gym Website & Class Management Platform

## 1. Executive Summary

**Product Name:** [Gym Name] Digital Platform

**Vision:** Create a frictionless digital experience that converts local community interest into paying gym members through an elegant, easy-to-manage website with integrated class scheduling and payments.

**Target Users:**
- **Primary:** Gym owners (non-technical) managing classes, content, and member communications
- **Secondary:** Prospective and current gym members discovering, booking, and paying for classes

**Success Metrics:**
- Email list growth rate (pre-launch community building)
- Class booking conversion rate (visitors → paying customers)
- Local search ranking for "[gym type] near me Lilburn GA"
- Social share rate and referral traffic from social platforms

---

## 2. Core User Journeys

### Journey 1: Prospective Member Discovery (Pre-Launch)
1. Discovers gym via Google search, Instagram, or Facebook
2. Lands on compelling homepage with clear value proposition
3. Joins email list to get notified about opening/special offers
4. Shares with friends on social media

### Journey 2: Member Books & Pays for Class
1. Views class schedule with real-time availability
2. Selects class and time slot
3. Creates account or logs in
4. Pays via Stripe/PayPal in 2-3 clicks
5. Receives confirmation email with calendar invite
6. Gets reminder notification before class

### Journey 3: Gym Owner Manages Operations
1. Logs into simple admin dashboard
2. Adds/updates class schedule in minutes
3. Reviews bookings and payments
4. Sends announcement to email list
5. Views basic reporting (revenue, attendance, popular classes)

---

## 3. Feature Requirements

### 3.1 Landing Page & Marketing
**Priority: P0 (Must-Have)**

**Requirements:**
- Hero section with compelling value proposition and high-quality imagery
- Clear class offerings overview (yoga, HIIT, strength training, etc.)
- Social proof section (instructor bios, testimonials when available)
- Prominent email capture form (above and below fold)
- Mobile-first responsive design
- Fast page load (<2 seconds on mobile)

**Success Criteria:**
- Email signup conversion >5% of visitors
- Mobile traffic accounts for >60% of total
- Page speed score >90 on Google PageSpeed Insights

---

### 3.2 Email List & Notifications
**Priority: P0 (Must-Have)**

**Requirements:**
- Email capture with single field (email) + optional name
- Mailchimp or ConvertKit integration for list management
- Automated welcome email upon signup
- Admin ability to send broadcast emails (class announcements, promotions)
- Segmentation capability (pre-launch vs. active members)
- Unsubscribe functionality (legally required)

**Admin UX:**
- "Send Email" button in dashboard
- Pre-built templates for common announcements
- Preview before sending

**Success Criteria:**
- Email delivery rate >95%
- Open rate >25% (industry benchmark)

---

### 3.3 Class Schedule & Booking
**Priority: P0 (Must-Have)**

**Schedule Display:**
- Weekly calendar view (default)
- Filter by class type, instructor, time
- Clear indication of spots available/full
- Mobile-optimized touch interactions

**Admin Management:**
- Drag-and-drop or simple form to add classes
- Recurring class templates (e.g., "Yoga every Monday 6pm")
- Set capacity limits per class
- Mark classes as canceled/full
- AI-powered description generator (see 3.8)
- No coding required - visual interface only

**Booking Flow:**
- Guest checkout OR account creation (don't force account pre-launch)
- Collect: name, email, phone (optional), emergency contact
- Class pack options (single class, 5-pack, 10-pack, monthly unlimited)
- Waitlist functionality when class is full

**Success Criteria:**
- Booking completion rate >70% (cart to payment)
- Admin can add a class in <2 minutes

---

### 3.4 Payment Processing
**Priority: P0 (Must-Have)**

**Requirements:**
- Stripe integration (recommended primary)
- PayPal integration (secondary option)
- Support for:
  - One-time class purchases
  - Class packs (5, 10, 20 sessions)
  - Monthly recurring memberships
- Automatic email receipts
- Refund capability for admin
- Tax calculation for Georgia

**Admin Experience:**
- View transaction history
- Issue refunds with one click
- See revenue by class/time period

**Security:**
- PCI compliance handled by Stripe/PayPal (no credit card data stored)
- SSL certificate (HTTPS)

**Success Criteria:**
- Payment success rate >95%
- Zero manual payment reconciliation needed

---

### 3.5 Business Reporting
**Priority: P1 (Should-Have)**

**Approach:** Leverage Stripe Dashboard + lightweight custom reporting

**Stripe Dashboard provides:**
- Revenue totals and trends
- Payment breakdown
- Refunds and disputes
- Payout schedule

**Custom Dashboard (simple add-on):**
- Most popular classes by attendance
- Revenue by class type
- Member attendance trends
- Email list growth chart

**Export Capability:**
- CSV download for bookings
- CSV download for member list

**Success Criteria:**
- Owners can answer "what's our best class?" in 30 seconds
- Monthly revenue reporting without manual spreadsheets

---

### 3.6 Local SEO & Discoverability
**Priority: P0 (Must-Have)**

**Technical SEO:**
- Google Business Profile setup and optimization
- Schema markup for LocalBusiness, Event (classes)
- Optimized meta titles/descriptions with location keywords
- Mobile-friendly (Google mobile-first indexing)
- XML sitemap submitted to Google Search Console

**Content Strategy:**
- Target keywords: "[class type] Lilburn GA", "gym near me Lilburn", "fitness classes Gwinnett County"
- Location pages: "Serving Lilburn, Stone Mountain, Tucker, Norcross"
- Blog capability for local content (optional P2)

**Local Citations:**
- Yelp, Facebook, Instagram business profiles
- Consistent NAP (Name, Address, Phone) across all platforms

**Success Criteria:**
- Rank in top 3 Google Map Pack for "gym Lilburn GA" within 90 days
- Organic search traffic >30% of total traffic

---

### 3.7 Social Sharing & Virality
**Priority: P0 (Must-Have)**

**Built-in Sharing:**
- Open Graph meta tags for rich Facebook/LinkedIn previews
- Twitter Card markup
- **Share this class (implemented):** Each class signup page includes a "Share this class" section with:
  - **Native share:** When the browser supports the Web Share API (e.g. mobile Safari, Android Chrome), a primary "Share" button opens the system share sheet (Messages, WhatsApp, Instagram, Copy, etc.).
  - **Copy link:** One-click copy of the class page URL to the clipboard, with "Link copied!" feedback.
  - **Social intents:** Links that open share dialogs in a new tab for X (Twitter), Facebook, and WhatsApp, using pre-filled title/text/URL.
- Referral incentive messaging ("Bring a friend, both get $10 off")

**Social Proof Integration:**
- Instagram feed embed on homepage
- Facebook page plugin
- User-generated content section (when available)

**Shareable Moments:**
- "I just booked [Class Name]!" auto-post option after booking
- Achievement badges ("10 classes completed!") with share prompt
- Referral link generation for members

**Admin Tools:**
- Pre-written social media posts in dashboard
- Download branded graphics for Instagram Stories
- QR code for easy mobile sharing

**Social Media Integration:**
- Easy posting to Instagram, Facebook from dashboard
- Automated class schedule posts
- Member spotlight features

**Success Criteria:**
- >15% of bookings include social share
- Social referral traffic >20% of total traffic

---

### 3.8 AI-Powered Content Tools
**Priority: P1 (Should-Have)**
**Status: Implemented (February 2026)**

**Description Generator:**
- One-click AI description generation in the admin class form
- Uses Vercel AI Gateway (built on AI SDK) with GPT-4o-mini
- Generates SEO-friendly, social-sharing-optimized class descriptions
- Tuned for brand voice: warm, confident, inclusive — matching homepage tone
- Incorporates Atlanta-area fitness keywords for local SEO
- Admin can edit generated text before saving

**How It Works:**
1. Admin fills in class name, type, instructor, duration, and capacity
2. Clicks "Generate with AI" button next to the description field
3. AI produces a 2-3 sentence description optimized for search and social sharing
4. Admin reviews, edits if needed, and saves

**Technical Details:**
- API route: `/api/generate-description` (admin-session-gated)
- Provider: Vercel AI Gateway → OpenAI GPT-4o-mini (swappable to any model)
- Cost: fractions of a cent per generation
- Env var: `AI_GATEWAY_API_KEY`

**Future Enhancements:**
- Social media post generation from class descriptions
- Email campaign copy generation
- Tone/style presets (e.g., "energetic", "calm", "motivational")
- Batch description generation for recurring class series

**Success Criteria:**
- >80% of new classes use AI-generated descriptions (vs. blank)
- Generated descriptions include at least one local SEO keyword
- Admin time to create a class with description <3 minutes

---

## 4. Non-Functional Requirements

### 4.1 Usability (Non-Technical Admin)
- Admin training time: <1 hour to full proficiency
- No code editing required for any common task
- Visual page builder for content updates
- Contextual help tooltips throughout admin
- Phone/email support from platform vendor

### 4.2 Performance
- Page load time: <2s on 4G mobile
- Booking flow completion: <60s from schedule to confirmation
- 99.9% uptime SLA

### 4.3 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- Color contrast ratios meet standards

### 4.4 Security & Compliance
- SSL/TLS encryption
- GDPR-compliant email practices
- CAN-SPAM Act compliance
- Payment data handled by Stripe/PayPal (PCI Level 1)

---

## 5. Technical Implementation Recommendations

### Recommended Tech Stack (for rapid prototyping):

**Option A: No-Code/Low-Code (Fastest)**
- **Platform:** Webflow (design) + MemberStack (auth) + Stripe + Zapier (integrations)
- **Scheduling:** Acuity Scheduling or Calendly embedded
- **Email:** Mailchimp or ConvertKit
- **Time to MVP:** 2-3 weeks
- **Pros:** Zero ongoing dev maintenance, very non-technical friendly
- **Cons:** Monthly SaaS costs (~$100-200/mo), some customization limits

**Option B: Lightweight Code (Your Learning Path)**
- **Framework:** Next.js + React
- **CMS:** Sanity or Contentful (for owners to manage content)
- **Payments:** Stripe Checkout + Stripe Billing
- **Email:** SendGrid or Resend API
- **Database:** Supabase (Postgres + auth + real-time)
- **Hosting:** Vercel
- **Time to MVP:** 4-8 weeks (great learning project)
- **Pros:** Full control, lower long-term costs, your skill development
- **Cons:** You're the support system, requires your ongoing maintenance

**Recommendation for You:** Start with **Option B** as a learning project. Build:
1. Week 1-2: Landing page + email capture + Stripe test integration
2. Week 3-4: Class schedule display + booking flow
3. Week 5-6: Admin dashboard + payment processing
4. Week 7-8: Social sharing + SEO optimization + polish

This gives you hands-on experience with modern web stack while delivering real value.

---

## 6. Launch Phases

### Phase 0: Pre-Launch (Weeks -8 to -1)
- Landing page live with email capture
- Google Business Profile active
- Social media accounts created and posting
- **Goal:** 200+ email subscribers before opening

### Phase 1: Soft Launch (Week 1-4)
- Class schedule live with limited classes
- Booking and payment functional
- Friends & family beta testing
- **Goal:** 50 paid bookings, identify bugs

### Phase 2: Public Launch (Month 2-3)
- Full class schedule
- Social sharing campaign
- Local PR/partnerships
- **Goal:** 100 active members, predictable revenue

### Phase 3: Optimization (Month 4+)
- A/B testing on landing page
- Referral program launch
- Enhanced reporting
- **Goal:** 20% MoM growth

---

## 7. Open Questions & Decisions Needed

1. **Gym Name and Branding:** Finalized? (impacts domain, SEO, design)
2. **Class Types:** Specific offerings? (yoga, HIIT, spin, strength, etc.)
3. **Pricing Model:** Drop-in rate, pack pricing, membership tiers?
4. **Instructor Count:** Solo or multiple instructors? (affects scheduling complexity)
5. **Launch Timeline:** Target opening date?
6. **Budget:** Monthly SaaS budget for tools? One-time dev budget?
7. **Your Involvement:** Will you build this or hire? How much time can you commit?

---

## 8. Success Metrics Dashboard

**Pre-Launch KPIs:**
- Email list size
- Social media followers
- Landing page traffic sources

**Post-Launch KPIs:**
- Monthly recurring revenue (MRR)
- Average revenue per member
- Class fill rate (% of capacity booked)
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- Net Promoter Score (NPS)

---

## Next Steps

1. **Validate Decisions:** Review open questions with your wife and her partner
2. **Choose Tech Path:** No-code fast launch vs. your learning build
3. **Content Gathering:** Photos, class descriptions, instructor bios, value prop messaging
4. **Domain & Hosting:** Secure domain name, set up Google Workspace
5. **Design Mockups:** Wireframe key pages (I can help with this)
6. **Build Sprint:** Start with landing page + email capture (can ship in 1 week)

---

## Revision History

- **v1.2** - Documented "Share this class" on class pages (Web Share API, Copy link, Twitter/Facebook/WhatsApp) (February 2026)
- **v1.1** - Added Section 3.8: AI-Powered Content Tools (February 14, 2026)
- **v1.0** - Initial PRD created (February 9, 2026)
