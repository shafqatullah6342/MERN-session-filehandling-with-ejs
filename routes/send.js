const db = require('../db');
const User = require("../models/Users");

exports.attachRoutes = app => {
    const obj = new db();

// to, password, send_amount

    const route = '/send';


    app
        .get(route, (req, res) => {
            if (req.session.user) {

                res.render('SendPage', {
                    user: req.session.user,
                    status: null,
                    bg: 0 //red
                });
            } else {
                res.redirect('/');
            }
        })
        .post(route, (req, res) => {
            const {to, password, send_amount} = req.body;
            const sess_email = req.session.user.email; //sender email
            User.findOne({email: sess_email}, (err, foundUser) => {
                    if (foundUser) {
                        User.findOne({email: to}, (err, toUser) => {
                                if (toUser) {
                                    User.findOne({email: sess_email, password: password}, (err, matchedUser) => {
                                            if (matchedUser) {
                                                User.updateOne({email: sess_email}, {wallet: foundUser.wallet - parseInt(send_amount)}, (err, doc) => { //<-- update sender
                                                        if (err) {
                                                            res.render('SendPage', {
                                                                user: req.session.user,
                                                                status: "" + err, //user not find
                                                                bg: 0
                                                            });
                                                        } else {
                                                            User.updateOne({email: to}, {wallet: toUser.wallet + parseInt(send_amount)}, (err, doc) => { // <-- update receiver
                                                                if (err)
                                                                    console.log(err + "")
                                                            })
                                                            req.session.user = foundUser
                                                            res.render('SendPage', {
                                                                user: foundUser,
                                                                status: "Amount Sent Successfully! Your new balance is " + (foundUser.wallet - parseInt(send_amount)),
                                                                bg: 1 //green
                                                            });
                                                        }
                                                    }
                                                )

                                            } else { // Password isn't matching
                                                res.render('SendPage', {
                                                    user: req.session.user,
                                                    status: "Password is not matching!", //user not find
                                                    bg: 0
                                                });
                                            }
                                        }
                                    )

                                } else { // Password isn't matching
                                    res.render('SendPage', {
                                        user: req.session.user,
                                        status: "Receiver id not found!", //user not find
                                        bg: 0
                                    });
                                }
                            }
                        )

                    } else {
                        res.render('SendPage', {
                            user: req.session.user,
                            status: "Sender Not Found!", //user not find
                            bg: 0
                        });
                    }
                }
            )
        })
    ;
}
;

/*
.post(route, (req, res) => {
            const {to, password, send_amount} = req.body;
            const email = req.session.user.email; //sender email
            //console.log(email+"emial")
            obj.findUserWithEmail(email, (i, user) => { //check Sender
                if (i !== null) {
                    if (user.password === password) {
                        obj.sendAmount(email, to, send_amount, (updatedUser, info) => {
                            if (updatedUser !== null) {
                                req.session.user = updatedUser
                                //console.log(info);
                                res.render('SendPage', {
                                    user: req.session.user,
                                    status: info,
                                    bg: 1 //green
                                });
                            } else {
                                //console.log("wron");
                                res.render('SendPage', {
                                    user: req.session.user,
                                    status: info,
                                    bg: 0 //red
                                });

                            }
                        })

                    } else {
                        console.log("Wrong Password")
                        res.render('SendPage', {
                            user: req.session.user,
                            status: "Wrong Password!",
                            bg: 0
                        });

                    }
                } else {
                    console.log("User Not Found!")
                    res.render('SendPage', {
                        user: req.session.user,
                        status: "User Not Found!", //user not find
                        bg: 0
                    });
                }

            });
        });
        */