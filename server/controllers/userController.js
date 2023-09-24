const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const twilio = require('twilio');
// const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

// Create a Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.signin = async (req,res) => {
    const {phoneNumber} = req.body;

    try{
        // Generate a random OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

        const otpData = new User({
            phoneNumber: phoneNumber,
            otp: otp,
            otpExpiry: otpExpiry,
        });
        await otpData.save();

         // Send the OTP via SMS using Twilio
         await client.messages.create({
            body: `Your OTP for sign-in is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        return res.status(200).json({ message: "OTP sent successfully" });
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Error sending OTP"});
    }
}

exports.verifyOTP = async (req, res) => {
    const { phoneNumber, enteredOTP } = req.body;
    
    try {
        // Find the user document in the database
        const user = await User.findOne({ phoneNumber });

        // Check if the user data exists
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check if the OTP expiry time has passed
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Check if the entered OTP matches the stored OTP
        if (user.otp !== enteredOTP) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        // OTP is valid, you can redirect to the home page or perform further actions
        // For a redirect, you can send a response with a redirection URL
        return res.status(200).json({ message: "OTP Verified Successfully!" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ message: "Error verifying OTP" });
    }
};