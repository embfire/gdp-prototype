# Management Center — UX Copy Principles

This is the single source of truth for UX copy in the Management Center. It applies to all UI text: labels, buttons, headings, error messages, dialogs, snackbars, placeholders, tooltips, and help content.

---

## Conflict resolution

When any UI copy in a design, prototype, or code conflicts with these principles, **always ask before proceeding**. Do not silently correct or silently accept. State specifically:
- What the conflict is
- Which principle it breaks
- What the corrected version would be
- Ask whether to proceed with the correction or keep the original

Example: "The button label 'Add Currency' uses title case, but principles require sentence case ('Add currency'). Should I use the corrected version?"

---

## Voice and tone

- **Be efficient** (prime principle): Every word counts. Cut anything unnecessary.
- **Be concise**: Use clear sentences that give just enough information.
- **Give context**: When users face something new, explain what it is and what they can do.
- **Be clear**: Use simple words. Avoid technical jargon. Give just enough for the user to have the right idea.
- **Be calm**: In error or unexpected states, assure the user everything is under control. Encourage action subtly.
- **Be enthusiastic**: When things go well, embrace it with optimism and encouragement.

---

## Plain language

Use words and language that users actually use. Avoid jargon — only use technical terms when strictly necessary. Each sentence should have a single focus and be kept short.

| Do | Don't |
|---|---|
| We've made some changes to improve your store's security | Your SSL certificates were activated |
| These products aren't getting a lot of views, but visitors are adding them to their carts | These are your less popular products with the highest add-to-cart conversion |

---

## Active and passive voice

**Default: always use active voice.**

Active voice pattern: Subject → verb → object. In most UI copy the subject (user) is implied and not mentioned.

Avoid the word "please" except when the user is asked to do something inconvenient (like wait) or the software is at fault.

Use **passive voice** only when:
- Avoiding referring to MENU/the system directly
- Making clear the system (not the user) took an action
- The thing being done is more important than who did it

| Do | Don't |
|---|---|
| Add details to the product | Details were added to the product |
| Add details to the product | Please add details to the product |
| Instructions to sign in or create an account are sent to john@mail.com | MENU has sent instructions to sign in or create an account to john@mail.com |

---

## Contractions

Use contractions to set a casual, human tone. Avoid contractions that sound awkward or are hard to read:

- **Avoid negative contractions** like "can't", "don't" — some users misread them. Write "cannot", "do not" instead.
- **Avoid**: should've, could've, would've, they've — hard to read.
- **OK to use**: you'll, it's, you've, we'll, what's, we'd, won't (in positive framing).

| Do | Don't |
|---|---|
| You'll have 5 minutes to use it | This'll permanently delete the application |
| This cannot be undone | This can't be undone |
| When enabled, users won't be able to use one phone number with multiple accounts | There're no applications added yet |

---

## Letter capitalization

**Always use sentence case** across all of the MC: headings, titles, buttons, labels, menus.

Rules:
- Capitalize the first word only
- Lowercase everything else

Exceptions — capitalize:
- MENU-unique products/features: Customization Center, Store Finder 2.0, Curbside, Dispatch, Web App, Mobile App, Kiosk, Tablet, Marketing Website
- Proper or trademarked nouns (product names, languages, countries, people, job titles adjacent to a name)
- Important legal documents: Terms of Service, Privacy Policy
- ALL CAPS only for: section headings (in component), table headings (in component), logic ops (AND, OR), file types (PNG, JSON, CSV), common abbreviations (URL, API, POS)
- **Never use title case** in the interface

| Do | Don't |
|---|---|
| Add reward | Add Reward |
| Program settings | Program Settings |
| Use Apple Pay | Use apple pay |
| Web App, Mobile App, Kiosk | Web app, mobile app, kiosk |

---

## Spelling

Use **American English** for all external-facing content.

| Do | Don't |
|---|---|
| Color | Colour |
| Center | Centre |
| Canceled | Cancelled |

---

## Punctuation

### Periods
Do NOT use periods at the end of: headlines, button labels, checkbox/radio labels, tooltips, text links, navigation items, snackbar messages, placeholder copy, single-sentence descriptions.

Use periods for: body text with 2+ sentences, descriptions, inline messages, subtitles, help text under form fields.

### Question marks
Avoid wherever possible. Use only when the result is genuinely unknown ("What's your email?", "Change to takeout?"). Do not use for binary on/off options or the only available option.

### Exclamation marks
Use sparingly — only for genuinely exciting moments. Max one per page.

### Apostrophes
- Contractions: don't, it's, you're
- Possessives: client's, women's, customers'
- Always use curly apostrophes ('), not straight quotes (')

### Colons
Avoid in sentences. Do not use to introduce radio buttons or checkboxes. Use to introduce bulleted lists in body text (not headings).

### Commas
Use the Oxford comma for lists of 3+ items. Do not use commas to end list items.

### Ellipses
Use for text overflow and "more options" menus only. Do not use in placeholder copy.

### En-dashes and em-dashes
- En dash (–) with no spaces for number ranges: 2018–2023
- Em dash ( — ) with spaces on both sides for dramatic breaks in sentences

### Hyphens
Hyphenate compound modifiers before a noun. Do not hyphenate after the noun. Never hyphenate "reorder" or "email".

| Do | Don't |
|---|---|
| third-party ordering channels | third party ordering channels |
| Dine-in | Dinein |
| e-commerce | ecommerce |

---

## Headings

Headings label pages or sections. Use noun phrases — name the space, not the task.

| Do | Don't |
|---|---|
| Customers | See customers |
| Currencies | Add currencies |

---

## Button labels

Imagine putting words in the mouth of the user — they're verbally telling the system what to do.

- Formula: **{verb} + {noun}** (except common actions: Close, Cancel, Agree)
- Always sentence case
- Avoid unnecessary articles (the, a, an)
- Use the word that most accurately describes the action from the user's perspective

| Do | Don't |
|---|---|
| Add currency | Add |
| Add printer | Add Printer |
| Create store group | Create |

---

## Links

Links must be clear and predictable. Users should know what happens before they click.

- Standalone links (not in a sentence): use {verb + noun}, no punctuation (exception: question marks like "Forgot password?")
- In sentences: link only the descriptive text, not the full sentence
- **Never use "click here" or "here" as link text**

| Do | Don't |
|---|---|
| Drag and drop to upload an image or [choose from files] | Drag and drop. Choose from files? [Click here] |

---

## Dialogs

- Headlines: sentence case
- Omit final punctuation for single declarative sentences; include for questions and exclamatory sentences
- Repeat the action in both the headline and the affirmative button label
- Avoid questions in headlines unless there's risk of data loss
- Avoid articles (the, a, an) to keep it short
- Never use generic button labels: OK, Yes, No

| Do | Don't |
|---|---|
| **Delete delivery hub?** / Cancel / Delete delivery hub | **Delete delivery hub?** / Cancel / OK |
| **Discard unsaved changes?** / Cancel / Discard changes | **Are you sure you want to discard the unsaved changes?** / Cancel / Discard changes |

---

## Errors

Before writing an error, ask: can the UI prevent this? Do the hard work to make the error case impossible.

When an error is unavoidable, communicate 3 things:
1. What happened
2. Why it happened
3. How to resolve or move forward

Rules:
- Sentence case; no final punctuation for single sentences
- Explicitly but concisely explain the situation
- Focus on the situation or product, not the user
- Do not frame errors as questions
- Do not blame the user
- Do not apologize unnecessarily
- For input errors: assist the user to fill correctly, don't just say "wrong format"

| Do | Don't |
|---|---|
| Couldn't upload the file. The size limit is 25 MB | The file is too big |
| **You don't have access to this page** — Contact your success manager to get access to reportings | **You don't have access to this page** — You don't have permission to see the reportings |
| The code can only contain letters and numbers | Wrong format |

---

## Snackbars (toasts)

Three types: **Success**, **Info**, **Error**

- **Success**: Avoid articles (keep it short). Use "successfully" only for positive actions (invited, saved). Do not use "successfully" for negative actions (deleted, removed).
- **Info**: Use when functionality isn't available; explain why and when it will be.
- **Error**: Use when an action couldn't be completed.
- Always provide singular AND plural versions where applicable: "User removed" / "{{number}} users removed"

| Do | Don't |
|---|---|
| User successfully invited | User invited |
| User removed | User successfully removed |
| 2 users removed | User(s) removed / 2 users were removed |

---

## Toggle labels

Label describes the object or action (e.g., "Barcode", "Accept orders in advance"). Do not use phrases describing the switch's state ("Enable fullscreen banner"). Do not include "Enabled"/"Disabled" text alongside the toggle graphic.

| Do | Don't |
|---|---|
| Fullscreen banner | Enable fullscreen banner |
| Show in redemption levels | Show in redemption levels — Enabled |

---

## Lists

**Bulleted**: use when order doesn't matter.
**Numbered**: use when sequence matters (step-by-step).
**Dropdown actions**: verb + noun pattern. If context is clear, verb alone is fine.
**Dropdown options (nouns)**: concise but descriptive enough to identify the item.

Capitalization & punctuation rules for all lists:
- List items always start with a capital letter
- Introduce with a colon (body text) or heading (no colon needed)
- No commas or semicolons at the end of list items
- If any item has 2+ sentences, punctuate ALL items; if all are single sentences/fragments, no punctuation

---

## Input fields and search fields

**Label text**: sentence case, max 2–3 words, no final punctuation.

**Placeholder text**: avoid in general — causes accessibility issues. Use ONLY when genuinely necessary (e.g., to indicate format like MM/DD/YYYY or searchable attributes).

- Do not use verbs in placeholders ("Add your birthday")
- Do not use examples ("Example: Serbia")
- Do not use just "Search" when more specificity helps

**Helper/error text**: Show error text only after user interaction. Must assist the user to fill in correctly. Never just say "wrong format".

| Do | Don't |
|---|---|
| Birthday — MM/DD/YYYY | Birthday — Add your birthday |
| Search by brand, store, city or ID | Search |

---

## Help content

Help content is educational text describing UI elements or concepts.

**When to use less**: Productivity areas (tasks users do regularly) — keep UI clean, minimal help content.
**When to use more**: Educational areas (infrequent tasks, first-time setups) — offer context and guidance.

Rules:
- Keep help short and to the point
- Place help as close as possible to what it references
- Avoid a marketing tone — don't promote features as if every user needs them
- "Learn more" links must go to a specific, relevant page or heading in the Knowledge Base

**Blank state**: Action-oriented title encouraging the first step. Subtitle explains utility (what) and benefit (why). Button uses {verb} + {noun}.

**Empty state**: Title explains the situation. Optional subtitle describes what's in the empty state.

**No results**: Don't dead-end. Title explains the situation. Subtitle offers suggestions (try different words, check spelling).

---

## Dates, times, numbers, currency, and measurements

**Dates** (American format — month before day):
- Long: Monday, January 8, 2023
- Medium: September 8, 1998
- Short (tables, lists): Aug 24, 2006
- Input fields: MM/DD/YYYY
- First day of the week: Sunday
- No ordinal numbers (1st, 2nd, 3rd)

**Times**: 12-hour clock with AM/PM. Space before AM/PM: "11:45 PM". Separate date+time with "at": "Jun 21, 2024 at 8:26 PM".

**Relative timestamps**:
- <1 min: Just now
- 1–60 min: 13 min ago
- Today: 10:30 AM
- Yesterday: Yesterday at 10:30 AM
- Last 7 days: Friday at 10:30 PM
- 7 days–1 year: Aug 14 at 10:30 AM
- >1 year: Aug 14, 2016

**Numbers**: Use numerals. Spell out only if below 10 AND not the subject of the sentence. Use commas for 1,000+. Use dots for decimals: 1,360.85.

**Currency**: Short format — $12.60. Explicit format (multi-currency) — 12.60 USD.

**Measurements**: Always include a space between number and unit: "3.4 lb", "2 kg", "1 cm".

---

## Word choice (this vs. that)

| Use | Not | When |
|---|---|---|
| Save | Apply, Done | Saving immediately to database |
| Done | Save | Deferred save (frontend-only, not yet persisted) |
| Create | Add | Generating something from scratch |
| Add | Create | Bringing something existing into the system |
| Edit | Manage | Changing field inputs (letters, numbers, properties) |
| Manage | Edit | Changing selections or options |
| Delete | Remove | Permanently erased from database, unrecoverable |
| Remove | Delete | Removed from view, still exists in database |
| View | See | In CTAs, buttons, and link text |
| See | View | In general conversational descriptions |
| Need | Must | Telling users something required |
| Export | Download | Transferring and converting format out of MENU |
| Download | Export | Copying same format from MENU to local |
| Import | Upload | Transferring and converting format into MENU |
| Upload | Import | Copying same format from local into MENU |

---

## Ampersand (&)

Do not use "&" as a substitute for "and" in body copy, labels, or navigation. Use it only when it's part of a proper name or space is critically limited in a UI component.
