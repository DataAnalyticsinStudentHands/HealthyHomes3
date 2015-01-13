angular.module('Controllers').controller('mainController', function($scope, inspections, $sessionStorage, $localStorage, $state) {
    
    $scope.main = {};
    var d = new Date();
    $scope.todayDate = d.toLocaleDateString();
    $scope.inspections = inspections;
    //console.log($localStorage['inspections']);
    $scope.alert = function (text) {
        alert(text+'in Main');
    };
    $scope.goLayout = function() {
        $state.go('layout.floor');
    };
    $scope.goCityMap = function() {
        $state.go('map.city');
    };
})
.controller('loginCtrl', ['$scope', 'Auth', '$state', 'ngNotify', '$timeout', '$ionicLoading', function($scope, Auth, $state, ngNotify, $timeout, $ionicLoading) {
     if($scope.isAuthenticated() === true) {
         //IF SUCCESSFULLY AUTH-ED USER IS TRYING TO GO TO LOGIN PAGE => SEND TO HOME PAGE OF APP
         //just to change line
         $state.go('secure.inspections');
     }
     $scope.salt = "nfp89gpe"; //PENDING - NEED TO GET ACTUAL SALT
     $scope.$parent.submit = function() {
         if ($scope.userName && $scope.passWord) {
             document.activeElement.blur();
             $ionicLoading.show();
             $scope.passWordHashed = new String(CryptoJS.SHA512($scope.passWord + $scope.userName + $scope.salt));
             Auth.setCredentials($scope.userName, $scope.passWordHashed);
             $scope.userName = '';
             $scope.passWord = '';
             $scope.loginResultPromise = $scope.Restangular().all("users").one("myUser").get();
             $scope.success = false;
             $scope.loginResultPromise.then(function(result) {
                 $scope.loginResult = result;
                 $scope.loginMsg = "You have logged in successfully!";
                 Auth.confirmCredentials();
                 $state.go("secure.inspections", {}, {reload: true});
                 ngNotify.set($scope.loginMsg, 'success');
                 $scope.success = true;
                 $ionicLoading.hide();
             }, function(error) {
                 $scope.loginMsg = "Incorrect username or password.";
                 ngNotify.set($scope.loginMsg, {position: 'top', type: 'error'});
                 Auth.clearCredentials();
                 $scope.success = true;
                 $ionicLoading.hide();
             });
             $timeout(function() {
                 if(!$scope.success) {
                     $scope.loginMsg = "Incorrect username or password.";
                     ngNotify.set($scope.loginMsg, {position: 'top', type: 'error'});
                     Auth.clearCredentials();
                     $ionicLoading.hide();
                 } else {
                     //$scope.loginMsg = "Not doing it.";
                     //ngNotify.set($scope.loginMsg, {position: 'top', type: 'error'});
                 }
             }, 10000)
         } else {
             $scope.loginMsg = "Please enter a username and password.";
             ngNotify.set($scope.loginMsg, {position: 'top', type: 'error'});
         }
     };
 }])
.controller('registerCtrl', ['$scope', '$state', 'Auth', 'ngNotify', '$ionicLoading', function($scope, $state, Auth, ngNotify, $ionicLoading) {
    $scope.registerUser = function() {
        if($scope.password.password === $scope.confirm.password) {
            Auth.setCredentials("Visitor", "test");
            $scope.salt = "nfp89gpe";
            $scope.register.password = new String(CryptoJS.SHA512($scope.password.password + $scope.register.username + $scope.salt));
            $ionicLoading.show();
            $scope.$parent.Restangular().all("users").post($scope.register).then(
                function (success) {
                    $ionicLoading.hide();
                    Auth.clearCredentials();
                    //Auth.setCredentials($scope.register.username, $scope.register.password);
                    //Auth.confirmCredentials();
                    ngNotify.set("User account created!", {position: 'top', type: 'success'});
                    $state.go("login", {}, {reload: true});
                }, function (fail) {
                    $ionicLoading.hide();
                    Auth.clearCredentials();
                    ngNotify.set(fail.data.message, {position: 'top', type: 'error'});
                });
            Auth.clearCredentials();
        } else {
            if($scope.confirm.password === "") {
                $scope.password.password = "";
                $scope.confirm.password = "";
                ngNotify.set("Passwords must match!", {position: 'top', type: 'error'});
            } else {
                ngNotify.set("Password must not be empty!", {position: 'top', type: 'error'});
            }
        }
    }
}])
.controller('settings', ['$scope', '$state', 'Auth', '$ionicModal', '$ionicPopup', function($scope, $state, Auth, $ionicModal, $ionicPopup) {
    //OPENING THE MODAL TO LOG OUT A USER
    $scope.logOutUser = function(id) {
        $scope.openLogOut(id);
    };
    $scope.openLogOut = function () {
        var confirmPopup = $ionicPopup.confirm({
                title: 'Log Out',
                template: 'Are you sure you would like to log out?'
            });
                confirmPopup.then(function(res) {
            if(res) {
                 $scope.ok();
            } else {

            }
        });
        $scope.ok = function () {
            $scope.out();
        };
    };
    $scope.out = function() {
        Auth.clearCredentials();
        location.reload();
        $state.go("home", {}, {reload: true});
    }
}]);
