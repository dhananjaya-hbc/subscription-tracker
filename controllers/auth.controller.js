import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";


export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const{name,email,password} = req.body;

        const existingUser = await User.findOne({ email }).session(session);

        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create([{name,email,password: hashedPassword}],{ session });

        const token = jwt.sign({userID: newUser[0]._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            user: newUser[0],
        });
    }catch (error) {
        await session.abortTransaction();
     
        next(error);
    } finally {
        session.endSession();
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Add .select('+password') to explicitly retrieve the password hash
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            const error = new Error('Invalid credentials'); // Use a generic error
            error.statusCode = 401;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const error = new Error('Invalid credentials'); // Use a generic error
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userID: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // Manually remove password from the user object before sending it in the response
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            token,
            user,
        });

    }catch (error) {
        next(error);
    }
}
export const signOut = async (req, res, next) => {}