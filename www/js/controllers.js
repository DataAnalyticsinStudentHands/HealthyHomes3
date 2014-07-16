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
	
    $scope.sideTabs=[{ //how did you link the images without the .PNG extension?
    icontype:  'sidetab1'/*, ui-sref: 'questions.first'*/
  },{
    icontype:  'sidetab2'/*, state: 'questions.second'*/
  },{
    icontype:  'sidetab3'/*, state: 'questions.third'*/
  },{
    icontype:  'sidetab4'/*, state: 'questions.fourth'*/
  },{
    icontype:  'sidetab5'/*, state: 'questions.fifth'*/
  },];
})

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