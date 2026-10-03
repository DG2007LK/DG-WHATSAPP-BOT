const express = require('express');
const app = express();
const __path = process.cwd();
const PORT = process.env.PORT || 8000;
let code = require('./pair'); 

require('events').EventEmitter.defaultMaxListeners = 500;

// 1. මුලින්ම Body Parser සහ Static Middleware දාන්න
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__path, 'public'))); // හෝ express.static('public')

// 2. ඊටපස්සේ Routes දෙන්න
app.use('/code', code);

app.use('/pair', async (req, res, next) => {
    res.sendFile(__path + '/public/index.html');
});

app.use('/', async (req, res, next) => {
    res.sendFile(__path + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`
Don't Forget To Give Star ‼️

Forward By Mr.Supun Fernando 

Server running on http://localhost:` + PORT);
});

module.exports = app;
