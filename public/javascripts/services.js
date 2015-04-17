/**
 * Created by David on 4/29/2015.
 */

var app = angular.module('baristaApp');

app.factory('orderData', ['$http', function ($http) {
    return $http.get('localhost:3000/api/orders')
        .success(function (data) {
            return data.orders;
        })
        .error(function (err) {
            return err;
        });
}]);