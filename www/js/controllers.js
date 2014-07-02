'use strict';

/* Controllers */

var HHControllers = angular.module('HHControllers', ['ui.router']);
HHControllers.controller('PhoneListCtrl', ['$scope', '$http',
  function($scope, $http) {
    $http.get('phones/phones.json').success(function(data) {
      $scope.phones = data;
    });
  }]);

