const { menuItems, categoryOrder } = require('./raw-menu-data');
const { convertCategories, convertItems } = require('./convert');

const categories = convertCategories(categoryOrder);
const items = convertItems(menuItems);

console.log('\n=== CATEGORIES ===');
console.log(JSON.stringify(categories, null, 2));

console.log('\n=== SPOT CHECK: Lemon Tea ===');
const lemonTea = items.find(i => i.name.toLowerCase().includes('lemon tea'));
console.log(JSON.stringify(lemonTea, null, 2));

console.log('\n=== SPOT CHECK: Roast Duck Mami ===');
const roastDuck = items.find(i => i.name.toLowerCase().includes('roast duck'));
console.log(JSON.stringify(roastDuck, null, 2));

console.log('\n=== SPOT CHECK: Asado Mami ===');
const asado = items.find(i => i.name.toLowerCase().includes('asado'));
console.log(JSON.stringify(asado, null, 2));

console.log(`\n=== SUMMARY: ${items.length} items, ${categories.length} categories ===`);
