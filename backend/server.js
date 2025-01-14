require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session'); 
const passportConfiguration = require('./utils/passportConfiguration');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// setting up cors
app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:5173',
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


// routes
app.use('/auth', require('./routes/authRoutes'));

app.use('/', (req, res) => {
    res.send('Welcome to root page\n<a href="/auth/google">click here to login<a>');
});

// server
const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected')
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    }
    catch (err) {
        console.log(err);
    }
}
start()