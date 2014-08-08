'use strict';

/* App Module */
/* NEED TO THINK THROUGH RESOLVES!
http://angular-ui.github.io/ui-router/site/#/api/ui.router.util.$resolve?*/

var HHApp = angular.module('HHApp', [
	'HHControllers', 
	'ui.router', 
	'ngCordova.plugins.camera',  
	'jsonServices',
	'dbServicesModule', 
	'checklist-model'
]); //dependencies

HHApp.config(
  function($stateProvider) {
    $stateProvider
      .state('logo', {
          url: "",
          views: {
            "app": { templateUrl: "partials/logoPage.html"}
          }
      })    
      .state('login', {
          url: "/login",
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
//          abstract: true,
          url: "/layout",
          views: {
                "layout": { 
					templateUrl: 'partials/layoutPage.html',
					controller: 'layoutCtrl' 					
					},
                "sideMenu": { //will give us more control later
                    templateUrl: 'partials/sideMenu.html',
                    controller: 'sideMenuController'
                    }	  
            } //,
          //authenticate: true //add here once Carl's module included for authentication
      })
      .state('layout.floor' {
             data: {
                floorData: 'ref to ID?'
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
			"q": {
				templateUrl: "partials/questions.html",
				controller: 'questionsCtrl'
			}
		  }
	  })
      .state('camera', { //I'm not sure how this has been envisioned
          url: "/login/camera",
          views: {
            "app": {templateUrl: "partials/camera.html"} 
          }
      });
  })
    .run(function($state){ //need to discuss how we will do login, etc.
   $state.go('logo');
    });
  