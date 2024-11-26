const bcrypt = require('bcryptjs');

// Get password from command line argument, or use default
const password = process.argv[2] || 'admin123';

async function generateAndVerify() {
  console.log('Input password:', password);
  
  // Generate hash
  const hash = await bcrypt.hash(password, 10);
  console.log('\nGenerated hash:', hash);
  
  // Verify the hash works
  const isValid = await bcrypt.compare(password, hash);
  console.log('\nVerification test:', isValid ? 'PASSED' : 'FAILED');
  
  if (!isValid) {
    console.error('ERROR: Hash verification failed!');
    process.exit(1);
  }
  
  console.log('\nTo update your password:');
  console.log('1. Copy the hash above');
  console.log('2. Replace the ADMIN_PASSWORD_HASH value in .env.local with the new hash');
  console.log('3. Restart the development server');
}

generateAndVerify().catch(console.error);
