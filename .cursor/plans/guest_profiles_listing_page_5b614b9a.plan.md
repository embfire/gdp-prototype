---
name: Guest Profiles Listing Page
overview: Create a guest profiles listing page (profiles.html) with a filterable table. Clicking a loyalty guest opens profile.html (existing), clicking a non-loyalty guest opens guest-profile.html (new). This demonstrates both identity resolution scenarios.
todos:
  - id: create-listing
    content: Create profiles.html with filterable table and search
    status: completed
  - id: create-guest-profile
    content: Create guest-profile.html for non-loyalty Isabella Chen scenario
    status: completed
  - id: update-loyalty-profile
    content: "Update profile.html: rename user to Marcus Thompson for consistency"
    status: completed
  - id: update-sidebar
    content: Update sidebar links in all HTML files to point to profiles.html
    status: completed
    dependencies:
      - create-listing
  - id: add-styles
    content: Add table hover, filter pill, and listing styles to styles.css
    status: completed
---

# Guest Profiles Listing Page

## Overview

Create a searchable, filterable guest listing table with two distinct profile types accessible from it.

## File Structure

```mermaid
flowchart LR
    A[profiles.html] -->|"Row 1: Marcus (Loyalty)"| B[profile.html]
    A -->|"Row 2: Isabella (Non-Loyalty)"| C[guest-profile.html]
```

| File | Purpose |

|------|---------|

| `profiles.html` | NEW - Listing page with table and filters |

| `profile.html` | KEEP - Loyalty member profile (current) |

| `guest-profile.html` | NEW - Non-loyalty guest profile (Isabella Chen scenario) |

## profiles.html Structure

### Header

- Title: "Guest Profiles"
- Search bar
- Filter pills/dropdowns

### Filters

- **Loyalty Status**: All / Members / Non-Members
- **Lifecycle**: All / New / Active / At-Risk / Lapsed
- **Segment**: Dropdown

### Table Columns

| Column | Description |

|--------|-------------|

| Guest | Avatar + Name |

| Email | Primary email |

| Phone | Phone number |

| Loyalty Status | "Gold Member" / "Non-Member" etc. |

| LTV | Lifetime value |

| Orders | Total order count |

| Source | Web App, POS, Punchh |

| Last Activity | Date |

### Sample Rows

1. **Marcus Thompson** → Links to `profile.html` (loyalty profile)
2. **Isabella Chen** → Links to `guest-profile.html` (non-loyalty, stitched profile)

## guest-profile.html Content

Based on previous conversation: Isabella Chen as a non-loyalty guest who made purchases via Web App and in-store POS, with credit card stitching. Timeline shows profile creation, orders, emails/SMS sent.

## Files to Modify

- **Create**: `profiles.html` - New listing page
- **Create**: `guest-profile.html` - Non-loyalty profile (based on Isabella scenario)
- **Keep**: `profile.html` - Rename user to "Marcus Thompson" for consistency
- **Update**: All sidebar links to point "Profiles" → `profiles.html`
- **Update**: `styles.css` - Add listing table and filter styles