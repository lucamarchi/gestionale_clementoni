/**
 * Created by luca on 20/05/16.
 */

var jwt = require('jsonwebtoken');
var User = require('./../models/user');

module.exports = function(app, jwt, apiRoutes) {

    apiRoutes.post('/authenticate', function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        if (username && password) {
            User.findByUsername(username)
                .then(function (user) {
                    if (user) {
                        console.log(user)
                        if (!User.checkPassword(password, user.password)) {
                            console.log(User.checkPassword(password, user.password))
                            res.status(401).send({
                                success: false,
                                message: "Password not valid"
                            });
                        } else {
                            var token = jwt.sign({user: user}, app.get('superSecret'), {expiresIn: '24h'});
                            res.status(200).json({
                                status: true,
                                token: token,
                                message: "Token generated",
                                username: user.username,
                                role: user.role
                            });
                        }
                    } else {
                        res.status(401).send({
                            success: false,
                            message: "Login failed"
                        });
                    }
                })
                .catch(function (err) {
                    res.status(401).send({
                        success: false,
                        message: "User or password not found",
                        error: err.message
                    });
                });
        } else {
            res.status(401).send({
                success: false,
                message: "User or password missing",
            });
        }
    });

    apiRoutes.post('/verify', function(req,res,next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, app.get('superSecret'), function(err,decoded) {
                if (err) {
                    return res.status(401).send({
                        status: false,
                        message: 'Failed to authenticate token'
                    });
                } else {
                    return res.status(200).send({
                        status: true,
                        message: 'Token valid'
                    });
                }
            });
        } else {
            return res.status(403).json({
                status: false,
                message: 'No token'
            });
        }
    });

};