import { MongoClient } from 'mongodb';

async function migrateData() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true,
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const portfolioDb = client.db('portfolio');
    const portfolioWebsiteDb = client.db('portfolio-website');

    // Get all collections from portfolio-website
    const collections = await portfolioWebsiteDb.listCollections().toArray();

    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`\nProcessing collection: ${collectionName}`);

      // Get all documents from the source collection
      const documents = await portfolioWebsiteDb.collection(collectionName).find({}).toArray();
      
      if (documents.length === 0) {
        console.log(`No documents found in ${collectionName}`);
        continue;
      }

      console.log(`Found ${documents.length} documents in ${collectionName}`);

      // Check if documents already exist in the target database
      const targetCollection = portfolioDb.collection(collectionName);
      const existingCount = await targetCollection.countDocuments();

      if (existingCount > 0) {
        console.log(`Warning: Target collection ${collectionName} already has ${existingCount} documents`);
        console.log('Skipping to prevent duplicate data. Please handle manually if needed.');
        continue;
      }

      // Insert documents into the target database
      const result = await targetCollection.insertMany(documents);
      console.log(`Successfully migrated ${result.insertedCount} documents to ${collectionName}`);

      // Verify the migration
      const sourceCount = documents.length;
      const newTargetCount = await targetCollection.countDocuments();
      
      if (sourceCount === newTargetCount) {
        console.log(`Migration verified: ${sourceCount} documents successfully transferred`);
      } else {
        console.log('Warning: Document count mismatch after migration');
        console.log(`Source: ${sourceCount}, Target: ${newTargetCount}`);
      }
    }

    console.log('\nMigration completed!');

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await client.close();
  }
}

// Run the migration
migrateData();
