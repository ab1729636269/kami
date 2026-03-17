import { initDatabase } from '../models';

async function initDb() {
  await initDatabase();
}

export default initDb;