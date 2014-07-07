'use strict';

/* Controllers */

var HHControllers = angular.module('HHControllers', ['ui.router']);
HHControllers

.controller('PhoneListCtrl', ['$scope', '$http',
  function($scope, $http) {
    $http.get('phones/phones.json').success(function(data) {
      $scope.phones = data;
    });
  }])

.controller('mainController', function($scope) {		//show & hide
	$scope.goCats = false;
});

/*    --------------    ng-repeat     ------------      */

function myCtrl($scope){
    $scope.icons=[{
    src: 'img/greenflag.PNG'
  },{
    src: 'img/yellowflag.PNG'
  },{
    src: 'img/redflag.PNG'
  }];
}

function myCtrl2($scope){
    $scope.icons=[{
    src: 'img/pencil.PNG'
  },{
    src: 'img/ruler.PNG'
  },{
    src: 'img/eraser.PNG'
  }];
}

function myCtrl3($scope){
    $scope.icons=[{
    src: 'img/sink.PNG'
  },{
    src: 'img/window.PNG'
  },{
    src: 'img/stairs.PNG'
  },{
    src: 'img/fire.PNG'
  },{
    src: 'img/toilet.PNG'
  },{
    src: 'img/tub.PNG'
  },{
    src: 'img/door.PNG'
  }];
}



