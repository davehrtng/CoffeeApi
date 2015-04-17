/**
 * Created by David on 4/29/2015.
 */

var app = angular.module('baristaApp', ['ngRoute']);

app.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});