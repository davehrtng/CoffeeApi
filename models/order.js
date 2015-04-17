/**
 * Created by David on 4/16/2015.
 */
var mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    orderNumber: Number,
    status: String,
    drink: String,
    cost: Number,
    additions: [String]
});

orderSchema.methods.makePublic = function() {
    return {
        uri: "localhost:3000/orders/" + this.orderNumber,
        status:this.status,
        drink:this.drink,
        cost:this.cost,
        additions:this.additions

    };
}

var Order = mongoose.model('Order', orderSchema);

module.exports = {
    Order: Order
}