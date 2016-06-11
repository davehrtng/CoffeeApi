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
        $http.post('/api/orders', JSON.parse($scope.newOrder))
            .success(function(data, status, header, config){
                $scope.getOrders();
            })
            .error(function(data, status, header, config){
                console.log(data);
            });
    }

    $scope.assignOrder = function(orderUri) {
        var data = {status: "preparing"};

        $http.put(orderUri, data)
            .success(function(data, status, header, config){
               $scope.getOrders();
            })
            .error(function(data, status, header, config){
                console.log(data);
            });
    }

    $scope.addAdditions = function(orderUri){
        console.log('add additions fired');
        var additions = getAdditions();
        $http.put(orderUri, {additions:additions})
            .success(function(data, status, header, config){
                clearCheckboxes();
                $scope.getOrders();
            })
            .error(function(data, status, header, config){
                console.log(data);
                console.log(status);
            })
    }

    $scope.makePayment = function(orderUri){
        console.log("make payment fired");
        var indexOfOrders = orderUri.lastIndexOf("orders");
        var uri = orderUri.slice(0, indexOfOrders) + "payments/" + orderUri.slice(indexOfOrders, orderUri.length);
        var orderId = uri.slice(uri.lastIndexOf('/')+1, uri.length);
        var paymentData = getPaymentInformation(orderId);

        $http.post(uri, paymentData)
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

    $scope.deleteOrder = function(orderUri){
        $http.delete(orderUri)
            .success(function(data, status, header, config){
                $scope.getOrders();
            })
            .error(function(data, status, header, config){
                console.log(data);
                console.log(status);
            });

    }
}]);
