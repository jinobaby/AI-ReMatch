var express = require('express');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var cors = require('cors');

var app = express();

dotenv.config();

mongoose.connect(process.env.MongoDB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    })



// Middleware
app.use(express.json());
app.use(cors());

var AdminRouter = require('./src/routes/AdminRouter');
var UserRouter = require ('./src/routes/UserRouter');


app.use('/Admin', AdminRouter);
app.use('/User', UserRouter)

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
