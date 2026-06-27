# Back Office Menu Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded menu array in `public/menu.html` with a Firebase-backed data model, and build an admin back office (`public/menu-management.html`) so non-technical staff can manage menu items and categories without a code deploy.

**Architecture:** Two new Firebase Realtime Database nodes (`/menu`, `/categories`) become the source of truth. A one-time Node.js seed script converts the existing hardcoded array into that schema. A new admin page provides CRUD on both nodes plus Firebase Storage photo upload. `menu.html`'s rendering/cart/variation logic is rewired to read the generic schema instead of today's hardcoded per-type fields. Everything is built and verified against the **staging** Firebase project/branch first; production is untouched until the final phase.

**Tech Stack:** Vanilla HTML/CSS/JS (ES modules), Firebase Realtime Database (modular SDK v10.8.0, loaded via CDN — matches existing `menu.html`/`staff.html` pattern), Firebase Storage, Firebase Admin SDK + Node.js (seed script only, run locally, never shipped to the browser).

**No automated test framework exists in this repo.** Verification per step is either (a) running the Node seed script and asserting on its printed output, or (b) an explicit manual check in a browser. Each step says which.

---

## Phase 1 — Data model + seed script (staging Firebase only)

### Task 1: Set up the seed script project

**Files:**
- Create: `scripts/seed-menu/package.json`
- Create: `scripts/seed-menu/.gitignore`

- [ ] **Step 1: Create the seed script folder and package.json**

```json
{
  "name": "ying-ying-seed-menu",
  "version": "1.0.0",
  "private": true,
  "type": "commonjs",
  "scripts": {
    "seed:staging": "node seed.js staging",
    "seed:production": "node seed.js production"
  },
  "dependencies": {
    "firebase-admin": "^12.0.0"
  }
}
```

- [ ] **Step 2: Add `.gitignore` for the service account key (never commit credentials)**

```
node_modules/
serviceAccountKey.staging.json
serviceAccountKey.production.json
```

- [ ] **Step 3: Install dependencies**

Run: `cd scripts/seed-menu && npm install`
Expected: `node_modules/firebase-admin` exists, no errors.

- [ ] **Step 4: Commit**

```bash
git add scripts/seed-menu/package.json scripts/seed-menu/.gitignore
git commit -m "Set up Node project for menu data seed script"
```

---

### Task 2: Get a Firebase Admin service account key for staging

This step is manual (Firebase console), not code.

- [ ] **Step 1:** In the Firebase console, open the **staging** project (`ying-ying-ordering-staging`) → gear icon → Project Settings → Service Accounts tab → "Generate new private key" → download the JSON file.
- [ ] **Step 2:** Save it as `scripts/seed-menu/serviceAccountKey.staging.json`. This file is git-ignored (Task 1, Step 2) — confirm with `git status` that it does NOT show up as untracked-to-be-added.

Verification: `git status` inside `scripts/seed-menu/` shows the key file is not listed (ignored).

---

### Task 3: Extract and hand-convert the existing menu array into seed data

This is the core migration logic. Rather than parsing the JS array out of `menu.html` with a brittle script, the array is copied once into a dedicated seed-data file and then converted by hand-written mapping functions — safer for a one-time migration where correctness matters more than automation.

**Files:**
- Create: `scripts/seed-menu/raw-menu-data.js`
- Create: `scripts/seed-menu/convert.js`

- [ ] **Step 1: Copy the raw array**

Open `public/menu.html`, copy the full literal from `const menu = [` (line 1052) through its closing `];` (line 2042), and paste it into a new file:

```javascript
// scripts/seed-menu/raw-menu-data.js
// Copied verbatim from public/menu.html's hardcoded `menu` array as of 2026-06-27.
// DO NOT hand-edit this file - it's the migration's source of truth for "what
// the live menu currently contains." Fix conversion bugs in convert.js instead.
module.exports = [
  // PASTE THE FULL CONTENTS OF THE `menu` ARRAY FROM public/menu.html HERE
];
```

Also copy the categories order from `getCategories()` in `menu.html` into a second export at the bottom of the same file:

```javascript
module.exports.categoryOrder = [
  'Dimsum', 'Toppings', 'Mami', 'Congee', 'Vegetable', 'Fried Rice', 'Roasting',
  'Beef', 'Pork', 'Chicken', 'Shrimps', 'Squid', 'Fish Fillet', 'Oyster',
  'Noodles', 'Soup', 'Hotpot', 'Drinks', 'Sizzling', 'Frozen'
];
```

(Use the exact array returned by `getCategories()` in `public/menu.html` — copy it verbatim rather than retyping, to avoid a transcription mistake silently reordering the customer-facing menu.)

- [ ] **Step 2: Write the conversion logic**

```javascript
// scripts/seed-menu/convert.js
const rawItems = require('./raw-menu-data');
const categoryOrder = require('./raw-menu-data').categoryOrder;

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function buildCategories() {
  const categories = {};
  categoryOrder.forEach((name, index) => {
    categories[slugify(name)] = {
      name,
      displayOrder: index + 1,
      isActive: true
    };
  });
  return categories;
}

// Converts the old per-type variation fields into the new generic
// variations[] array. Each old shape maps to exactly one of the 4
// pricing modes + 2 selection types defined in the design spec.
function convertVariations(item) {
  const groups = [];

  // OLD SHAPE 1: simple array of {size, price} - e.g. Vegetable, Beef, Soup, Roasting
  if (Array.isArray(item.variations)) {
    groups.push({
      type: 'Size',
      required: true,
      selectionType: 'single',
      pricingMode: 'fixed',
      options: item.variations.map(v => ({ label: v.size, price: v.price }))
    });
    return groups;
  }

  // OLD SHAPE 2: complex object - Mami, Drinks, etc.
  if (item.variations && typeof item.variations === 'object') {
    const v = item.variations;

    if (v.size) {
      groups.push({
        type: 'Size',
        required: true,
        selectionType: 'single',
        pricingMode: 'fixed',
        options: v.size.map(s => ({ label: s.name, price: s.price }))
      });
    }

    if (v.noodle) {
      groups.push({
        type: 'Noodle Type',
        required: true,
        selectionType: 'single',
        pricingMode: 'none',
        options: v.noodle.map(n => ({ label: n.name }))
      });
    }

    if (v.style) {
      groups.push({
        type: 'Style',
        required: false,
        selectionType: 'single',
        pricingMode: 'modifier',
        options: v.style.map(s => ({ label: s.name, modifier: s.priceModifier || 0 }))
      });
    }

    if (v.temperature) {
      groups.push({
        type: 'Temperature',
        required: true,
        selectionType: 'single',
        pricingMode: 'fixed',
        options: v.temperature.map(t => ({ label: t.name, price: t.price }))
      });
    }

    if (v.flavor) {
      groups.push({
        type: 'Flavor',
        required: true,
        selectionType: 'single',
        pricingMode: 'fixed',
        options: v.flavor.map(f => ({ label: f.name, price: f.price }))
      });
    }

    if (v.addons) {
      groups.push({
        type: 'Add-ons',
        required: false,
        selectionType: 'multiple',
        pricingMode: 'modifier',
        options: v.addons.map(a => ({ label: a.name, modifier: a.priceModifier || 0 }))
      });
    }
  }

  return groups;
}

function convertItem(item) {
  const variations = convertVariations(item);
  return {
    id: item.id,
    name: item.name,
    basePrice: item.price ?? null,
    station: item.station,
    photoUrl: null,
    isAvailable: true,
    categories: [slugify(item.category)],
    legacyImage: item.image || null, // emoji fallback, kept for the placeholder tile
    variations: variations.length > 0 ? variations : null
  };
}

function buildMenu() {
  const menu = {};
  rawItems.forEach(item => {
    menu[String(item.id)] = convertItem(item);
  });
  return menu;
}

module.exports = { buildCategories, buildMenu, slugify };
```

- [ ] **Step 3: Verify the conversion with a dry-run script (no Firebase yet)**

```javascript
// scripts/seed-menu/dry-run.js
const { buildCategories, buildMenu } = require('./convert');

const categories = buildCategories();
const menu = buildMenu();

console.log(`Converted ${Object.keys(categories).length} categories`);
console.log(`Converted ${Object.keys(menu).length} menu items`);

// Spot-check the tricky items by name
const rawItems = require('./raw-menu-data');
['Lemon Tea', 'Roast Duck Mami', 'Asado Mami'].forEach(name => {
  const raw = rawItems.find(i => i.name === name);
  if (!raw) {
    console.log(`⚠️  Could not find "${name}" in raw data to spot-check`);
    return;
  }
  console.log(`\n--- ${name} (id ${raw.id}) ---`);
  console.log(JSON.stringify(menu[String(raw.id)], null, 2));
});
```

Run: `cd scripts/seed-menu && node dry-run.js`
Expected: prints a count (e.g. "Converted 20 categories", "Converted 241 menu items" — exact count depends on the live array) and the full converted JSON for Lemon Tea, Roast Duck Mami, and Asado Mami. **Manually read these 3 outputs and confirm:**
- Lemon Tea has one `Temperature` group, `pricingMode: "fixed"`, options Hot/Cold with their real prices.
- Roast Duck Mami has `Noodle Type` (pricingMode `none`), `Style` (pricingMode `modifier`), and if it has an Extra Soup option, an `Add-ons` group with `selectionType: "multiple"`.
- No item shows `price: undefined` or `NaN` anywhere.

If any of these look wrong, fix `convertVariations`/`convertItem` and re-run before continuing — do not proceed to Task 4 until this spot-check passes.

- [ ] **Step 4: Commit**

```bash
git add scripts/seed-menu/raw-menu-data.js scripts/seed-menu/convert.js scripts/seed-menu/dry-run.js
git commit -m "Add menu data conversion logic with dry-run spot-check"
```

---

### Task 4: Write and run the seed script against staging Firebase

**Files:**
- Create: `scripts/seed-menu/seed.js`

- [ ] **Step 1: Write the seed script**

```javascript
// scripts/seed-menu/seed.js
const admin = require('firebase-admin');
const { buildCategories, buildMenu } = require('./convert');

const target = process.argv[2]; // "staging" or "production"
if (target !== 'staging' && target !== 'production') {
  console.error('Usage: node seed.js <staging|production>');
  process.exit(1);
}

const databaseURLs = {
  staging: 'https://ying-ying-ordering-staging-default-rtdb.asia-southeast1.firebasedatabase.app',
  production: 'https://ying-ying-ordering-default-rtdb.asia-southeast1.firebasedatabase.app'
};

const serviceAccount = require(`./serviceAccountKey.${target}.json`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURLs[target]
});

async function seed() {
  const db = admin.database();

  const existingMenu = await db.ref('menu').get();
  const existingCategories = await db.ref('categories').get();
  if (existingMenu.exists() || existingCategories.exists()) {
    console.error(`❌ ${target} already has data under /menu or /categories. Refusing to overwrite.`);
    console.error('   Delete those nodes manually in the Firebase console first if you intend to re-seed.');
    process.exit(1);
  }

  const categories = buildCategories();
  const menu = buildMenu();

  await db.ref('categories').set(categories);
  await db.ref('menu').set(menu);

  console.log(`✅ Seeded ${Object.keys(categories).length} categories and ${Object.keys(menu).length} menu items to ${target}.`);
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
```

Note the guard in Step 1: the script refuses to run if `/menu` or `/categories` already has data, so re-running it accidentally can't silently duplicate or overwrite anything.

- [ ] **Step 2: Run against staging**

Run: `cd scripts/seed-menu && npm run seed:staging`
Expected output: `✅ Seeded 20 categories and <N> menu items to staging.`

- [ ] **Step 3: Verify in the Firebase console**

Open the staging project's Realtime Database in the Firebase console. Confirm `/categories` has 20 entries and `/menu` has the expected item count, matching what the dry-run printed in Task 3.

- [ ] **Step 4: Commit**

```bash
git add scripts/seed-menu/seed.js
git commit -m "Add seed script with staging guard against accidental overwrite"
```

---

## Phase 2 — Admin back office UI (staging only)

### Task 5: Shared nav component and PIN gate

**Files:**
- Create: `public/admin-nav.js`
- Modify: `public/staff.html`

- [ ] **Step 1: Create the shared nav module**

```javascript
// public/admin-nav.js
// Shared top-left nav menu for staff.html and menu-management.html.
// Renders a hamburger button that opens a slide-out panel with the two modules.
function renderAdminNav(activePage) {
  const nav = document.createElement('div');
  nav.innerHTML = `
    <button id="adminNavToggle" style="position:fixed;top:15px;left:15px;z-index:500;
      width:44px;height:44px;border-radius:8px;border:none;background:#2d5016;
      color:white;font-size:20px;cursor:pointer;">☰</button>
    <div id="adminNavPanel" style="position:fixed;top:0;left:0;height:100%;width:220px;
      background:white;box-shadow:2px 0 10px rgba(0,0,0,0.2);z-index:600;
      transform:translateX(-100%);transition:transform 0.25s;padding:70px 20px 20px;">
      <a href="/staff.html" style="display:block;padding:12px 10px;margin-bottom:8px;
        border-radius:8px;text-decoration:none;font-weight:bold;
        color:${activePage === 'dashboard' ? 'white' : '#2d5016'};
        background:${activePage === 'dashboard' ? '#2d5016' : 'transparent'};">Dashboard</a>
      <a href="/menu-management.html" style="display:block;padding:12px 10px;
        border-radius:8px;text-decoration:none;font-weight:bold;
        color:${activePage === 'menu-management' ? 'white' : '#2d5016'};
        background:${activePage === 'menu-management' ? '#2d5016' : 'transparent'};">Menu Management</a>
    </div>
    <div id="adminNavOverlay" style="position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,0.3);z-index:550;display:none;"></div>
  `;
  document.body.prepend(nav);

  const panel = document.getElementById('adminNavPanel');
  const overlay = document.getElementById('adminNavOverlay');
  document.getElementById('adminNavToggle').onclick = () => {
    panel.style.transform = 'translateX(0)';
    overlay.style.display = 'block';
  };
  overlay.onclick = () => {
    panel.style.transform = 'translateX(-100%)';
    overlay.style.display = 'none';
  };
}
window.renderAdminNav = renderAdminNav;
```

- [ ] **Step 2: Wire it into `staff.html`**

Find the line in `public/staff.html` that calls `login()` successfully (the block inside `function login()` that shows the dashboard — search for `document.getElementById('dashboard').classList.add('active');`) and add a script tag plus a call right after it:

In the `<head>` of `public/staff.html`, add:
```html
<script src="/admin-nav.js"></script>
```

In the `login()` function in `public/staff.html`, immediately after `document.getElementById('dashboard').classList.add('active');`, add:
```javascript
renderAdminNav('dashboard');
```

- [ ] **Step 3: Manual verification**

Open staging `staff.html` in a browser, log in with PIN 9875. Confirm a ☰ button appears top-left; clicking it slides out a panel with "Dashboard" (highlighted) and "Menu Management" (not yet a working link — that's Task 6).

- [ ] **Step 4: Commit**

```bash
git add public/admin-nav.js public/staff.html
git commit -m "Add shared admin nav component, wire into staff.html"
```

---

### Task 6: `menu-management.html` skeleton with PIN gate and Firebase env switch

**Files:**
- Create: `public/menu-management.html`

- [ ] **Step 1: Create the file with PIN gate, env-switching Firebase init, and nav**

Reuse the exact PIN-gate HTML/CSS structure and the `IS_PRODUCTION` hostname-detection Firebase config pattern already in `public/staff.html` (lines ~752-767 for the login screen markup, and ~862-906 for the Firebase init block) — copy both verbatim into the new file so behavior is identical, then add:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ying Ying - Menu Management</title>
  <script src="/admin-nav.js"></script>
  <style>
    /* Copy the .login-screen, .login-box, .pin-input, .login-btn, .error-msg
       rules verbatim from public/staff.html so the login screen looks
       identical between the two admin pages. */
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin:0; }
    .mm-dashboard { display: none; padding: 70px 20px 40px; max-width: 1100px; margin: 0 auto; }
    .mm-dashboard.active { display: block; }
    .mm-tabs { display: flex; gap: 10px; margin-bottom: 20px; }
    .mm-tab { padding: 10px 20px; border-radius: 8px; border: 2px solid #ddd; cursor: pointer; font-weight: bold; background: white; }
    .mm-tab.active { background: #2d5016; color: white; border-color: #2d5016; }
  </style>
</head>
<body>
  <div class="login-screen" id="loginScreen">
    <div class="login-box">
      <div class="logo">🐓</div>
      <h1>Menu Management</h1>
      <p>Enter PIN to access</p>
      <input type="password" class="pin-input" id="pinInput" maxlength="4" placeholder="••••" autofocus>
      <button class="login-btn" onclick="login()">Access</button>
      <p class="error-msg" id="errorMsg">Incorrect PIN. Please try again.</p>
    </div>
  </div>

  <div class="mm-dashboard" id="dashboard">
    <div class="mm-tabs">
      <div class="mm-tab active" id="itemsTabBtn" onclick="switchMMTab('items')">Menu Items</div>
      <div class="mm-tab" id="categoriesTabBtn" onclick="switchMMTab('categories')">Categories</div>
    </div>
    <div id="itemsTab"></div>
    <div id="categoriesTab" style="display:none;"></div>
  </div>

  <script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
    import { getDatabase, ref, onValue, get, set, update, remove, push }
      from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

    const PROD_FIREBASE_CONFIG = {
      apiKey: "AIzaSyAXb-7_W_0enqpkT3c8iEhtlTFTFet3Foc",
      authDomain: "ying-ying-ordering.firebaseapp.com",
      databaseURL: "https://ying-ying-ordering-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "ying-ying-ordering",
      storageBucket: "ying-ying-ordering.firebasestorage.app",
      messagingSenderId: "624037327199",
      appId: "1:624037327199:web:4e9e38fd8cf16a5fdcc6ea"
    };
    const STAGING_FIREBASE_CONFIG = {
      apiKey: "AIzaSyBQLev_8W_UFAr_oAaOySUjmeUFLyUTajQ",
      authDomain: "ying-ying-ordering-staging.firebaseapp.com",
      databaseURL: "https://ying-ying-ordering-staging-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "ying-ying-ordering-staging",
      storageBucket: "ying-ying-ordering-staging.firebasestorage.app",
      messagingSenderId: "865566055595",
      appId: "1:865566055595:web:1bdb565d30ff9880fd2bee"
    };
    const IS_PRODUCTION = window.location.hostname === 'ying-ying-ordering.vercel.app';
    const firebaseConfig = IS_PRODUCTION ? PROD_FIREBASE_CONFIG : STAGING_FIREBASE_CONFIG;

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    window.mmDB = database;
    window.mmRef = ref;
    window.mmOnValue = onValue;
    window.mmGet = get;
    window.mmSet = set;
    window.mmUpdate = update;
    window.mmRemove = remove;
    window.mmPush = push;

    const CORRECT_PIN = '9875';
    function login() {
      const pin = document.getElementById('pinInput').value;
      if (pin === CORRECT_PIN) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        renderAdminNav('menu-management');
        window.initMenuManagement(); // defined in menu-management.js, Task 7
      } else {
        document.getElementById('errorMsg').style.display = 'block';
        document.getElementById('pinInput').value = '';
        setTimeout(() => { document.getElementById('errorMsg').style.display = 'none'; }, 3000);
      }
    }
    window.login = login;

    function switchMMTab(tab) {
      document.getElementById('itemsTab').style.display = tab === 'items' ? 'block' : 'none';
      document.getElementById('categoriesTab').style.display = tab === 'categories' ? 'block' : 'none';
      document.getElementById('itemsTabBtn').classList.toggle('active', tab === 'items');
      document.getElementById('categoriesTabBtn').classList.toggle('active', tab === 'categories');
    }
    window.switchMMTab = switchMMTab;
  </script>
  <script src="/menu-management.js"></script>
</body>
</html>
```

- [ ] **Step 2: Manual verification**

Open the staging `menu-management.html` URL, enter PIN 9875. Confirm: login succeeds, nav ☰ appears, "Menu Items"/"Categories" tabs are visible and clickable (content will be empty until Task 7).

- [ ] **Step 3: Commit**

```bash
git add public/menu-management.html
git commit -m "Add menu-management.html skeleton with PIN gate and tab switcher"
```

---

### Task 7: Menu Items List + Create/Edit Item

**Files:**
- Create: `public/menu-management.js`

- [ ] **Step 1: Implement the items list, render, and CRUD wiring**

```javascript
// public/menu-management.js
// Logic for the "Menu Items" tab in menu-management.html.
// Depends on window.mmDB / mmRef / mmOnValue / mmGet / mmSet / mmUpdate /
// mmRemove / mmPush being set by the <script type="module"> block in that file.

let mmCategories = {};
let mmItems = {};
let mmEditingItemId = null;

function initMenuManagement() {
  window.mmOnValue(window.mmRef(window.mmDB, 'categories'), (snap) => {
    mmCategories = snap.exists() ? snap.val() : {};
    renderItemsTab();
    renderCategoriesTab();
  });
  window.mmOnValue(window.mmRef(window.mmDB, 'menu'), (snap) => {
    mmItems = snap.exists() ? snap.val() : {};
    renderItemsTab();
  });
}
window.initMenuManagement = initMenuManagement;

function categoryName(id) {
  return mmCategories[id] ? mmCategories[id].name : id;
}

function renderItemsTab() {
  const container = document.getElementById('itemsTab');
  const items = Object.entries(mmItems);

  container.innerHTML = `
    <button onclick="openItemForm(null)" style="margin-bottom:15px;padding:10px 20px;
      background:#ff6b35;color:white;border:none;border-radius:8px;font-weight:bold;
      cursor:pointer;">+ Add New Item</button>
    <div id="itemFormContainer"></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;">
      ${items.map(([id, item]) => `
        <div style="background:white;border-radius:10px;padding:12px;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
          <div style="font-weight:bold;margin-bottom:6px;">${item.name}</div>
          <div style="font-size:12px;color:#666;margin-bottom:6px;">
            ${(item.categories || []).map(categoryName).join(', ')}
          </div>
          <div style="margin-bottom:8px;">
            ${item.basePrice != null ? '₱' + item.basePrice : 'Variable price'}
            — <span style="color:${item.isAvailable ? '#2d5016' : '#e74c3c'};font-weight:bold;">
              ${item.isAvailable ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div style="display:flex;gap:6px;">
            <button onclick="openItemForm('${id}')" style="flex:1;padding:6px;border:none;
              border-radius:6px;background:#2d5016;color:white;cursor:pointer;">Edit</button>
            <button onclick="toggleItemAvailability('${id}')" style="flex:1;padding:6px;border:none;
              border-radius:6px;background:#ffc107;color:#333;cursor:pointer;">
              ${item.isAvailable ? 'Deactivate' : 'Reactivate'}
            </button>
            <button onclick="deleteItem('${id}')" style="flex:1;padding:6px;border:none;
              border-radius:6px;background:#e74c3c;color:white;cursor:pointer;">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function toggleItemAvailability(id) {
  const item = mmItems[id];
  window.mmUpdate(window.mmRef(window.mmDB, `menu/${id}`), { isAvailable: !item.isAvailable });
}
window.toggleItemAvailability = toggleItemAvailability;

function deleteItem(id) {
  if (!confirm(`Delete "${mmItems[id].name}" permanently? This cannot be undone.`)) return;
  window.mmRemove(window.mmRef(window.mmDB, `menu/${id}`));
}
window.deleteItem = deleteItem;

function openItemForm(id) {
  mmEditingItemId = id;
  const item = id ? mmItems[id] : {
    name: '', basePrice: null, station: 'upper', isAvailable: true, categories: [], variations: null
  };

  const categoryCheckboxes = Object.entries(mmCategories).map(([catId, cat]) => `
    <label style="display:block;margin-bottom:4px;">
      <input type="checkbox" class="mm-cat-checkbox" value="${catId}"
        ${(item.categories || []).includes(catId) ? 'checked' : ''}> ${cat.name}
    </label>
  `).join('');

  document.getElementById('itemFormContainer').innerHTML = `
    <div style="background:white;border:2px solid #2d5016;border-radius:10px;padding:20px;margin-bottom:15px;">
      <h3 style="margin-bottom:12px;">${id ? 'Edit' : 'New'} Item</h3>
      <label>Name:</label>
      <input id="mmItemName" value="${item.name}" style="width:100%;padding:8px;margin-bottom:10px;">

      <label>Base Price (leave blank if fully determined by variations):</label>
      <input id="mmItemPrice" type="number" value="${item.basePrice ?? ''}" style="width:100%;padding:8px;margin-bottom:10px;">

      <label>Station:</label>
      <select id="mmItemStation" style="width:100%;padding:8px;margin-bottom:10px;">
        <option value="upper" ${item.station === 'upper' ? 'selected' : ''}>Upper Kitchen</option>
        <option value="lower" ${item.station === 'lower' ? 'selected' : ''}>Lower Kitchen</option>
      </select>

      <label><input type="checkbox" id="mmItemAvailable" ${item.isAvailable ? 'checked' : ''}> Available to customers</label>

      <div style="margin:10px 0;">
        <label>Categories:</label>
        ${categoryCheckboxes}
      </div>

      <div style="display:flex;gap:10px;margin-top:15px;">
        <button onclick="saveItemForm()" style="flex:1;padding:10px;background:#2d5016;color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">Save</button>
        <button onclick="closeItemForm()" style="flex:1;padding:10px;background:#999;color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">Cancel</button>
      </div>
    </div>
  `;
}
window.openItemForm = openItemForm;

function closeItemForm() {
  mmEditingItemId = null;
  document.getElementById('itemFormContainer').innerHTML = '';
}
window.closeItemForm = closeItemForm;

function saveItemForm() {
  const name = document.getElementById('mmItemName').value.trim();
  if (!name) { alert('Name is required.'); return; }

  const priceValue = document.getElementById('mmItemPrice').value;
  const categories = Array.from(document.querySelectorAll('.mm-cat-checkbox:checked')).map(el => el.value);
  if (categories.length === 0) { alert('Select at least one category.'); return; }

  const data = {
    name,
    basePrice: priceValue === '' ? null : Number(priceValue),
    station: document.getElementById('mmItemStation').value,
    isAvailable: document.getElementById('mmItemAvailable').checked,
    categories,
    photoUrl: mmEditingItemId ? (mmItems[mmEditingItemId].photoUrl || null) : null,
    variations: mmEditingItemId ? (mmItems[mmEditingItemId].variations || null) : null
  };

  if (mmEditingItemId) {
    window.mmUpdate(window.mmRef(window.mmDB, `menu/${mmEditingItemId}`), data);
  } else {
    window.mmPush(window.mmRef(window.mmDB, 'menu'), data);
  }
  closeItemForm();
}
window.saveItemForm = saveItemForm;
```

**Note on scope:** the Variations builder (dynamic add/remove groups with pricing modes) and the photo upload field from the design spec are intentionally deferred to Task 8 — this task ships a working item editor for name/price/station/availability/categories first, independently testable, before adding the more complex pieces.

- [ ] **Step 2: Manual verification**

On staging `menu-management.html`: confirm the seeded items (from Phase 1) render as cards. Click "+ Add New Item", fill in a test item ("Test Soda", price 50, Upper Kitchen, one category checked), Save — confirm a new card appears. Click Edit on it, change the price to 60, Save — confirm the card updates. Click Deactivate — confirm the badge changes to "Inactive". Click Delete, confirm the prompt, confirm it disappears. Refresh the page — confirm changes persisted (this means writes actually reached Firebase, not just local state).

- [ ] **Step 3: Commit**

```bash
git add public/menu-management.js
git commit -m "Add Menu Items list and basic Create/Edit form (no variations/photo yet)"
```

---

### Task 8: Variations builder and photo upload on the item form

**Files:**
- Modify: `public/menu-management.js`
- Modify: `public/menu-management.html`

- [ ] **Step 0: Enable Firebase Storage with billing + budget alert (manual, Firebase console)**

This is a prerequisite, not a code change — without it, every upload in this task will fail.

1. In the Firebase console, open the **staging** project → Build → Storage → "Get Started". If prompted, this requires upgrading to the Blaze (pay-as-you-go) plan — follow the prompt to link a billing account/card.
2. Once Storage is enabled, go to Storage → Rules and set rules that allow reads for everyone (the customer menu needs to load photos) and writes only from the app (acceptable for now since the back office is already PIN-gated client-side; tightening this further is out of scope for this phase):
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if true;
       }
     }
   }
   ```
3. In the Google Cloud Console (linked automatically from the Firebase project), go to Billing → Budgets & alerts → "Create Budget". Set a $1 monthly budget with an email alert at 50%/90%/100% thresholds. This won't stop any charges, but guarantees an early warning if usage ever exceeds the free tier.
4. Repeat steps 1-3 for the **production** Firebase project as well, so Task 13 (production seed) doesn't hit the same missing-Storage problem later.

Verification: in the Firebase console, Storage → Files shows an empty bucket (no error) for both staging and production projects.

- [ ] **Step 1: Add Firebase Storage imports to `menu-management.html`**

In the `<script type="module">` block, add to the import lines:
```javascript
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject }
  from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';
```
Immediately after `const database = getDatabase(app);`, add:
```javascript
const storage = getStorage(app);
window.mmStorage = storage;
window.mmStorageRef = storageRef;
window.mmUploadBytes = uploadBytes;
window.mmGetDownloadURL = getDownloadURL;
window.mmDeleteObject = deleteObject;
```

- [ ] **Step 2: Add the variations builder and photo field to `openItemForm` in `public/menu-management.js`**

Replace the `openItemForm` function's template (the part building `itemFormContainer.innerHTML`) by inserting two new sections — Photo (right after the Name field) and Variations (right after the Categories block) — and add the supporting functions below it:

```javascript
// Insert into the form HTML, directly after the Name <input>:
//   <label>Photo (JPG/PNG/WEBP, max 2MB):</label>
//   <input type="file" id="mmItemPhoto" accept="image/jpeg,image/png,image/webp" style="display:block;margin-bottom:10px;">
//   <div id="mmPhotoPreview">${item.photoUrl ? `<img src="${item.photoUrl}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">` : 'No photo'}</div>
//   <p id="mmPhotoError" style="color:#e74c3c;display:none;"></p>
//
// Insert into the form HTML, directly after the categoryCheckboxes block:
//   <div id="mmVariationsBuilder">
//     <label>Variations:</label>
//     <div id="mmVariationGroups"></div>
//     <button type="button" onclick="addVariationGroup()" style="margin-top:8px;padding:6px 14px;
//       background:#2d5016;color:white;border:none;border-radius:6px;cursor:pointer;">+ Add Variation Group</button>
//   </div>

let mmCurrentVariationGroups = [];

function startVariationsBuilder(existingVariations) {
  mmCurrentVariationGroups = existingVariations ? JSON.parse(JSON.stringify(existingVariations)) : [];
  renderVariationGroups();
}

function renderVariationGroups() {
  const container = document.getElementById('mmVariationGroups');
  container.innerHTML = mmCurrentVariationGroups.map((group, gIndex) => `
    <div style="border:1px solid #ddd;border-radius:8px;padding:10px;margin-bottom:8px;">
      <input placeholder="Group name (e.g. Size)" value="${group.type}"
        onchange="updateVariationGroupField(${gIndex}, 'type', this.value)"
        style="width:100%;padding:6px;margin-bottom:6px;">
      <div style="display:flex;gap:10px;margin-bottom:6px;">
        <select onchange="updateVariationGroupField(${gIndex}, 'selectionType', this.value)" style="flex:1;padding:6px;">
          <option value="single" ${group.selectionType === 'single' ? 'selected' : ''}>Single choice</option>
          <option value="multiple" ${group.selectionType === 'multiple' ? 'selected' : ''}>Multiple choice (checkboxes)</option>
        </select>
        <select onchange="updateVariationGroupField(${gIndex}, 'pricingMode', this.value)" style="flex:1;padding:6px;">
          <option value="multiplier" ${group.pricingMode === 'multiplier' ? 'selected' : ''}>Multiplier (×base price)</option>
          <option value="fixed" ${group.pricingMode === 'fixed' ? 'selected' : ''}>Fixed price per option</option>
          <option value="modifier" ${group.pricingMode === 'modifier' ? 'selected' : ''}>+/- modifier on base price</option>
          <option value="none" ${group.pricingMode === 'none' ? 'selected' : ''}>No price change</option>
        </select>
        <label style="white-space:nowrap;"><input type="checkbox"
          onchange="updateVariationGroupField(${gIndex}, 'required', this.checked)"
          ${group.required ? 'checked' : ''}> Required</label>
      </div>
      <div id="mmGroupOptions${gIndex}">
        ${(group.options || []).map((opt, oIndex) => renderOptionRow(group, gIndex, opt, oIndex)).join('')}
      </div>
      <button type="button" onclick="addVariationOption(${gIndex})" style="margin-top:4px;padding:4px 10px;
        background:#ddd;border:none;border-radius:6px;cursor:pointer;font-size:12px;">+ Add Option</button>
      <button type="button" onclick="removeVariationGroup(${gIndex})" style="margin-top:4px;margin-left:6px;padding:4px 10px;
        background:#e74c3c;color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;">Remove Group</button>
    </div>
  `).join('');
}

function renderOptionRow(group, gIndex, opt, oIndex) {
  const valueField = group.pricingMode === 'multiplier'
    ? `<input type="number" step="0.1" placeholder="Multiplier" value="${opt.multiplier ?? ''}"
        onchange="updateVariationOptionField(${gIndex}, ${oIndex}, 'multiplier', Number(this.value))" style="width:90px;padding:6px;">`
    : group.pricingMode === 'none'
    ? ''
    : `<input type="number" placeholder="${group.pricingMode === 'fixed' ? 'Price' : 'Modifier (+/-)'}"
        value="${(group.pricingMode === 'fixed' ? opt.price : opt.modifier) ?? ''}"
        onchange="updateVariationOptionField(${gIndex}, ${oIndex}, '${group.pricingMode === 'fixed' ? 'price' : 'modifier'}', Number(this.value))"
        style="width:90px;padding:6px;">`;

  return `
    <div style="display:flex;gap:8px;margin-bottom:4px;align-items:center;">
      <input placeholder="Option label" value="${opt.label || ''}"
        onchange="updateVariationOptionField(${gIndex}, ${oIndex}, 'label', this.value)" style="flex:1;padding:6px;">
      ${valueField}
      <button type="button" onclick="removeVariationOption(${gIndex}, ${oIndex})" style="padding:4px 8px;
        background:#e74c3c;color:white;border:none;border-radius:6px;cursor:pointer;">×</button>
    </div>
  `;
}

function addVariationGroup() {
  mmCurrentVariationGroups.push({ type: '', required: false, selectionType: 'single', pricingMode: 'fixed', options: [] });
  renderVariationGroups();
}
window.addVariationGroup = addVariationGroup;

function removeVariationGroup(gIndex) {
  mmCurrentVariationGroups.splice(gIndex, 1);
  renderVariationGroups();
}
window.removeVariationGroup = removeVariationGroup;

function addVariationOption(gIndex) {
  mmCurrentVariationGroups[gIndex].options.push({ label: '' });
  renderVariationGroups();
}
window.addVariationOption = addVariationOption;

function removeVariationOption(gIndex, oIndex) {
  mmCurrentVariationGroups[gIndex].options.splice(oIndex, 1);
  renderVariationGroups();
}
window.removeVariationOption = removeVariationOption;

function updateVariationGroupField(gIndex, field, value) {
  mmCurrentVariationGroups[gIndex][field] = value;
  if (field === 'pricingMode') renderVariationGroups(); // option inputs depend on pricing mode
}
window.updateVariationGroupField = updateVariationGroupField;

function updateVariationOptionField(gIndex, oIndex, field, value) {
  mmCurrentVariationGroups[gIndex].options[oIndex][field] = value;
}
window.updateVariationOptionField = updateVariationOptionField;

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

async function uploadItemPhotoIfSelected(itemId) {
  const fileInput = document.getElementById('mmItemPhoto');
  const file = fileInput.files[0];
  if (!file) return mmItems[itemId] ? (mmItems[itemId].photoUrl || null) : null;

  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error('Photo exceeds 2MB limit.');
  }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Unsupported file type. Use JPG, PNG, or WEBP.');
  }

  const path = `menu-photos/${itemId}-${Date.now()}`;
  const fileRef = window.mmStorageRef(window.mmStorage, path);
  await window.mmUploadBytes(fileRef, file);
  const newUrl = await window.mmGetDownloadURL(fileRef);

  const oldUrl = mmItems[itemId] ? mmItems[itemId].photoUrl : null;
  if (oldUrl) {
    try {
      const oldRef = window.mmStorageRef(window.mmStorage, oldUrl);
      await window.mmDeleteObject(oldRef);
    } catch (e) {
      console.warn('Could not delete old photo (may already be gone):', e);
    }
  }

  return newUrl;
}
```

- [ ] **Step 3: Update `saveItemForm` to include variations and photo upload**

In `public/menu-management.js`, replace the existing `saveItemForm` function with this version, which validates the photo first, uploads it, then writes the full record:

```javascript
async function saveItemForm() {
  const name = document.getElementById('mmItemName').value.trim();
  if (!name) { alert('Name is required.'); return; }

  const priceValue = document.getElementById('mmItemPrice').value;
  const categories = Array.from(document.querySelectorAll('.mm-cat-checkbox:checked')).map(el => el.value);
  if (categories.length === 0) { alert('Select at least one category.'); return; }

  const targetId = mmEditingItemId || window.mmPush(window.mmRef(window.mmDB, 'menu')).key;

  let photoUrl;
  try {
    photoUrl = await uploadItemPhotoIfSelected(targetId);
  } catch (err) {
    document.getElementById('mmPhotoError').textContent = err.message;
    document.getElementById('mmPhotoError').style.display = 'block';
    return;
  }

  const data = {
    name,
    basePrice: priceValue === '' ? null : Number(priceValue),
    station: document.getElementById('mmItemStation').value,
    isAvailable: document.getElementById('mmItemAvailable').checked,
    categories,
    photoUrl,
    variations: mmCurrentVariationGroups.length > 0 ? mmCurrentVariationGroups : null
  };

  window.mmSet(window.mmRef(window.mmDB, `menu/${targetId}`), data);
  closeItemForm();
}
window.saveItemForm = saveItemForm;
```

Also add a call to `startVariationsBuilder(item.variations)` at the end of `openItemForm` (after setting `.innerHTML`), so the builder initializes with the item's existing variations when editing.

- [ ] **Step 4: Manual verification**

On staging: edit the seeded "Lemon Tea" item (from Phase 1). Confirm its Temperature variation group shows up pre-filled with Hot/Cold options and the correct fixed prices. Add a new option "Iced" with price 90, Save. Re-open Edit — confirm "Iced" persisted. Try uploading a photo over 2MB — confirm it's rejected with a visible error before any network request (check the Network tab in dev tools shows no upload request fired). Upload a valid <2MB JPG — confirm the preview updates and, after Save and re-opening Edit, the photo persisted.

- [ ] **Step 5: Commit**

```bash
git add public/menu-management.js public/menu-management.html
git commit -m "Add variations builder and photo upload to item Create/Edit form"
```

---

### Task 9: Category Management tab

**Files:**
- Modify: `public/menu-management.js`

- [ ] **Step 1: Implement `renderCategoriesTab` and its CRUD functions**

```javascript
// Add to public/menu-management.js

function renderCategoriesTab() {
  const container = document.getElementById('categoriesTab');
  const sorted = Object.entries(mmCategories).sort((a, b) => a[1].displayOrder - b[1].displayOrder);
  const itemCounts = {};
  Object.values(mmItems).forEach(item => {
    (item.categories || []).forEach(catId => {
      itemCounts[catId] = (itemCounts[catId] || 0) + 1;
    });
  });

  container.innerHTML = `
    <button onclick="addCategoryPrompt()" style="margin-bottom:15px;padding:10px 20px;
      background:#ff6b35;color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">+ Add Category</button>
    <table style="width:100%;background:white;border-collapse:collapse;">
      <thead><tr style="text-align:left;border-bottom:2px solid #eee;">
        <th style="padding:8px;">Name</th><th style="padding:8px;">Items</th>
        <th style="padding:8px;">Status</th><th style="padding:8px;">Actions</th>
      </tr></thead>
      <tbody>
        ${sorted.map(([id, cat], index) => `
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:8px;">${cat.name}</td>
            <td style="padding:8px;">${itemCounts[id] || 0}</td>
            <td style="padding:8px;color:${cat.isActive ? '#2d5016' : '#e74c3c'};font-weight:bold;">
              ${cat.isActive ? 'Active' : 'Inactive'}
            </td>
            <td style="padding:8px;display:flex;gap:6px;">
              <button onclick="renameCategory('${id}')" style="padding:4px 10px;border:none;border-radius:6px;background:#2d5016;color:white;cursor:pointer;">Rename</button>
              <button onclick="moveCategory('${id}', -1)" ${index === 0 ? 'disabled' : ''} style="padding:4px 8px;border:none;border-radius:6px;background:#ddd;cursor:pointer;">↑</button>
              <button onclick="moveCategory('${id}', 1)" ${index === sorted.length - 1 ? 'disabled' : ''} style="padding:4px 8px;border:none;border-radius:6px;background:#ddd;cursor:pointer;">↓</button>
              <button onclick="toggleCategoryActive('${id}')" style="padding:4px 10px;border:none;border-radius:6px;background:#ffc107;cursor:pointer;">
                ${cat.isActive ? 'Deactivate' : 'Reactivate'}
              </button>
              <button onclick="deleteCategory('${id}')" ${itemCounts[id] > 0 ? 'disabled title="Reassign items before deleting"' : ''}
                style="padding:4px 10px;border:none;border-radius:6px;background:#e74c3c;color:white;cursor:pointer;">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function addCategoryPrompt() {
  const name = prompt('New category name:');
  if (!name || !name.trim()) return;
  const id = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (mmCategories[id]) { alert('A category with this name already exists.'); return; }
  const maxOrder = Math.max(0, ...Object.values(mmCategories).map(c => c.displayOrder));
  window.mmSet(window.mmRef(window.mmDB, `categories/${id}`), {
    name: name.trim(), displayOrder: maxOrder + 1, isActive: true
  });
}
window.addCategoryPrompt = addCategoryPrompt;

function renameCategory(id) {
  const name = prompt('New name:', mmCategories[id].name);
  if (!name || !name.trim()) return;
  window.mmUpdate(window.mmRef(window.mmDB, `categories/${id}`), { name: name.trim() });
}
window.renameCategory = renameCategory;

function toggleCategoryActive(id) {
  window.mmUpdate(window.mmRef(window.mmDB, `categories/${id}`), { isActive: !mmCategories[id].isActive });
}
window.toggleCategoryActive = toggleCategoryActive;

function deleteCategory(id) {
  const inUse = Object.values(mmItems).some(item => (item.categories || []).includes(id));
  if (inUse) { alert('Cannot delete a category that still has items assigned to it.'); return; }
  if (!confirm(`Delete category "${mmCategories[id].name}"?`)) return;
  window.mmRemove(window.mmRef(window.mmDB, `categories/${id}`));
}
window.deleteCategory = deleteCategory;

function moveCategory(id, direction) {
  const sorted = Object.entries(mmCategories).sort((a, b) => a[1].displayOrder - b[1].displayOrder);
  const index = sorted.findIndex(([catId]) => catId === id);
  const swapIndex = index + direction;
  if (swapIndex < 0 || swapIndex >= sorted.length) return;

  const [idA, catA] = sorted[index];
  const [idB, catB] = sorted[swapIndex];
  const updates = {};
  updates[`categories/${idA}/displayOrder`] = catB.displayOrder;
  updates[`categories/${idB}/displayOrder`] = catA.displayOrder;
  window.mmUpdate(window.mmRef(window.mmDB), updates);
}
window.moveCategory = moveCategory;
```

- [ ] **Step 2: Manual verification**

On staging Categories tab: confirm all 20 seeded categories show in the correct order with item counts matching the seeded menu. Add a test category "Test Category" — confirm it appears at the bottom. Use ↑ to move it up one position, refresh the page, confirm the new order persisted. Try deleting a category that has items (e.g. "Drinks") — confirm the Delete button is disabled. Delete "Test Category" (0 items) — confirm it's removed. Deactivate "Drinks" — confirm its status flips to Inactive (customer-menu effect isn't testable until Phase 3).

- [ ] **Step 3: Commit**

```bash
git add public/menu-management.js
git commit -m "Add Category Management tab: add/rename/reorder/deactivate/delete"
```

---

## Phase 3 — Customer-facing `menu.html` rewired to Firebase (staging only)

### Task 10: Replace the hardcoded array with a Firebase read

**Files:**
- Modify: `public/menu.html`

- [ ] **Step 1: Remove the hardcoded `menu` array and `getCategories()` function**

Delete the `const menu = [ ... ];` literal (the block identified in Phase 1, Task 3) and the existing `getCategories()` function in `public/menu.html`.

- [ ] **Step 2: Add Firebase reads for `/menu` and `/categories`, building equivalent in-memory structures**

In the `<script type="module">` block in `public/menu.html`, after the existing `window.firebaseGet = get;` line, add:

```javascript
import { onValue } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';
window.firebaseOnValue = onValue;

let menu = [];
let categoriesById = {};
let categoryOrderList = [];
let menuDataReady = false;
let onMenuDataReadyCallback = null;

function loadMenuData() {
  const categoriesRef = window.firebaseRef(window.firebaseDB, 'categories');
  const menuRef = window.firebaseRef(window.firebaseDB, 'menu');

  let categoriesLoaded = false;
  let itemsLoaded = false;

  function maybeReady() {
    if (categoriesLoaded && itemsLoaded && !menuDataReady) {
      menuDataReady = true;
      if (onMenuDataReadyCallback) onMenuDataReadyCallback();
    }
  }

  window.firebaseOnValue(categoriesRef, (snap) => {
    const data = snap.exists() ? snap.val() : {};
    categoriesById = data;
    categoryOrderList = Object.entries(data)
      .filter(([id, cat]) => cat.isActive)
      .sort((a, b) => a[1].displayOrder - b[1].displayOrder)
      .map(([id, cat]) => cat.name);
    categoriesLoaded = true;
    maybeReady();
  });

  window.firebaseOnValue(menuRef, (snap) => {
    const data = snap.exists() ? snap.val() : {};
    menu = Object.entries(data)
      .filter(([id, item]) => item.isAvailable)
      .map(([id, item]) => ({
        id,
        name: item.name,
        price: item.basePrice,
        category: (item.categories || [])
          .map(catId => categoriesById[catId] ? categoriesById[catId].name : null)
          .filter(Boolean)[0], // primary category for rendering grouping; see Task 11 for multi-category display
        categories: item.categories || [],
        station: item.station,
        image: item.legacyImage || '🍽️',
        photoUrl: item.photoUrl,
        variations: item.variations || null
      }));
    itemsLoaded = true;
    maybeReady();
  });
}

function getCategories() {
  return categoryOrderList;
}
```

- [ ] **Step 3: Defer `init()` until menu data has loaded**

Find the existing `init()` function and the line that calls it (likely near the bottom of the script or in a `window.onload`/`DOMContentLoaded` handler — search for `init();`). Replace that call site so `init()` runs only after Firebase data arrives:

```javascript
onMenuDataReadyCallback = init;
loadMenuData();
```

(Remove the old direct `init();` call if it ran immediately on script load — `init()` now runs from the `maybeReady()` callback above instead.)

- [ ] **Step 4: Manual verification**

Open staging `menu.html?table=1`. Confirm: the menu grid renders with the same ~20 categories and item count as before (now sourced from Firebase instead of the hardcoded array). Confirm Lemon Tea still shows Temperature options correctly. In `menu-management.html`, deactivate one item — refresh `menu.html` and confirm that item disappears from the customer menu. Reactivate it — confirm it reappears on refresh.

- [ ] **Step 5: Commit**

```bash
git add public/menu.html
git commit -m "Replace hardcoded menu array with Firebase read from /menu and /categories"
```

---

### Task 11: Rewire variation modal rendering to the generic schema

**Files:**
- Modify: `public/menu.html`

This is the largest task in the plan. The existing `openVariationModal`, `updateComplexPrice`, and `selectComplexVariation` functions are built around hardcoded keys (`item.variations.size`, `.temperature`, `.style`, etc. — see the existing code around what was originally lines 2236-2446 before Task 10's edits shifted line numbers). They must become data-driven over the new `item.variations` array shape (`[{ type, required, selectionType, pricingMode, options }]`).

- [ ] **Step 1: Replace `openVariationModal` with a generic-schema version**

```javascript
let currentVariationSelections = {}; // { [groupIndex]: optionIndex | [optionIndex, ...] for multi-select }

function openVariationModal(item) {
  currentItem = item;
  currentQuantity = 1;
  currentVariationSelections = {};
  specialInstructions = '';

  document.getElementById('variationItemName').textContent = item.name;

  let html = '';

  (item.variations || []).forEach((group, gIndex) => {
    if (group.selectionType === 'multiple') {
      currentVariationSelections[gIndex] = [];
      html += `<div class="variation-section">
        <label>${group.type}${group.required ? ' *' : ''}:</label>
        ${group.options.map((opt, oIndex) => `
          <label style="display:block;margin-bottom:6px;">
            <input type="checkbox" onchange="toggleMultiVariation(${gIndex}, ${oIndex}, this.checked)">
            ${opt.label}${variationOptionPriceLabel(group, opt)}
          </label>
        `).join('')}
      </div>`;
    } else {
      currentVariationSelections[gIndex] = group.required ? 0 : null;
      html += `<div class="variation-section">
        <label>${group.type}${group.required ? ' *' : ''}:</label>
        <div class="variation-options">
          ${group.options.map((opt, oIndex) => `
            <div class="variation-option ${oIndex === 0 && group.required ? 'selected' : ''}"
                 onclick="selectSingleVariation(${gIndex}, ${oIndex})">
              <span>${opt.label}</span>
              <strong>${variationOptionPriceLabel(group, opt)}</strong>
            </div>
          `).join('')}
        </div>
      </div>`;
    }
  });

  html += `<div class="variation-section">
    <label>Quantity:</label>
    <div class="quantity-controls">
      <button class="qty-btn" onclick="adjustQuantity(-1)">-</button>
      <span id="modalQuantity">1</span>
      <button class="qty-btn" onclick="adjustQuantity(1)">+</button>
    </div>
  </div>`;

  html += `<div class="variation-section">
    <label>Special Instructions (Optional):</label>
    <textarea id="specialInstructions" placeholder="e.g., Less salt, No MSG, Extra spicy..." rows="3"></textarea>
  </div>`;

  html += `<div class="modal-price">Total: <strong id="modalPrice">₱${computeVariationPrice(item)}</strong></div>`;

  document.getElementById('variationOptions').innerHTML = html;
  document.getElementById('variationModal').classList.add('active');
}

function variationOptionPriceLabel(group, opt) {
  if (group.pricingMode === 'fixed') return ` (₱${opt.price})`;
  if (group.pricingMode === 'modifier' && opt.modifier) return ` (${opt.modifier > 0 ? '+' : ''}₱${opt.modifier})`;
  if (group.pricingMode === 'multiplier') return ` (×${opt.multiplier})`;
  return '';
}

function computeVariationPrice(item) {
  let price = item.price || 0;
  let multiplier = 1;

  (item.variations || []).forEach((group, gIndex) => {
    const selection = currentVariationSelections[gIndex];
    if (selection === null || selection === undefined) return;

    const applyOption = (opt) => {
      if (group.pricingMode === 'fixed') price = opt.price;
      else if (group.pricingMode === 'modifier') price += (opt.modifier || 0);
      else if (group.pricingMode === 'multiplier') multiplier = opt.multiplier;
      // 'none' pricing mode: no price effect
    };

    if (group.selectionType === 'multiple') {
      selection.forEach(oIndex => applyOption(group.options[oIndex]));
    } else if (typeof selection === 'number') {
      applyOption(group.options[selection]);
    }
  });

  return Math.round(price * multiplier * currentQuantity);
}

function selectSingleVariation(gIndex, oIndex) {
  currentVariationSelections[gIndex] = oIndex;
  event.target.closest('.variation-options').querySelectorAll('.variation-option').forEach(el => el.classList.remove('selected'));
  event.target.closest('.variation-option').classList.add('selected');
  document.getElementById('modalPrice').textContent = '₱' + computeVariationPrice(currentItem);
}

function toggleMultiVariation(gIndex, oIndex, checked) {
  const list = currentVariationSelections[gIndex];
  if (checked && !list.includes(oIndex)) list.push(oIndex);
  if (!checked) currentVariationSelections[gIndex] = list.filter(i => i !== oIndex);
  document.getElementById('modalPrice').textContent = '₱' + computeVariationPrice(currentItem);
}

function adjustQuantity(change) {
  currentQuantity = Math.max(1, currentQuantity + change);
  document.getElementById('modalQuantity').textContent = currentQuantity;
  document.getElementById('modalPrice').textContent = '₱' + computeVariationPrice(currentItem);
}
```

This replaces the old `openVariationModal`, `adjustQuantity`, `updateComplexPrice`, and `selectComplexVariation`/`selectVariation` functions. Delete those old functions entirely (search for each by name and remove the full function body) to avoid duplicate declarations.

- [ ] **Step 2: Update `confirmVariation` to read from the new selection structure**

Find the existing `confirmVariation` function (search for `function confirmVariation`). Replace its body with:

```javascript
function confirmVariation() {
  for (const [gIndex, group] of (currentItem.variations || []).entries()) {
    const selection = currentVariationSelections[gIndex];
    const isEmpty = group.selectionType === 'multiple' ? selection.length === 0 : (selection === null || selection === undefined);
    if (group.required && isEmpty) {
      alert(`Please select a ${group.type}.`);
      return;
    }
  }

  const variationLabels = [];
  (currentItem.variations || []).forEach((group, gIndex) => {
    const selection = currentVariationSelections[gIndex];
    if (group.selectionType === 'multiple') {
      selection.forEach(oIndex => variationLabels.push(group.options[oIndex].label));
    } else if (typeof selection === 'number') {
      variationLabels.push(group.options[selection].label);
    }
  });

  const cartItem = {
    ...currentItem,
    quantity: currentQuantity,
    price: computeVariationPrice(currentItem) / currentQuantity,
    variationDisplay: variationLabels.join(', '),
    specialInstructions: document.getElementById('specialInstructions').value.trim() || null,
    selectedVariation: { size: variationLabels.join(', ') } // keeps existing cart-rendering code (which reads .selectedVariation.size) working unchanged
  };

  cart.push(cartItem);
  updateCartButton();
  closeVariationModal();
}
```

- [ ] **Step 3: Update the `window.fn = fn` exposure list**

Find the exposure block from earlier in this conversation (`window.addToCart = addToCart;` etc., near the bottom of the script). Remove the now-deleted `window.selectVariation = selectVariation;` line (function no longer exists) and add:

```javascript
window.selectSingleVariation = selectSingleVariation;
window.toggleMultiVariation = toggleMultiVariation;
```

(`window.adjustQuantity`, `window.confirmVariation`, `window.closeVariationModal` already exist from prior work and don't need re-adding — confirm they're still present.)

- [ ] **Step 4: Manual verification**

On staging `menu.html?table=1`:
- Open a single-choice item (e.g. a Vegetable dish with Size options). Confirm Small/Medium/Large show with correct multiplier-derived prices, selecting one highlights it and updates the total, quantity +/- works, Add to Cart works.
- Open Lemon Tea. Confirm Temperature (Hot/Cold) shows fixed prices, selecting Cold updates the total to ₱85, quantity +/- works (this is the bug fixed earlier in the project — confirm it's still fixed after this rewrite).
- Open a Mami item. Confirm Noodle Type (no price change), Style (+₱10 modifier when Toasted is picked), and if it has Extra Soup, a checkbox-style Add-ons section that adds to the total independently of the other selections.
- Add a couple of these to cart and confirm the cart screen and Send Order flow (built in earlier sessions) still work end-to-end with no console errors.

- [ ] **Step 5: Commit**

```bash
git add public/menu.html
git commit -m "Rewire variation modal to generic schema (multiplier/fixed/modifier/none, single/multi-select)"
```

---

## Phase 4 — End-to-end staging validation

### Task 12: Full staging regression pass

This task has no code changes — it's a structured manual verification pass before touching production.

**Files:** None modified.

- [ ] **Step 1:** On staging, place a full test order: a single-choice item, a Mami item with all variation types touched (noodle/style/addon), and a Drinks item with Temperature. Confirm the cart total matches manual arithmetic.
- [ ] **Step 2:** Submit the order. On the staging staff dashboard, confirm it appears in Pending with the correct items, prices, and station-correct grouping (Upper/Lower) for kitchen receipts.
- [ ] **Step 3:** Confirm the order, mark ready, mark delivered, finalize payment — confirm the existing order lifecycle (built in earlier sessions, untouched by this feature) still works without errors.
- [ ] **Step 4:** In `menu-management.html`, create one brand-new item from scratch (with a photo, one multiplier variation group, one modifier group), and confirm it appears correctly on the customer menu within a page refresh — no redeploy.
- [ ] **Step 5:** In Category Management, deactivate a category with items in it; confirm those items disappear from the customer menu; reactivate; confirm they reappear.
- [ ] **Step 6:** Report results back — any failures here block Phase 5 until fixed.

---

## Phase 5 — Production seed + cutover

**Do not start this phase until Task 12 fully passes and the user explicitly confirms staging is ready.**

### Task 13: Seed production Firebase

**Files:** None created/modified (uses `scripts/seed-menu/` from Phase 1).

- [ ] **Step 1:** Get a production Firebase Admin service account key (same process as Task 2, but for the `ying-ying-ordering` project), save as `scripts/seed-menu/serviceAccountKey.production.json` (git-ignored).
- [ ] **Step 2:** Run: `cd scripts/seed-menu && npm run seed:production`. Expected: `✅ Seeded 20 categories and <N> menu items to production.` The script's existing-data guard (Task 4) prevents this from running twice or overwriting.
- [ ] **Step 3:** Verify in the Firebase console (production project) that `/menu` and `/categories` now contain the expected data, matching staging's seeded data exactly.

### Task 14: Merge `staging` to `main` and verify production

**Files:** None — this is a git operation plus manual verification.

- [ ] **Step 1:** Confirm with the user this is the moment to go live (production `menu.html` will switch from the hardcoded array to Firebase the instant this merges and Vercel deploys).
- [ ] **Step 2:** Merge `staging` into `main`:
```bash
git checkout main
git pull
git merge staging
git push
```
- [ ] **Step 3:** Wait for Vercel's production deployment to complete, then open the real production menu URL and confirm the menu renders correctly from Firebase.
- [ ] **Step 4:** Confirm with the user that they (or Justin) should do one real test order on production to be sure, given this is the production cutover.
