import mongoose from 'mongoose';
import dns from 'dns';

// Import models to ensure they are registered
import './models/Project';
import '@/models/Subscriber';

// Use Promise-based DNS lookups
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function establishDatabaseConnection() {
  // If connection is already established, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 60000,
      retryWrites: true,
      retryReads: true,
      ssl: true,
      authSource: 'admin',
    };

    mongoose.set('strictQuery', true);

    try {
      // Connect to MongoDB
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('MongoDB connection established');
        return mongoose.connection;
      }).catch((error) => {
        console.error('MongoDB connection error:', error);
        cached.promise = null;
        throw error;
      });
    } catch (connectionError) {
      console.error('Error initializing MongoDB connection:', connectionError);
      cached.promise = null;
      throw connectionError;
    }
  }

  try {
    // Wait for the connection
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (connectionError) {
    console.error('Failed to establish MongoDB connection:', connectionError);
    throw connectionError;
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

export default establishDatabaseConnection;
export async function connectToDatabase() {
  const conn = await establishDatabaseConnection();
  return conn;
}