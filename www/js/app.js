'use strict';

/* App Module */

var HHApp = angular.module('HHApp', [
  'ngRoute', 'HHControllers', 'ui.router', 'ngAnimate'
]); //dependencies

HHApp.config(
  function($stateProvider, $urlRouterProvider) {
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
          url: "/login/layout",
          views: {
            "app": {templateUrl: "partials/layoutPage.html"}
          }
      }).
	  state('layout.first', {
		  url: "/login/layout/questions",
		  controller: 'mainController',
		  views: {
			"a": {templateUrl: "partials/questions.html"}
		  }
	  }).
	  state('layout.second', {
		  url: "/login/layout/questions1",
		  views: {
			"b": {templateUrl: "partials/questions1.html"}
		  }
	  }).
	  state('layout.third', {
		  url: "/login/layout/questions2",
		  views: {
			"c": {templateUrl: "partials/questions2.html"}
		  }
	  }).
	  state('layout.fourth', {
		  url: "/login/layout/questions3",
		  views: {
			"d": {templateUrl: "partials/questions3.html"}
		  }
	  }).
	  state('layout.fifth', {
		  url: "/login/layout/summary",
		  views: {
			"e": {templateUrl: "partials/summary.html"}
		  }
	  }).
      state('camera', {
          url: "/login/camera",
          views: {
            "app": {templateUrl: "partials/camera.html"} 
          }
      });
  });

