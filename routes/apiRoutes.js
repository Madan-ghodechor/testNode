const express = require('express');
const router = express.Router();
const exe = require('./../db');
const bcrypt = require('bcrypt');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');

const apiController = require('../controllers/apiController');
const authController = require('../controllers/authController');

router.post("/register", async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        if (!username || !email || !password || !phone) {
            return res.status(400).json({ "message": "All fields are required" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save the user to the database
        const sql = await exe('INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, phone]);

        res.status(201).json({ "message": "User registered successfully" });

    } catch (err) {
        console.log("error:" + err);
        res.status(500).json({ "message": "Internal server error" });
    }
});

// router.post("/login", async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         if (!username || !password) {
//             return res.status(400).json({ "message": "Username and password required" });
//         }

//         const sql = await exe('SELECT * FROM users WHERE email = ?', [username]);

//         if (sql.length === 0) {
//             return res.status(401).json({ "message": "Invalid username or password" });
//         }

//         const user = sql[0];
//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (!passwordMatch) {
//             return res.status(401).json({ "message": "Invalid username or password" });
//         }

//         const payload = {
//             phone: user.phone,
//             email: user.email
//         };

//         const token = generateToken(payload);
//         res.status(200).json({ data: user, token: token });

//     } catch (err) {
//         console.log("error:" + err);
//         res.status(500).json({ "message": "Internal server error" });
//     }
// });

// router.post("/login", apiController.getLogin );

router.post('/login', authController.login);

router.get("/", async (req, res) => {
    res.send({ status: 200, msg: "routes are working" });
});

router.post("/getData", jwtAuthMiddleware, async (req, res) => {
    res.status(200).json({ error: 'Data Accessed' });
});

module.exports = router;
