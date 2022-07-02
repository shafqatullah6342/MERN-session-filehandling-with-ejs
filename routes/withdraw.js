//const db = require('../db');
const User = require('../models/Users')

exports.attachRoutes = app => {
    // const obj = new db();
    const route = '/withdraw';
    app
        .get(route, (req, res) => {
            if (req.session.user) {

                res.render('WithdrawPage', {
                    user: req.session.user,
                    status: null,
                    bg: 0 //red

                });
            } else {
                res.redirect('/');
            }
        })
        .post(route, (req, res) => {
            const {amount, password} = req.body;
            const email = req.session.user.email;
            User.findOne({email: email}, (err, foundUser) => {
                if (foundUser) {
                    User.findOne({email: email, password: password}, (err, matchedUser) => {
                        if (matchedUser) {
                            User.updateOne({email: email}, {wallet: foundUser.wallet - parseInt(amount)}, (err, doc) => {
                                if (err) {
                                    res.render('WithdrawPage', {
                                        user: req.session.user,
                                        status: "" + err, //user not find
                                        bg: 0
                                    });
                                } else {
                                    req.session.user = foundUser
                                    res.render('WithdrawPage', {
                                        user: foundUser,
                                        status: "Amount Deposited Successfully! Your new balance is " + (foundUser.wallet - parseInt(amount)),
                                        bg: 1 //green
                                    });
                                }
                            })

                        } else { // Password isn't matching
                            res.render('WithdrawPage', {
                                user: req.session.user,
                                status: "Password is not matching!", //user not find
                                bg: 0
                            });
                        }
                    })

                } else {
                    res.render('WithdrawPage', {
                        user: req.session.user,
                        status: "User Not Found!", //user not find
                        bg: 0
                    });
                }
            })
        })
};

/*
.post(route, (req, res) => {
            const {amount, password} = req.body;
            const email = req.session.user.email;
            obj.findUserWithEmail(email, (i, user) => {
                if (i !== null) {
                    if (user.password === password) {
                        obj.withDrawAmount(email, amount, (updatedUser, info) => {
                            if (info !== null) {
                                req.session.user = updatedUser
                                //console.log(info);
                                res.render('WithdrawPage', {
                                    user: req.session.user,
                                    status: info,
                                    bg: 1 //green
                                });
                            } else {
                                //console.log("wron");
                                res.render('WithdrawPage', {
                                    user: req.session.user,
                                    status: "Something wrong happened!",
                                    bg: 0 //red
                                });

                            }
                        })

                    } else {
                        console.log("Wrong Password")
                        res.render('DepositPage', {
                            user: req.session.user,
                            status: "Wrong Password!",
                            bg: 0
                        });

                    }
                } else {
                    console.log("User Not Found!")
                    res.render('WithdrawPage    ', {
                        user: req.session.user,
                        status: "User Not Found!", //user not find
                        bg: 0
                    });
                }

            });
        });
 */