import express from 'express';

import { PORT } from './config/env.js';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello subcription tracker!');
});
app.listen(PORT, () => {
    console.log(`subcription tracker is running on http://localhost:${PORT}`);
});

export default app;