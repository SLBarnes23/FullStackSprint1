const express = require('express');
const path = require('path');
const { newToken } = require('./token');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { token: null, error: null }); // Pass error as null
});

app.post('/generate-token', (req, res) => {
    const username = req.body.username;
    if (!username || !/^[a-zA-Z0-9_]+$/.test(username)) {
        res.render('index', { token: null, error: 'Invalid username. Please use only letters, numbers, and underscores.' });
        return;
    }
    const token = newToken(username);
    res.render('index', { token, error: null }); // Pass error as null
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
