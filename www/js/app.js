'use strict';

/* App Module */

var HHApp = angular.module('HHApp', [
	'HHControllers', 
	'ui.router', 
	'ngCordova.plugins.camera',  
	'jsonServices',
	'listControllers', 
	'dbServicesModule', 
	'checklist-model'
]); //dependencies

HHApp.config(
  function($stateProvider) {
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
      state('layout', {											//same v
          url: "/login/layout",
          views: {
                "app": { 
					templateUrl: 'partials/layoutPage.html',
					controller: 'mainController' 					
					},
                "svg_select": { 
					templateUrl: 'partials/svgLayout.html',
					controller: 'mainController' 
					}			  
            }
      }).
      state('questions', {										//same ^
		  abstract: true,										//has to have children
          url: "/login/questions",
          views: {
			"app": { templateUrl: 'partials/layoutPage.html' }/*,
			"svg_select": { 
				templateUrl: 'partials/svgLayout.html',			//sidebars still dont show up
				controller: 'mainController' 
				}*/
            }
      }).
	  state('questions.tabs', {
		  url: "/login/questions/:tabId",
		  views: {
			"q": {
				templateUrl: "partials/questions.html"
			}/*,
           	"svg_select": { 					
				templateUrl: 'partials/svgLayout.html',			//sidebars still dont show up
				controller: 'mainController' 	
			}*/
		  }
	  }).
      state('camera', {
          url: "/login/camera",
          views: {
            "app": {templateUrl: "partials/camera.html"} 
          }
      });
  });