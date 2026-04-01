
// src/models/Basket.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,       // No two users can have the same email
        lowercase: true,    //always store email in lowercase to avoid duplicates
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    favouriteStations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FuelStation'
    }]
}, {
    timestamps: true
});

// Middleware to hash password before saving user
userSchema.pre('save', async function(next) {
    // Hash the password before saving
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
// Important: module.exports
module.exports = mongoose.model('User', userSchema);
