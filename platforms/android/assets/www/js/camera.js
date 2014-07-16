    //http://docs.phonegap.com/en/1.2.0/phonegap_camera_camera.md.html
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