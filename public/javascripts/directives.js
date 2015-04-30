/**
 * Created by David on 4/29/2015.
 */
var app = angular.module('baristaApp');

app.directive('order', function() {
    return {
        restrict: 'E',
        // scoping the directive takes it out of scope of OrdersCtrl
        // I see no compelling reason to do this
        /*scope: {
          order:'=info'
        },*/
        templateUrl: '../directives/order.html'
    };
});