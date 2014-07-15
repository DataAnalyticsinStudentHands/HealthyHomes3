'use strict';

/* Controllers */

var HHControllers = angular.module('HHControllers', ['ui.router']);
HHControllers

.controller('PhoneListCtrl', ['$scope', '$http',
  function($scope, $http) {
    $http.get('phones/phones.json').success(function(data) {
      $scope.phones = data;
    });
  }])

/* ----------------- show & hide -------------------- */

.controller('mainController', function($scope) {		
	$scope.goCats = false;
})

/*    --------------    ng-repeat     ------------      */

function myCtrl($scope){
    $scope.icons=[{
    src: 'img/greenflag.PNG'
  },{
    src: 'img/yellowflag.PNG'
  },{
    src: 'img/redflag.PNG'
  }];
}

function myCtrl2($scope){
    $scope.icons=[{
    src: 'img/pencil.PNG'
  },{
    src: 'img/ruler.PNG'
  },{
    src: 'img/eraser.PNG'
  }];
}

function myCtrl3($scope){
    $scope.icons=[{
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
}

/* ------------------ camera --------------------- */

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