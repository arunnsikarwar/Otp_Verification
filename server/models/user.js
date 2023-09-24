const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    
    phoneNumber:{
      type: Number,
      required: true,
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type:Date
    },
   createdAt:{
    type: Date,
    default: Date.now(),
   },

  });
  
  
  module.exports = mongoose.model("User", userSchema);