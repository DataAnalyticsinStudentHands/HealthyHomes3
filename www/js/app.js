'use strict';

/* App Module */

var HHApp = angular.module('HHApp', [
    'ui.router','HHControllers',
  //'ui.router', 'ngAnimate', 'ngTouch', 'ngGesture','ngResource','databaseServicesModule','HealthyHomesControllers'
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
      state('layout', {
          url: "/login/layout",
          views: {
            "app": {templateUrl: "partials/layout.html"}
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
    
//        .state('home', {
//            url: "/home",
//            templateUrl: "/partials/home.html"
////          views: {
////            "app":      { templateUrl: "/partials/home.html"},
////            "sideselectbar": { templateUrl: "partials/sideselectbar.html"}
////            //"menuBar":  { templateUrl: "partials/menuBar.html", controller: 'menuCtrl'}
////          }
//        })
//        .state('login', {
//            
//        })
//        .state('user', {
//            
//        })
//        .state('layout', {
//            //should there be nested views for the different floors?
//        })
//        .state('questions', {
//            
//        })
//        .state('manager', {
//            
//        });
//    });
        
        /*state('login', {
          url: "/phones/:phoneId",
          views: {
            "app": {templateUrl: "partials/beatles.html", controller: 'PhoneListCtrl'} 
          }
        })*/
      // Anonymous routes http://www.frederiknakstad.com/2014/02/09/ui-router-in-angular-client-side-auth/
    //at some point might help with the residential versions - now there is no anonymous use
   /*     .state('anon', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.anon
            }
        })
        .state('anon.login', {
            url: '/login/',
            templateUrl: 'login',
            controller: 'LoginCtrl'
        })
        .state('anon.register', {
            url: '/register/',
            templateUrl: 'register',
            controller: 'RegisterCtrl'
        });*/

// Regular user routes
/*$stateProvider
    .state('user', {
        abstract: true,
        template: "<ui-view/>",
        data: {
            access: access.user
        }
    })
    .state('user.home', {
        url: '/',
        templateUrl: 'home'
    })
    .state('user.private', {
        abstract: true,
        url: '/private/',
        templateUrl: 'private/layout'
    })
    .state('user.private.home', {
        url: '',
        templateUrl: 'private/home'
    })
    .state('user.private.nested', {
        url: 'nested/',
        templateUrl: 'private/nested'
    })
    .state('user.private.admin', {
        url: 'admin/',
        templateUrl: 'private/nestedAdmin',
        data: {
            access: access.admin
        }
    });

      state('loginHomePage', {
          views: {
            "app": {url: "", templateUrl: "partials/loginPage.html"}
          }
      });*/
  

