let mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    isAdmin: {type : Boolean, default : false},
    isVerified : {type : Boolean,default : false},
    verificationToken : String,
    resetToken : String,
    bio: { type: String }
});

module.exports = mongoose.model('User',userSchema);

