'use strict';

/* Controllers */

var HHControllers = angular.module('HHControllers', ['ui.router','layoutModuleController','layoutModuleServices', 'angular-gestures']);

HHControllers

.controller('mainController', function($scope) {	
    $scope.alert = function (text) {
        alert(text);
    };
    $scope.test = function() {
        alert('test in ctrl scope');
    };
	
    $scope.flagicons=[{
        icontype: 'greenflag'
            },{
        icontype: 'yellowflag'
            },{
        icontype: 'redflag'
    }];

//    $scope.icons2=[{
//    src: 'img/pencil.PNG'
//  },{
//    src: 'img/ruler.PNG'
//  },{
//    src: 'img/eraser.PNG'
//  }];

    $scope.icons3=[{
    icontype:  'sink'
  },{
    icontype:  'window'
  },{
    icontype:  'stairs'
  },{
    icontype:  'fire'
  },{
    icontype:  'toilet'
  },{
    icontype:  'tub'
  },{
    icontype:  'door'
  }];
    
    $scope.iconSVGs=[{
    icontype:  'svg_line'
  },{
    icontype:  'svg_rectangle'
  },{
    icontype:  'svg_circle'
  }];

})

.controller('questionsController1', ['$scope', '$http',						
  function($scope, $http) {
    $http.get('json/asthma.json').success(function(data) {
      $scope.questions = data;
    });
    $scope.orderProp = 'ID';
  }])

.controller('questionsController2', ['$scope', '$http',						
  function($scope, $http) {
    $http.get('json/fall_prevention.json').success(function(data) {
      $scope.questions = data;
    });
    $scope.orderProp = 'ID';
  }])

.controller('questionsController3', ['$scope', '$http',						
  function($scope, $http) {
    $http.get('json/lead.json').success(function(data) {
      $scope.questions = data;
    });
    $scope.orderProp = 'ID';
  }])

.controller('questionsController4', ['$scope', '$http',						
  function($scope, $http) {
    $http.get('json/pesticide.json').success(function(data) {
      $scope.questions = data;
    });
    $scope.orderProp = 'ID';
  }]);	// end of controllers