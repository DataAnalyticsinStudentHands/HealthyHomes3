angular.module('HHControllers').controller('PictureCtrl', function($scope, $cordovaCamera) {

  $scope.takePicture = function() {
		$scope.alert = 'accessed function of take picture';

		var options = { 
			quality : 75, 
			destinationType : Camera.DestinationType.DATA_URL, 
			sourceType : Camera.PictureSourceType.CAMERA, 
			allowEdit : true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 100,
			targetHeight: 100,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false
		};

		$cordovaCamera.getPicture(options).then(function(imageData) {
			$scope.alert("success! image data is here");
		}, function(err) {
			$scope.alert("an error occured");
		});
	  
	  
  }
  
});