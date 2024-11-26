import { MongoClient } from 'mongodb';

async function checkToken() {
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

    // Check verificationtokens in portfolio database
    const portfolioTokens = await portfolioDb.collection('VerificationToken').find({}).toArray();
    console.log('\nTokens in portfolio database:', portfolioTokens.length);
    for (const token of portfolioTokens) {
      console.log({
        token: token.token,
        type: token.type,
        expires: token.expires,
        userId: token.userId,
      });
    }

    // Check verificationtokens in portfolio-website database
    const portfolioWebsiteTokens = await portfolioWebsiteDb.collection('VerificationToken').find({}).toArray();
    console.log('\nTokens in portfolio-website database:', portfolioWebsiteTokens.length);
    for (const token of portfolioWebsiteTokens) {
      console.log({
        token: token.token,
        type: token.type,
        expires: token.expires,
        userId: token.userId,
      });
    }

    // Check users collection in both databases
    const portfolioUsers = await portfolioDb.collection('users').find({}).toArray();
    console.log('\nUsers in portfolio database:', portfolioUsers.length);
    for (const user of portfolioUsers) {
      console.log({
        id: user._id,
        email: user.email,
        emailVerified: user.emailVerified,
      });
    }

    const portfolioWebsiteUsers = await portfolioWebsiteDb.collection('users').find({}).toArray();
    console.log('\nUsers in portfolio-website database:', portfolioWebsiteUsers.length);
    for (const user of portfolioWebsiteUsers) {
      console.log({
        id: user._id,
        email: user.email,
        emailVerified: user.emailVerified,
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

// Run the check
checkToken();
