# Guest Data Platform: Prototype Design Brief

## Purpose and Context

This brief defines the scope and design approach for a low-fidelity prototype of the Guest Data Platform (GDP) to be shown during a 40-minute Voice of Customer (VOC) session. The primary objective is **credibility validation**, not functional validation.

### Strategic Intent
- Demonstrate that PAR is capable of delivering an enterprise-grade Guest Data Platform
- Establish perceived credibility through familiar CDP patterns and professional data presentation
- Communicate clarity of data storytelling and unified data architecture
- Avoid positioning as a "CDP" to differentiate from tools like mParticle or Bikky

### Key Risk to Mitigate
The greatest risk is building something that technically contains the right pieces but **feels immature, fragmented, or unfamiliar** to experienced restaurant operators and marketers who have strong mental models of what enterprise data platforms should look like.

---

## Primary User Impression (First 60 Seconds)

When a customer first enters the Guest Data Platform section, they should immediately feel:

1. **"This is a real data platform"** - Not a dashboard or reporting tool, but a comprehensive data management system
2. **"PAR understands my data architecture"** - Clear evidence of unified data from POS, Ordering, and Loyalty systems
3. **"I can trust this with my customer data"** - Professional presentation, enterprise-grade UI patterns, clear data lineage
4. **"This feels familiar yet purpose-built"** - Recognizable CDP patterns adapted for restaurant industry needs

### Critical First Impressions
- **Navigation**: Clear, hierarchical structure that suggests depth and organization
- **Data Density**: Sufficient data presence to feel "real" without overwhelming
- **Visual Hierarchy**: Professional layout that prioritizes information architecture over decoration
- **Language**: Enterprise-grade terminology (profiles, segments, identity resolution, data sources) used confidently

---

## Key Legitimacy Signals

The prototype must communicate credibility through these specific signals:

### 1. Layout and Information Architecture
- **Multi-panel layouts** that show data relationships (e.g., profile summary + activity timeline + related segments)
- **Breadcrumb navigation** and clear page hierarchies
- **Data tables** with proper sorting, filtering, and pagination patterns
- **Card-based organization** for related data groupings
- **Consistent spacing and typography** that feels intentional, not accidental

### 2. Data Presence and Completeness
- **Realistic data volumes** (e.g., "12,847 guests" not "12 guests")
- **Cross-source data indicators** clearly labeled (POS, Ordering, Loyalty badges/icons)
- **Data freshness indicators** (last updated timestamps, sync status)
- **Confidence scores and data quality indicators** where appropriate
- **Empty states that feel intentional** (not broken) for future features

### 3. Language and Terminology
- Use enterprise CDP terminology confidently:
  - "Guest Profile" (not "Customer Record")
  - "Identity Resolution" (not "Matching")
  - "Segmentation" (not "Filtering")
  - "Data Sources" (not "Integrations")
  - "Profile Enrichment" (not "Adding Data")
- Avoid marketing-speak or overly simplified language
- Use technical terms where appropriate to signal sophistication

### 4. Visual Patterns
- **Data visualization** that looks production-ready (not placeholder charts)
- **Status indicators** and badges for data quality, confidence, completeness
- **Source attribution** clearly visible on all data points
- **Timeline/chronology views** for activity and transaction history
- **Comparison views** (before/after, segment vs. all guests)

### 5. Professional Polish
- **Consistent iconography** (data source icons, status icons, action icons)
- **Proper loading states** (even if simulated)
- **Error states** that feel handled (not broken)
- **Tooltips and help text** that suggest a mature product
- **Responsive considerations** visible in layout (even if desktop-only)

---

## Minimum Set of Screens Required

### Core Experience Screens (Fully Designed)

#### 1. Unified Guest Profile
**Purpose**: Demonstrate cross-source data unification and complete guest view

**Required Views:**
- **Profile Overview Page**
  - Guest identity summary (name, contact info, profile ID)
  - Data source indicators (POS, Ordering, Loyalty badges)
  - Key metrics at-a-glance (total spend, visit frequency, lifetime value)
  - Engagement milestones timeline (Transacted → Contact Info → Marketing Opt-In → Loyalty Opt-In)
  - Profile completeness indicator
  - Last updated timestamp

- **Activity Timeline View**
  - Chronological list of all transactions across all sources
  - Each transaction shows: date, source (POS/Ordering/Loyalty), location, amount, items
  - Visual distinction between source types
  - Ability to expand transaction details
  - Filter by source, date range, transaction type

- **Data Sources Tab**
  - Breakdown of data contributions from each source
  - Data quality indicators per source
  - First seen / last seen dates per source
  - Confidence scores for identity matching

**What Must Feel Real:**
- Actual transaction data with realistic dates, amounts, locations
- Multiple transactions from different sources for the same guest
- Clear visual distinction between POS, Ordering, and Loyalty transactions
- Profile completeness metrics that feel calculated (not arbitrary)

**What Can Be Simulated:**
- Profile matching confidence scores (can use static values)
- Data freshness timestamps (can be static "Last updated 2 hours ago")
- Profile enrichment data (can show structure without real demographic data)

---

#### 2. Segment Builder
**Purpose**: Demonstrate sophisticated segmentation capabilities across all data sources

**Required Views:**
- **Segment Builder Interface**
  - Rules-based condition builder with drag-and-drop or form-based inputs
  - Available data dimensions organized by source:
    - **POS Data**: Transaction amount, frequency, recency, location, payment method
    - **Ordering Data**: Order type (pickup/delivery), order value, product preferences
    - **Loyalty Data**: Membership status, points balance, challenge completion, game participation
  - Logical operators (AND, OR, NOT) clearly visible
  - Real-time segment size estimate as conditions are added
  - Segment preview showing sample guest IDs or count

- **Segment List/Management View**
  - List of existing segments with key metrics
  - Segment size, last used date, creation date
  - Quick actions (edit, duplicate, delete, use in campaign)
  - Search and filter capabilities

**What Must Feel Real:**
- Segment size calculations that update dynamically (can be simulated but must feel responsive)
- Realistic segment sizes (e.g., "1,247 guests" not "5 guests")
- Clear organization of available data dimensions by source
- Segment rules that are readable and make business sense

**What Can Be Simulated:**
- Actual segment evaluation (can show "Evaluating..." state then result)
- Segment performance metrics (can be static)
- Integration with campaign tools (can show "Use in Campaign" button without full flow)

---

#### 3. Analytics / Data Presentation
**Purpose**: Tell a clear story about segment performance and guest behavior

**Required Views:**
- **Segment Analytics Dashboard**
  - Selected segment overview with key metrics
  - Comparison view: segment vs. all guests
  - Visualizations:
    - Visit frequency distribution
    - Spend over time (line chart)
    - Product preferences (bar chart or heatmap)
    - Geographic distribution (if location data available)
  - Written summary/insights section (2-3 bullet points)
  - Suggested actions (e.g., "Create re-engagement campaign")

- **Guest Insights View** (Alternative or Additional)
  - Aggregate guest behavior patterns
  - Top segments by size or value
  - Data quality overview
  - Source contribution breakdown

**What Must Feel Real:**
- Charts and visualizations that look production-ready (not placeholders)
- Realistic data distributions in charts
- Meaningful comparisons (segment vs. baseline)
- Insights that feel data-driven (not generic)

**What Can Be Simulated:**
- AI-generated insights (can be static text that feels AI-written)
- Real-time query results (can be pre-rendered)
- Drill-down interactions (can show structure without full functionality)

---

### Supporting Screens (Navigation and Placeholders)

#### 4. GDP Landing / Dashboard
**Purpose**: Establish the GDP section and show platform breadth

**Required Elements:**
- Overview metrics (total guests, active segments, data sources connected)
- Quick access to key actions (View Profile, Create Segment, Run Analytics)
- Recent activity feed (optional, can be minimal)
- Navigation to all GDP sections

**What Must Feel Real:**
- Aggregate metrics that feel calculated
- Clear navigation structure

**What Can Be Simulated:**
- Real-time updates
- Personalized recommendations

---

#### 5. Navigation Structure (Within Punchh Backoffice)

The Guest Data Platform should appear as a top-level section in the Punchh backoffice navigation, with the following structure:

```
Punchh Backoffice Navigation
├── [Existing Punchh Sections]
│   ├── Dashboard
│   ├── Loyalty
│   ├── Campaigns
│   └── ...
│
└── Guest Data Platform (NEW)
    ├── Overview / Dashboard
    ├── Profiles
    │   ├── Search Profiles
    │   ├── Profile Detail (individual guest)
    │   └── Profile List
    ├── Segments
    │   ├── Segment Builder
    │   ├── Segment List
    │   └── Segment Analytics
    ├── Analytics
    │   ├── Segment Insights
    │   ├── Guest Insights
    │   └── Data Quality
    ├── Data Sources [Coming Soon]
    │   └── (Empty state with description)
    ├── Identity Resolution [Coming Soon]
    │   └── (Empty state with description)
    ├── Profile Enrichment [Coming Soon]
    │   └── (Empty state with description)
    └── Data Export [Coming Soon]
        └── (Empty state with description)
```

**Navigation Principles:**
- Use familiar CDP navigation patterns (profiles, segments, analytics as primary sections)
- "Coming Soon" sections should feel intentional, not like missing features
- Empty states should explain value and timeline, not just say "coming soon"

---

## What Should Feel Real and Credible

### Must Be Production-Quality (Even if Static)

1. **Data Presentation**
   - Realistic data volumes and distributions
   - Proper data formatting (currency, dates, percentages)
   - Data tables with proper alignment and spacing
   - Charts that look like they were generated from real data

2. **Information Architecture**
   - Logical grouping of related information
   - Clear visual hierarchy
   - Consistent navigation patterns
   - Breadcrumbs and page titles

3. **Cross-Source Data Integration**
   - Clear visual indicators of data source (POS, Ordering, Loyalty)
   - Unified presentation that doesn't feel fragmented
   - Data lineage visible (where data came from)

4. **Professional UI Patterns**
   - Consistent spacing and typography
   - Proper use of color for status and categorization
   - Loading states (even if instant)
   - Error handling (even if simulated)

### Can Be Simulated or Static

1. **Real-Time Updates**
   - Data freshness can show static timestamps
   - Segment size calculations can be pre-calculated
   - Analytics can use static data

2. **Complex Interactions**
   - Full segment evaluation can show loading then result
   - Profile search can use static results
   - Export functionality can show "Export started" without actual file

3. **Future Features**
   - "Coming Soon" sections with professional empty states
   - Placeholder navigation items
   - Feature previews without full functionality

4. **Backend Processing**
   - Identity resolution can show results without actual matching
   - Profile enrichment can show structure without real enrichment
   - Data pipeline status can be simulated

---

## What Should NOT Be Built

### Explicitly Out of Scope for Prototype

1. **Full Functional Flows**
   - Complete campaign creation and execution
   - Actual data export and download
   - Real-time data synchronization
   - Live identity resolution matching

2. **Advanced Features Mentioned in PRD**
   - Natural language segmentation (NLP)
   - AI-assisted segment suggestions
   - Open-ended analytics queries (Ava/Ask Analytics)
   - Profile enrichment with third-party data
   - Advanced ML model configuration

3. **Administrative Functions**
   - User management and permissions
   - Data source configuration
   - System settings
   - API documentation

4. **Mobile or Responsive Views**
   - Focus on desktop experience only
   - Tablet/mobile can be acknowledged but not designed

5. **Error Handling Deep Dives**
   - Basic error states are fine
   - Complex error recovery flows not needed

6. **Onboarding or Help Systems**
   - No tutorials or guided tours
   - Tooltips are acceptable
   - Help documentation not needed

7. **Performance Optimization**
   - No need to optimize for actual large datasets
   - Loading states can be minimal
   - Pagination can be simplified

---

## Design Principles for Prototype

### 1. Familiarity Over Innovation
- Use established CDP UI patterns that customers recognize
- Don't reinvent data presentation conventions
- Follow enterprise software design standards

### 2. Clarity Over Complexity
- Make data relationships obvious
- Use clear labels and terminology
- Avoid unnecessary visual complexity

### 3. Credibility Over Completeness
- Better to show 3 features well than 10 features poorly
- Empty states should feel intentional, not broken
- "Coming soon" should communicate roadmap, not limitations

### 4. Data Storytelling Over Data Dumping
- Analytics should tell a story, not just show numbers
- Visualizations should have clear narratives
- Insights should be actionable, not just descriptive

### 5. Integration Over Isolation
- Clearly show connection to POS, Ordering, Loyalty
- Make unified data architecture visible
- Avoid making it feel like separate tools stitched together

---

## Success Criteria for VOC Session

The prototype will be considered successful if customers:

1. **Express Confidence in PAR's Capability**
   - "This looks like a real data platform"
   - "I can see how this would work for us"
   - "This feels enterprise-grade"

2. **Recognize Familiar Patterns**
   - "This reminds me of [CDP tool they know]"
   - "I understand how to use this"
   - "The navigation makes sense"

3. **See Clear Value Proposition**
   - "I can see how POS, Ordering, and Loyalty data come together"
   - "This would help us reach the 80% we're missing"
   - "The segmentation looks powerful"

4. **Provide Constructive Feedback**
   - Focus on feature priorities and use cases
   - Not on "this doesn't work" or "this feels broken"
   - Questions about "when will X be available" not "why doesn't X exist"

5. **Engage in Productive Discussion**
   - Talk about their use cases and needs
   - Discuss integration requirements
   - Explore pricing and packaging (if appropriate)

---

## Next Steps After Brief Approval

Once this brief is approved, the next phase will include:

1. **Visual Reference Integration**
   - Review Punchh backoffice UI screenshots for navigation and layout patterns
   - Review reference CDP tools (Bikky, etc.) for structural patterns
   - Establish visual design system alignment

2. **Wireframe Creation**
   - Low-fidelity wireframes for all required screens
   - Navigation structure documentation
   - Interaction flow diagrams

3. **Prototype Implementation**
   - Static HTML/CSS prototype or design tool prototype
   - Realistic sample data
   - Simulated interactions

4. **VOC Session Preparation**
   - Discussion guide aligned with prototype capabilities
   - Key questions to validate
   - Success metrics tracking

---

## Questions for Clarification

Before proceeding to wireframes and implementation, please confirm:

1. **Data Realism**: Should we use actual anonymized sample data from a real restaurant brand, or is realistic synthetic data acceptable?

2. **Interaction Depth**: How interactive should the prototype be? (e.g., can users actually build a segment, or should it be a walkthrough?)

3. **Visual Fidelity**: Should this be low-fidelity (wireframe style) or mid-fidelity (closer to final design)?

4. **Punchh Integration**: How closely should the GDP section match existing Punchh backoffice styling? Should it feel like a native extension or a distinct section?

5. **VOC Format**: Will this be a live demo, screen share, or interactive prototype that customers can explore?

---

**Document Status**: Ready for Review  
**Next Action**: Await confirmation and answers to clarification questions before proceeding to wireframes and implementation.
