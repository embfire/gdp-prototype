---
name: "source-command-ux-review"
description: "ALWAYS apply automatically when asked to review, audit, check, or give feedback on any Guest360 screen, page, component, or design. Trigger on phrases like \"review this\", \"does this look right\", \"check this page\", \"give feedback\", \"is this correct\", or when a Figma URL or HTML file is shared for review. Runs a full check across both Bento interaction patterns and copy principles — load both rule sets before responding. Do not give UX feedback without running this skill first."
---

# source-command-ux-review

Use this skill when the user asks to run the migrated source command `ux-review`.

## Command Template

# Guest360 — Full UX Review

You are conducting a holistic UX review against the Bento/PAR design system standards. Always check both dimensions below.

## Step 1 — Load both rule sets

Read these files before reviewing anything:

1. `.Codex/commands/bento-guest360-ux-patterns.md` — component behavior, interaction patterns, layout rules
2. `.Codex/commands/bento-guest360-ux-copy.md` — all copy: labels, errors, toasts, headings, dialogs, tooltips

Then load whichever pattern reference files are relevant to what's being reviewed:

| If the screen includes... | Also load |
|---|---|
| Tables, filters, column alignment, truncation | `.Codex/bento-ux/data-display.md` |
| Empty states, errors, banners, loading, toasts | `.Codex/bento-ux/feedback.md` |
| Tabs, modals, cards, bulk actions, navigation | `.Codex/bento-ux/navigation.md` |
| Forms, buttons, fields, dropdowns, checkboxes | `.Codex/bento-ux/forms.md` |

## Step 2 — Review structure

Organize your review into two sections:

### Patterns
Flag any violations of Bento component behavior, interaction, or layout rules. For each issue:
- What the violation is
- Which principle it breaks
- What the corrected implementation should be

### Copy
Flag any violations of Bento copy principles. For each issue:
- The current text
- Which rule it breaks (voice, tone, capitalization, punctuation, word choice, etc.)
- The corrected version

## Step 3 — Summary

End with:
- Count of pattern issues vs copy issues
- Severity assessment: blocking (must fix before handoff) vs polish (nice to fix)
- Any conflicts between what's shown and what the system currently supports
