require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  try {
    console.log('Starting user verification fix...');
    
    const users = await db.collection('users').find({}).toArray();
    
    for (const user of users) {
      const now = new Date();
      const update = {
        $set: {
          emailVerified: user.emailVerified || null,
          isVerified: Boolean(user.emailVerified),
          verifiedAt: user.emailVerified || null,
          role: user.role || 'user',
          updatedAt: now
        }
      };

      await db.collection('users').updateOne(
        { _id: user._id },
        update
      );
      
      console.log(`Updated user: ${user.email}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
