angular.module('Controllers').controller('mainController', function($scope, $state) {
    $scope.main = {};
    console.log('loaded main controller');
    $scope.alert = function (text) {
        alert(text+'in');
    };
    $scope.test = function() {
        alert('test in ctrl scope');
    };
    $scope.goLayout = function() {
        $state.go('layout.floor');
    };
    $scope.goCityMap = function() {
        $state.go('map.city');
    };
});