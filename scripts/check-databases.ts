import { MongoClient } from 'mongodb';

async function checkDatabases() {
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

    // Check both databases
    const portfolioDb = client.db('portfolio');
    const portfolioWebsiteDb = client.db('portfolio-website');

    // Get collections from both databases
    const portfolioCollections = await portfolioDb.listCollections().toArray();
    const portfolioWebsiteCollections = await portfolioWebsiteDb.listCollections().toArray();

    console.log('\n=== Database: portfolio ===');
    for (const collection of portfolioCollections) {
      const count = await portfolioDb.collection(collection.name).countDocuments();
      const sample = await portfolioDb.collection(collection.name).find().limit(1).toArray();
      console.log(`\nCollection: ${collection.name}`);
      console.log(`Documents count: ${count}`);
      if (count > 0) {
        console.log('Sample document:');
        console.log(JSON.stringify(sample[0], null, 2));
      }
    }

    console.log('\n=== Database: portfolio-website ===');
    for (const collection of portfolioWebsiteCollections) {
      const count = await portfolioWebsiteDb.collection(collection.name).countDocuments();
      const sample = await portfolioWebsiteDb.collection(collection.name).find().limit(1).toArray();
      console.log(`\nCollection: ${collection.name}`);
      console.log(`Documents count: ${count}`);
      if (count > 0) {
        console.log('Sample document:');
        console.log(JSON.stringify(sample[0], null, 2));
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

// Run the check
checkDatabases();
