import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';

// Middleware
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';

// Routers
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subcription.routes.js';

const app = express();

// Apply global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

// --- Define Routes BEFORE error middleware ---
app.get('/', (req, res) => {
    res.send('Hello subcription tracker!');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscription', subscriptionRouter);

// Apply final error handling middleware
app.use(errorMiddleware);

// --- Robust Server Startup ---
const startServer = async () => {
    try {
        // 1. Connect to the database first
        await connectToDatabase();

        // 2. If connection is successful, start the server
        app.listen(PORT, () => {
            console.log(`subcription tracker is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database. Server will not start.", error);
        process.exit(1); // Exit if DB connection fails
    }
};

// Start the application
startServer();

export default app;