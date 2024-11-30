import mongoose from 'mongoose';
import dns from 'dns';

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

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 60000, // Increased timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 60000, // Increased timeout
      retryWrites: true,
      retryReads: true,
      ssl: true,
      authSource: 'admin',
      directConnection: false,
    };

    mongoose.set('strictQuery', true);

    try {
      // Attempt DNS resolution before connecting
      const hostname = new URL(MONGODB_URI).hostname;
      try {
        await new Promise((resolve, reject) => {
          dns.resolve4(hostname, (err, addresses) => {
            if (err) {
              console.error('DNS resolution failed:', err);
              reject(err);
            } else {
              console.log('DNS resolution successful:', addresses);
              resolve(addresses);
            }
          });
        });
      } catch (dnsError) {
        console.error('DNS lookup failed:', dnsError);
        // Continue anyway as MongoDB driver has its own DNS resolution
      }

      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('Successfully connected to MongoDB');
          return mongoose;
        })
        .catch((error) => {
          console.error('MongoDB connection error:', {
            name: error.name,
            message: error.message,
            cause: error.cause,
            code: error.code
          });
          cached.promise = null;
          throw error;
        });
    } catch (error) {
      console.error('Error initializing MongoDB connection:', error);
      cached.promise = null;
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error('Error establishing MongoDB connection:', error);
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', {
    name: err.name,
    message: err.message,
    code: err.code
  });
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB connection reestablished');
});

// Clean up on app termination
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  }
});

export default connectToDatabase;
export { connectToDatabase };