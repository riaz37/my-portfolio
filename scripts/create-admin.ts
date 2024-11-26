import { config } from 'dotenv';
import { createInterface } from 'readline/promises';
import { MongoClient } from 'mongodb';
import { hash } from 'bcryptjs';

// Load environment variables
config({ path: '.env.local' });

async function createAdmin() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    console.log('\n🔐 Admin User Creation\n');

    const email = await rl.question('Enter admin email: ');
    const password = await rl.question('Enter admin password: ');
    const adminKey = process.env.ADMIN_CREATION_KEY;

    if (!adminKey) {
      console.error('❌ ADMIN_CREATION_KEY not found in environment variables');
      process.exit(1);
    }

    console.log('\nCreating admin user...');

    // Connect directly to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('portfolio');

    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({
      email,
      role: 'admin'
    });

    if (existingAdmin) {
      console.error('\n❌ Admin user already exists');
      await client.close();
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create admin user
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      role: 'admin',
      name: 'Admin',
      emailVerified: new Date(),
      isVerified: true,
      verifiedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await client.close();

    console.log('\n✅ Admin user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log('\nYou can now sign in with these credentials at /auth/signin\n');
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : 'Unknown error occurred');
  } finally {
    rl.close();
  }
}

createAdmin();
