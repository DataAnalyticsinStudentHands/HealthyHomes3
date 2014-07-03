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
      state('questions', {
          url: "/login/questions",
          views: {
            "app": {templateUrl: "partials/questions.html"} 
          }
      }).    
      state('camera', {
          url: "/login/camera",
          views: {
            "app": {templateUrl: "partials/camera.html"} 
          }
      });
  });

