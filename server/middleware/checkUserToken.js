/**
 * Created by luca on 20/05/16.
 */

var jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {

    if (req.url == '/api/authentication') {
        return next();
    }
     var token = req.body.token || req.query.token || req.headers['x-access-token'];
        console.log("Token is: "+token);
        if (token) {
            jwt.verify(token, app.get('superSecret'), function(err,decoded) {
                if (err) {
                    return res.status(401).json({success: false, message: 'Failed to authenticate token'});
                } else {
                    console.log("Token verify");
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).json({
                success: false,
                message: 'No token'
            });
        }
};