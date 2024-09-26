const exe = require('../db'); // Adjust path as per your project structure
const bcrypt = require('bcrypt');
const { generateToken } = require('../jwt'); // Assuming you have a utility function for token generation

class LoginModel {
    static async login(username, password) {
        try {
            const sql = await exe('SELECT * FROM users WHERE email = ?', [username]);

            if (sql.length === 0) {
                return null; // User not found
            }

            const user = sql[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return null; // Incorrect password
            }

            const payload = {
                phone: user.phone,
                email: user.email
            };

            const token = generateToken(payload);
            return { user, token }; // Return user data and token
        } catch (error) {
            console.error('Error during login:', error);
            throw error; // Propagate error for handling in controller
        }
    }
}

module.exports = LoginModel;
