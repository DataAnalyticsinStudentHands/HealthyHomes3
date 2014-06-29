'use strict';

/* Services */

// $$$$$$$$$$$$$$$$$ to talk to DB $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

var databaseServices = angular.module('HealthyHomesApp', ['ngResource']);
databaseServices.factory('databaseConnection', ['$resource', '$http',
    function($resource, $http){
        return $resource('http://housuggest.org/appLogin/echoJSON.php', {}, {
            query: {method:'GET', params:{"query":"Hello to you too!"}},
            hello: {method:'GET', params:{"commType":"Hello"}}, 
            login: {method:'GET', params:{"requestType":"LOGIN"}},
            queryWebService: {method:'GET'},

        });

    }]);