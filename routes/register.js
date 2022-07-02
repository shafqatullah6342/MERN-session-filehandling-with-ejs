//const db = require('../db');
const User = require('../models/Users')
const {v4: uuidv4} = require('uuid');

exports.attachRoutes = app => {
    let route = '/register'
    //const obj = new db();

    app
        .get(route, (req, res) => {
            if (req.session.user === undefined) {
                res.render('RegisterPage', {
                    user: null,
                    status: null
                });
            } else {
                res.redirect('/');
            }
        })
        .post(route, (req, res) => {
            const {email, password} = req.body;

            User.findOne({email: email}, (err, foundUser) => {
                if (foundUser) {
                    res.render('RegisterPage', {
                        user: null,
                        status: "Already Exist!"
                    });
                } else { //save
                    new User({
                        uid: uuidv4(),
                        wallet: 0,
                        email: email,
                        password: password
                    }).save(err => {
                        if (err) {
                            res.render('RegisterPage', {
                                user: null,
                                status: err.toString()
                            });
                        } else {
                            res.render('RegisterPage', {
                                user: null,
                                status: "Registered Successfully!"
                            });
                        }
                    });
                }
            })
        })
}

/*obj.findUserWithEmail(email, (i, user) => {
    if (i === null) {
        obj.addNewUser(email, password, (msg) => {
            res.render('RegisterPage', {
                user: null,
                status: msg
            });
        })
    } else {
        res.render('RegisterPage', {
            user: null,
            status: "Already Exist!"
        });
    }

});*/
