/**
 * Created by David on 4/29/2015.
 */

var app = angular.module('baristaApp');

app.service('orderService', ['$http', function ($http) {
    this.get = function () {
        return $http.get('http://localhost\:3000/api/orders')
            .success(function (data) {
                return data;
            })
            .error(function (err) {
                return err;
            });
    }
}]);