'use strict';

/* App Module */
/* NEED TO THINK THROUGH RESOLVES!
http://angular-ui.github.io/ui-router/site/#/api/ui.router.util.$resolve?*/

var HHApp = angular.module('HHApp', [
	'HHControllers', 
	'ui.router', 
    'angular-gestures',
	'ngCordova',  
	'jsonServices',
	'dbServicesModule', 
    'restangular',
	'checklist-model'
]); //dependencies

HHApp.config(function(RestangularProvider) {
                RestangularProvider.setBaseUrl('/json');
            })
.config(
  function($stateProvider) {
    $stateProvider 
      .state('login', {
          url: "",
          views: {
            "app": {templateUrl: "partials/loginPage.html"} 
          }
      })
      .state('inspection',{
          url: "/inspection",
          views: {
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
          }
          //, is inspectionId being set with each inspection?
//          resolve:
//          data: 
      })  
      .state('layout', {	
          abstract: true,
//          url: "/layout",
          views: {
                "layout": { 
					templateUrl: 'partials/layoutPage.html',
					controller: 'layoutCtrl' 					
					}//,
//                "sideMenu": { //will give us more control later
//                    templateUrl: 'partials/sideMenu.html',
//                    controller: 'layoutCtrl'   
//                    //controller: 'sideMenuController' //right now, it's just calling in json
//                    }	  
            } //,
          //authenticate: true //add here once Carl's module included for authentication
      })
      .state('layout.floor', {
          url: "/layout",
          views: {
                "floor": {
                    templateUrl: 'partials/floor.html'
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
      .state('topMenu', {
          views: {
              'topMenu': {
                  templateUrl: 'partials/topMenu.html'
              }
          }
      })         
    // perhaps for note, too?
//    http://stackoverflow.com/questions/23231608/angular-ui-router-modal-removes-parent-state
      .state('camera', { //I'm not sure how this has been envisioned
          url: "/login/camera",
          views: {
            "camera": {templateUrl: "partials/camera.html"} 
          }
      });
  })
    .run(function($state){ //need to discuss how we will do login, etc.
   $state.go('login');
    });
  