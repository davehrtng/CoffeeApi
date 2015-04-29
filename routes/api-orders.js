/**
 * Created by David on 3/23/2015.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

var Order = require('../models/order.js').Order;

var orderCounter=0;
Order.count({}, function(err, count){
   orderCounter = count;
});

var notFoundResponse = {
    "statusCode":404,
    "status":"Not Found",
    "message":"The server could not find an order at the specified URI."
};

function validatePostedOrder(requestBody) {
    var errors = [];
    if(!requestBody.hasOwnProperty('cost')) {
        errors.push("Posted data must contain a cost key with a decimal value.");
    }
    if(!requestBody.hasOwnProperty('drink')) {
        errors.push("Posted data must contain a drink key with a text value.");
    }
    return errors;
}

function validateAdditions(requestBody) {
    var errors = [];
    if(!requestBody.hasOwnProperty('additions')){
        errors.push("Posted data must contain an additions key.");
    }
    // TODO: validate that the value is an array of strings
    return errors;
}


router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


/* GET orders listing. */
router.get('/', function(req, res, next) {
    Order.find(function(err, orders) {
        if(err) res.status(500);
        res.status(200).json({'orders':orders.map(function(o) { return o.makePublic();})})
    });
});

/* GET order by ID */
router.get('/:id', function(req, res, next){
    Order.find({orderNumber:req.params.id}, function(err, orders){
        if(err) {
            res.status(500);
        } else if(orders.length===0){
            res.status(404).json(notFoundResponse);
        } else {
            res.status(200).json(
                {
                    'orders': orders.map(function (o) {
                        return o.makePublic()
                    })
                });
        }
    })
});

/* POST a new order*/
router.post('/', function(req, res, next) {
    var errors = validatePostedOrder(req.body);
    if(errors.length===0) {
        console.log(orderCounter);
        orderCounter++;
        var newOrder = new Order({
            orderNumber: orderCounter,
            status: "preparing",
            drink: req.body.drink,
            cost: req.body.cost,
            additions: []
        });
        console.log(newOrder);
        newOrder.save(function (err) {
            if (err) res.status(500);
            res.status(201).json({'orders': [newOrder.makePublic()]});
        });
    }
    else {
        res.status(400).json({
                                "errors":errors,
                                "statusCode":400,
                                "status":"Bad Request",
                                "message":"The request could not be understood by the server due to malformed syntax. " +
                                "The client SHOULD NOT repeat the request without modifications."
                            });
    }
});

/*PUT additions on an order
* id of the order to be ammended is parameterized URI
* body should be json containing "additions":[Array of Strings]
* Appends all additions to the existing additions array (does not overwrite previous additions).
* */
router.put('/additions/:id', function(req, res, next){
    if(!req.body.hasOwnProperty('additions')){
        req.status(400).send();
    }
    Order.findOneAndUpdate({orderNumber: req.params.id}, {$push: {additions: {$each: req.body.additions}}}, {new: true}, function (err, order) {
        if (err) res.status(500).send();
        if (order) {
            res.status(200).json({
                "orders": [order.makePublic()]
            });
        } else {
            res.status(404).json(notFoundResponse);
        }
    });
});

/*PUT update the status of an order */
router.put('/status/:id', function(req, res, next){
    if(!req.body.hasOwnProperty('status')){
        res.status(400).send();
    }
    Order.findOneAndUpdate({orderNumber: req.params.id}, {$set: {status: req.body.status}}, {new: true}, function (error,order) {
        if (error) res.status(500).send();
        if (order) {
            res.status(200).json({
                "orders": [order.makePublic()]
            });
        } else {
            res.status(404).json(notFoundResponse);
        }
    });
});

/* DELETE order with specified orderNumber */
router.delete('/:id', function(req, res, next){
  Order.remove({orderNumber:req.params.id}, function(error, numberRemoved){
      if(error){
          res.status(500).send()
      } else if(numberRemoved.result.n===0){
          res.status(404).json(notFoundResponse);
      } else {
          res.status(204).send();
      }
  });
});

module.exports = router;
