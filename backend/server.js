// require('dotenv').config();
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const express = require('express');
const passport = require('passport');
const errorHandler = require("./middlewares/errorHandler");

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
      origin: '*',
      methods: ["GET", "POST", "PUT", "PATCH" ,"DELETE", "OPTIONS"],
    })
  );

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


// Routes
const userManagementRoutes= require("./routes/authRoutes")




app.use('/api/v1/auth', userManagementRoutes);




app.use('/', (req, res) => {
    res.send('Welcome to root page\n<a href="/auth/google">click here to login<a>');
});



// Error Handling Middleware
app.use(errorHandler);


// server
const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to ${process.env.NODE_ENV} Database`);
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
}
start()