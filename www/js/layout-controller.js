'use strict';
/* Controllers */
var layoutController = angular.module('layoutModuleController', []);

layoutController.controller('layoutCtrl', ['$scope', '$window','$state','$stateParams', 'layoutObjectModel','addObj','addSvgPoint','findGeom',
	function ($scope, $window, $state, $stateParams, layoutObjectModel, addObj, addSvgPoint, findGeom) { 
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
            console.log(elemWidth)
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
        var inspectInd = 0; //will get from service or $stateParam
        var currentInspection = layoutObjectModel.inspections[inspectInd];
//        var currentInspection = layoutObjectModel.currentInspection();
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
            //find closest corners
            var fingerX = $event.gesture.center.pageX;
            var fingerY = $event.gesture.center.pageY;
            //var pythagDist = Math.sqrt((fingerX-arr[0][0])*(fingerY-arr[0][1]));
            var hypotRatio = 0;
            var newRatio = 0;
            var ind4new = 0;
//            var slope1 = 0;
//            var slope2 = 0;
            arr.push([arr[0][0],arr[0][1]])
            for (var i = 0;i<arr.length-1;i++){
                //find sides from finger to endpoints of line and then look for closest to same length
                newRatio = Math.sqrt(((arr[i+1][0]-arr[i][0])*(arr[i+1][0]-arr[i][0]))+((arr[i+1][1]-arr[i][1])*(arr[i+1][1]-arr[i][1])))/(Math.sqrt(((fingerX-arr[i][0])*(fingerX-arr[i][0]))*((fingerY-arr[i][1])*(fingerY-arr[i][1])))+Math.sqrt(((fingerX-arr[i+1][0])*(fingerX-arr[i+1][0]))+((fingerY-arr[i+1][1])*(fingerY-arr[i+1][1]))));
                if (newRatio > hypotRatio){
                    hypotRatio = newRatio;
                    newRatio = 0;
                    ind4new = i+1;
                };
            }
            arr.pop();
            var newX = fingerX*gridMag;
            var newY = fingerY*gridMag;
            if(ind4new+1>arr.length || ind4new == 0 ){
                currentRoom.roomPoints.push([newX,newY]); //to end??
            }else{
                currentRoom.roomPoints.splice(ind4new,0,[newX,newY]);
            }
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
        $scope.showMeasures = function(arr){
            var dist = Math.sqrt(((arr[0][0]-arr[1][0])*(arr[0][0]-arr[1][0]))+((arr[i][1]-arr[1][1])*(arr[0][1]-arr[1][1])));
            //pythag distances for between points
            //make it like showing the other lines or circles?
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
                    currentRoom.roomPoints = $scope.roomPoints = [[220,220],[320,220],[320,320],[220,320]]; //should be calculated from previous?
                    
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
        $scope.pinchResize = function($event){
            $event.preventDefault();
            //not sure how to do this for debugging - my thought is we'd just resize whole distance on x and on y
            console.log($event.gesture.deltaX)
        }
        $scope.roomLines = function(points4line){ // too much for Angular to digest
            var lines = [];
            var firstLine = [];
            var line = [];
            var line2 = [];
            for(var i = 0;i<points4line.length;i++){
                if (i%2 == 0){
                    line.push(points4line[i]);
                    if(line.length==2){
                        lines.push(line);
                    }else{
                        firstLine.push(line)
                    };
                    line = [];
                    line2.push(points4line[i]);
                }else{
                    line.push(points4line[i]);
                    line2.push(points4line[i]);
                    if (line2.length==2){
                        lines.push(line2);
                        line2 = [];
                    };
                };
                firstLine.push(line2);
                lines.push(firstLine);
            }
            console.log(lines)
            return lines;
        }
        $scope.dragPoints = function($event,i){
            $event.preventDefault();
            currentRoom.roomPoints[i][0] = 10*Math.round(($event.gesture.center.pageX*gridMag)/10);
            currentRoom.roomPoints[i][1] = 10*Math.round(($event.gesture.center.pageY*gridMag)/10);
        }

//        $scope.dragAloneRoom = function($event,ind,vals){
//            setTimeout(100);
//            var deltaX = $event.gesture.deltaX;
//            var deltaY = $event.gesture.deltaY;
//            currentRoom.roomPoints[ind][0] = vals[0]+deltaX;
//            currentRoom.roomPoints[ind][1] = vals[1]+deltaY;
//        }
        $scope.dragShapes = function($event){ //need to work in zoom stuff - needs copy and drag from left top to smooth it out
            var copyPoints = currentRoom.roomPoints
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
        };
        $scope.dragLines = function($event){
            var arr = currentRoom.roomPoints
            var fingerX = $event.gesture.center.pageX;
            var fingerY = $event.gesture.center.pageY;
            var hypotRatio = 0;
            var newRatio = 0;
            var ind4new = 0;
            arr.push([arr[0][0],arr[0][1]])
            for (var i = 0;i<arr.length-1;i++){
                newRatio = Math.sqrt(((arr[i+1][0]-arr[i][0])*(arr[i+1][0]-arr[i][0]))+((arr[i+1][1]-arr[i][1])*(arr[i+1][1]-arr[i][1])))/(Math.sqrt(((fingerX-arr[i][0])*(fingerX-arr[i][0]))*((fingerY-arr[i][1])*(fingerY-arr[i][1])))+Math.sqrt(((fingerX-arr[i+1][0])*(fingerX-arr[i+1][0]))+((fingerY-arr[i+1][1])*(fingerY-arr[i+1][1]))));
                if (newRatio > hypotRatio){
                    hypotRatio = newRatio;
                    newRatio = 0;
                    ind4new = i;
                };
            }
            arr.pop();
            var xtraOffX = 0;
            var xtraOffY = 0;
            var dragX = ($event.gesture.center.pageX*gridMag)-arr[0][0]-xtraOffX;
            var dragY = ($event.gesture.center.pageY*gridMag)-arr[0][1]-xtraOffY;
            for (var n = ind4new;n<ind4new+2;n++){
                currentRoom.roomPoints[n][0] = 10*Math.round((arr[n][0] + dragX)/10);
                currentRoom.roomPoints[n][1] = 10*Math.round((arr[n][1] + dragY)/10);
            };
        };
            
//                var deltaY = $event.gesture.deltaY;
                
//                copyRoomPoints[n][0] = currentRoom.roomPoints[n][0]
//                copyRoomPoints[n][1] = currentRoom.roomPoints[n][1]
                
//                var newY = deltaY+tmpY
//                var pageDistX = $event.gesture.center.pageX-tmpX
//                var pageDistY = $event.gesture.center.pageY-tmpY
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
                
                //setTimeout(10);
                
//                console.log(copyPoints)
//                newY = 0;
//                deltaY = 0;
                
//            }
        
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


