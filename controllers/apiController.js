const LoginModel = require('../models/loginModel');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const result = await LoginModel.login(username, password);

        if (!result) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        res.status(200).json({ data: result.user, token: result.token });

    } catch (error) {
        console.error('Error in login controller:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};
