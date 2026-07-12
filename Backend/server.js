// Replace require with import
import express from 'express';

const app = express();
const PORT = 3002;

app.get('/', (req, res) => {
    res.send('Your Node backend is running successfully!');
});

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
