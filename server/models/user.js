const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
},{strict:false});


let userModel = mongoose.model('users', userSchema);

module.exports = userModel;