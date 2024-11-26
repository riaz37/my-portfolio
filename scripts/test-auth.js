require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');

async function testAuth() {
    try {
        console.log('\nEnvironment Variables Check:');
        console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME);
        console.log('ADMIN_PASSWORD_HASH exists:', !!process.env.ADMIN_PASSWORD_HASH);
        console.log('ADMIN_PASSWORD_HASH length:', process.env.ADMIN_PASSWORD_HASH?.length);
        console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
        console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

        // Test credentials
        const testCredentials = {
            username: 'admin',
            password: 'admin123'
        };

        console.log('\nTesting Authentication:');
        console.log('Test username:', testCredentials.username);
        console.log('Expected username:', process.env.ADMIN_USERNAME);
        console.log('Username match:', testCredentials.username === process.env.ADMIN_USERNAME);

        // Test password
        const isValidPassword = await bcrypt.compare(
            testCredentials.password,
            process.env.ADMIN_PASSWORD_HASH
        );

        console.log('\nPassword Check:');
        console.log('Password valid:', isValidPassword);

        if (!isValidPassword) {
            // Generate a new hash for the test password
            const newHash = await bcrypt.hash(testCredentials.password, 10);
            console.log('\nNew hash generated for reference:');
            console.log(newHash);
        }

    } catch (error) {
        console.error('Error during authentication test:', error);
    }
}

testAuth();
