//const db = require('../db');
const User = require('../models/Users')

// with File Hanlding
exports.attachRoutes = app => {
    //const obj = new db()
    const route = '/';
    app
        .get(route, (req, res) => {
            if (req.session.user === undefined) {
                res.render('LoginPage', {
                    user: null,
                    info: null
                });
            } else {

                res.redirect('/deposit')
            }

        }).post(route, (req, res) => {
        const {email, password} = req.body;
        User.findOne({email: email}, (err, foundUser) => {
            if (foundUser) {
                User.findOne({email: email, password: password}, (err, foundUser) => {
                    if (foundUser) {
                        //User.where('password').equals(password);
                        req.session.user = foundUser;
                        res.redirect('/deposit');
                    } else {
                        res.render('LoginPage', {
                            user: null,
                            info: "Password Not Match"
                        });
                    }
                })
            } else {
                res.render('LoginPage', {
                    user: null,
                    info: "User Not Found!"
                });
            }
        })
    })
}


/*.post(route, (req, res) => {
    const { email, password } = req.body;
    obj.findUserWithEmail(email, (i, user) => {
        console.log("loginuser"+user)
        if (i !== null) {
            obj.logInUser(user, email, password, (result) => {
                if (result !== null) {
                    req.session.user = user;
                    res.redirect('/deposit');

                } else {

                    res.render('LoginPage', {
                        user: null,
                        info: "Credentials Not Match!"
                    });
                }
            })
        } else {

            res.render('LoginPage', {
                user: null,
                info: "USER NOT EXIST"
            });
        }
    });
});*/


