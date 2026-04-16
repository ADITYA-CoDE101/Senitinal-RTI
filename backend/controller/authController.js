const userModel = require("../Models/userSchema");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');   

const registerUser = async (req, res) => {
    try {
        
        const { name, email, password } = req.body;

        if (!name || !email || !HasedPassword) {
            return res.status(400).json({ 
                status: "failed",
                error: "Please provide all required fields (name, email, password)." });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                status: "failed",
                error: "Email is already registered." 
            });
        }

        const HasedPassword = await bcrypt.hash(password, 'sjjsbdfjsdfj'); // Hash the password with a salt

        const newUser = new userModel({
            name,
            email,
            HasedPassword
        });

        await newUser.save();

        res.status(201).json({
            status: "success",
            message: "User registered successfully!",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {

        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
}

module.exports = { registerUser };