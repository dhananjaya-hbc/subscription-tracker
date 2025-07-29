import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello subcription tracker!');
});
app.listen(3000, () => {
    console.log('subcription tracker is running on http://localhost:3000');
});

export default app;