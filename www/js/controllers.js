'use strict';

/* Controllers PROBABLY DELETE ALL */

var HHControllers = angular.module('HHControllers', ['layoutModuleController','layoutModuleServices']);

HHControllers

.controller('mainController', function($scope, $state) {
    $scope.alert = function (text) {
        alert(text+'in');
    };
    $scope.test = function() {
        alert('test in ctrl scope');
    };
    $scope.goLayout = function() {
        $state.go('layout.floor');
    };
    
	
//    $scope.flagicons=[{
//        icontype: 'greenflag'
//            },{
//        icontype: 'yellowflag'
//            },{
//        icontype: 'redflag'
//    }];
//    $scope.icons3=[{
//    icontype:  'sink'
//  },{
//    icontype:  'window'
//  },{
//    icontype:  'stairs'
//  },{
//    icontype:  'fire'
//  },{
//    icontype:  'toilet'
//  },{
//    icontype:  'tub'
//  },{
//    icontype:  'door'
//  }];
//    
//    $scope.iconSVGs=[{
//    icontype:  'svg_line'
//  },{
//    icontype:  'svg_rectangle'
//  },{
//    icontype:  'svg_circle'
//  }];
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

	$scope.visibility = [{see: true}];
  }])

 .controller('inputBoxCtrl', ['$scope', 'databaseConnection',
	function($scope, databaseConnection) {
   		$scope.list = [{stuff: 'type something'}];
		
		$scope.sync = function(){
        	databaseConnection.queryWebService($scope.list, function(value){
            	console.log(value);
				console.log("input box sync function");
       		 });
   		 };
 }])

.controller('listController', ['$scope', 'databaseConnection',
  function($scope, databaseConnection) {
    $scope.list = [
       {id: 1, name: 'perfect condition', checked: false},
       {id: 12, name: 'good condition', checked: false},
       {id: 35, name: 'needs work', checked: false},
       {id: 47, name: 'very bad condition', checked: false}
    ];
    $scope.sync = function(){
        databaseConnection.queryWebService($scope.list, function(value){
            console.log(value);
			console.log("list sync function");
        });
    };
}]);

