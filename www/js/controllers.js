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

/*.controller("tabCtrl", function($scope, $state) {		
	$scope.go = function(route){
		$state.go(route);
	};
	$scope.active = function(route){
		return $state.is(route);
	};
	$scope.tabs = [
		{ heading: "Tab 1", route:"questions.first", active:false },
		{ heading: "Tab 2", route:"questions.second", active:false },
		{ heading: "Tab 3", route:"questions.third", active:false },
		{ heading: "Tab 4", route:"questions.fourth", active:false },
		{ heading: "Tab 5", route:"questions.fifth", active:false }
	];
	$scope.$on("$stateChangeSuccess", function() {
		$scope.tabs.forEach(function(tab) {
			tab.active = $scope.active(tab.route);
		});
	});
})*/

.controller('questionsController1', ['$scope', '$http',						
  function($scope, $http) {
	  $scope.questions=[];
    $http.get('json/asthma.json').success(function(data) {
		$scope.questions = data;
		/*$scope.orderProp = 'ID';*/
		var text = "";

		for (var i = 0; i < $scope.questions.length; i++) {
			text += $scope.questions[i].questionText + "<br>";
		}
		document.getElementById("forloop").innerHTML = text;
		console.log("asthma array length is "+$scope.questions.length); //just to see
	}); 
  }])

.controller('questionsController2', ['$scope', '$http',						
  function($scope, $http) {
	  $scope.questions=[];	  
    $http.get('json/fall_prevention.json').success(function(data) {
      $scope.questions = data;
    
    /*$scope.orderProp = 'ID';*/
	var text = "";

	for (var i = 0; i < $scope.questions.length; i++) {
		text += $scope.questions[i].questionText + "<br>";
	}
	document.getElementById("forloop").innerHTML = text;  
	console.log("fall prevention array length is "+$scope.questions.length); //just to see		
	});  
  }])

.controller('questionsController3', ['$scope', '$http',						
  function($scope, $http) {
	  $scope.questions=[];	  
    $http.get('json/lead.json').success(function(data) {
      $scope.questions = data;
    
    /*$scope.orderProp = 'ID';*/
	var text = "";

	for (var i = 0; i < $scope.questions.length; i++) {
		text += $scope.questions[i].questionText + "<br>";
	}
	document.getElementById("forloop").innerHTML = text;	
	console.log("lead array length is "+$scope.questions.length); //just to see		
	});  
  }])

.controller('questionsController4', ['$scope', '$http',						
  function($scope, $http) {
	  $scope.questions=[];	  
    $http.get('json/pesticide.json').success(function(data) {
      $scope.questions = data;
    
    /*$scope.orderProp = 'ID';*/
	var text = "";

	for (var i = 0; i < $scope.questions.length; i++) {
		text += $scope.questions[i].questionText + "<br>";
	}
	document.getElementById("forloop").innerHTML = text;	
	console.log("pesticide array length is "+$scope.questions.length); //just to see
	});  
  }]);	// end of controllers