const mongoose = require('mongoose');

const waitListSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        default: "",
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    rtiComplain: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const waitListModel = mongoose.model("waitListModel", waitListSchema);

module.exports = waitListModel;