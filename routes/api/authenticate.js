/**
 * Created by Chirag on 16-04-2016.
 */
var express = require('express');
var User = require('./../../models/user');
var router = express.Router();

router.post('/', function (req, res, next) {
    var body = req.body;
    User.authenticate(body.email,body.password,function (err, user) {
        if (err)
            res.status(403).json(err);
        else if (!user)
            res.status(403).json({error: {status: 403, message: "User not found!"}});
        else {
            res.json(user);
        }
    });

});
module.exports=router;