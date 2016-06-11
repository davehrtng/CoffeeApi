/**
 * Created by David on 4/16/2015.
 */
var mongoose = require('mongoose');

var paymentSchema = mongoose.Schema({
    orderNumber: Number,
    cardNumber: String,
    expirationDate: String,
    name: String,
    amount: Number
});

paymentSchema.methods.makePublic = function() {
    return {
        // TODO: this URI needs to be relative
        // does this need to be api/payments/orders ?
        uri: "/payments/orders/" + this.orderNumber,
        cardNumber:this.cardNumber,
        expirationDate:this.expirationDate,
        name:this.name,
        amount:this.amount

    };
}

var Payment = mongoose.model('Payment', paymentSchema);

module.exports = {
    Payment: Payment
}
