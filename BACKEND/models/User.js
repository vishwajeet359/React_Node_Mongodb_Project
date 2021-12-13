const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name:{
      type:String,
      require:true
  },
  email:{
      type:String,
      required:true
  },
  password:{
      type:String,
      required:true,
      unique:true
  },
  data:{
      type:Date,
      default:Date.now
  },
  });
  const User = mongoose.model('user',UserSchema);
  module.exports =User;