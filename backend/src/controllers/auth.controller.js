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
            dp:newUser.dp
         });
      }
      else{
         res.status(400).json({message:"Invalid user data"});
      }
   } catch (error) {
      console.log("error:",error);
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
      if (!email || !password) {
         return res
            .status(400)
            .json({ message: "Input fields needs to be filled to login" });
      }

      const user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({ message: "Invalid credentials" });
      }

      if (user.password === password) {
         return res.status(200).json({ message: "Mubarak ho" });
      }
   } catch (error) {}
};
