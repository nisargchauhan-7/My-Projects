// Standalone seeder: initialises the MySQL schema and seeds the Computer Networks template.
// Usage: AI_MODE=live DB_* set, then `npm run seed`.
const db = require('../config/db');

(async () => {
  process.env.FORCE_DB = '1';
  const { connected } = await db.init();
  if (!connected) { console.error('Seed failed: could not connect to MySQL. Check DB_* in .env'); process.exit(1); }
  console.log('Seed complete.');
  process.exit(0);
})();
