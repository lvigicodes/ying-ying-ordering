const admin = require('firebase-admin');
const path = require('path');
const { menuItems, categoryOrder } = require('./raw-menu-data');
const { convertCategories, convertItems } = require('./convert');

const ENV = process.argv[2];
if (!ENV || !['staging', 'production'].includes(ENV)) {
  console.error('Usage: node seed.js staging|production');
  process.exit(1);
}

const keyFile = path.join(__dirname, `serviceAccountKey.${ENV}.json`);
const serviceAccount = require(keyFile);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}-default-rtdb.asia-southeast1.firebasedatabase.app`
});

const db = admin.database();

async function seed() {
  console.log(`\n🌱 Seeding ${ENV} Firebase...`);

  // Safety guard: refuse if data already exists
  const menuSnap = await db.ref('/menu').once('value');
  const catSnap = await db.ref('/categories').once('value');

  if (menuSnap.exists() || catSnap.exists()) {
    console.error('\n❌ ABORT: /menu or /categories already has data. Refusing to overwrite.');
    console.error('   If you want to re-seed, manually delete /menu and /categories in the Firebase console first.');
    process.exit(1);
  }

  const categories = convertCategories(categoryOrder);
  const items = convertItems(menuItems);

  // Seed categories
  console.log(`\n📂 Seeding ${categories.length} categories...`);
  const catUpdates = {};
  for (const cat of categories) {
    catUpdates[`/categories/${cat.id}`] = {
      name: cat.name,
      displayOrder: cat.displayOrder,
      isActive: cat.isActive
    };
  }
  await db.ref().update(catUpdates);
  console.log('✅ Categories seeded.');

  // Seed menu items
  console.log(`\n🍜 Seeding ${items.length} menu items...`);
  const itemUpdates = {};
  for (const item of items) {
    const { id, ...itemData } = item;
    itemUpdates[`/menu/${id}`] = itemData;
  }
  await db.ref().update(itemUpdates);
  console.log('✅ Menu items seeded.');

  console.log(`\n🎉 Done! ${categories.length} categories + ${items.length} items written to ${ENV} Firebase.`);
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
