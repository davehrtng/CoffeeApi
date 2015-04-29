/**
 * Created by David on 4/29/2015.
 */
var app = angular.module('baristaApp');

app.directive('order', function() {
    return {
        restrict: 'E',
        scope: {
          order:'=info'
        },
        templateUrl: '../directives/order.html'
    };
});