import express from 'express';

import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subcription.routes.js';


const app = express();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscription', subscriptionRouter);


app.get('/', (req, res) => {
    res.send('Hello subcription tracker!');
});
app.listen(PORT, () => {
    console.log(`subcription tracker is running on http://localhost:${PORT}`);
});

export default app;