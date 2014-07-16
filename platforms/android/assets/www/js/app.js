'use strict';

/* App Module */

var HHApp = angular.module('HHApp', [
    'HHControllers', 
    'ui.router',
//    'restangular',
//    'ngCookies', 
//    'databaseControllerModule',  //once we get Restful going
//    'databaseServicesModule',
    'layoutModuleServices', 
    'angular-gestures'
]); //dependencies

HHApp.config( //first login things are coming from DatabaseCommunication Module
  function($stateProvider, $urlRouterProvider) {
    //function($stateProvider) {
//    $stateProvider.
//      state('loggedout', {
//        abstract: true,
//        template: "<ui-view>"
//      }); //.
//      state('login', {
//          url: "/login",
//          templateUrl: "partials/loginPage.html",
//          controller: 'loginCtrl',
//          authenticate: false
//      });

//    $stateProvider.
//      state('loggedin', {
//          abstract: true,
//          template: "<ui-view>"
//      }).
//      state('secure', {
//          url: "/secure",
//          templateUrl: "partials/secure.html",
//          controller: 'secureCtrl',
//          authenticate: true
//      });
       // });
    $stateProvider.
      state('logo', {
          url: "",
          views: {
            "app": { templateUrl: "partials/logoPage.html"}
          }
      }).    
      state('login', {
          url: "/login",
          views: {
            "app": {templateUrl: "partials/loginPage.html"} 
          }
      }).
      state('layout', {
          
          url: "/layout",
          views: {
                "app": { templateUrl: 'partials/layoutPage.html', controller: 'mainController' },
                //"menu_layout": { templateUrl: 'partials/menuLayout.html', controller: 'mainController' },
                    //will want controller on app to be layoutCtrl
                    //think through add on stuff
                //"notes":  { templateUrl: 'partials/svgLayout.html', controller: 'mainController' },
                "svg_select": { templateUrl: 'partials/svgLayout.html', controller: 'mainController' }
            }
      }).
//	  state('layout.first', {
//		  url: "/login/layout/questions",
//		  controller: 'mainController',
//		  views: {
//			"a": {templateUrl: "partials/questions.html"}
//		  }
//	  }).
//	  state('layout.second', {
//		  url: "/login/layout/questions1",
//		  views: {
//			"b": {templateUrl: "partials/questions1.html"}
//		  }
//	  }).
//	  state('layout.third', {
//		  url: "/login/layout/questions2",
//		  views: {
//			"c": {templateUrl: "partials/questions2.html"}
//		  }
//	  }).
//	  state('layout.fourth', {
//		  url: "/login/layout/questions3",
//		  views: {
//			"d": {templateUrl: "partials/questions3.html"}
//		  }
//	  }).
//	  state('layout.fifth', {
//		  url: "/login/layout/summary",
//		  views: {
//			"e": {templateUrl: "partials/summary.html"}
//		  }
//	  }).
      state('camera', {
          url: "/camera",
          views: {
            "app": {templateUrl: "partials/camera.html"} 
          }
      });
    });
  
//HHApp.run(['Restangular', '$rootScope', 'Auth', '$q', '$state', function(Restangular, $rootScope, Auth, $q, $state) {
//    Restangular.setBaseUrl("http://localhost:8080/RESTFUL-WS/services/");
//    $rootScope.Restangular = function() {
//        return Restangular;
//    }
//    $rootScope.addAuth = function() {
//        //
//    }
//    $rootScope.isAuthenticated = function() {
        //BELOW - Trying to get promises to work to verify auth
//        var deferred = $q.defer();
//        //This should be set to a work-all URL.
//        var rqPromise = Restangular.all("users").get("2").then(function(result) {
//            console.log("authed");
//            return true;
//        }, function(error) {
//            Auth.clearCredentials();
//            console.log("not-authed");
//            return false;
//        });
//        return deferred.resolve(rqPromise);
        //END
//        return Auth.hasCredentials();
//    }
//    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
//      console.log("$stateChangeStart");
//      console.log($rootScope.isAuthenticated());
//      if (toState.authenticate && !$rootScope.isAuthenticated()){
//        console.log("non-authed");
//        // User isn’t authenticated
//        $state.go("login");
//        //What?
//        event.preventDefault(); 
//      } else console.log("authed");
//    });
//}]);