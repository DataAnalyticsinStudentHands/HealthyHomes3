'use strict';
/* Controllers */
var layoutController = angular.module('layoutModuleController', []);

layoutController.controller('layoutCtrl', ['$scope', '$state', 'layoutObjectModel', 
	function ($scope, $state, layoutObjectModel) { //why is this being called twice???
        //console.log(layoutObjectModel)
        
        $scope.alert = function (text) {
            alert(text);
        };
        //$scope.crtype = 'line';
        $scope.layoutObjectModel = layoutObjectModel; //this can be repeated for other controllers to share data model
        //alert(Object.keys(layoutObjectModel.list));
        $scope.testFunction = function () {
            alert('from controller')
        };
        
        var svgItems = []; //internal descriptors go here, but are placed from directive
        var iconItems = [];
        var layoutObjects = [];
        var relPositions = []; //x,y as transformed into percent of relContainer
    //var relContainer = []; //height and width, although used as 100% reference for relPositions -- is each room a relative container/ no just the background grid at full size????
        var rooms = []; //is relative position for objects - what happens if a room is added after tags?? need to add included objects?
        var floors = []; //includes all rooms as positioned relative to it
    
        var layoutData = [];
    //var ObjData = []; //have this call the $http of localStorage if not allowed.
    //var layoutObjectModel = [];
//    this.layoutObjectModel = layoutObjectModel;
    
    //create and save object in the right place
        this.addNewLayoutObject = function(layoutObject){
//        layoutObjects = layoutData['current'].floors['current'].rooms['current'].layoutObjects;
//        layoutObjects.push(layoutObject);
//        layoutData['current'].floors['current'].rooms['current'].layoutObjects = layoutObjects;
        //can we push with:
        //state has to be set as current!! isActiveFloor; isActiveRoom; isActiveLayout
        layoutData[$state.current].floors[$state.current].rooms[$state.current].layoutObjects.push(layoutObject);
        
        
        //the directive has created the object
        //discriminate on object.type?
        //push to right level
        //add to larger object as appropriate
        //when do we need to write?
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


