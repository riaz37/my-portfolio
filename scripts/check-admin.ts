require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkAdmin() {
    const uri = process.env.MONGODB_URI || "mongodb+srv://riaz37ipe:Shuvo302001@portfolio.kbc6t.mongodb.net/portfolio";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db();
        
        // Find user by email
        const user = await db.collection('users').findOne({ 
            email: 'riaz37.ipe@gmail.com' 
        });
        
        if (user) {
            console.log('User found:');
            console.log('Email:', user.email);
            console.log('Role:', user.role);
            console.log('Created At:', user.createdAt);

            // Update user to admin if role is missing
            if (!user.role) {
                await db.collection('users').updateOne(
                    { _id: user._id },
                    { 
                        $set: { 
                            role: 'admin',
                            isVerified: true,
                            emailVerified: new Date(),
                            verifiedAt: new Date(),
                            updatedAt: new Date()
                        } 
                    }
                );
                console.log('Updated user to admin role');
            }
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        process.exit(0);
    }
}

checkAdmin();
