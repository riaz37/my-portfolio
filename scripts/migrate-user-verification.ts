const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  try {
    console.log('Starting user verification migration...');
    
    // Update all existing users to add isVerified and verifiedAt fields
    const result = await db.collection('users').updateMany(
      { 
        $or: [
          { isVerified: { $exists: false } },
          { verifiedAt: { $exists: false } }
        ]
      },
      [
        {
          $set: {
            isVerified: { $cond: [{ $ne: ["$emailVerified", null] }, true, false] },
            verifiedAt: "$emailVerified",
            updatedAt: new Date()
          }
        }
      ]
    );

    console.log(`Migration completed: ${result.modifiedCount} users updated`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
