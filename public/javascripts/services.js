/**
 * Created by David on 4/29/2015.
 */

var app = angular.module('baristaApp');

app.factory('orderData', ['$http', function ($http) {
    $http.defaults.useXDomain = true;
    return $http.get('http://localhost\:3000/api/orders')
        .success(function (data) {
            return data;
        })
        .error(function (err) {
            return err;
        });
}]);