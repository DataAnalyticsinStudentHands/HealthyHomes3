angular.module('ngCordova', [
  'ngCordova.plugins'
]);
angular.module('ngCordova.plugins.camera', [])

.factory('$cordovaCamera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      if(!navigator.camera) {
        q.resolve(null);
        return q.promise;
      }

      navigator.camera.getPicture(function(imageData) {
        q.resolve(imageData);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    },
    cleanup: function(options) {
      var q = $q.defer();

      navigator.camera.cleanup(function() {
        q.resolve(arguments);
      }, function(err) {
        q.reject(err);
      });

      return q.promise;
    }
    
  }
}]);
angular.module('ngCordova.plugins.dialogs', [])

.factory('$cordovaDialogs', [function() {

  return {
    alert: function(message, callback, title, buttonName) {
	    return navigator.notification.alert.apply(navigator.notification, arguments);
    },

    confirm: function(message, callback, title, buttonName) {
	    return navigator.notification.confirm.apply(navigator.notification, arguments);
    },

    prompt: function(message, promptCallback, title, buttonLabels, defaultText) {
	    return navigator.notification.prompt.apply(navigator.notification, arguments);
    },

    beep: function(times) {
	    return navigator.notification.beep(times);
    }
  }
}]);
angular.module('ngCordova.plugins.geolocation', [])

.factory('$cordovaGeolocation', ['$q', function($q) {

  return {
    getCurrentPosition: function(options) {
      var q = $q.defer();

      navigator.geolocation.getCurrentPosition(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    },
    watchPosition: function(options) {
      var q = $q.defer();

      var watchId = navigator.geolocation.watchPosition(function(result) {
        // Do any magic you need
        q.notify(result);

      }, function(err) {
        q.reject(err);
      }, options);

      return {
        watchId: watchId,
        promise: q.promise
      }
    },

    clearWatch: function(watchID) {
      return navigator.geolocation.clearWatch(watchID);
    }
  }
}]);
angular.module('ngCordova.plugins.keyboard', [])

.factory('$cordovaKeyboard', [function () {

  return {
    hideAccessoryBar: function (bool) {
      return cordova.plugins.Keyboard.hideKeyboardAccessoryBar(bool);
    },

    close: function () {
      return cordova.plugins.Keyboard.close();
    },

    disableScroll: function (bool) {
      return cordova.plugins.Keyboard.disableScroll(bool);
    },

    isVisible: function () {
      return cordova.plugins.Keyboard.isVisible
    }

    //TODO: add support for native.keyboardshow + native.keyboardhide
  }
}]);
angular.module('ngCordova.plugins.network', [])

.factory('$cordovaNetwork', [function () {

  return {

    getNetwork: function () {
      return navigator.connection.type;
    },

    isOnline: function () {
      var networkState = navigator.connection.type;
      return networkState !== Connection.UNKNOWN && networkState !== Connection.NONE;
    },

    isOffline: function () {
      var networkState = navigator.connection.type;
      return networkState === Connection.UNKNOWN || networkState === Connection.NONE;
    }
  }
}]);
angular.module('ngCordova.plugins.splashscreen', [])

.factory('$cordovaSplashscreen', [ function () {

  return {
    hide: function () {
      return navigator.splashscreen.hide();
    },

    show: function () {
      return navigator.splashscreen.show();
    }
  };

}]);
