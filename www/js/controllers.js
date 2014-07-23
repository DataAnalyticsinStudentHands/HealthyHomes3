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

.controller('tabCtrl', ['$scope', 'Tab',
  function($scope, Tab) {
    $scope.tabs = Tab.query();
 }])

.controller('questionsCtrl', ['$scope', '$stateParams', 'Tab',
  function($scope, $stateParams, Tab) {
    $scope.tab = Tab.query2({tabId: $stateParams.tabId}, function(tab) {
		$scope.questions=[]; 
		
		for (var i=0; i<$scope.tab.length; i++){
			$scope.questions[i]=$scope.tab[i];
		}
    });	
  }]);// end of controllers
