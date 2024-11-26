const bcrypt = require('bcryptjs');

// Get password from command line argument, or use default
const password = process.argv[2] || 'admin123';

bcrypt.hash(password, 10).then(hash => {
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nTo update your password:');
  console.log('1. Copy the hash above');
  console.log('2. Replace the ADMIN_PASSWORD_HASH value in .env.local with the new hash');
  console.log('3. Restart the development server');
});
