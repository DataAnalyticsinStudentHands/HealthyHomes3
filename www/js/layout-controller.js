'use strict';
/* Controllers */
var layoutController = angular.module('layoutModuleController', []);

layoutController.controller('layoutCtrl', ['$scope', '$window','$state','$stateParams', 'layoutObjectModel','uuid','$compile','addObj','addSvgPoint',
	function ($scope, $window, $state, $stateParams, layoutObjectModel, uuid, $compile, addObj, addSvgPoint) { 
//        document.addEventListener("deviceready", onDeviceReady, false);
//        function onDeviceReady() {
        $scope.flagicons=[{
                icontype: 'greenflag'
            },{
                icontype: 'yellowflag'
            },{
                icontype: 'redflag'
        }];
        $scope.icons3=[{
              icontype:  'sink'
            },{
              icontype:  'window'
            },{
              icontype:  'stairs'
            },{
              icontype:  'fire'
            },{
              icontype:  'toilet'
            },{
              icontype:  'tub'
            },{
              icontype:  'door'
        }];
        $scope.iconSVGs=[{
              icontype:  'svg_line'
            },{
              icontype:  'svg_rectangle'
            },{
              icontype:  'svg_circle'
        }];
        //console.log(_.range(0,2000,50))
        $scope.alert = function (text) {
            alert(text);
        };
        
//        document.addEventListener("deviceready", onDeviceReady, false);
    
        function touchHandler(event)
            {
            var touches = event.changedTouches,
            first = touches[0],
            type = "";
            switch(event.type)
            {
            case "touchstart": type = "mousedown"; break;
            case "touchmove":  type="mousemove"; break;        
            case "touchend":   type="mouseup"; break;
            default: return;
            }
            var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1,
                first.screenX, first.screenY,
                   first.clientX, first.clientY, false,
                         false, false, false, 0/*left*/, null);
            first.target.dispatchEvent(simulatedEvent);
             event.preventDefault();
             return;
            }
        document.addEventListener("touchstart", touchHandler, true);
        document.addEventListener("touchmove", touchHandler, true);
        document.addEventListener("touchend", touchHandler, true);
        document.addEventListener("touchcancel", touchHandler, true);  
    //}
        
        var viewContainer = document.getElementById('grid-container');
        
        $scope.gridShow = true;
        $scope.gridSizeHt = 2000; //just ng-init these? or get from some settings?
        $scope.gridSizeWd = 2000;
        var windowHt = $window.outerHeight;
        var windowWd = $window.outerWidth;
        $scope.gridLineNumber = function(gridSizeHt,gridSizeWd){
            return _.range(0,2000,50) //everyfive feet
        }
        //console.log($scope.gridLineNumber(11,11))
        $scope.gridlinePts = function(gridSizeHt,gridSizeWd){
            return '5,5 2000,2000'
        }
        $scope.floorLists = ['neighborhood', 'exterior', 'first', 'second', 'third', 'basement', 'attic', 'garage', 'section'];
        $scope.roomLists = ['exterior','living room','bath','closet','kitchen','dining room'];
        var floors = []; 
        var floor = $scope.floor;
        var floorPoints = $scope.floorPoints = []; //if empty, nothing is drawn on floor.html 
        //$scope.floorPoints = [[100,100],[150,100],[150,150],[100,150]];
        $scope.roomLineEdit = false; //svgEdit is now set through isolate scopes on drag-save, but may change
        var rooms = [];
        var room = $scope.room;
        var roomPoints = $scope.roomPoints = [[10,10],[150,100],[150,150],[100,150]]; //[]; //have to decide which one is active on first load; how do we get from $scope?
        $scope.layoutObjectModel = layoutObjectModel; 
        var inspectInd = 0; //will get from service or $stateParam
        var currentInspection = layoutObjectModel.inspections[inspectInd];
        currentInspection.floors = floors;

        //console.log(layoutObjectModel)
        var currentFloor = $scope.currentFloor = [];
        var newFloorOrRoom = $scope.newFloorOrRoom = true;
        if(currentInspection.floors.length > 0){
            //take values from layoutObjectModel
            newFloorOrRoom = $scope.newFloorOrRoom = false;
            floors = currentInspection.floors;
            var floorInd = $stateParams.floorInd = floors.indexOf(floor);
            if (floorInd == -1) { floorInd = 0 }; //just in case they have an inspection without a first floor
            currentFloor = $scope.currentFloor = currentInspection.floors[floorInd];
            floorPoints = $scope.floorPoints = currentInspection.floors[floorInd].floorPoints;
        };
            
        $scope.pointPath = function(arr){
//            console.log(arr)
            var rtnStr = '';
            for (var i = 0; i < arr.length; i++){
                rtnStr+=(' ' + arr[i][0]+','+arr[i][1])
//                console.log(rtnStr)
            }
//            console.log(rtnStr);
            return rtnStr;
        };
        
    
        
        $scope.newFloor = function(floor){
            if (floors.indexOf(floor)==-1){
                console.log('add')
                room = '';
                rooms = [];
//                $scope.tpospx = '250px';
//                $scope.lpospx = '150px';
//                $scope.container = 'grid-container';
                floors.push(floor);
                floorInd = $stateParams.floorInd = floors.indexOf(floor);
                if (!$scope.drawFromRooms){
                    floorPoints = $scope.floorPoints = [[100,100],[300,100],[300,300],[100,300]]; //add this way and can bezier later
                    console.log('still need to think through')
                    //create a floorPoint list with four corners
                    //addObj.newObj($scope,floor+"_floor",floorInd)
                } else {
                    floorPoints = $scope.floorPoints = [];
                };
                currentInspection.floors[floorInd] = [floor];
                currentInspection.floors[floorInd].floorPoints = $scope.floorPoints = floorPoints; 
                
                //need floorPoints to be added here!!!!
            }else{
                floorInd = $stateParams.floorInd = floors.indexOf(floor); //because indexOf doesn't update in order
                //will I need to redo all the sub indices, or will the .state do it??
            };
            $state.go('layout.floor');
            $stateParams.floorName = floor; //can that have an ng-show or ui-sref-active???
            currentFloor = currentInspection.floors[floorInd]; //make sure picks up original
            console.log(currentInspection)
            
            //floorPoints
            console.log(currentFloor)
            //
            //all the state management things
        };
        $scope.floorPoints4Lines = [[100,100,300,100],[300,100,300,300],[300,300,100,300],[100,300,100,100]]
        
//        var floorInd = $stateParams.floorInd = floors.indexOf(floor);
        $scope.floorPointPath = function(){
            //returns value of floorPoints, etc.
        }
        var room = $scope.room || '';
        var rooms = $scope.rooms = [];
        var roomInd = $stateParams.roomInd = rooms.indexOf(room);
        var currentRoom = [];
        //var currentRoom = currentFloor[roomInd] || false;
        $scope.newRoom = function(room){
            if (!currentFloor) {
                alert('Must add floor/area to place room inside');
                return
            } else {
//                if (!currentFloor[roomInd]){
//                    console.log('roomInd'+roomInd)
//                    currentFloor[roomInd] = $scope.rooms = rooms;
//                }else{
//                    rooms = $scope.rooms = currentFloor.rooms;
//                };
                console.log(rooms)
                console.log(currentFloor)
                if (rooms.indexOf(room)==-1){
                    //confirm if they want to add two by same name
                    $scope.tpospx = '360px';
                    $scope.lpospx = '260px';
                    $scope.container = 'grid-container';
                    rooms.push(room);
                    $scope.rooms = rooms;
                    roomInd = $stateParams.roomInd = rooms.indexOf(room);
                    //addSvgPoint.newSvg($scope,'line',3);
                    //addObj.newObj($scope,room+"_room",roomInd);
                    currentFloor[roomInd] = [room];
                    console.log('wet')
                    console.log(currentFloor)
                } else {
                    roomInd = $stateParams.roomInd = rooms.indexOf(room);
                };
                $state.go('layout.floor.room');
                newFloorOrRoom = $scope.newFloorOrRoom = false;
                $stateParams.roomName = room; //can that have an ng-show or ui-sref-active??? how is it inherited?
                currentRoom = currentFloor[roomInd]; //make sure picks up original
                if (!currentRoom.roomPoints){
                    currentRoom.roomPoints = $scope.roomPoints = [[120,120],[220,120],[220,220],[120,220]]; //should be calculated from previous?
                    
                };
                $scope.currentFloor = currentFloor;
                currentInspection.floors[floorInd] = currentFloor;
                console.log(currentFloor)
                //roomPoints = currentRoom.roomPoints;
                
//                if (!currentRoom[layoutObj]){
//                    currentRoom[layoutObj] = layoutObjs;
//                }else{
//                    rooms = currentRoom.layoutObjs;
//            }
            console.log(currentRoom)
            };
        };
        $scope.dragAlone = function($event,ind){
            setTimeout(1000);
            var deltaX = $event.gesture.deltaX;
            var deltaY = $event.gesture.deltaY;
            currentFloor.floorPoints[ind][0] += deltaX;
            currentFloor.floorPoints[ind][1] += deltaY;
        }
        $scope.dragAloneRoom = function($event,ind,vals){
            setTimeout(100);
            var deltaX = $event.gesture.deltaX;
            var deltaY = $event.gesture.deltaY;
            currentRoom.roomPoints[ind][0] = vals[0]+deltaX;
            currentRoom.roomPoints[ind][1] = vals[1]+deltaY;
        }
        $scope.dragShapes = function($event){ //need to work in zoom stuff
            setTimeout(100);
            $event.preventDefault();
            var deltaX = $event.gesture.deltaX;
            var deltaY = $event.gesture.deltaY;
//            var newX = $event.gesture.center.pageX-
            console.log($event)
            for (var n = 0;n<currentRoom.roomPoints.length;n++){
//                var tmpY = currentRoom.roomPoints[n][1]
//                var newX = currentRoom.roomPoints[n][0] + ($event.gesture.center.pageX - currentRoom.roomPoints[n][0]) 
//                currentRoom.roomPoints[n][0] = $event.gesture.center.pageX;
//                currentRoom.roomPoints[n][0] = newX;
                currentRoom.roomPoints[n][0] += deltaX;
                currentRoom.roomPoints[n][1] += deltaY;
            }
        };
        var copyPoints = [];
        $scope.dragShapes2 = function($event,copyPoints){ //need to work in zoom stuff
            $event.preventDefault();
//            var deltaX = $event.gesture.deltaX;
//            var deltaY = $event.gesture.deltaY;
//            var newX = $event.gesture.center.pageX-
//            console.log('dragShapes2')
//            console.log($event)
            for (var n = 0;n<copyPoints.length;n++){
                
                var deltaX = $event.gesture.deltaX;
                var deltaY = $event.gesture.deltaY;
//                var deltaY = $event.gesture.deltaY;
                
//                copyRoomPoints[n][0] = currentRoom.roomPoints[n][0]
//                copyRoomPoints[n][1] = currentRoom.roomPoints[n][1]
                var tmpX = copyPoints[n][0]
                var tmpY = copyPoints[n][1]
//                var newY = deltaY+tmpY
                var pageDistX = $event.gesture.center.pageX-tmpX
                var pageDistY = $event.gesture.center.pageY-tmpY
//                if($event){iEvent++
//                    console.log(iEvent)
////                    console.log(iEvent%10)
////                    console.log(iEvent/10)
//            }
//                var newX = currentRoom.roomPoints[n][0] + ($event.gesture.center.pageX - currentRoom.roomPoints[n][0]) 
//                currentRoom.roomPoints[n][0] = $event.gesture.center.pageX;
//                currentRoom.roomPoints[n][0] = newX;
//                currentRoom.roomPoints[n][0] += deltaX;
                
//                currentRoom.roomPoints[n][1] = 0;
                copyPointsPoints[n][0] = $event.gesture.center.pageX+pageDistX;
                copyPoints[n][1] = $event.gesture.center.pageY+pageDistY;
                console.log(copyPoints)
//                newY = 0;
//                deltaY = 0;
                
            }
        };
        $scope.cons = function(){
            console.log(currentInspection)
        }
        $scope.dragLines = function($event){
            setTimeout(100);
            var deltaX = $event.gesture.deltaX;
            var deltaY = $event.gesture.deltaY;
            console.log($event)
            console.log($event.target.attributes[4])
            for (var n = 0;n<$scope.floorPoints4Lines.length;n++){
                $scope.floorPoints4Lines[n][0] += deltaX;
                $scope.floorPoints4Lines[n][1] += deltaY;
                $scope.floorPoints4Lines[n][2] += deltaX;
                $scope.floorPoints4Lines[n][3] += deltaY;
            }
        };
        var layoutObjs = [];
        var layoutObjInd = 0; //layoutObjs.indexOf(layoutObj);
        $scope.newObj = function(obj){
            if (!currentRoom) { //have to rethink
                alert('Must add room to place objects inside'); 
                return
                //or have it just use room as container?? have it go to a modal container
            } else {
                $scope.tpospx = '200px'; //need to figure out better process for placement
                $scope.lpospx = '200px';
                $scope.container = 'grid-container'; //make it room?
                layoutObjs.push(obj);
                layoutObjInd = layoutObjs.indexOf(layoutObj);
                addObj.newObj($scope,obj,layoutObjInd);
            };
                    //console.log($stateParams.floor) //better to do $state
        };
//        $scope.points = [[1,2],[15,23],[45,14]] //as percentage of 100
//        if ( layoutObjectModel.inspections.floors[floor]) {  //should be the selectRoom, which should be mandatory
//            var room = $scope.room = layoutObjectModel.inspections.floors.floor[room]
//        }else{
//            layoutObjectModel.inspections.floors[floor] = ['posArray','lineStyle','color']
//            layoutObjectModel.inspections.floors[floor].push([room]);  //room and floor can be both exterior
////            layoutObjectModel.inspections.floors.rooms.push(); //for the room
//            console.log(layoutObjectModel)
//        };
//        layoutObjectModel.inspections.floors.rooms.push(['redflag',[22,44]]);
        
        //addLayoutObject is below this? or each add has to look for this? How does it deal with someone not doing it right direction??
        
        //or - from the service, create the first object, and then make these only with add/delete, etc.
        //
        
        
//        $scope.goFloor = function(selectFloor) {
//            if (layoutObjectModel.inspections['floors']){
//                $state.go(floor);
//                //do I have to add data to the stateParams? I think it's covered by app.js
//            }else{
//                layoutObjectModel.inspections.floors = rooms;
//            }
//        };
        
        
//        console.log(layoutObjectModel)
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
//        this.addNewLayoutObject = function(layoutObject){
//            layoutData[$state.current].floors[$state.floor].rooms[$state.room].layoutObjects.push(layoutObject);
//        };
//        this.addNewRoom = function(roomObject){
//        };
//        this.addNewFloor = function(floorObject){
//        };
        
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


