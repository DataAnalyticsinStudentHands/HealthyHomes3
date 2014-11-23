angular.module('HHApp', [
    'ionic',
	'Controllers',
    'Services',
    'Directives',
    'restangular',
    'ngNotify',
    'databaseControllerModule',
    'databaseServicesModule'
]).run(function ($ionicPlatform, Restangular, $rootScope, Auth, $q, $state) {
    'use strict';

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    }); 
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
          onEnter: function(){
            console.log("enter inspection");
          },
          authenticate: true
      })
      .state('secure', {
                url: "/tab",
                abstract: true,
                authenticate: true,
                templateUrl: "templates/tabs.html",
                resolve: {
                    items: function (DataService, $ionicLoading) {
                        return DataService.getAllItems('applications');
                    }
                } 
      })
      .state('secure.inspections', {
          url: "/inspections",
          
          views: {
            "schedule": { templateUrl: "templates/inspectionSchedule.html",
                          controller: "scheduleController"
                         },
            "general": { templateUrl: "templates/inspectionGeneral.html",
                        controller: "inspectionController"
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
      .state('map', {
          abstract: true,
          templateUrl: 'templates/map.html',
          controller: 'mapCtrl'
      })
      .state('map.city', {
          url:"/city",
          views: {
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
      .state('layout', {	
          abstract: true,
          templateUrl: 'templates/layout.html',
          controller: 'layoutCtrl'
//          views: {
//                "pagelayout": { 
//					templateUrl: 'templates/layoutPage.html',
//					controller: 'layoutCtrl' 				
//					}
//            } 
      })
      .state('layout.floor', {
          url: "/layout",
          views: {
                "floor": {
                    templateUrl: 'templates/floor.html'
                },
                "sideLeft": {
                    templateUrl: 'templates/left.html'
                }
            }//,
//          data:{
//             resolve: {
//                floorData: function($stateParams, layoutObjectModel) {
//                    var thisFloor = $stateParams.floorName;
//                    var currentFloor = layoutObjectModel.inspection[thisFloor]; //need to rethink
//                    return currentFloor;
//                }
//             }
      })
      .state('layout.floor.room', {
             resolve: {
                floorData: function(layoutObjectModel) {
                    return layoutObjectModel;
                }
             }
      })
    });
//    http://stackoverflow.com/questions/23231608/angular-ui-router-modal-removes-parent-state
//      .state('camera', { //I'm not sure how this has been envisioned
//          url: "/login/camera",
//          views: {
//            "camera": {templateUrl: "templates/camera.html"} 
//          }
//      });
  