// Ying Ying — Menu Management logic
// Renders into #tabItems and #tabCategories on menu-management.html.
// Entry point: window.initMenuManagement() (called after PIN success;
// Firebase is already exposed on window.firebase*).

const CATEGORY_COLORS = [
    '#e8f5e9', '#fff3e0', '#e3f2fd', '#fce4ec', '#f3e5f5',
    '#e0f2f1', '#fff8e1', '#efebe9', '#e8eaf6', '#f1f8e9'
];

let menuData = {};        // { itemId: item }
let categoryData = {};    // { categoryId: category }
let editingItemId = null; // null = list view, 'new' = creating, else editing
let itemFilterCategory = 'all';
let itemFilterStatus = 'all';
let dataReady = { menu: false, categories: false };
let started = false;

function initMenuManagement() {
    if (started) return;
    started = true;

    injectStyles();

    window.firebaseOnValue(window.firebaseRef(window.firebaseDB, 'menu'), (snap) => {
        menuData = snap.val() || {};
        dataReady.menu = true;
        rerender();
    });
    window.firebaseOnValue(window.firebaseRef(window.firebaseDB, 'categories'), (snap) => {
        categoryData = snap.val() || {};
        dataReady.categories = true;
        rerender();
    });
}

function rerender() {
    if (!dataReady.menu || !dataReady.categories) return;
    // Don't blow away the form while the admin is editing
    if (editingItemId === null) renderItemsTab();
    renderCategoriesTab();
}

// ============================================================
// HELPERS
// ============================================================

function esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function sortedCategories() {
    return Object.entries(categoryData)
        .map(([id, c]) => ({ id, ...c }))
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

function categoryName(id) {
    return categoryData[id] ? categoryData[id].name : id;
}

function itemCountForCategory(catId) {
    return Object.values(menuData).filter(i => (i.categories || []).includes(catId)).length;
}

function catColor(catId) {
    let hash = 0;
    for (let i = 0; i < catId.length; i++) hash = (hash * 31 + catId.charCodeAt(i)) >>> 0;
    return CATEGORY_COLORS[hash % CATEGORY_COLORS.length];
}

function displayPrice(item) {
    if (item.basePrice != null) return '₱' + item.basePrice;
    // Price fully determined by variations — show cheapest fixed option
    const fixedGroup = (item.variations || []).find(v => v.pricingMode === 'fixed');
    if (fixedGroup) {
        const prices = fixedGroup.options.map(o => o.price).filter(p => p != null);
        if (prices.length) return 'from ₱' + Math.min(...prices);
    }
    return '—';
}

// ============================================================
// ITEMS TAB
// ============================================================

function renderItemsTab() {
    const el = document.getElementById('tabItems');
    const cats = sortedCategories();

    const items = Object.entries(menuData)
        .map(([id, item]) => ({ id, ...item }))
        .filter(i => itemFilterCategory === 'all' || (i.categories || []).includes(itemFilterCategory))
        .filter(i => itemFilterStatus === 'all'
            || (itemFilterStatus === 'active' && i.isAvailable !== false)
            || (itemFilterStatus === 'inactive' && i.isAvailable === false))
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    el.innerHTML = `
        <div class="mm-toolbar">
            <button class="mm-btn mm-btn-primary" onclick="mmOpenItemForm('new')">+ Add New Item</button>
            <select class="mm-select" onchange="mmSetItemFilterCategory(this.value)">
                <option value="all">All Categories</option>
                ${cats.map(c => `<option value="${esc(c.id)}" ${itemFilterCategory === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
            </select>
            <select class="mm-select" onchange="mmSetItemFilterStatus(this.value)">
                <option value="all" ${itemFilterStatus === 'all' ? 'selected' : ''}>All Statuses</option>
                <option value="active" ${itemFilterStatus === 'active' ? 'selected' : ''}>Active</option>
                <option value="inactive" ${itemFilterStatus === 'inactive' ? 'selected' : ''}>Inactive</option>
            </select>
            <span class="mm-count">${items.length} item${items.length === 1 ? '' : 's'}</span>
        </div>
        <div class="mm-item-grid">
            ${items.map(i => itemCardHTML(i)).join('') || '<div class="placeholder">No items match the filters.</div>'}
        </div>
    `;
}

function itemCardHTML(item) {
    const inactive = item.isAvailable === false;
    const firstCat = (item.categories || [])[0] || '';
    const photo = item.photoUrl
        ? `<img src="${esc(item.photoUrl)}" alt="" onerror="this.remove()">`
        : `<span class="mm-card-emoji">${esc(item.emoji || '🍽️')}</span>`;
    return `
        <div class="mm-item-card ${inactive ? 'mm-inactive' : ''}">
            <div class="mm-card-img" style="background:${catColor(firstCat)}">${photo}
                ${inactive ? '<span class="mm-badge mm-badge-off">Inactive</span>' : ''}
            </div>
            <div class="mm-card-body">
                <div class="mm-card-name">${esc(item.name)}</div>
                <div class="mm-card-cats">${(item.categories || []).map(c => esc(categoryName(c))).join(', ')}</div>
                <div class="mm-card-price">${displayPrice(item)} <span class="mm-station-tag">${item.station === 'lower' ? '⬇ Lower' : '⬆ Upper'}</span></div>
            </div>
            <div class="mm-card-actions">
                <button class="mm-btn mm-btn-sm" onclick="mmOpenItemForm('${esc(item.id)}')">Edit</button>
                <button class="mm-btn mm-btn-sm" onclick="mmToggleItem('${esc(item.id)}')">${inactive ? 'Reactivate' : 'Deactivate'}</button>
                <button class="mm-btn mm-btn-sm mm-btn-danger" onclick="mmDeleteItem('${esc(item.id)}')">Delete</button>
            </div>
        </div>
    `;
}

function mmSetItemFilterCategory(v) { itemFilterCategory = v; renderItemsTab(); }
function mmSetItemFilterStatus(v) { itemFilterStatus = v; renderItemsTab(); }

async function mmToggleItem(id) {
    const item = menuData[id];
    if (!item) return;
    await window.firebaseUpdate(window.firebaseRef(window.firebaseDB, `menu/${id}`), {
        isAvailable: item.isAvailable === false
    });
}

async function mmDeleteItem(id) {
    const item = menuData[id];
    if (!item) return;
    if (!confirm(`Delete "${item.name}" permanently? This cannot be undone.\n\nTip: use Deactivate instead if you might bring it back.`)) return;
    await window.firebaseRemove(window.firebaseRef(window.firebaseDB, `menu/${id}`));
}

// ============================================================
// ITEM FORM (create / edit)
// ============================================================

// Working copy of variations while the form is open
let formVariations = [];
let formPhotoFile = null;

function mmOpenItemForm(id) {
    editingItemId = id;
    const isNew = id === 'new';
    const item = isNew
        ? { name: '', basePrice: null, station: 'upper', isAvailable: true, categories: [], variations: [], photoUrl: null }
        : { ...menuData[id] };
    formVariations = JSON.parse(JSON.stringify(item.variations || []));
    formPhotoFile = null;

    const cats = sortedCategories();
    const el = document.getElementById('tabItems');
    el.innerHTML = `
        <div class="mm-form">
            <div class="mm-form-header">
                <h2>${isNew ? 'Add New Item' : 'Edit: ' + esc(item.name)}</h2>
                <button class="mm-btn" onclick="mmCloseItemForm()">← Back to list</button>
            </div>

            <div class="mm-form-section">
                <h3>Basic Info</h3>
                <label class="mm-label">Name *
                    <input class="mm-input" id="mmName" value="${esc(item.name)}" placeholder="e.g. Siomai">
                </label>
                <label class="mm-label">Base Price (₱)
                    <input class="mm-input" id="mmBasePrice" type="number" min="0" step="0.01"
                           value="${item.basePrice != null ? item.basePrice : ''}"
                           placeholder="Leave empty if price comes fully from variations">
                </label>
                <label class="mm-label">Kitchen Station * <span class="mm-hint">(controls which kitchen printer receives this item)</span>
                    <select class="mm-input" id="mmStation">
                        <option value="upper" ${item.station !== 'lower' ? 'selected' : ''}>⬆ Upper Kitchen</option>
                        <option value="lower" ${item.station === 'lower' ? 'selected' : ''}>⬇ Lower Kitchen</option>
                    </select>
                </label>
                <label class="mm-check">
                    <input type="checkbox" id="mmAvailable" ${item.isAvailable !== false ? 'checked' : ''}>
                    Available on customer menu
                </label>
            </div>

            <div class="mm-form-section">
                <h3>Photo</h3>
                <div class="mm-photo-row">
                    <div class="mm-photo-preview" id="mmPhotoPreview">
                        ${item.photoUrl ? `<img src="${esc(item.photoUrl)}" alt="">` : '<span>No photo</span>'}
                    </div>
                    <div>
                        <input type="file" id="mmPhotoFile" accept="image/jpeg,image/png,image/webp" onchange="mmPhotoChosen(this)">
                        <p class="mm-hint">JPG, PNG or WEBP, max 2MB. Uploaded when you save.</p>
                        ${item.photoUrl ? `<button class="mm-btn mm-btn-sm mm-btn-danger" onclick="mmRemovePhoto()">Remove photo</button>` : ''}
                    </div>
                </div>
                <div id="mmPhotoError" class="mm-error" style="display:none"></div>
            </div>

            <div class="mm-form-section">
                <h3>Categories</h3>
                <div class="mm-cat-checks">
                    ${cats.map(c => `
                        <label class="mm-check">
                            <input type="checkbox" class="mm-cat-check" value="${esc(c.id)}"
                                   ${(item.categories || []).includes(c.id) ? 'checked' : ''}>
                            ${esc(c.name)}
                        </label>`).join('')}
                </div>
            </div>

            <div class="mm-form-section">
                <h3>Variations</h3>
                <p class="mm-hint">Option groups like Size, Temperature, Add-ons. Each group has its own pricing rule.</p>
                <div id="mmVariations"></div>
                <button class="mm-btn" onclick="mmAddVariationGroup()">+ Add Variation Group</button>
            </div>

            <div class="mm-form-section">
                <h3>Price Preview</h3>
                <div id="mmPricePreview" class="mm-price-preview"></div>
            </div>

            <div id="mmFormError" class="mm-error" style="display:none"></div>

            <div class="mm-form-actions">
                <button class="mm-btn mm-btn-primary" id="mmSaveBtn" onclick="mmSaveItem()">💾 Save Item</button>
                <button class="mm-btn" onclick="mmCloseItemForm()">Cancel</button>
            </div>
        </div>
    `;
    renderVariationsBuilder();
    renderPricePreview();
    document.getElementById('mmBasePrice').addEventListener('input', renderPricePreview);
}

function mmCloseItemForm() {
    editingItemId = null;
    formVariations = [];
    formPhotoFile = null;
    renderItemsTab();
}

// ---------- Photo ----------

function mmPhotoChosen(input) {
    const errEl = document.getElementById('mmPhotoError');
    errEl.style.display = 'none';
    const file = input.files && input.files[0];
    if (!file) { formPhotoFile = null; return; }

    const okTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!okTypes.includes(file.type)) {
        errEl.textContent = 'Unsupported format. Please use JPG, PNG or WEBP.';
        errEl.style.display = 'block';
        input.value = '';
        formPhotoFile = null;
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        errEl.textContent = `File is ${(file.size / 1024 / 1024).toFixed(1)}MB — max is 2MB. Please compress it first.`;
        errEl.style.display = 'block';
        input.value = '';
        formPhotoFile = null;
        return;
    }
    formPhotoFile = file;
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById('mmPhotoPreview').innerHTML = `<img src="${e.target.result}" alt="">`;
    };
    reader.readAsDataURL(file);
}

let formPhotoRemoved = false;
function mmRemovePhoto() {
    formPhotoRemoved = true;
    formPhotoFile = null;
    document.getElementById('mmPhotoPreview').innerHTML = '<span>No photo</span>';
}

async function uploadPhotoIfAny(itemId, existingUrl) {
    if (!formPhotoFile) return formPhotoRemoved ? null : existingUrl;
    // Lazy-load Firebase Storage only when actually uploading
    const { getStorage, ref: sRef, uploadBytes, getDownloadURL, deleteObject } =
        await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js');
    const storage = getStorage();
    const ext = formPhotoFile.type === 'image/png' ? 'png' : formPhotoFile.type === 'image/webp' ? 'webp' : 'jpg';
    const newRef = sRef(storage, `menu-photos/${itemId}-${Date.now()}.${ext}`);
    await uploadBytes(newRef, formPhotoFile);
    const url = await getDownloadURL(newRef);
    // Delete old photo only AFTER new upload succeeded
    if (existingUrl && existingUrl.includes('firebasestorage')) {
        try {
            const oldPath = decodeURIComponent(new URL(existingUrl).pathname.split('/o/')[1]);
            await deleteObject(sRef(storage, oldPath));
        } catch (e) { console.warn('Old photo cleanup failed (non-fatal):', e); }
    }
    return url;
}

// ---------- Variations builder ----------

function renderVariationsBuilder() {
    const wrap = document.getElementById('mmVariations');
    wrap.innerHTML = formVariations.map((g, gi) => `
        <div class="mm-var-group">
            <div class="mm-var-head">
                <input class="mm-input mm-var-type" value="${esc(g.type)}" placeholder="Group name e.g. Size"
                       onchange="mmVarField(${gi}, 'type', this.value)">
                <button class="mm-btn mm-btn-sm mm-btn-danger" onclick="mmRemoveVariationGroup(${gi})">✕ Remove group</button>
            </div>
            <div class="mm-var-config">
                <label>Selection:
                    <select class="mm-select" onchange="mmVarField(${gi}, 'selectionType', this.value)">
                        <option value="single" ${g.selectionType !== 'multiple' ? 'selected' : ''}>Pick one (radio)</option>
                        <option value="multiple" ${g.selectionType === 'multiple' ? 'selected' : ''}>Pick many (checkboxes)</option>
                    </select>
                </label>
                <label>Pricing:
                    <select class="mm-select" onchange="mmVarPricingMode(${gi}, this.value)">
                        <option value="none" ${g.pricingMode === 'none' ? 'selected' : ''}>No price effect</option>
                        <option value="fixed" ${g.pricingMode === 'fixed' ? 'selected' : ''}>Sets the price (₱)</option>
                        <option value="modifier" ${g.pricingMode === 'modifier' ? 'selected' : ''}>Adds/subtracts (±₱)</option>
                        <option value="multiplier" ${g.pricingMode === 'multiplier' ? 'selected' : ''}>Multiplies base price (×)</option>
                    </select>
                </label>
                <label class="mm-check">
                    <input type="checkbox" ${g.required ? 'checked' : ''}
                           onchange="mmVarField(${gi}, 'required', this.checked)"> Required
                </label>
            </div>
            <div class="mm-var-options">
                ${(g.options || []).map((o, oi) => `
                    <div class="mm-var-option">
                        <input class="mm-input" value="${esc(o.label)}" placeholder="Option label"
                               onchange="mmVarOption(${gi}, ${oi}, 'label', this.value)">
                        ${varValueInput(g, o, gi, oi)}
                        <button class="mm-btn mm-btn-sm" onclick="mmRemoveVarOption(${gi}, ${oi})">✕</button>
                    </div>`).join('')}
                <button class="mm-btn mm-btn-sm" onclick="mmAddVarOption(${gi})">+ Add option</button>
            </div>
        </div>
    `).join('') || '<p class="mm-hint">No variations — this item is ordered as-is.</p>';
}

function varValueInput(g, o, gi, oi) {
    if (g.pricingMode === 'fixed')
        return `<input class="mm-input mm-var-val" type="number" min="0" step="0.01" value="${o.price ?? ''}" placeholder="₱ price" onchange="mmVarOption(${gi}, ${oi}, 'price', this.value)">`;
    if (g.pricingMode === 'modifier')
        return `<input class="mm-input mm-var-val" type="number" step="0.01" value="${o.modifier ?? ''}" placeholder="±₱" onchange="mmVarOption(${gi}, ${oi}, 'modifier', this.value)">`;
    if (g.pricingMode === 'multiplier')
        return `<input class="mm-input mm-var-val" type="number" min="0" step="0.01" value="${o.multiplier ?? ''}" placeholder="× base" onchange="mmVarOption(${gi}, ${oi}, 'multiplier', this.value)">`;
    return '<span class="mm-hint mm-var-val">no price</span>';
}

function mmAddVariationGroup() {
    formVariations.push({ type: '', required: false, selectionType: 'single', pricingMode: 'none', options: [{ label: '' }] });
    renderVariationsBuilder();
    renderPricePreview();
}
function mmRemoveVariationGroup(gi) {
    formVariations.splice(gi, 1);
    renderVariationsBuilder();
    renderPricePreview();
}
function mmVarField(gi, field, value) {
    formVariations[gi][field] = value;
    renderPricePreview();
}
function mmVarPricingMode(gi, mode) {
    formVariations[gi].pricingMode = mode;
    // Strip stale value fields when mode changes
    formVariations[gi].options = formVariations[gi].options.map(o => ({ label: o.label }));
    renderVariationsBuilder();
    renderPricePreview();
}
function mmVarOption(gi, oi, field, value) {
    if (field === 'label') formVariations[gi].options[oi].label = value;
    else formVariations[gi].options[oi][field] = value === '' ? null : parseFloat(value);
    renderPricePreview();
}
function mmAddVarOption(gi) {
    formVariations[gi].options.push({ label: '' });
    renderVariationsBuilder();
}
function mmRemoveVarOption(gi, oi) {
    formVariations[gi].options.splice(oi, 1);
    renderVariationsBuilder();
    renderPricePreview();
}

// ---------- Price preview ----------

function renderPricePreview() {
    const el = document.getElementById('mmPricePreview');
    if (!el) return;
    const base = parseFloat(document.getElementById('mmBasePrice')?.value) || 0;
    const rows = [];

    const singleGroups = formVariations.filter(g => g.selectionType !== 'multiple' && g.pricingMode !== 'none' && (g.options || []).length);
    if (!singleGroups.length) {
        rows.push(`Base: ₱${base.toFixed(2)}`);
    } else {
        // Show each option of the first pricing group combined with base
        const g = singleGroups[0];
        for (const o of g.options) {
            if (!o.label) continue;
            let p = base;
            if (g.pricingMode === 'fixed') p = o.price ?? 0;
            if (g.pricingMode === 'modifier') p = base + (o.modifier ?? 0);
            if (g.pricingMode === 'multiplier') p = base * (o.multiplier ?? 1);
            rows.push(`${esc(g.type || 'Option')} — ${esc(o.label)}: ₱${p.toFixed(2)}`);
        }
    }
    const multiMods = formVariations.filter(g => g.selectionType === 'multiple' && g.pricingMode === 'modifier');
    for (const g of multiMods) for (const o of g.options) {
        if (o.label && o.modifier) rows.push(`+ ${esc(o.label)}: ${o.modifier > 0 ? '+' : ''}₱${o.modifier.toFixed(2)}`);
    }
    el.innerHTML = rows.map(r => `<div>${r}</div>`).join('');
}

// ---------- Save ----------

async function mmSaveItem() {
    const errEl = document.getElementById('mmFormError');
    errEl.style.display = 'none';
    const saveBtn = document.getElementById('mmSaveBtn');

    const name = document.getElementById('mmName').value.trim();
    const basePriceRaw = document.getElementById('mmBasePrice').value;
    const basePrice = basePriceRaw === '' ? null : parseFloat(basePriceRaw);
    const station = document.getElementById('mmStation').value;
    const isAvailable = document.getElementById('mmAvailable').checked;
    const categories = [...document.querySelectorAll('.mm-cat-check:checked')].map(c => c.value);

    // Validation
    const problems = [];
    if (!name) problems.push('Name is required.');
    if (!categories.length) problems.push('Pick at least one category.');
    const cleanVariations = [];
    for (const g of formVariations) {
        if (!g.type.trim()) { problems.push('Every variation group needs a name.'); continue; }
        const opts = (g.options || []).filter(o => o.label && o.label.trim());
        if (!opts.length) { problems.push(`Variation "${g.type}" has no options.`); continue; }
        if (g.pricingMode === 'fixed' && opts.some(o => o.price == null)) problems.push(`Variation "${g.type}": every option needs a ₱ price.`);
        if (g.pricingMode === 'modifier' && opts.some(o => o.modifier == null)) problems.push(`Variation "${g.type}": every option needs a ±₱ amount.`);
        if (g.pricingMode === 'multiplier' && opts.some(o => o.multiplier == null)) problems.push(`Variation "${g.type}": every option needs a × multiplier.`);
        cleanVariations.push({
            type: g.type.trim(),
            required: !!g.required,
            selectionType: g.selectionType === 'multiple' ? 'multiple' : 'single',
            pricingMode: g.pricingMode,
            options: opts.map(o => {
                const out = { label: o.label.trim() };
                if (g.pricingMode === 'fixed') out.price = o.price;
                if (g.pricingMode === 'modifier') out.modifier = o.modifier;
                if (g.pricingMode === 'multiplier') out.multiplier = o.multiplier;
                return out;
            })
        });
    }
    if (basePrice == null && !cleanVariations.some(g => g.pricingMode === 'fixed')) {
        problems.push('Item needs either a Base Price or a variation group that sets the price.');
    }
    if (problems.length) {
        errEl.innerHTML = problems.map(esc).join('<br>');
        errEl.style.display = 'block';
        return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
        const isNew = editingItemId === 'new';
        const itemId = isNew
            ? window.firebasePush(window.firebaseRef(window.firebaseDB, 'menu')).key
            : editingItemId;
        const existingUrl = isNew ? null : (menuData[editingItemId]?.photoUrl || null);

        let photoUrl = existingUrl;
        try {
            photoUrl = await uploadPhotoIfAny(itemId, existingUrl);
        } catch (photoErr) {
            console.error('Photo upload failed:', photoErr);
            errEl.textContent = 'Photo upload failed (is Firebase Storage enabled?). The item was saved WITHOUT the new photo — you can retry the photo later.';
            errEl.style.display = 'block';
            photoUrl = formPhotoRemoved ? null : existingUrl;
        }

        const record = {
            name, basePrice, station, isAvailable, categories,
            variations: cleanVariations,
            photoUrl: photoUrl ?? null
        };
        // Preserve fields we don't manage (e.g. emoji from the seed)
        if (!isNew && menuData[editingItemId]?.emoji) record.emoji = menuData[editingItemId].emoji;

        await window.firebaseSet(window.firebaseRef(window.firebaseDB, `menu/${itemId}`), record);

        formPhotoRemoved = false;
        mmCloseItemForm();
    } catch (err) {
        console.error('Save failed:', err);
        errEl.textContent = 'Save failed: ' + err.message;
        errEl.style.display = 'block';
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save Item';
    }
}

// ============================================================
// CATEGORIES TAB
// ============================================================

function renderCategoriesTab() {
    const el = document.getElementById('tabCategories');
    const cats = sortedCategories();

    el.innerHTML = `
        <div class="mm-toolbar">
            <button class="mm-btn mm-btn-primary" onclick="mmAddCategory()">+ Add Category</button>
        </div>
        <table class="mm-table">
            <thead><tr><th>Order</th><th>Name</th><th>Items</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
                ${cats.map((c, i) => {
                    const count = itemCountForCategory(c.id);
                    return `
                    <tr class="${c.isActive === false ? 'mm-inactive' : ''}">
                        <td class="mm-order-cell">
                            <button class="mm-btn mm-btn-sm" ${i === 0 ? 'disabled' : ''} onclick="mmMoveCategory('${esc(c.id)}', -1)">▲</button>
                            <button class="mm-btn mm-btn-sm" ${i === cats.length - 1 ? 'disabled' : ''} onclick="mmMoveCategory('${esc(c.id)}', 1)">▼</button>
                        </td>
                        <td>${esc(c.name)}</td>
                        <td>${count}</td>
                        <td>${c.isActive === false ? '<span class="mm-badge mm-badge-off">Inactive</span>' : '<span class="mm-badge mm-badge-on">Active</span>'}</td>
                        <td class="mm-actions-cell">
                            <button class="mm-btn mm-btn-sm" onclick="mmRenameCategory('${esc(c.id)}')">Rename</button>
                            <button class="mm-btn mm-btn-sm" onclick="mmToggleCategory('${esc(c.id)}')">${c.isActive === false ? 'Reactivate' : 'Deactivate'}</button>
                            <button class="mm-btn mm-btn-sm mm-btn-danger" ${count > 0 ? 'disabled title="Remove or reassign its items first"' : ''}
                                onclick="mmDeleteCategory('${esc(c.id)}')">Delete</button>
                        </td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>
        ${cats.length === 0 ? '<div class="placeholder">No categories yet.</div>' : ''}
    `;
}

async function mmAddCategory() {
    const name = prompt('New category name:');
    if (!name || !name.trim()) return;
    const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!id) return alert('Invalid name.');
    if (categoryData[id]) return alert('A category with that name already exists.');
    const maxOrder = Math.max(0, ...Object.values(categoryData).map(c => c.displayOrder || 0));
    await window.firebaseSet(window.firebaseRef(window.firebaseDB, `categories/${id}`), {
        name: name.trim(), displayOrder: maxOrder + 1, isActive: true
    });
}

async function mmRenameCategory(id) {
    const cat = categoryData[id];
    if (!cat) return;
    const name = prompt('Rename category:', cat.name);
    if (!name || !name.trim() || name.trim() === cat.name) return;
    await window.firebaseUpdate(window.firebaseRef(window.firebaseDB, `categories/${id}`), { name: name.trim() });
}

async function mmToggleCategory(id) {
    const cat = categoryData[id];
    if (!cat) return;
    await window.firebaseUpdate(window.firebaseRef(window.firebaseDB, `categories/${id}`), {
        isActive: cat.isActive === false
    });
}

async function mmDeleteCategory(id) {
    if (itemCountForCategory(id) > 0) return; // guarded in UI too
    const cat = categoryData[id];
    if (!cat) return;
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    await window.firebaseRemove(window.firebaseRef(window.firebaseDB, `categories/${id}`));
}

async function mmMoveCategory(id, dir) {
    const cats = sortedCategories();
    const idx = cats.findIndex(c => c.id === id);
    const swapIdx = idx + dir;
    if (idx < 0 || swapIdx < 0 || swapIdx >= cats.length) return;
    const a = cats[idx], b = cats[swapIdx];
    await window.firebaseUpdate(window.firebaseRef(window.firebaseDB), {
        [`categories/${a.id}/displayOrder`]: b.displayOrder,
        [`categories/${b.id}/displayOrder`]: a.displayOrder
    });
}

// ============================================================
// STYLES
// ============================================================

function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .mm-toolbar { display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:16px; }
        .mm-count { color:#999; font-size:13px; margin-left:auto; }
        .mm-btn { padding:8px 14px; border:1px solid #ddd; background:#fff; border-radius:8px; cursor:pointer; font-size:14px; }
        .mm-btn:hover:not(:disabled) { border-color:#2d5016; color:#2d5016; }
        .mm-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .mm-btn-primary { background:#ff6b35; border-color:#ff6b35; color:#fff; font-weight:bold; }
        .mm-btn-primary:hover:not(:disabled) { background:#e55a28; color:#fff; }
        .mm-btn-danger { color:#e74c3c; }
        .mm-btn-danger:hover:not(:disabled) { border-color:#e74c3c; color:#e74c3c; }
        .mm-btn-sm { padding:5px 9px; font-size:12px; }
        .mm-select, .mm-input { padding:8px 10px; border:1px solid #ddd; border-radius:8px; font-size:14px; }
        .mm-item-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:14px; }
        .mm-item-card { border:1px solid #eee; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; background:#fff; }
        .mm-item-card.mm-inactive { opacity:0.55; }
        .mm-card-img { aspect-ratio:2/1; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
        .mm-card-img img { width:100%; height:100%; object-fit:cover; }
        .mm-card-emoji { font-size:40px; }
        .mm-badge { padding:2px 8px; border-radius:10px; font-size:11px; font-weight:bold; }
        .mm-badge-on { background:#e8f5e9; color:#2d5016; }
        .mm-badge-off { background:#fdecea; color:#e74c3c; position:absolute; top:8px; right:8px; }
        .mm-card-body { padding:10px 12px; flex:1; }
        .mm-card-name { font-weight:bold; color:#2d5016; }
        .mm-card-cats { font-size:12px; color:#999; margin:2px 0 6px; }
        .mm-card-price { font-size:14px; font-weight:bold; }
        .mm-station-tag { font-size:11px; color:#999; font-weight:normal; margin-left:6px; }
        .mm-card-actions { display:flex; gap:6px; padding:8px 12px 12px; }
        .mm-form-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px; }
        .mm-form-header h2 { color:#2d5016; font-size:20px; }
        .mm-form-section { border:1px solid #eee; border-radius:12px; padding:16px; margin-bottom:16px; }
        .mm-form-section h3 { color:#2d5016; font-size:15px; margin-bottom:12px; }
        .mm-label { display:block; margin-bottom:12px; font-size:14px; color:#444; }
        .mm-label .mm-input { display:block; width:100%; max-width:420px; margin-top:4px; }
        .mm-hint { font-size:12px; color:#999; font-weight:normal; }
        .mm-check { display:flex; align-items:center; gap:8px; font-size:14px; margin-bottom:6px; cursor:pointer; }
        .mm-cat-checks { display:grid; grid-template-columns:repeat(auto-fill, minmax(160px, 1fr)); gap:4px; }
        .mm-photo-row { display:flex; gap:16px; align-items:flex-start; flex-wrap:wrap; }
        .mm-photo-preview { width:120px; height:120px; border:1px dashed #ccc; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#bbb; font-size:12px; overflow:hidden; }
        .mm-photo-preview img { width:100%; height:100%; object-fit:cover; }
        .mm-var-group { border:1px solid #e0e0e0; border-radius:10px; padding:12px; margin-bottom:12px; background:#fafafa; }
        .mm-var-head { display:flex; gap:10px; margin-bottom:10px; }
        .mm-var-type { flex:1; max-width:280px; font-weight:bold; }
        .mm-var-config { display:flex; gap:16px; align-items:center; flex-wrap:wrap; margin-bottom:10px; font-size:13px; color:#555; }
        .mm-var-option { display:flex; gap:8px; margin-bottom:6px; align-items:center; }
        .mm-var-option .mm-input:first-child { flex:1; max-width:240px; }
        .mm-var-val { width:110px; }
        .mm-price-preview { font-size:14px; color:#2d5016; line-height:1.8; }
        .mm-error { background:#fdecea; color:#c0392b; padding:12px; border-radius:8px; margin-bottom:12px; font-size:14px; }
        .mm-form-actions { display:flex; gap:10px; }
        .mm-table { width:100%; border-collapse:collapse; font-size:14px; }
        .mm-table th, .mm-table td { text-align:left; padding:10px 8px; border-bottom:1px solid #eee; }
        .mm-table th { color:#999; font-size:12px; text-transform:uppercase; }
        .mm-table tr.mm-inactive td { opacity:0.5; }
        .mm-order-cell { white-space:nowrap; }
        .mm-actions-cell { white-space:nowrap; }
        .mm-actions-cell .mm-btn { margin-right:4px; }
        @media (max-width:600px) {
            .mm-item-grid { grid-template-columns:1fr 1fr; }
            .mm-table { font-size:12px; }
        }
    `;
    document.head.appendChild(style);
}

// ============================================================
// WINDOW EXPOSURE (inline onclick handlers need these — this file
// is a module, so nothing is global by default)
// ============================================================

window.initMenuManagement = initMenuManagement;
window.mmOpenItemForm = mmOpenItemForm;
window.mmCloseItemForm = mmCloseItemForm;
window.mmToggleItem = mmToggleItem;
window.mmDeleteItem = mmDeleteItem;
window.mmSetItemFilterCategory = mmSetItemFilterCategory;
window.mmSetItemFilterStatus = mmSetItemFilterStatus;
window.mmPhotoChosen = mmPhotoChosen;
window.mmRemovePhoto = mmRemovePhoto;
window.mmAddVariationGroup = mmAddVariationGroup;
window.mmRemoveVariationGroup = mmRemoveVariationGroup;
window.mmVarField = mmVarField;
window.mmVarPricingMode = mmVarPricingMode;
window.mmVarOption = mmVarOption;
window.mmAddVarOption = mmAddVarOption;
window.mmRemoveVarOption = mmRemoveVarOption;
window.mmSaveItem = mmSaveItem;
window.mmAddCategory = mmAddCategory;
window.mmRenameCategory = mmRenameCategory;
window.mmToggleCategory = mmToggleCategory;
window.mmDeleteCategory = mmDeleteCategory;
window.mmMoveCategory = mmMoveCategory;
