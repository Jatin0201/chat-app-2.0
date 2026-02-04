import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const signup = async (req, res) => {
   const { fullname, email, password } = req.body;
   try {
      if (!fullname || !email || !password) {
         return res.status(400).json({ message: "All fields are required" });
      }
      if (password.length < 6) {
         return res
            .status(400)
            .json({ message: "Password length must be greater than 6" });
      }
      //Regex email format verification
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email))
         return res.status(400).json({ message: "Invalid email format" });
      const user = await User.findOne({ email });
      if (user) {
         return res.status(400).json({ message: "Email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
         fullname,
         email,
         password: hashedPassword,
      });
      if (newUser) {
         const savedUser = await newUser.save();
         generateToken(savedUser._id, res);
         res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            dp: newUser.dp,
         });
      } else {
         res.status(400).json({ message: "Invalid user data" });
      }
   } catch (error) {
      console.log("error:", error);
      return res.status(500).json({ message: "Internal Server error" });
   }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const login = async (req, res) => {
   const { email, password } = req.body;
   try {
      const user = await User.findOne({ email });
      if (!user)
         return res.status(400).json({ message: "Invalid credentials" });

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect)
         return res.status(400).json({ message: "Invalid credentials" });

      generateToken(user._id, res);
      res.status(200).json({
         _id: user._id,
         fullname: user.fullname,
         email: user.email,
         profilePic: user.dp,
      });
   } catch (error) {
      console.error("Error in login controller: ",error);
      res.status(500).json({message:"Internal server error"});
   }
};

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const logout = async (_, res) => {
   res.cookie("jwt","",{maxAge:0})
   res.status(200).json({mesasge:"Logged out successfully"})
};
