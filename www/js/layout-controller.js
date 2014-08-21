'use strict';
/* Controllers */
var layoutController = angular.module('layoutModuleController', []);

layoutController.controller('layoutCtrl', ['$scope', '$window','$state', 'layoutObjectModel','addObj','addSvgPoint','findGeom',
	function ($scope, $window, $state, layoutObjectModel, addObj, addSvgPoint, findGeom) { 
//        document.addEventListener("deviceready", onDeviceReady, false);
//        function onDeviceReady() {
        //https://github.com/hammerjs/hammer.js/wiki/Event-delegation-and-how-to-stopPropagation---preventDefaults
//        $scope.flagicons=[{
//                icontype: 'greenflag'
//            },{
//                icontype: 'yellowflag'
//            },{
//                icontype: 'redflag'
//        }];
        $scope.icons=[{
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
            },{
              icontype: 'flag'
        }];
//        $scope.iconSVGs=[{
//              icontype:  'svg_line'
//            },{
//              icontype:  'svg_rectangle'
//            },{
//              icontype:  'svg_circle'
//        }];
        //console.log(_.range(0,2000,50))
        $scope.alert = function (text) {
            alert(text);
        };
        //findClosestLine.testFunc();
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
        
//        var viewContainer = document.getElementById('grid-container');
//        layoutObjectModel.testFunc()
        $scope.newFloorRoom = function(){
            $scope.newFloorOrRoom = !$scope.newFloorOrRoom
        };
        $scope.gridShow1 = true; //in case we want to turn them off for some views
        $scope.gridShow5 = true;
        $scope.gridSizeHt = 2000; //just ng-init these? or get from some settings?
        $scope.gridSizeWd = 2000;
        var windowHt = $window.outerHeight;
        var windowWd = $window.outerWidth;
//        var gridElem = document.getElementById('floor-container');
//        var gridWd = gridElem.width;
        $scope.gridLineNumber = function(gridSizeHt,gridSizeWd){
            return _.range(0,2000,gridSizeWd) //everyfive feet
        }
        //console.log($scope.gridLineNumber(11,11))
        $scope.gridlinePts = function(gridSizeHt,gridSizeWd){
            return '5,5 2000,2000'
        }
        var gridMag = 1;
        $scope.magnifyGrid = function(num){
            var gridElem = angular.element(document.getElementById('floor-container'));
            var elemWidth = gridElem[0].offsetWidth;
            if (elemWidth == 2016){elemWidth = 2000}; //have to figure out where the margins are coming from
            var newNum = num * (elemWidth); 
            gridElem.css({'width':newNum+'px','height':newNum+'px'});
            gridMag = 2000/newNum;
        }
        var dragtheGrid = $scope.dragtheGrid = false;
        $scope.gridDrag = function(){
            dragtheGrid =! dragtheGrid;
            $scope.dragtheGrid = dragtheGrid;
        };
        $scope.dragGrid = function($event){
            if (dragtheGrid){
                $event.preventDefault();
                var deltaX = $event.gesture.deltaX;
                var deltaY = $event.gesture.deltaY;
                var offTop = $event.target.offsetTop + deltaY;
                var offLeft = $event.target.offsetLeft + deltaX;
                if (offTop > 0) { offTop = 0}; //need to also keep it from going off to the right
                if (offLeft > 0) { offLeft = 0};
                angular.element($event.target).css({'top':offTop,'left':offLeft});
            };
        }
//        $scope.gridMag = windowWd/gridWd;
//        console.log('gridMag: '+$scope.gridMag);
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
        console.log('fdas')
        console.log(layoutObjectModel);
        var inspectInd = 0; //will get from service or $state.params
        var currentInspection = layoutObjectModel.inspections[inspectInd];
//        $state.param.inspectInd = 0;
//        var currentInspection = layoutObjectModel.currentInspection();
        currentInspection.floors = floors;

        //console.log(layoutObjectModel)
        var currentFloor = $scope.currentFloor = [];
        var newFloorOrRoom = $scope.newFloorOrRoom = true;
        if(currentInspection.floors.length > 0){
            //take values from layoutObjectModel
            newFloorOrRoom = $scope.newFloorOrRoom = false;
            floors = currentInspection.floors;
            var floorInd = $state.params.floorInd = floors.indexOf(floor);
            if (floorInd == -1) { floorInd = 0 }; //just in case they have an inspection without a first floor
            currentFloor = $scope.currentFloor = currentInspection.floors[floorInd];
            floorPoints = $scope.floorPoints = currentInspection.floors[floorInd].floorPoints;
        };
            
        $scope.pointPath = function(arr){
            var rtnStr = '';
            for (var i = 0; i < arr.length; i++){
                rtnStr+=(' ' + arr[i][0]+','+arr[i][1]);
            }
            return rtnStr;
        };
        //http://geomalgorithms.com/a03-_inclusion.html [0 is online;>0 is Left of line;<0 is Right of Line
        var onLine = function(x1,y1,x2,y2,xTest,yTest){
            return ( ((x2-x1)*(yTest-y1)) - ((xTest-x1)* (y2-y1)) )
        }
        var windingTest = function(xTest,yTest, arr){
            var wn = 0;
            arr.push([arr[0][0],arr[0][1]])
            for (var i = 0; i < arr.length-1; i++) {
                if (arr[i][1] <= yTest) {
                    if (arr[i+1][1] > yTest){
                        if (onLine(arr[i][0],arr[i][1],arr[i+1][0],arr[i+1][1],xTest,yTest) > 0) {
                            wn += 1; }
                    }
                } else {
                    if (arr[i+1][1] <= yTest){
                        if (onLine(arr[i][0],arr[i][1],arr[i+1][0],arr[i+1][1],xTest,yTest) < 0){
                            wn -= 1; }
                    }
                }
            }
            arr.pop();
            return wn
        }
        $scope.testWn = function($event,arr){
            console.log(arr)
            $event.preventDefault();
            var wn = windingTest($event.gesture.center.pageX,$event.gesture.center.pageY,arr)
            return wn
        }
        $scope.addPoint = function($event,arr){
            var fingerX = $event.gesture.center.pageX;
            var fingerY = $event.gesture.center.pageY;
            var ind4new = findGeom.closestLine(arr,fingerX,fingerY);
            
            var newX = fingerX*gridMag;
            var newY = fingerY*gridMag;
            if(ind4new+1>arr.length || ind4new == 0 ){
                currentRoom.roomPoints.push([newX,newY]); //to end??
            }else{
                currentRoom.roomPoints.splice(ind4new,0,[newX,newY]);
            }
            currentRoom.measurePoints = $scope.measurePoints = findGeom.showMeasures(currentRoom.roomPoints);
        }
        $scope.pointPathDonut = function(arr){
            firstStr = $scope.pointPath(arr);
            insideDirection = arr.reverse();
            //add points to see if inside, and give a distance based on size of polygon
        }
                
        $scope.addMeasures = function(arr){
            var rtnStr = 'M'+arr[0][0]+','+arr[0][1]+' ';
            //INSTEAD: Have it extend on the slope, and draw a line perpendicular to the ditance line
//            arr.push([arr[0][0],arr[0][1]]) ---i equals different things depending on ng-whim
            
            for (var n = 0; n < arr.length+1; n++){
                var i = 0;
                if (n != arr.length){ i = n};
                //var i = 0;
                //if (n == arr.length){ i=0 } else { i=n-1 };
                var controlX = arr[i][0]*1.1;
                var controlY = arr[i][1]*1.1;
                var control2X = arr[i][0]*1.1;
                var control2Y = arr[i][1]*1.1;
                var insidePoly = windingTest(controlX,controlY,arr)
                if (insidePoly == 0){
                    console.log('insidePoly'+i)
                    controlX = arr[i][0]*1.9;
                    controlY = arr[i][1]*1.9;
                    control2X = arr[i][0]*1.9;
                    control2Y = arr[i][1]*1.9;
                };
                rtnStr += 'C';
                rtnStr += ' '+controlX +','+controlY; //first control
                rtnStr += ' '+control2X +','+control2Y; //second control point
                rtnStr += ' '+arr[i][0]+','+arr[i][1]; //actual points
            }
//            arr.pop();
            return rtnStr;
        }
        
            
    
        
        $scope.newFloor = function(floor){
            if (floors.indexOf(floor)==-1){
                console.log('add')
                room = '';
                rooms = [];
//                $scope.tpospx = '250px';
//                $scope.lpospx = '150px';
//                $scope.container = 'grid-container';
                floors.push(floor);
                floorInd = $state.params.floorInd = floors.indexOf(floor);
//                if (!$scope.drawFromRooms){
                floorPoints = $scope.floorPoints = [[100,100],[300,100],[300,300],[100,300]]; //add this way and can bezier later
                    //console.log('still need to think through')
                    //create a floorPoint list with four corners
                    //addObj.newObj($scope,floor+"_floor",floorInd)
                //} else {
                //    floorPoints = $scope.floorPoints = [];
               // };
                currentInspection.floors[floorInd] = [floor];
                currentInspection.floors[floorInd].floorPoints = $scope.floorPoints = floorPoints; 
                
                //need floorPoints to be added here!!!!
            }else{
                floorInd = $state.params.floorInd = floors.indexOf(floor); //because indexOf doesn't update in order
                //will I need to redo all the sub indices, or will the .state do it??
            };
            $state.go('layout.floor');
            $state.params.inspectInd = 0; //will need to do this differently
            $state.params.floorName = floor; //can that have an ng-show or ui-sref-active???
            currentFloor = currentInspection.floors[floorInd]; //make sure picks up original
            console.log(currentInspection)
            
            //floorPoints
            
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
        var roomInd = $state.params.roomInd = rooms.indexOf(room);
        var currentRoom = [];
        //var currentRoom = currentFloor[roomInd] || false;
        $scope.newRoom = function(room){
            console.log(currentFloor.length+' currentfloot')
            if (currentFloor.length > 0) {
                if (rooms.indexOf(room)==-1){
                    //have room list add possibility of room2 as well as existing 
                    //http://www.bennadel.com/blog/2452-mixing-static-and-dynamic-data-in-an-angularjs-select-menu.htm
//                    $scope.tpospx = '360px';
//                    $scope.lpospx = '260px';
//                    $scope.container = 'grid-container';
                    rooms.push(room);
                    $scope.rooms = rooms;
                    roomInd = $state.params.roomInd = rooms.indexOf(room);
                    //addSvgPoint.newSvg($scope,'line',3);
                    //addObj.newObj($scope,room+"_room",roomInd);
                    currentFloor[roomInd] = [room];
                    console.log('wet');
                    console.log(currentFloor);
                } else {
                    roomInd = $state.params.roomInd = rooms.indexOf(room);
                };
                $state.go('layout.floor.room');
                newFloorOrRoom = $scope.newFloorOrRoom = false;
                $state.params.roomName = room; //can that have an ng-show or ui-sref-active??? how is it inherited?
                currentRoom = currentFloor[roomInd]; //make sure picks up original
                if (!currentRoom.roomPoints){
                    currentRoom.roomPoints = $scope.roomPoints = [[220,220],[320,220],[320,320],[220,320]]; //should be calculated from previous?
                    
                };
                if (!currentRoom.measurePoints){
                    currentRoom.measurePoints = $scope.measurePoints = findGeom.showMeasures(currentRoom.roomPoints);
                }
                $scope.currentFloor = currentFloor;
                currentInspection.floors[floorInd] = currentFloor;
            } else {
                alert('Must add floor/area to place room inside');
                return
//                if (!currentFloor[roomInd]){
//                    console.log('roomInd'+roomInd)
//                    currentFloor[roomInd] = $scope.rooms = rooms;
//                }else{
//                    rooms = $scope.rooms = currentFloor.rooms;
//                };
                //roomPoints = currentRoom.roomPoints;
                
//                if (!currentRoom[layoutObj]){
//                    currentRoom[layoutObj] = layoutObjs;
//                }else{
//                    rooms = currentRoom.layoutObjs;
//            }
            console.log(currentRoom)
            };
        };
        $scope.pinchResize = function($event){
            
            $event.preventDefault();
            
            $scope.gesture = $event.gesture;
            $scope.touches = $event.gesture.touches[0];
            $scope.touches1 = $event.gesture.touches[1];
            currentRoom.measurePoints = $scope.measurePoints = findGeom.showMeasures(currentRoom.roomPoints);
        };
        $scope.dragPoints = function($event,i){
            $event.preventDefault();
            currentRoom.roomPoints[i][0] = 10*Math.round(($event.gesture.center.pageX*gridMag)/10);
            currentRoom.roomPoints[i][1] = 10*Math.round(($event.gesture.center.pageY*gridMag)/10);
            currentRoom.measurePoints = $scope.measurePoints = findGeom.showMeasures(currentRoom.roomPoints);
        };
        $scope.dragShapes = function($event){ //need to work in zoom stuff - needs copy and drag from left top to smooth it 
            var copyPoints = _.clone(currentRoom.roomPoints)
            $event.preventDefault();
            var xtraOffX = 0;
            var xtraOffY = 0;
            console.log(copyPoints.length)
            if(copyPoints.length > 3){
                xtraOffX = Math.abs(copyPoints[0][0]-copyPoints[1][0])/2;
                xtraOffY = Math.abs(copyPoints[0][1]-copyPoints[2][1])/2; //works well for squares
            }
            var dragX = ($event.gesture.center.pageX*gridMag)-copyPoints[0][0]-xtraOffX;
            var dragY = ($event.gesture.center.pageY*gridMag)-copyPoints[0][1]-xtraOffY;
            for (var n = 0;n<currentRoom.roomPoints.length;n++){
                currentRoom.roomPoints[n][0] = 10*Math.round((copyPoints[n][0] + dragX)/10);
                currentRoom.roomPoints[n][1] = 10*Math.round((copyPoints[n][1] + dragY)/10);
            };
            currentRoom.measurePoints = $scope.measurePoints = findGeom.showMeasures(currentRoom.roomPoints);
        };
        $scope.closestIndices = 0;
        $scope.dragLineStart = function($event){
            $event.preventDefault();
//            $scope.gesture = $event.gesture;
            var arr = _.clone(currentRoom.roomPoints);
            var fingerX = $event.gesture.center.pageX*gridMag;
            var fingerY = $event.gesture.center.pageY*gridMag;
//            var hypotRatio = 0;
//            var newRatio = 0;
            var ind4new = 0;
            $scope.ind4new = ind4new = findGeom.closestLine(arr,fingerX,fingerY);
            $scope.xtraOffX1 = fingerX - arr[ind4new-1][0];
            $scope.xtraOffY1 = fingerY - arr[ind4new-1][1];
            if(ind4new+1>arr.length){ind4new = 0};
            $scope.xtraOffX2 = fingerX - arr[ind4new][0];
            $scope.xtraOffY2 = fingerY - arr[ind4new][1];
        }
        $scope.dragLines = function($event){
            $event.preventDefault();
            var ind4new = $scope.ind4new;
            var xtraOffX1 = $scope.xtraOffX1;
            var xtraOffY1 = $scope.xtraOffY1;
            var xtraOffX2 = $scope.xtraOffX2;
            var xtraOffY2 = $scope.xtraOffY2;
            var dragX1 = ($event.gesture.center.pageX*gridMag)-xtraOffX1;
            var dragY1 = ($event.gesture.center.pageY*gridMag)-xtraOffY1;
            var dragX2 = ($event.gesture.center.pageX*gridMag)-xtraOffX2;
            var dragY2 = ($event.gesture.center.pageY*gridMag)-xtraOffY2;
            
//            var dragX = ($event.gesture.center.pageX*gridMag)-arr[0][0]-xtraOffX;
//            var dragY = ($event.gesture.center.pageY*gridMag)-arr[0][1]-xtraOffY;
            currentRoom.roomPoints[ind4new-1][0] = 10*Math.round(dragX1/10);// 10*Math.round((arr[ind4new-1][0] + dragX)/10);
            currentRoom.roomPoints[ind4new-1][1] = 10*Math.round(dragY1/10); //10*Math.round((arr[ind4new-1][1] + dragY)/10);
            if(ind4new+1>currentRoom.roomPoints.length){ind4new = 0};
            currentRoom.roomPoints[ind4new][0] = 10*Math.round(dragX2/10); //10*Math.round((arr[ind4new][0] + dragX)/10);
            currentRoom.roomPoints[ind4new][1] = 10*Math.round(dragY2/10); //10*Math.round((arr[ind4new][1] + dragY)/10);
//            for (var n = ind4new-1;n<ind4new+1;n++){
//                currentRoom.roomPoints[n][0] = 10*Math.round((arr[n][0] + dragX)/10);
//                currentRoom.roomPoints[n][1] = 10*Math.round((arr[n][1] + dragY)/10);
//            };
            currentRoom.measurePoints = $scope.measurePoints = findGeom.showMeasures(currentRoom.roomPoints);
        };
        $scope.showMeasurePoints = function(){
            return findGeom.showMeasures(currentRoom.roomPoints);
        }
        
        $scope.cons = function(){
            console.log(currentInspection)
        }
//        $scope.dragLines = function($event){
//            setTimeout(100);
//            var deltaX = $event.gesture.deltaX;
//            var deltaY = $event.gesture.deltaY;
//            console.log($event)
//            console.log($event.target.attributes[4])
//            for (var n = 0;n<$scope.floorPoints4Lines.length;n++){
//                $scope.floorPoints4Lines[n][0] += deltaX;
//                $scope.floorPoints4Lines[n][1] += deltaY;
//                $scope.floorPoints4Lines[n][2] += deltaX;
//                $scope.floorPoints4Lines[n][3] += deltaY;
//            }
//        };
        $scope.iconWidth = 145;
        $scope.iconHeight = 145;
        $scope.iconFill = '#60FF00'; //green - red= #FF0000; yellow=#FFFF0D;
        var layoutObjs = [];
        var layoutObjInd = 0; //layoutObjs.indexOf(layoutObj);
        var XYObj = [];
        $scope.newObj = function(obj){
            if (!currentRoom) { //have to rethink
                alert('Must add room to place objects inside'); 
                return
                //or have it just use room as container?? have it go to a modal container
            } else {
                if (currentRoom.layoutObjs){
                    layoutObjs = currentRoom.layoutObjs;};
//                    $scope.tpospx = '200px'; //need to figure out better process for placement
//                    $scope.lpospx = '200px';
//                    $scope.container = 'grid-container'; //make it room?
                XYObj = [layoutObjs.length*100,200,obj];
                $scope.iconWidth = 45;
                $scope.iconHeight = 45;
                layoutObjs.push(XYObj);
                layoutObjInd = layoutObjs.indexOf(XYObj);
                currentRoom.layoutObjs = $scope.layoutObjs = layoutObjs;
                //addObj.newObj($scope,obj,layoutObjInd);
            };
        };
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


