// Converts raw menu data from menu.html format to the Firebase schema.

/**
 * Convert category name to slug.
 * e.g. "Dim Sum" -> "dim-sum", "Fried Rice" -> "fried-rice"
 */
function toSlug(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Infer station from category slug when item has no explicit station field.
 */
function inferStation(categorySlug) {
    const upperCategories = ['dimsum', 'appetizers', 'congee', 'noodles', 'mami', 'roasting'];
    const lowerCategories = ['drinks', 'extras', 'sauces'];
    if (upperCategories.includes(categorySlug)) return 'upper';
    if (lowerCategories.includes(categorySlug)) return 'lower';
    return 'upper';
}

/**
 * Convert an array-style variations list (e.g. [{size, price}, ...])
 * into a single VariationGroup with pricingMode "fixed".
 */
function convertArrayVariations(arr) {
    return [{
        type: 'Size',
        required: true,
        selectionType: 'single',
        pricingMode: 'fixed',
        options: arr.map(v => ({ label: v.size, price: v.price }))
    }];
}

/**
 * Convert an object-style variations map (e.g. { temperature: [...], addons: [...] })
 * into an array of VariationGroups.
 */
function convertObjectVariations(variationsObj) {
    const groups = [];

    for (const [key, opts] of Object.entries(variationsObj)) {
        const keyLower = key.toLowerCase();

        if (keyLower === 'temperature') {
            // Fixed pricing, single required selection
            groups.push({
                type: 'Temperature',
                required: true,
                selectionType: 'single',
                pricingMode: 'fixed',
                options: opts.map(o => ({ label: o.name, price: o.price }))
            });

        } else if (keyLower === 'flavor' || keyLower === 'flavors') {
            // Fixed pricing if options have a price field
            const hasPrice = opts.some(o => o.price != null);
            groups.push({
                type: 'Flavor',
                required: true,
                selectionType: 'single',
                pricingMode: hasPrice ? 'fixed' : 'none',
                options: hasPrice
                    ? opts.map(o => ({ label: o.name, price: o.price }))
                    : opts.map(o => ({ label: o.name }))
            });

        } else if (keyLower === 'size' || keyLower === 'portion') {
            // Fixed pricing if options have a price field; modifier/multiplier otherwise
            const hasPrice = opts.some(o => o.price != null);
            const hasModifier = opts.some(o => o.priceModifier != null);
            groups.push({
                type: 'Size',
                required: true,
                selectionType: 'single',
                pricingMode: hasPrice ? 'fixed' : (hasModifier ? 'modifier' : 'none'),
                options: hasPrice
                    ? opts.map(o => ({ label: o.name, price: o.price }))
                    : hasModifier
                        ? opts.map(o => ({ label: o.name, modifier: o.priceModifier }))
                        : opts.map(o => ({ label: o.name }))
            });

        } else if (keyLower === 'noodle') {
            // Noodle type — modifier pricing (all 0 in current data)
            groups.push({
                type: 'Noodle',
                required: true,
                selectionType: 'single',
                pricingMode: 'modifier',
                options: opts.map(o => ({ label: o.name, modifier: o.priceModifier }))
            });

        } else if (keyLower === 'style') {
            // Style (e.g. Original / Toasted) — modifier pricing, optional
            groups.push({
                type: 'Style',
                required: false,
                selectionType: 'single',
                pricingMode: 'modifier',
                options: opts.map(o => ({ label: o.name, modifier: o.priceModifier }))
            });

        } else if (keyLower === 'addons' || keyLower === 'extras') {
            // Add-ons — modifier pricing, multiple optional selections
            groups.push({
                type: 'Add-ons',
                required: false,
                selectionType: 'multiple',
                pricingMode: 'modifier',
                options: opts.map(o => ({ label: o.name, modifier: o.priceModifier }))
            });

        } else {
            // Unknown key — fall back to "none" pricingMode
            groups.push({
                type: key,
                required: false,
                selectionType: 'single',
                pricingMode: 'none',
                options: opts.map(o => ({ label: o.name || o.size || String(o) }))
            });
        }
    }

    return groups;
}

/**
 * Convert the categoryOrder array into /categories Firebase documents.
 * Returns an array of { id, name, displayOrder, isActive }.
 */
function convertCategories(categoryOrder) {
    return categoryOrder.map((name, index) => ({
        id: toSlug(name),
        name,
        displayOrder: index + 1,
        isActive: true
    }));
}

/**
 * Convert the raw menuItems array into /menu Firebase documents.
 * Returns an array of converted item objects (each with an `id` field = item.id).
 */
function convertItems(menuItems) {
    return menuItems.map(item => {
        const categorySlug = toSlug(item.category);
        const station = item.station || inferStation(categorySlug);

        let variations = [];
        if (item.variations) {
            if (Array.isArray(item.variations)) {
                variations = convertArrayVariations(item.variations);
            } else if (typeof item.variations === 'object') {
                variations = convertObjectVariations(item.variations);
            }
        }

        return {
            id: item.id,
            name: item.name,
            basePrice: item.price !== undefined ? item.price : null,
            station,
            photoUrl: null,
            isAvailable: true,
            categories: [categorySlug],
            variations
        };
    });
}

module.exports = { convertCategories, convertItems };
