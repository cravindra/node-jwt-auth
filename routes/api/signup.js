/**
 * Created by Chirag on 16-04-2016.
 */
var express = require('express');
var User = require('./../../models/user');
var router = express.Router();

router.post('/', function (req, res, next) {
    var body = req.body;

    User.register(body,function (err, user) {
        if (err)
            res.status(500).json(err);
        else if (!user)
            res.status(500).json({error: {status: 403, message: "User not Created!"}});
        else{
            res.json({user:user});
        }
    });

});
module.exports=router;