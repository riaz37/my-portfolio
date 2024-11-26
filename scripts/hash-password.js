const bcrypt = require('bcryptjs');

const password = 'admin123';
const saltRounds = 10;

bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) {
        console.error('Error generating salt:', err);
        return;
    }
    
    bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
            console.error('Error generating hash:', err);
            return;
        }
        
        console.log('Password:', password);
        console.log('Salt:', salt);
        console.log('Hash:', hash);
        
        // Verify the hash
        bcrypt.compare(password, hash, function(err, result) {
            if (err) {
                console.error('Error verifying hash:', err);
                return;
            }
            console.log('Verification:', result ? 'PASSED' : 'FAILED');
        });
    });
});
