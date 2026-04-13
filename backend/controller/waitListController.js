const waitListModel = require("../Models/waitListSchema");

// adding new user to the waitlist
const addTOwaitlist = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, rtiComplain } = req.body;

        if (!firstName || !email || !phoneNumber || !rtiComplain) {
            return res.status(400).json({ 
                status: "failed",
                error: "Please provide all required fields (firstName, email, phoneNumber, rtiComplain)." });
        }

        const existingUser = await waitListModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                status: "success",
                error: "Email is already on the waitlist." 
            });
        }

        const newUser = new waitListModel({
            firstName,
            lastName,
            email,
            phoneNumber,
            rtiComplain
        });

        await newUser.save();

        res.status(201).json({ 
            status: "success",
            message: "Successfully joined the waitlist!" ,
            entry : newUser
        });


    } catch (error) {
        console.error("Waitlist error:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
}

module.exports = { addTOwaitlist };
