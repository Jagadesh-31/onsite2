let mongoose = require('mongoose');

let verificationLinkSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  code:{
    type:String,
    required:true,
  },
  expiresAt:{
    type:Date,
    required:true,
  }
},{strict:false})

let verificationLinkModel = new mongoose.model('verificationlink',verificationLinkSchema);

module.exports = verificationLinkModel;