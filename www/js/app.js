'use strict';

/* App Module */
/* NEED TO THINK THROUGH RESOLVES!
http://angular-ui.github.io/ui-router/site/#/api/ui.router.util.$resolve?*/

var HHApp = angular.module('HHApp', [
    'ionic',
	'HHControllers', 
    //'ngNotify',
	//'ui.router', 
    //'angular-gestures',
	//'ngCordova',  
	'jsonServices',
    //'userServiceModule',
    'layoutModuleServices',
	'databaseServicesModule', 
    'restangular',
	//'checklist-model'
]); //dependencies

HHApp.config(function(RestangularProvider) {
                RestangularProvider.setBaseUrl('/json');
            })
.config(
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("","/inspection");
    $urlRouterProvider.when("/","/inspection");
    $urlRouterProvider.otherwise("/inspection");
    $stateProvider 
      .state('inspection',{ //should all come from login?
          url: "/inspection",
          //abstract: true,
          templateUrl: 'partials/loginPage.html',
          controller: 'mainController',
          onEnter: function(){
            console.log("enter inspection");
          }
  		
      })
      .state('login', {
          url: "/login",
          views: {
            //"signin": {templateUrl: "partials/loginPage.html"},
            "schedule": { templateUrl: "partials/inspectionSchedule.html",
                          controller: "scheduleController"
                         },
            "general": { templateUrl: "partials/inspectionGeneral.html",
                        controller: "inspectionController"
                       },
            "summary": { templateUrl: "partials/summary.html",
                        controller: "summaryController"
                       },
            "overview": { templateUrl: "partials/overview.html",
                           controller: "overviewController"
                          }
//            "layout": { 
//					templateUrl: 'partials/layoutPage.html',
//					controller: 'layoutCtrl' 				
//					}
          }
      })
      .state('layout', {	
          abstract: true,
          templateUrl: 'partials/layoutPage.html',
          controller: 'layoutCtrl'
//          views: {
//                "pagelayout": { 
//					templateUrl: 'partials/layoutPage.html',
//					controller: 'layoutCtrl' 				
//					}
//            } 
      })
      .state('layout.floor', {
          url: "/layout",
          views: {
                "floor": {
                    templateUrl: 'partials/floor.html'
                },
                "sideLeft": {
                    templateUrl: 'partials/left.html'
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
                    console.log('in app.js')
                    return layoutObjectModel;
                }
             }
      })
      .state('questions', {										//same ^
		  abstract: true,										//has to have children
          url: "/questions",
          views: {
			"app": { templateUrl: 'partials/layoutPage.html' }
            }
      })
	  .state('questions.tabs', {
		  url: "/login/questions/:tabId",
		  views: {
			"questions": {
				templateUrl: "partials/questions.html",
				controller: 'questionsCtrl'
			}
		  }
	  })
    });
//      .state('topMenu', {
//          views: {
//              'topMenu': {
//                  templateUrl: 'partials/topMenu.html'
//              }
//          }
//      })         
    // perhaps for note, too?
//    http://stackoverflow.com/questions/23231608/angular-ui-router-modal-removes-parent-state
//      .state('camera', { //I'm not sure how this has been envisioned
//          url: "/login/camera",
//          views: {
//            "camera": {templateUrl: "partials/camera.html"} 
//          }
//      });
      //$urlRouterProvider.when('', '/login');
  
    //.run(function ($ionicPlatform, Restangular, $rootScope, Auth, $q, $state, UserService, ngNotify) {
    
  