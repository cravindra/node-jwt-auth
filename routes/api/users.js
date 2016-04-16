/**
 * Created by Chirag on 16-04-2016.
 */
var express = require('express');
var User = require('./../../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find().then(function(data){
        res.json(data);
    });

});
module.exports=router;