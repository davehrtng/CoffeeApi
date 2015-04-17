/**
 * Created by David on 4/16/2015.
 */

/**
 * Created by David on 3/23/2015.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

var Payment = require('../models/payment').Payment;
var Order = require('../models/order').Order;

var notFoundResponse = {
    "statusCode":404,
    "status":"Not Found",
    "message":"The server could not find an order at the specified URI."
};

function validatePostedPayment(requestBody) {
    var errors = [];
    // validate the parameters of the json body
    // we need to have a cardNumber, amount, name, and expiration date
    if(!requestBody.hasOwnProperty('cardNumber')) {
        errors.push("Posted data must contain a cardNumber key with a string value.");
    }
    if(!requestBody.hasOwnProperty('name')) {
        errors.push("Posted data must contain a name key with a string value.");
    }
    if(!requestBody.hasOwnProperty('expirationDate')) {
        errors.push("Posted data must contain an expirationDate key with a string value.");
    }
    return errors;
}

/* POST a new payment*/
router.post('/orders/:id', function(req, res, next) {
    console.log("inside post payment");
    var errors = validatePostedPayment(req.body);
    // validate the order number this payment is associated with
    Order.find({orderNumber:req.params.id}, function(error, orders){
        if(error){
            errors.push("SERVER ERROR: something went wrong retrieving order " + reqParams.id + " from the database.");
        } else if(orders.length===0){
            errors.push("There is no order with order number " + reqParams.id + ".");
        }
        if(errors.length===0) {
            var order = orders[0];
            var newPayment = new Payment({
                orderNumber: order.orderNumber,
                cardNumber: req.body.cardNumber,
                expirationDate: req.body.expirationDate,
                amount: order.cost,
                name: req.body.name
            });
            console.log(newPayment);
            newPayment.save(function (err) {
                if (err){
                    res.status(500).send();
                } else {
                    order.status = "paid";
                    order.save(function(error){
                        if(error){
                            res.status(500).send();
                        } else {
                            res.status(201).json({'payments': [newPayment.makePublic()]});
                        }
                    });
                }
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
});

/* GET all payments */
router.get('/', function(req, res, next) {
   Payment.find({}, function(error, payments){
     if(error){
         res.status(500).send();
     } else {
         res.status(200).json({
             'payments':payments.map(function(p){
                 return p.makePublic();
             })
         });
     }
   });
});

/* GET payment by order id */
router.get('/orders/:id', function(req, res, next) {
   Payment.find({orderNumber:req.params.id}, function(error, payments){
      if(error){
          res.status(500).send();
      } else {
          if(payments.length==0){
              res.status(404).json(notFoundResponse);
          } else {
              res.status(200).json({
                 'payments':payments.map(function(p){
                     return p.makePublic();
                 })
              });
          }
      }
   });
});

function createUpdateDocument(reqBody) {
    var doc = {};

    if(reqBody.hasOwnProperty('name')){
        doc.name = reqBody.name;
    }
    if(reqBody.hasOwnProperty('cardNumber')){
        doc.cardNumber = reqBody.cardNumber;
    }
    if(reqBody.hasOwnProperty('expirationDate')){
        doc.expirationDate = reqBody.expirationDate;
    }
    if(reqBody.hasOwnProperty('amount')){
        doc.amount = reqBody.amount;
    }

    return doc;
}

/* PUT update a payment by id*/
router.put('/orders/:id', function(req, res, next) {
    var update = createUpdateDocument(req.body);
    console.log(update);
    Payment.findOneAndUpdate({orderNumber:req.params.id}, {$set: update}, {new:true}, function(error, payment){
        if(error) {
            res.status(500).send();
        }
        else if(payment) {
            res.status(200).json({
                "payments": [payment.makePublic()]
            });
        }
        else {
            res.status(404).json(notFoundResponse);
        }
    });
});

router.delete('/orders/:id', function(req, res, next){
    Payment.remove({orderNumber:req.params.id}, function(error, numberRemoved){
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
