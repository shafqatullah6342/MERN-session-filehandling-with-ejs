//const db = require('../db');
const User = require('../models/Users')

exports.attachRoutes = app => {
    // const obj = new db();

    const route = '/deposit';

    app
        .get(route, (req, res) => {
            if (req.session.user) {
                res.render('DepositPage', {
                    user: req.session.user,
                    status: null,
                    bg: 0 //red
                });
            } else {
                res.redirect('/');
            }
        })
        .post(route, (req, res) => {
            const {amount} = req.body;
            const email = req.session.user.email;
            User.findOne({email: email}, (err, foundUser) => {
                if (foundUser) {
                    User.updateOne({email: email}, {wallet: foundUser.wallet + parseInt(amount)}, (err, doc) => {
                            if (err) {
                                res.render('DepositPage', {
                                    user: req.session.user,
                                    status: "" + err,
                                    bg: 0
                                });
                            } else {
                                req.session.user = foundUser
                                res.render('DepositPage', {
                                    user: foundUser,
                                    status: "Amount Deposited Successfully! Your new balance is " + (foundUser.wallet + parseInt(amount)),
                                    bg: 1 //green
                                });
                            }
                        }
                    )
                } else {
                    res.render('DepositPage', {
                        user: req.session.user,
                        status: "User Not Found!",
                        bg: 0
                    });
                }
            })

        });
};
/*

obj.findUserWithEmail(email, (i, user) => {
                if (i !== null) {
                    obj.depositAmount(email, amount, (updatedUser, info) => {
                        if (info !== null) {
                            req.session.user = updatedUser
                            //console.log(info);
                            console.log("Checking Before Headers Sent")
                            console.log(req.session.user);
                            console.log(updatedUser);
                            res.render('DepositPage', {
                                user: updatedUser,
                                status: info,
                                bg: 1 //green
                            });

                        } else {
                            //console.log("wron");
                            res.render('DepositPage', {
                                user: updatedUser,
                                status: "Something wrong happened!",
                                bg: 0 //red
                            });

                        }
                    })

                } else {
                    console.log("User Not Found!")
                    res.render('DepositPage', {
                        user: req.session.user,
                        status: "User Not Found!", //user not find
                        bg: 0
                    });
                }

            });
 */