import fetch from 'node-fetch';

const createAdmin = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/auth/create-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'riaz37.ipe@gmail.com',
                password: 'Shuvo302001',
                secretKey: '99899a00874c75586c1c6f6f9d8b331e5932a17e8418229949854f335b79c235'
            }),
        });

        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

createAdmin();
