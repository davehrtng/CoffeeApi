/**
 * Created by David on 3/27/2015.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('barista');
});

module.exports = router;