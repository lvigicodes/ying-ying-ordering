# Back Office Menu Management — Design

**Project:** Ying Ying Tea House Ordering System
**Status:** Approved, ready for implementation planning
**Date:** 2026-06-27
**Author:** Claude (with Luigi Martin Nava)
**Source spec:** Provided in full by Luigi (PM) — see conversation history for the original requirements doc this design refines.

---

## 1. Background

All menu items are currently hardcoded in a JS array inside `public/menu.html`. Any change — new dish, price update, sold-out toggle — requires a code change and a Vercel redeploy. This feature removes that dependency by introducing a Menu Management module in the staff back office, backed by Firebase as the single source of truth, replacing the hardcoded array entirely.

This is a major change to the live production ordering system. Production currently serves real customers; this design is built around migrating safely with staging as the proving ground, not a big-bang cutover.

## 2. Goals

- Non-technical admin can create/edit/deactivate/delete menu items and categories without a developer.
- Firebase becomes the single source of truth for menu data; the hardcoded JS array is removed once migration completes.
- No regression to the existing customer ordering experience (variations, pricing, kitchen-printer routing) during or after migration.

## 3. Out of scope (this phase)

Sales reports/analytics, staff account management, role-based access control beyond the existing PIN gate, printer IP configuration, order management from the back office, multiple photos per item, drag-and-drop category reordering (using up/down arrows instead — see Section 8).

## 4. Architecture decisions

### 4.1 Where the back office lives

Two separate HTML files, sharing a small top-left nav menu component:

- `public/staff.html` — existing order-flow dashboard, renamed conceptually to "Dashboard" in the nav. **Unchanged** except for the new nav component.
- `public/menu-management.html` (new) — Menu Management module, containing both the Items list/editor and Category management as two tabs within it.

**Why not a 5th tab inside staff.html:** `staff.html` is already ~1900 lines handling real-time order sync, printing, and the full order lifecycle. Adding full CRUD + photo upload + dynamic variation builders into the same file would make it unwieldy to maintain. Two focused files, sharing only the nav and Firebase env-detection pattern already established, keeps each page's concerns separable.

### 4.2 Authentication

Same PIN as the existing staff dashboard (`9875`). No new credential system. Both pages independently check the PIN on load (same pattern `staff.html` already uses).

### 4.3 Photo storage

Firebase Storage, per the original spec. **Constraint discovered during design:** Firebase now requires a linked billing account (Blaze plan) to use Storage at all, even within free-tier usage limits. Decision: link billing, set a budget alert (e.g. $1) as an early-warning tripwire. Expected real cost: $0/month at Ying Ying's scale (the spec's own estimate — under 300 items, <500KB compressed photos — stays well inside the always-free Storage quota even on Blaze).

### 4.4 Variation pricing model — extended from the original spec

The original spec proposed 3 pricing modes (multiplier, fixed, none). Tracing the *existing* hardcoded variation logic in `menu.html` surfaced two gaps that would otherwise be lost in migration:

1. **Modifier pricing** — e.g. Mami's "Toasted" style adds **+₱10** to whatever the base/size price already is, rather than replacing it with an absolute number. This is different from "fixed" (which replaces the price outright, e.g. each Drinks temperature option has its own flat price). Added as a 4th pricing mode: `modifier` (±amount added to the running price).
2. **Multi-select option groups** — e.g. Mami's "Extra Soup" add-on is independently toggleable (checkbox), not a single-choice radio group like Size or Style. Added `selectionType: "single" | "multiple"` per variation group.

Without these two additions, a faithful migration of the existing menu (Mami, Drinks, Roasting) would not be possible without silently changing real prices or dropping the add-on/checkbox behavior — both are required for the migration to be lossless.

### 4.5 Station (kitchen routing)

The original spec did not mention `station` (upper/lower kitchen — used by `staff.html`/`printer.js` to split kitchen receipts). Decision: `station` becomes an **admin-editable required field** on the Create/Edit Item screen (single-select: Upper Kitchen / Lower Kitchen), not a hardcoded or inferred value. Rationale: leaving it hardcoded would mean every new item still needs developer involvement to route correctly to a kitchen printer, defeating this feature's core goal.

### 4.6 Temperature variation

Per discussion, Temperature (Hot/Cold, used by Drinks) is *not* a special-cased field — it's modeled as an ordinary variation group (`type: "Temperature"`, `pricingMode: "fixed"`, `selectionType: "single"`), identical in mechanism to Size, Style, or any future variation type an admin defines. This consistency is a core value of the generic model: one mechanism handles every current and future variation type.

## 5. Data model (Firebase Realtime Database)

```
/categories
  /{categoryId}                  // stable lowercase slug, e.g. "dimsum", "mami"
    name: "Dimsum"
    displayOrder: 1
    isActive: true

/menu
  /{itemId}                      // Firebase push key
    name: "Siomai"
    basePrice: 85                // null when fully determined by variations (e.g. temperature-only drinks)
    station: "upper" | "lower"   // admin-editable, drives kitchen printer routing
    photoUrl: "https://..." | null
    isAvailable: true
    categories: ["dimsum", "toppings"]   // array of category ids, not names
    variations: [
      {
        type: "Size",
        required: true,
        selectionType: "single",
        pricingMode: "multiplier",       // multiplier | fixed | modifier | none
        options: [
          { label: "Small", multiplier: 1 },
          { label: "Medium", multiplier: 1.5 },
          { label: "Large", multiplier: 3 }
        ]
      },
      {
        type: "Style",
        required: false,
        selectionType: "single",
        pricingMode: "modifier",
        options: [
          { label: "Original", modifier: 0 },
          { label: "Toasted", modifier: 10 }
        ]
      },
      {
        type: "Add-ons",
        required: false,
        selectionType: "multiple",
        pricingMode: "modifier",
        options: [
          { label: "Extra Soup", modifier: 5 }
        ]
      }
    ]
```

Roasting's quarter/half/whole portions use the same `multiplier` mode as Size, just with different multiplier values (1x / 2x / 4x) and option labels — no separate pricing mode needed.

## 6. Migration plan

1. **Seed script** (Node.js, run locally with the Firebase Admin SDK): parses the current hardcoded array out of `menu.html` and converts every item to the schema above, including faithful reconstruction of Mami (noodle/style/soup), Drinks (temperature/flavor/addons), and Roasting (portion multipliers).
2. Categories seeded first, with `displayOrder` matching the current fixed category order in code, stable slug ids.
3. Seed script runs against **staging Firebase only** first. Luigi and Claude jointly spot-check converted data for a handful of representative items (a Mami, a Drinks item, a Roasting item, a plain item) before proceeding.
4. Staging `menu.html` switched to read from Firebase instead of the hardcoded array. Full customer ordering flow re-tested end-to-end on staging (including the order-merge transaction logic and printer-routing-relevant `station` field).
5. Only after staging passes: seed script runs against **production** Firebase, and production `menu.html` is switched over in the same release. The hardcoded JS array is deleted from the codebase at this point — not before.

Production remains on the current hardcoded-array behavior, unchanged, through steps 1–4. There is no partially-migrated state in production.

## 7. Customer-facing `menu.html` changes

Replace the hardcoded array with a Firebase read of `/menu` + `/categories` on page load:
- Filter to `isAvailable: true` items and `isActive: true` categories.
- Sort categories by `displayOrder`.
- Adapt the existing cart/variation-selection rendering to read the new generic `variations` array shape (type/selectionType/pricingMode/options) instead of today's hardcoded per-type fields (`item.variations.size`, `.temperature`, `.style`, etc.). This is the largest single chunk of implementation work in the feature — the existing rendering logic (`openVariationModal`, `updateComplexPrice`, `selectComplexVariation`) is built around specific hardcoded keys and needs to become data-driven.

## 8. Admin UI — screens

### 8.1 Nav

Shared top-left hamburger/slide-out panel on both `staff.html` and `menu-management.html`: **Dashboard** | **Menu Management**. Same PIN gate on both.

### 8.2 Menu Items List (default view in `menu-management.html`)

- Card grid, visually consistent with the new customer-facing menu grid (colored tile + emoji/photo, name, price).
- Filters: by category, by status (Active/Inactive).
- Per card: thumbnail, name, categories, base price, status badge, Edit / Deactivate↔Reactivate / Delete actions.
- "+ Add New Item" button.

### 8.3 Create/Edit Item (inline panel, not a separate page)

Sections in order: Basic Info (Name, Base Price, Station, Availability) → Photo upload with live preview → Categories (checkboxes) → Variations (dynamically add/remove groups; each group configures type name, `selectionType`, `pricingMode`, and its options). Computed price previews update live. Save writes to Firebase and returns to the list; Cancel discards changes.

### 8.4 Category Management (second tab within Menu Management)

Table: name, item count, status, up/down reorder controls (chosen over drag-and-drop for mobile reliability), Rename/Deactivate/Delete actions. Delete is disabled with a tooltip when item count > 0, per the spec's rule.

## 9. Photo upload

- Client-side validation (file size ≤2MB, type in JPG/PNG/WEBP) before any upload attempt — instant rejection with a clear error, no wasted network round-trip.
- On replace: new file uploads first; old file is deleted from Storage only after the new upload succeeds. Avoids ending up with no photo if a replacement upload fails partway.
- No photo uploaded → customer menu shows the existing emoji-tile placeholder (already built, see prior session work).

## 10. Acceptance criteria

(Carried over from the original spec, extended with the additions from this design)

- [ ] Admin can create a new item (including Station assignment) and it appears on the customer menu without a redeployment.
- [ ] Admin can update name, price, station, photo, categories, or variations; changes reflect immediately on the customer menu.
- [ ] Deactivating an item hides it from the customer menu; reactivating restores it.
- [ ] Deleting an item (after confirmation) removes it everywhere.
- [ ] An item assigned to multiple categories appears under all of them on the customer menu.
- [ ] All four variation pricing modes (multiplier, fixed, modifier, none) compute correctly, including multi-select groups (`selectionType: "multiple"`).
- [ ] Photo upload rejects >2MB or unsupported formats before uploading, with a clear error.
- [ ] Photo upload stores in Firebase Storage; URL persists on the item record.
- [ ] Items without a photo show the placeholder.
- [ ] Replacing a photo deletes the old Storage file only after the new upload succeeds.
- [ ] Admin can add/rename/reorder/deactivate categories; changes reflect on the customer menu.
- [ ] A category cannot be deleted while items are assigned to it.
- [ ] Kitchen receipt routing (upper/lower printer) continues to work correctly post-migration, driven by the now-admin-editable `station` field.
- [ ] Migration to production only happens after full validation on staging; production is never in a partially-migrated state.
- [ ] All actions are performable by a non-technical user with no developer assistance.
