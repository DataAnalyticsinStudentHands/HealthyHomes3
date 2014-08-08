'use strict';
/* Controllers */
var layoutController = angular.module('layoutModuleController', []);

layoutController.controller('layoutCtrl', ['$scope', '$state','$stateParams', 'layoutObjectModel', 
	function ($scope, $state,$stateParams, layoutObjectModel) { 
        console.log($state)
        $scope.alert = function (text) {
            alert(text);
        };
        //$scope.crtype = 'line';
        $scope.layoutObjectModel = layoutObjectModel; //this can be repeated for other controllers to share data model
        //alert(Object.keys(layoutObjectModel.list));
        $scope.testFunction = function () {
            alert('from controller')
        };
        
        //var svgItems = []; //internal descriptors go here, but are placed from directive
        //var layoutItems = [];
        var relPositions = []; //x,y as transformed into percent of relContainer
        
        var layoutObjects = [];
    //var relContainer = []; //height and width, although used as 100% reference for relPositions -- is each room a relative container/ no just the background grid at full size????
        var rooms = []; //is relative position for objects - what happens if a room is added after tags?? need to add included objects?
        var floors = []; //includes all rooms as positioned relative to it
    
        var layoutData = [];
        this.addNewLayoutObject = function(layoutObject){
            layoutData[$state.current].floors[$state.floor].rooms[$state.room].layoutObjects.push(layoutObject);
        };
        this.addNewRoom = function(roomObject){
        };
        this.addNewFloor = function(floorObject){
        };
        
        $scope.selectLayoutObject = function (layoutObject) {
            layoutObjectModel.setSelectedObject(layoutObject);
        };
        $scope.isSelected = function(layoutObject) {
            return layoutObject === layoutObjectModel.selectedLayoutObject;
        };
        $scope.txt = 'I am in the controller $scope';
//        $scope.myDrag = function($event) {
//            console.log($event.gesture);
//            $scope.gesture = $event.gesture;
//        };
        $scope.type = '--';    
        //$scope.gesture = $event.gesture;
        $scope.handleGesture = function($event) {
//http://stackoverflow.com/questions/10246305/android-browser-touch-events-stop-display-being-updated-inc-canvas-elements-h/10495741#10495741
            function touchHandlerDummy($event) 
                {
                $event.preventDefault();
                return false;
                }
            document.addEventListener("touchstart", touchHandlerDummy, false);
            document.addEventListener("touchmove", touchHandlerDummy, false);
            document.addEventListener("touchend", touchHandlerDummy, false);
            console.log($event.type);
            //console.log($event.gesture);
            $scope.type = $event.type;
            $scope.gesture = $event.gesture;
        //scope.topPosition = e.gesture.center.pageY;
        };
    
 }]);


