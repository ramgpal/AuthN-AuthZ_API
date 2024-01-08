const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        // Getting data
        const { name, email, password, role } = req.body;
        // Checking if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User Already Exists',
            });
        }

        // Securing the password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error in hashing the password',
            });
        }

        // Creating entry for the user means entry saving in DB
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        return res.status(200).json({
            success: true,
            message: 'User created successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'User registration failed, please try again later',
        });
    }
};

// Login function
exports.login = async (req, res) => {
    try {
        // Getting data
        const { email, password } = req.body;
        // Validating the email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the details carefully',
            });
        }

        // Checking if user with provided credentials exists in DB or not
        const user = await User.findOne({ email });
        // If not a registered user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User is not registered',
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };

        // Verifying the password
        if (await bcrypt.compare(password, user.password)) {
            // Password match
            let token = jwt.sign(payload, process.env.JWT_SECRET);
            const modifiedUser = user.toObject(); // Creating a new object
            modifiedUser.token = token;
            modifiedUser.password = undefined;

            console.log(modifiedUser);
            // Creating a cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user: modifiedUser,
                message: 'User logged in successfully',
            });

        } else {
            // Password not matched
            return res.status(403).json({
                success: false,
                message: 'Wrong Password',
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Login failure',
        });
    }
};


