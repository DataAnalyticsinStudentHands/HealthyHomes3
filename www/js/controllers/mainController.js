angular.module('Controllers').controller('mainController', function($scope, inspections, $sessionStorage, $localStorage, $state) {
    
    $scope.main = {};
    var d = new Date();
    $scope.todayDate = d.toLocaleDateString();
    $scope.inspections = inspections;
    //console.log($localStorage['inspections']);
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