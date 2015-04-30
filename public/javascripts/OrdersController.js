/**
 * Created by David on 4/29/2015.
 */
var app = angular.module('baristaApp');

app.controller('OrdersCtrl', ['$scope', '$http', 'orderService', function ($scope, $http, orderService) {

    $scope.getOrders = function(){
       orderService.get().success(function(data){
           $scope.orderArray = data.orders;
       });
    };

    $scope.getOrders();

    $scope.newOrder = {};

    $scope.createOrder = function(){
        $http.post('http://localhost:3000/api/orders', JSON.parse($scope.newOrder))
            .success(function(data, status, header, config){
                $scope.getOrders();
            })
            .error(function(data, status, header, config){
                console.log(data);
            });
    }

    $scope.assignOrder = function(uri) {
        var data = {status: "preparing"};

        $http.put(uri, data)
            .success(function(data, status, header, config){
               $scope.getOrders();
            })
            .error(function(data, status, header, config){
                console.log(data);
            });
    }

    $scope.makePayment = function(orderUri){
        var indexOfOrders = orderUri.lastIndexOf("orders");
        var uri = orderUri.slice(0, indexOfOrders) + "payments/" + orderUri.slice(indexOfOrders, orderUri.length);
        // for now, just use default values for payment information
        // need to add functionality to take the info from the customer
        var data = {
          name:"David Harting",
            cardNumber: "1234-2345-3456-4567",
            expirationDate: "01/20"
        };
        $http.post(uri, data)
            .success(function(data, status, header, config){
                $scope.getOrders();
            })
            .error(function(data, status, header, config){
                console.log(data);
            })
    }

    $scope.completeOrder = function(orderUri){
        var data = {status:"done"};
        $http.put(orderUri, data)
            .success(function(data, status, header, config) {
                $scope.getOrders();
            })
            .error(function(data, status, header, config){
                console.log(data);
                console.log(status);
            })
    }
}]);