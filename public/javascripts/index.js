/**
 * Created by David on 4/30/2015.
 *
 * Separate all use of jQuery, manual DOM manipulation, and any other non-Angular code here
 */

function getAdditions() {
    var additions = [];
    $.each($(":checkbox:checked"), function(index, checkbox){
        additions.push(checkbox.value);
    });
    return additions;
}

function clearCheckboxes() {
    $.each($(":checkbox:checked"), function(index, checkbox){
       checkbox.checked = false;
    });
}

function getPaymentInformation(orderId){
    var payment = {};
    var cssClass = "payment" + orderId;
    $.each($('input.' + cssClass), function(index, input){
        payment[input.name] = input.value;
    });
    return payment;
}
