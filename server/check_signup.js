const axios = require('axios');

(async () => {
    try {
        const res = await axios.post('http://localhost:4050/api/v1/auth/signup', {
            firstName: "Test",
            lastName: "User",
            email: "testuser@example.com",
            password: "password123",
            accountType: "User"
        });
        console.log("SUCCESS:", res.data);
    } catch (err) {
        console.log("ERROR:", err.response ? err.response.data : err.message);
    }
})();
