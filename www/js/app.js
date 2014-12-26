angular.module('HHApp', [
    'ionic',
	'Controllers',
    'Services',
    'Directives',
    'restangular',
    'ngNotify',
    'ngStorage',
	//'ngCordova',
	'ngCordova.plugins.camera',
    'databaseControllerModule',
    'databaseServicesModule'
]).run(function ($ionicPlatform, Restangular, $rootScope, Auth, $q, $state) {
    'use strict';

    // $ionicPlatform.ready(function () {
//         // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//         // for form inputs)
//         if (window.cordova && window.cordova.plugins.Keyboard) {
//             cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//         }
//         if (window.StatusBar) {
//             // org.apache.cordova.statusbar required
//             StatusBar.styleDefault();
//         }
//     }); 
    //Restangular.setBaseUrl("http://www.housuggest.org:8080/HealthyHomes/");
    //Restangular.setBaseUrl("http://www.housuggest.org:8080/HHtest/");
 
    $rootScope.Restangular = function () {
        return Restangular;
    };
    $rootScope.isAuthenticated = function () {
        return true; //until through with testing
        //return Auth.hasCredentials(); 
    };

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        console.log("$stateChangeStart");
        console.log($rootScope.isAuthenticated());
        if (toState.authenticate && !$rootScope.isAuthenticated()) {
            console.log("non-authed");
            // User isn’t authenticated
            $state.go("login");
            //What?
            event.preventDefault();
        } else {
            console.log("authed");
        }
    });
    
    //Logout user by clearing credentials
    $rootScope.logout = function () {
        Auth.clearCredentials();
        console.log("log out");
        $state.go('login', {}, {
            reload: true
        });
    };
    
    // Some watchdogs for fixing ui-route issues Credits: Adam's answer in http://stackoverflow.com/a/20786262/69362
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeError - fired when an error occurs during transition.');
        console.log(arguments);
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
    });

    $rootScope.$on('$viewContentLoaded', function (event) {
        console.log('$viewContentLoaded - fired after dom rendered', event);
    });

    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
        console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
        console.log(unfoundState, fromState, fromParams);
    });
})
.config(function ($stateProvider, $urlRouterProvider) {
        'use strict';
//    $urlRouterProvider.when("","/inspection");
//    $urlRouterProvider.when("/","/inspection");
    $urlRouterProvider.otherwise("/login");
    $stateProvider 
      .state('login',{ //should all come from login?
          url: "/login",
          templateUrl: 'templates/login.html',
          controller: 'loginCtrl',
          authenticate: true
      })
      .state('secure', {
            abstract: true,
            url: "/tab",
            authenticate: true,
            templateUrl: "templates/tabs.html",
            controller: "mainController",
            resolve: {
                inspections: function (DataService, $ionicLoading) {
                    return DataService.getInspections();
                }
            } 
      })
      .state('secure.inspections', {
          url: "/inspections",
          views: { //as separate views so we can access them directly
            "inspections": { templateUrl: "templates/inspections.html"
                         },
            "schedule": { templateUrl: "templates/inspectionSchedule.html",
                          controller: "scheduleController"
                         },
            "general": { templateUrl: "templates/inspectionGeneral.html",
                        controller: "generalController"
                       },
            "summary": { templateUrl: "templates/summary.html",
                        controller: "summaryController"
                       },
            "overview": { templateUrl: "templates/overview.html",
                           controller: "overviewController"
                          }
//            "layout": { 
//					templateUrl: 'templates/layoutPage.html',
//					controller: 'layoutCtrl' 				
//					}
          }
      })
//      .state('secure.map', {
//          abstract: true,
//          templateUrl: 'templates/map.html',
//          controller: 'mapCtrl'
//      })
    //should all work like layout
      .state('secure.inspections.map', {
          url:"/map",
          views: {
                "map@secure": {
                    templateUrl: 'templates/map.html',
                    controller: 'mapCtrl'
                },
                "surroundCity": {
                    templateUrl: 'templates/city.html'
                },
                "neighborhood": {
                    templateUrl: 'templates/neighborhood.html'
                },
                "dataCtrls": {
                    templateUrl: 'templates/left.html'
                }
            }
      })
      .state('secure.inspections.layout', {	
          url: "/layout/:inspectionIndex/:floorInd/:roomInd",
          views: {
                "inspections@secure": { 
					templateUrl: 'templates/layout.html',
					controller: 'layoutCtrl' 				
					},
				"outline@secure": { //right now doing as ng-include
					templateUrl: 'templates/outline.html'
					}
                },
		resolve: {
			currentInspection: function ($ionicLoading,inspections,$stateParams) {
				var inspInd = $stateParams.inspectionIndex || 0;
				var currentInspection = inspections[inspInd];
				return currentInspection;
			},
	        currentFloor: function ($ionicLoading,inspections,$stateParams) {
				var inspInd = $stateParams.inspectionIndex || 0;
				var floorInd = $stateParams.floorInd || 0;
				var currentFloor = inspections[inspInd].floors[floorInd];
	        	return currentFloor;
	        }
		}
      })
      .state('secure.inspections.questions', {	
          url: "/questions/:inspectionIndex/:floorInd",
          views: {
                "inspections@secure": { 
					templateUrl: 'templates/questions.html'
					}
                }
      })
//      .state('secure.inspections.floor', {
//        url: "/floor/:inspectionIndex",
//        views: {
//                    templateUrl: 'templates/floor.html'
//                }
//      });

    });
//    http://stackoverflow.com/questions/23231608/angular-ui-router-modal-removes-parent-state
//      .state('camera', { //I'm not sure how this has been envisioned
//          url: "/login/camera",
//          views: {
//            "camera": {templateUrl: "templates/camera.html"} 
//          }
//      });
  