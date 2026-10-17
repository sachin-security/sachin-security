import { MongoClient } from "mongodb";

// Defer connecting until an operation needs the database.
const mongoGlobal = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

export default function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured. Configure the database before signing in.");
  if (!mongoGlobal._mongoClientPromise) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
    mongoGlobal._mongoClientPromise = client.connect().catch(error => {
      mongoGlobal._mongoClientPromise = undefined;
      throw error;
    });
  }
  return mongoGlobal._mongoClientPromise;
}
