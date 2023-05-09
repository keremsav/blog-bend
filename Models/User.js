let mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    isAdmin: {type : Boolean, default : false},
    bio: { type: String }
});

module.exports = mongoose.model('User',userSchema);

