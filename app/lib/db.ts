// lib/db.ts
import clientPromise from './mongodb';

const DB_NAME = 'sachin-security-01';

export async function getDatabase() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

export async function getCollection(collectionName: string) {
  const db = await getDatabase();
  return db.collection(collectionName);
}
