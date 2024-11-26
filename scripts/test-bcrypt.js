const bcrypt = require('bcryptjs');

async function testBcrypt() {
    try {
        console.log('Starting bcrypt test...');
        
        const password = 'admin123';
        console.log('Test password:', password);
        
        // Test hash generation
        console.log('\nGenerating hash...');
        const hash = await bcrypt.hash(password, 10);
        console.log('Generated hash:', hash);
        
        // Test comparison with correct password
        console.log('\nTesting correct password...');
        const validResult = await bcrypt.compare(password, hash);
        console.log('Valid password test:', validResult ? 'PASSED' : 'FAILED');
        
        // Test comparison with wrong password
        console.log('\nTesting wrong password...');
        const invalidResult = await bcrypt.compare('wrongpassword', hash);
        console.log('Invalid password test:', !invalidResult ? 'PASSED' : 'FAILED');
        
        // Test comparison with stored hash
        const storedHash = process.env.ADMIN_PASSWORD_HASH || '$2a$10$zKk84QPDwXAiXcg65B2aUuFocie0fCMjJpe/LsouhBIYxgkk/RENK';
        console.log('\nTesting against stored hash...');
        console.log('Stored hash:', storedHash);
        const storedResult = await bcrypt.compare(password, storedHash);
        console.log('Stored hash test:', storedResult ? 'PASSED' : 'FAILED');
        
    } catch (error) {
        console.error('Error during bcrypt test:', error);
    }
}

testBcrypt();
