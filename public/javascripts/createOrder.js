/**
 * Created by David on 3/30/2015.
 */
function createOrder(){
    var drinkText = $("#drinkInput").val();
    var costText = $("#costInput").val();

    $.post('localhost:3000/api/orders'
        , {drink:drinkText, cost:costText}
        , function(data){
            console.log(data);
        }
        , "json"
    );
}