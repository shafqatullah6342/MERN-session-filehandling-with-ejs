const express = require('express');
const bodyParser = require("body-parser")
const ejs = require('ejs');
//const fs = require('fs');
const session = require('express-session');
const db = require('./db');
const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/ATM-DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();

//

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: 'qwerty-uiop-zxvcvbnm',
    resave: false,
    saveUninitialized: true
    //cookie: { maxAge: oneDay },
}));

// ROUTES
require('./routes/login').attachRoutes(app);
require('./routes/register').attachRoutes(app);
require('./routes/deposit').attachRoutes(app);
require('./routes/withdraw').attachRoutes(app);
require('./routes/send').attachRoutes(app);


app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}`);
});
