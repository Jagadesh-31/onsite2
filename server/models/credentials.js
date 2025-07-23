const mongoose = require('mongoose');

var credentialsSchema = new mongoose.Schema({
  userId:{
    type:String,
  },
  name:{
    type:String,
  },
    clientId:{
        type:String,
    },
    clientSecret:{
        type:String,
    },
    grant_type:{
      type:String,
      default:'username email'
    },
    callback:{
      type:String,
    },
    home:{
      type:String,
    }
},{strict:false});


let credentialsModel = mongoose.model('credentials', credentialsSchema);

module.exports = credentialsModel;