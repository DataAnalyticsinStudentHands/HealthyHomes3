'use strict';

/* Controllers */

var HHControllers = angular.module('HHControllers',['ui.router']);

HHControllers.controller('PhoneListCtrl', ['$scope','$http', //may not need this at all
  function($scope, $http) {
    $http.get('phones/phones.json').success(function(data) {
      $scope.phones = data;
    });
  }])
.controller('loginCtrl', ['$scope', 'databaseConnection',
  function($scope, $rootScope, databaseConnection) {
    $scope.submit = function() {
        if ($scope.userName && $scope.passWord) {
            $scope.loginMsg = "Thank you for logging in!";
            $scope.loginResult = databaseConnection.login({userName:$scope.userName, passWord:$scope.passWord});
            $scope.userName = '';
            $scope.passWord = '';
        } else if (!$scope.userName) {
            $scope.loginMsg = "Please enter your username!";
            $scope.loginResult = "";
        } else if (!$scope.passWord) {
            $scope.loginMsg = "Please enter your password!";
            $scope.loginResult = "";
        }
    };
//    $rootScope.$on("$stateChangeStart",  //http://www.frederiknakstad.com/2014/02/09/ui-router-in-angular-client-side-auth/
//    function (event, toState, toParams, 
//              fromState, fromParams) {
//        if (!Auth.authorize(toState.data.access)) {
//            $rootScope.error = "Access denied";
//            event.preventDefault();
//        };
//        if(fromState.url === '^') {
//            if(Auth.isLoggedIn()) {
//                //$state.go('user.home');
//            } else {
//                //$rootScope.error = null;
//                //$state.go('anon.login');
//            };
//        };
//    });
  }]);                

//.controller('menuCtrl', ['$scope', '$state',
//  function($scope, $state) {
//    $scope.goBack = function() {
//        //window.history.back();
//        $state.go('^');
//    };
//  }]);

/*//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

function myCtrl($scope){

// %%%%%%%%%% to talk to DB %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

var databaseController = angular.module('databaseControllerModule', []);
databaseController.controller('dbDisplayController', ['$scope', 'databaseConnection',
  function($scope, databaseConnection) {
    $scope.hello = databaseConnection.hello();
    $scope.queryResult = databaseConnection.query();    
    databaseConnection.login({"data": {userName:"user", passWord: "pass"}}, function(value){
        $scope.login = value;
        $scope.loginData = JSON.parse(value.data);
    });
    
    $scope.send = function(){
        $scope.user = databaseConnection.queryWebService({"queryA":$scope.queryA});
        $scope.pass = databaseConnection.queryWebService({"query1":$scope.query1});        
        $scope.inputText='';
        
    };
      
  }]);*/


