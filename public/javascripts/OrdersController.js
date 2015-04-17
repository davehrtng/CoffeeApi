/**
 * Created by David on 4/29/2015.
 */
var app = angular.module('baristaApp');

app.controller('OrdersCtrl', ['$scope', 'orderData', function ($scope, orderData) {
    console.log("orders controller");
    orderData.success(function (data) {
        console.log(JSON.stringify(data));
        $scope.orders = data;
    });
}]);