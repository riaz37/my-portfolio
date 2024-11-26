require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  try {
    console.log('Starting user fields update...');
    
    // Get all users
    const users = await db.collection('users').find({}).toArray();
    
    for (const user of users) {
      const now = user.createdAt || new Date();
      
      // Prepare the update
      const update = {
        $set: {
          email: user.email,
          password: user.password,
          role: user.role || 'user',
          name: user.name,
          emailVerified: user.emailVerified || null,
          isVerified: user.isVerified || Boolean(user.emailVerified),
          verifiedAt: user.verifiedAt || user.emailVerified || null,
          createdAt: user.createdAt || now,
          updatedAt: user.updatedAt || now
        },
        // Remove any fields that shouldn't be there
        $unset: {
          image: "",
          __v: "",
          // Add any other fields that need to be removed
        }
      };

      // Update the user
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
