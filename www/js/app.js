angular.module('HHApp', [
    'ionic',
	'Controllers',
    'Services',
    'Directives',
    'restangular',
    'ngNotify',
    'ngStorage',
	//'ngCordova',
	//'ngCordova.plugins.camera',
//    'databaseControllerModule', need to clean up whole folder
    'databaseServicesModule'
]).run(function ($ionicPlatform, Restangular, $rootScope, Auth, UserService, $q, $state) {
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
    Restangular.setBaseUrl("https://www.housuggest.org:8443/FormBuilder/");
 
    $rootScope.Restangular = function () {
        return Restangular;
    };
    $rootScope.isAuthenticated = function (authenticate) {
        if(!$rootScope.uid) {
            UserService.getMyUser().then(function (result) {
                //console.log("authed");
                result = Restangular.stripRestangular(result)[0];
                //USERNAME & ID TO BE USED IN CONTROLLERS
                //$rootScope.uid = result.id.toString();
                //$rootScope.uin = result.username.toString();
            });
        }
        UserService.getMyRole().then(function(success){
                $rootScope.role = success;
                $rootScope.isMod = (success == "ROLE_MODERATOR");
                $rootScope.isAdm = (success == "ROLE_ADMIN");
        }, function (error) {
            if (error.status === 0) { // NO NETWORK CONNECTION OR SERVER DOWN, WE WILL NOT LOG THEM OUT
                ngNotify.set("Internet or Server Unavailable", {type: "error", sticky: true});
            } else { //Most Likely a 403 - LOG THEM OUT
                Auth.clearCredentials();
                //console.log("not-authed");
                if (authenticate) {
                    $state.go("login");
                    location.reload();
                }
            }
        });
        return Auth.hasCredentials();
    };

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !$rootScope.isAuthenticated(toState.authenticate)){
            console.log("non-authed");
            // User isn’t authenticated
            $state.go("login");
            //Prevents the switching of the state
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
.config(function ($stateProvider, $urlRouterProvider,$compileProvider) {
        'use strict';
		$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/); //for CORS, at least in debug - should see if it matters for end project
//    $urlRouterProvider.when("","/inspection");
//    $urlRouterProvider.when("/","/inspection");
    $urlRouterProvider.otherwise("/login");
    $stateProvider 
      .state('login',{ //should all come from login?
          url: "/login",
          views: {
            "app_home": {templateUrl: "templates/login.html", controller: 'loginCtrl'}
          },
          authenticate: false
      })
      .state('register', {
          url: "/register",
          views: {
            "app_home": { templateUrl: "templates/register.html", controller: 'registerCtrl'}
          },
          authenticate: false
      })
      .state('secure', {
            abstract: true,
            url: "/tab",
            authenticate: true,
            views: {
            "app_home": { templateUrl: "templates/tabs.html",controller: "mainController"}
            },
            resolve: {
                inspections: function (DataService, $ionicLoading) {
                    return DataService.getInspections();
                },
				questions: function (DataService, $ionicLoading) {
                    return DataService.getQuestions('asthma');
				}
            } 
      })
      .state('secure.settings', {
          url: "/settings",
          views: {
            "app_home": { templateUrl: "templates/settings.html", controller: "settings"}
          },
          authenticate: true
      })
      .state('secure.inspections', {
          url: "/inspections",
          views: { //as separate views so we can access them directly
            "inspections": { templateUrl: "templates/inspections.html"
                         }
//              ,
//            "schedule": { templateUrl: "templates/inspectionSchedule.html",
//                          controller: "scheduleController"
//                         },
//            "general": { templateUrl: "templates/inspectionGeneral.html",
//                        controller: "generalController"
//                       },
//            "summary": { templateUrl: "templates/summary.html",
//                        controller: "summaryController"
//                       },
//            "overview": { templateUrl: "templates/overview.html",
//                           controller: "overviewController"
//                          }
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
          authenticate: true,
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
          authenticate: true,
          views: {
                "inspections@secure": { 
					templateUrl: 'templates/layout.html',
					controller: 'layoutCtrl' 				
					},
				"outline@secure": { //right now doing as ng-include; should fix
					templateUrl: 'templates/outline.html'
					},
				"questions@secure": { 
					templateUrl: 'templates/questions.html'
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
					//       .state('secure.inspections.questions', {
					//           url: "/questions/:inspectionIndex/:floorInd",
					//           views: {
					//                 "questionsOld@secure": {
					// templateUrl: 'templates/questions.html'
					// }
					//                 }
					//       })
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
  