import { MongoClient } from 'mongodb'
import { Product } from '@/types/products'

const { MONGO_DB_URI, DB_NAME, DB_COLLECTION } = process.env

if (!MONGO_DB_URI) {
  throw new Error('Please define the MONGO_DB_URI environment variable')
}

if (!DB_NAME) {
  throw new Error('Please define the DB_NAME environment variable')
}

if (!DB_COLLECTION) {
  throw new Error('Please define the DB_COLLECTION environment variable')
}

export async function createClientCollection() {
  const client = new MongoClient(MONGO_DB_URI!)
  try {
    await client.connect()

    const db = client.db(DB_NAME)
    return db.collection<Product>(DB_COLLECTION!)
  } catch (error) {
    // TODO: report to Sentry?
    console.error(error)
    throw new Error('Error connecting to the database')
  }
}
