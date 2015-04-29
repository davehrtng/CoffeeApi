/**
 * Created by David on 4/17/2015.
 */

function prepareOrder(event){
    var orderNumber = event.target.id;
    var uri = "http://localhost:3000/api/orders/status/" + event.target.id;
    var body = {status:"preparing"};
    $.ajax(uri, {
        success: function(){
            location.reload();
        },
        data: JSON.stringify(body),
        dataType: "json",
        type: "PUT",
        contentType: "application/json"
    });
}

function finishOrder(event){
    var orderNumber = event.target.id;
    var uri = "http://localhost:3000/api/orders/status/" + event.target.id;
    var body = {status:"done"};
    $.ajax(uri, {
        success: function(){
            location.reload();
        },
        data: JSON.stringify(body),
        dataType: "json",
        type: "PUT",
        contentType: "application/json"
    });

}