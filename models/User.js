const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please add a valid email']
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Librarian', 'Student']
    },
    dob: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
    //check if the password is  modified
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(13);
    this.password = await bcrypt.hash(this.password, salt);
});

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        {
            id: this._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    );
};

//Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    const res = await bcrypt.compare(enteredPassword, this.password);
    return res;
};

module.exports = mongoose.model('User', UserSchema);
