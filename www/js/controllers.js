'use strict';

/* Controllers */

var HHControllers = angular.module('HHControllers', ['ui.router']);
HHControllers

/* ----------------- show & hide -------------------- */

.controller('mainController', function($scope) {		
	$scope.goCats = false;
})

/*    --------------    ng-repeat     ------------      */

.controller('myCtrl', function($scope) {
    $scope.icons=[{
    src: 'img/greenflag.PNG'
  },{
    src: 'img/yellowflag.PNG'
  },{
    src: 'img/redflag.PNG'
  }]

    $scope.icons2=[{
    src: 'img/pencil.PNG'
  },{
    src: 'img/ruler.PNG'
  },{
    src: 'img/eraser.PNG'
  }]

    $scope.icons3=[{
    src: 'img/sink.PNG'
  },{
    src: 'img/window.PNG'
  },{
    src: 'img/stairs.PNG'
  },{
    src: 'img/fire.PNG'
  },{
    src: 'img/toilet.PNG'
  },{
    src: 'img/tub.PNG'
  },{
    src: 'img/door.PNG'
  }];
})

/*.controller('layoutController', function($scope) {		
	.....content.....
})*/

.controller('questionsController1', ['$scope', '$http',						
  function($scope, $http) {
    $http.get('json/asthma.json').success(function(data) {
      $scope.questions = data;
    });
    $scope.orderProp = 'ID';
  }])

.controller('questionsController2', ['$scope', '$http',						
  function($scope, $http) {
    $http.get('json/fall_prevention.json').success(function(data) {
      $scope.questions = data;
    });
    $scope.orderProp = 'ID';
  }])

.controller('questionsController3', ['$scope', '$http',						
  function($scope, $http) {
    $http.get('json/lead.json').success(function(data) {
      $scope.questions = data;
    });
    $scope.orderProp = 'ID';
  }])

.controller('questionsController4', ['$scope', '$http',						
  function($scope, $http) {
    $http.get('json/pesticide.json').success(function(data) {
      $scope.questions = data;
    });
    $scope.orderProp = 'ID';
  }])

/* ------------------- camera controller -------------------*/

.controller('cameraController', function($scope) {		
    var pictureSource;  
    var destinationType;

    document.addEventListener("deviceready",onDeviceReady,false);

    function onDeviceReady() {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    }

    function onPhotoDataSuccess(imageData) {
      var smallImage = document.getElementById('smallImage');
      smallImage.style.display = 'block';
      smallImage.src = "data:image/jpeg;base64," + imageData;
    }

    function onPhotoURISuccess(imageURI) {
      var largeImage = document.getElementById('largeImage');
      largeImage.style.display = 'block';
      largeImage.src = imageURI;
    }

    function capturePhoto() {
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
        destinationType: destinationType.DATA_URL });
    }

    function capturePhotoEdit() {
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL });
    }

    function getPhoto(source) {
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }

    function onFail(message) {
      alert('Failed because: ' + message);
    }
	
});	// end of controllers