/**
 * Created by David on 3/27/2015.
 */

var express = require('express');
var router = express.Router();
var https = require('https');

var Order = require('../models/order').Order;

/* GET home page. */
router.get('/', function(req, res, next) {
    Order.find({}, function(error, orders){
        if(error){
            res.status(500).send();
        }
        else{
            res.render('barista', {orders: orders});
        }
    });
});

router.get('/new', function(req, res, next){
   res.render('createOrder');
});

module.exports = router;