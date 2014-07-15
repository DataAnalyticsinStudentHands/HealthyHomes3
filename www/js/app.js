'use strict';

/* App Module */

var HHApp = angular.module('HHApp', [
  'HHControllers', 'ui.router'
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
		  abstract: true,
          url: "/login/questions",
          views: {
                "app": { templateUrl: 'partials/layoutPage.html' }
            }
      }).
	  state('questions.first', {
		  url: "",
		  views: {
			"q": {
				templateUrl: "partials/questions.first.html"
			}
		  }
	  }).
	  state('questions.second', {
		  url: "",
		  views: {
			"q": {templateUrl: "partials/questions.second.html"}
		  }
	  }).
	  state('questions.third', {
		  url: "",
		  views: {
			"q": {templateUrl: "partials/questions.third.html"}
		  }
	  }).
	  state('questions.fourth', {
		  url: "",
		  views: {
			"q": {templateUrl: "partials/questions.fourth.html"}
		  }
	  }).
	  state('questions.fifth', {
		  url: "",
		  views: {
			"q": {templateUrl: "partials/questions.summary.html"}
		  }
	  }).
      state('camera', {
          url: "/login/camera",
          views: {
            "app": {templateUrl: "partials/camera.html"} 
          }
      });
  });