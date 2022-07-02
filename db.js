const fs = require('fs')
const {v4: uuidv4} = require('uuid');


class DB {
    filename = 'users.json';

    constructor() {
    }

    checkIfFileExistsElseCreate = () => {
        if (!fs.existsSync(this.filename)) {
            fs.writeFile(this.filename, '[]', (err) => {
                if (err) throw err;
                console.log('The file has been created!');
            });
        }
    }

    findUserWithEmail = (email, callback = (i = null, user = null) => {
    }) => {
        this.checkIfFileExistsElseCreate();
        fs.readFile(this.filename, (err, data) => {
            if (err) throw err;
            const users = JSON.parse(data.toString());

            for (let i = 0; i < users.length; i++) {
                /*console.log(users[i].email + "<-- looping emails")
                console.log(email + " <-- param_mail")*/
                if (users[i].email === email) {
                    callback(i, users[i]);
                    console.log(users[i])
                    return;
                }
            }

            callback(null, null, null);

        });
    }

    logInUser = (user, email, password, callback = (result = null) => {
    }) => {
        this.checkIfFileExistsElseCreate();
        if (user.email === email && user.password === password) {

            callback("success")
            return;
        }
        callback(null);
        return;
    }

    addNewUser = (email, password, callback = (msg = null) => {
    }) => {
        this.checkIfFileExistsElseCreate();
        fs.readFile(this.filename, (err, data) => {
            if (err) throw err;
            const users = JSON.parse(data.toString());

            users.push({
                uid: uuidv4(),
                email: email,
                password: password,
                wallet: 0
            });

            fs.writeFile(this.filename, JSON.stringify(users), err => {
                if (err) throw err;
                if (err) {
                    callback("Error!")
                    return
                } else {
                    callback(email + " Added Successfully!");
                    return

                }
            });
        });

    }

    updateUser = (user, callback = (updatedUser = null, info = null) => {
    }) => {
        this.checkIfFileExistsElseCreate();
        fs.readFile(this.filename, (err, data) => {
            if (err) throw err;

            const users = JSON.parse(data.toString()).map(iteratedUser => {
                return iteratedUser.email === user.email ? user : iteratedUser
            });

            fs.writeFile(this.filename, JSON.stringify(users), err => {
                if (err) throw err;
                if (err) {
                    callback("Error!")
                    return
                } else {
                    callback(user, "User Updated Successfully!");
                    return
                }
            });
        });
    }

    depositAmount = (email, amount, callback = (updatedUser = null, info) => {
    }) => {
        let cur_user;
        this.checkIfFileExistsElseCreate();
        //  this.findUserWithEmail(email, (i, user) => {

        fs.readFile(this.filename, (err, data) => {
            if (err) throw err;

            const users = JSON.parse(data.toString())
            for (let i = 0; i < users.length; i++) {
                if (users[i].email === email) {
                    users[i].wallet = (parseFloat(users[i].wallet) + parseFloat(amount))
                    cur_user=users[i]
                    break

                }
            }

            fs.writeFile(this.filename, JSON.stringify(users), err => {
                if (err) throw err;
                if (err) {
                    callback(null, null)
                    return
                } else {
                    callback(cur_user, `${amount} Deposited Successfully!`);
                    return
                }

            });

        });

    }

    withDrawAmount = (email, amount, callback = (updatedUser = null, info) => {
    }) => {
        this.checkIfFileExistsElseCreate();
        let cur_user;
        fs.readFile(this.filename, (err, data) => {
            if (err) throw err;

            const users = JSON.parse(data.toString())
            for (let i = 0; i < users.length; i++) {
                if (users[i].email === email) {
                    users[i].wallet = (parseFloat(users[i].wallet) - parseFloat(amount))
                    cur_user=users[i]
                    break

                }
            }

            fs.writeFile(this.filename, JSON.stringify(users), err => {
                if (err) throw err;
                if (err) {
                    callback(null, null)
                    return
                } else {
                    callback(cur_user, `${amount} Withdrawn Successfully!`);
                    return
                }

            });

        });

        //})

    }

    sendAmount = (from, to, amount, callback = (updatedUser = null, info = null) => {
    }) => {
        let sender;
        this.checkIfFileExistsElseCreate();
        this.findUserWithEmail(to, (i, user) => { //checking receiver
                if (user !== null)
                    fs.readFile(this.filename, (err, data) => {
                        if (err) throw err;

                        const users = JSON.parse(data.toString())

                        for (let i = 0; i < users.length; i++) {
                            if (users[i].email === from) {
                                if (users[i].email >= amount) {
                                    for (let j = 0; j < users.length; j++)
                                        if (users[j].email === to) {
                                            users[j].wallet = (parseFloat(users[i].wallet) + parseFloat(amount))
                                            users[i].wallet = (parseFloat(users[i].wallet) - parseFloat(amount))
                                            sender=users[i]
                                        }
                                } else {
                                    callback(null, "Low Balance!")
                                    return
                                }
                            }

                        }

                        fs.writeFile(this.filename, JSON.stringify(users), err => {
                            if (err) throw err;
                            if (err) {
                                callback(null, null)
                                return
                            } else {
                                callback(sender, `${amount} sent Successfully!`);
                                return
                            }

                        });

                    });
                else
                    callback(callback(null, "Receiver Not Found"))
                return
            }
        )

    }

}


module.exports = DB
