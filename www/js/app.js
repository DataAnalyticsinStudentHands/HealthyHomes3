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
		//]).run(function ($ionicPlatform, Restangular, $rootScope, UserService, $q, $state) {
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
    Restangular.setBaseUrl("https://www.housuggest.org:8443/FormBuilder/");
	//Restangular.setBaseUrl("http://localhost:2480/studio/index.html#/database/HealthyHomes/db");
 
    $rootScope.Restangular = function () {
        return Restangular;
    };
    $rootScope.isAuthenticated = function (authenticate) {
        //if(!$rootScope.uid) {
		if(Auth.hasCredentials()) {
			console.log('has credentials')
            UserService.getMyUser().then(function (result) {
                result = Restangular.stripRestangular(result)[0];
                //USERNAME & ID TO BE USED IN CONTROLLERS
                //$rootScope.uid = result.id.toString();
                //$rootScope.uin = result.username.toString();
            }); 
			//}
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
		};
        return Auth.hasCredentials();
    };

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
		if (toState.authenticate==undefined){toState.authenticate=true};
        if (toState.authenticate && !$rootScope.isAuthenticated(toState.authenticate)){
            $state.go("login");
            //Prevents the switching of the state
            event.preventDefault();
		};
    });
    //Logout user by clearing credentials
    $rootScope.logout = function () {
        Auth.clearCredentials();
        console.log("log out");
        $state.go('login', {}, {
            reload: true
        });
    };
})
.config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
        'use strict';
		$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/); //for CORS, at least in debug - should see if it matters for end project and loading from local
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
                         },
          authenticate: true
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
  