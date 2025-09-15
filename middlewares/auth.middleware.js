import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/env.js';

import User from '../models/user.model.js';


const authorize = async (req, res, next) => {
    try {
        let token;
        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } 
        // Check for token in cookies
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        
        if (!token) return res.status(401).json({ message: 'Unauthorized - No token provided' });

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userID);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized - User not found' });
        }

        // Add user info to request object
        req.user = user;
        
        next();
    } catch (error) {
        res.status(401).json({ 
            message: 'Unauthorized', 
            error: error.message 
        });
    }
}

export default authorize;