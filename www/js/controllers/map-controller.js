'use strict';
/* Controllers */
//var layoutController = angular.module('HHControllers', []);

angular.module('HHControllers').controller('mapCtrl', 
	function ($scope, $window, $state, layoutObjectModel,findGeom,mapData) { 
        
        //var geojson_data = data;
        //console.log(geojson_data['type']);
        console.log(mapData);
        //need to check if it has UTM or lat/lon
        //need to write back to it, if it's changed
        
        $scope.alert = function (text) {
            alert(text+'inside mapCtrl');
        };
        //findClosestLine.testFunc();
//        document.addEventListener("deviceready", onDeviceReady, false);
    //are the touchHandlers needed with ionic? in each directive?
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

        $scope.floorLists = ['neighborhood', 'exterior', 'first', 'second', 'third', 'basement', 'attic', 'garage', 'section'];
        $scope.roomLists = ['exterior','living room','bath','closet','kitchen','dining room'];
        var floors = []; 
        var floor = $scope.floor;
        var floorPoints = $scope.floorPoints = []; //if empty, nothing is drawn on floor.html 
        //$scope.floorPoints = [[100,100],[150,100],[150,150],[100,150]];
        //$scope.roomLineEdit = false; //svgEdit is now set through isolate scopes on drag-save, but may change
        var rooms = [];
        var room = $scope.room;
        var roomPoints = $scope.roomPoints = [[10,10],[150,100],[150,150],[100,150]]; //[]; //have to decide which one is active on first load; how do we get from $scope?
        $scope.layoutObjectModel = layoutObjectModel; 
        //console.log(layoutObjectModel.inspections);
        var inspectInd = 0; //will get from service or $state.params
        var currentInspection = layoutObjectModel.inspections[inspectInd];
        //console.log(currentInspection)
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
            
        $scope.pointPath = findGeom.pointPath;
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
//            currentRoom.measurePoints = $scope.measurePoints = findGeom.showMeasures(currentRoom.roomPoints);
        }
        $scope.pointPathDonut = function(arr){
            firstStr = $scope.pointPath(arr);
            insideDirection = arr.reverse();
            //add points to see if inside, and give a distance based on size of polygon
        };
        
        $scope.Measures = true;
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
            //$scope.magnifyGrid(3);
            $scope.layoutObjs = [];
            $scope.rooms = [];
            if (floors.indexOf(floor)==-1){
                room = '';
                rooms = [];
//                $scope.tpospx = '250px';
//                $scope.lpospx = '150px';
//                $scope.container = 'grid-container';
                floors.push(floor);
                floorInd = $state.params.floorInd = floors.indexOf(floor);
//                if (!$scope.drawFromRooms){
//                floorPoints = $scope.floorPoints = [[100,100],[300,100],[300,300],[100,300]]; //add this way and can bezier later
                    //console.log('still need to think through')
                    //create a floorPoint list with four corners
                    //addObj.newObj($scope,floor+"_floor",floorInd)
                //} else {
                //    floorPoints = $scope.floorPoints = [];
               // };
                currentInspection.floors[floorInd] = [floor];
                currentInspection.floors[floorInd].rooms = [];
                currentInspection.floors[floorInd].floorPoints = $scope.floorPoints = floorPoints; 
                rooms = $scope.rooms = [];
                //need floorPoints to be added here!!!!
            }else{
                floorInd = $state.params.floorInd = floors.indexOf(floor); //because indexOf doesn't update in order
                rooms = $scope.rooms = currentInspection.floors[floorInd].rooms;
                console.log(rooms)
                console.log('that was rooms, but as object or list?')
                //will I need to redo all the sub indices, or will the .state do it??
            };
            console.log(floorInd + 'floorInd')
//            floorInd = 0;
            $state.go('layout.floor');
            $state.params.inspectInd = 0; //will need to do this differently
            $state.params.floorName = floor; //can that have an ng-show or ui-sref-active???
            currentFloor = currentInspection.floors[floorInd]; //make sure picks up original
            console.log(currentInspection.floors);
            console.log('was currentInspect');
            console.log(currentFloor);
            
            //floorPoints
            
            //
            //all the state management things
        };
//        $scope.floorPoints4Lines = [[100,100,300,100],[300,100,300,300],[300,300,100,300],[100,300,100,100]]
        
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
//            console.log(currentFloor.length+' currentfloot')
            if (currentFloor.length > 0) {
                if (rooms.indexOf(room)==-1){
                    //have room list add possibility of room2 as well as existing 
                    //http://www.bennadel.com/blog/2452-mixing-static-and-dynamic-data-in-an-angularjs-select-menu.htm
                    rooms.push(room);
                    $scope.rooms = rooms;
                    roomInd = $state.params.roomInd = rooms.indexOf(room);
                    //addSvgPoint.newSvg($scope,'line',3);
                    //addObj.newObj($scope,room+"_room",roomInd);
                    currentFloor.rooms[roomInd] = [room];
                } else {
                    roomInd = $state.params.roomInd = rooms.indexOf(room);
                };
                $state.go('layout.floor.room');
                newFloorOrRoom = $scope.newFloorOrRoom = false;
                $state.params.roomName = room; //can that have an ng-show or ui-sref-active??? how is it inherited?
                currentRoom = currentFloor.rooms[roomInd]; //make sure picks up original
                console.log(currentRoom)
                console.log(roomInd + ' roomInd')
                if (!currentRoom.roomPoints){
                    currentRoom.roomPoints = $scope.roomPoints = [[120.0,120.0],[220.0,120.0],[220.0,220.0],[120.0,220.0]]; //should be calculated from previous?
                    
                };
//                $scope.showMeasures = findGeom.showMeasures(currentRoom.roomPoints);
                if (!currentRoom.measurePoints){
                    currentRoom.measurePoints = $scope.measurePoints = findGeom.showMeasures(currentRoom.roomPoints);
                }; //have to do them here, or overloads $digest
                $scope.currentFloor = currentFloor;
                currentInspection.floors[floorInd] = currentFloor;
                //$scope.$apply;
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
        $scope.makeActive = function(){
            currentRoom = currentFloor.rooms[this.$index];
        }
        $scope.centerView = function($event){
            console.log(offLeft)
        }
        
        $scope.pinchResize = function($event){
            
            $event.preventDefault();
            
            $scope.gesture = $event.gesture;
            $scope.touches = $event.gesture.touches[0];
            $scope.touches1 = $event.gesture.touches[1];
            currentRoom.measurePoints = $scope.measurePoints = findGeom.showMeasures(currentRoom.roomPoints);
        };
        $scope.dragPoints = function($event,i){
            $event.preventDefault();
            currentRoom.roomPoints[i][0] = 10*Math.round((($event.gesture.center.pageX-offLeft)*gridMag)/10);
            currentRoom.roomPoints[i][1] = 10*Math.round((($event.gesture.center.pageY-offTop)*gridMag)/10);
            currentRoom.measurePoints = $scope.measurePoints = findGeom.showMeasures(currentRoom.roomPoints);
        };
        
        $scope.dragShapesOLD = function($event){ //need to work in zoom stuff - needs copy and drag from left top to smooth it 
            var copyPoints = _.clone(currentRoom.roomPoints)
            $event.preventDefault();
            var xtraOffX = 0;
            var xtraOffY = 0;
            if(copyPoints.length > 3){ //change to center of polygon
                xtraOffX = Math.abs(copyPoints[0][0]-copyPoints[1][0])/2;
                xtraOffY = Math.abs(copyPoints[0][1]-copyPoints[2][1])/2; //works well for squares
            }
            var dragX = (($event.gesture.center.pageX-offLeft)*gridMag)-copyPoints[0][0]-xtraOffX;
            var dragY = (($event.gesture.center.pageY-offTop)*gridMag)-copyPoints[0][1]-xtraOffY;
            for (var n = 0;n<currentRoom.roomPoints.length;n++){
                currentRoom.roomPoints[n][0] = 10*Math.round((copyPoints[n][0] + dragX)/10);
                currentRoom.roomPoints[n][1] = 10*Math.round((copyPoints[n][1] + dragY)/10);
            };
            currentRoom.measurePoints = $scope.measurePoints = findGeom.showMeasures(currentRoom.roomPoints);
        };
        $scope.closestIndices = 0;
        $scope.dragLineStart = function($event){
            $event.preventDefault();
            var arr = _.clone(currentRoom.roomPoints);
            var fingerX = ($event.gesture.center.pageX-offLeft)*gridMag;
            var fingerY = ($event.gesture.center.pageY-offTop)*gridMag;
            var ind4new = 0;
            $scope.ind4new = ind4new = findGeom.closestLine(arr,fingerX,fingerY);
            $scope.xtraOffX1 = fingerX - arr[ind4new-1][0];
            $scope.xtraOffY1 = fingerY - arr[ind4new-1][1];
            if(ind4new+1>arr.length){ind4new = 0};
            $scope.xtraOffX2 = fingerX - arr[ind4new][0];
            $scope.xtraOffY2 = fingerY - arr[ind4new][1];
        }
        $scope.dragLinesOLD = function($event){
            $event.preventDefault();
            var ind4new = $scope.ind4new;
            var xtraOffX1 = $scope.xtraOffX1;
            var xtraOffY1 = $scope.xtraOffY1;
            var xtraOffX2 = $scope.xtraOffX2;
            var xtraOffY2 = $scope.xtraOffY2;
            var dragX1 = (($event.gesture.center.pageX-offLeft)*gridMag)-xtraOffX1;
            var dragY1 = (($event.gesture.center.pageY-offTop)*gridMag)-xtraOffY1;
            var dragX2 = (($event.gesture.center.pageX-offLeft)*gridMag)-xtraOffX2;
            var dragY2 = (($event.gesture.center.pageY-offTop)*gridMag)-xtraOffY2;
            
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
//        $scope.showMeasurePoints = function(){
//            return findGeom.showMeasures(currentRoom.roomPoints);
//        }
        
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
        $scope.iconWidth = 45;
        $scope.iconHeight = 45;
        $scope.iconFill = '#60FF00'; //green - red= #FF0000; yellow=#FFFF0D;
        
        var layoutObjInd = 0; //layoutObjs.indexOf(layoutObj);
        var XYObj = [];
        $scope.newObj = function(obj,$event){
            var layoutObjs = [];
            if (currentRoom.layoutObjs != null) { // && currentRoom.layoutObjs.length>0){
                layoutObjs = currentRoom.layoutObjs;};
            //need to catch if it exists? this always adds more by same name???
            $scope.iconWidth = 15;
            $scope.iconHeight = 15;
            var iconX = 10;
            var iconY = 10;
            XYObj = [iconX,iconY,obj];
            layoutObjs.push(XYObj);
            currentRoom.layoutObjs = $scope.layoutObjs = layoutObjs;
            //$scope.currentRoom = currentRoom;
            console.log(layoutObjs);
        }
        $scope.newObjOLD = function(obj,$event){
            //findGridOffsets();
            if (currentRoom.length==0) { //have to rethink
                alert('Must add room to place objects inside'); 
                return
                //or have it just use room as container?? have it go to a modal container
            } else {
                if (currentRoom.layoutObjs != null) { // && currentRoom.layoutObjs.length>0){
                    layoutObjs = currentRoom.layoutObjs;};
                if ($event.type == 'click'){
                    currentRoom.measurePoints = $scope.measurePoints = findGeom.showMeasures(currentRoom.roomPoints);
                    var iconX = currentRoom.measurePoints[0][0];
                    var iconY = currentRoom.measurePoints[0][1];
                }else{
                    var iconX = 10*Math.round((($event.gesture.center.pageX-offLeft)*gridMag)/10);
                    var iconY = 10*Math.round((($event.gesture.center.pageY-offTop)*gridMag)/10);    
                };
//                    $scope.tpospx = '200px'; //need to figure out better process for placement
//                    $scope.lpospx = '200px';
//                    $scope.container = 'grid-container'; //make it room?
                XYObj = [iconX,iconY,obj];
                $scope.iconWidth = 15;
                $scope.iconHeight = 15;
                layoutObjs.push(XYObj);
                layoutObjInd = layoutObjs.indexOf(XYObj);
                currentRoom.layoutObjs = $scope.layoutObjs = layoutObjs;
                console.log(layoutObjs);
                //addObj.newObj($scope,obj,layoutObjInd);
            };
        };
//        $scope.dragLayoutObjs = function($event,i){
//            //findGridOffsets(); 
//            $event.preventDefault();
//            currentRoom.layoutObjs[i][0] = 10*Math.round((($event.gesture.center.pageX-offLeft)*gridMag)/10);
//            currentRoom.layoutObjs[i][1] = 10*Math.round((($event.gesture.center.pageY-offTop)*gridMag)/10);
//        };
        var notes = [];
        var note = $scope.note = '';
        $scope.showNote = false;
        $scope.openNote = function(){
            //console.log('openNote')
            $scope.showNote = !$scope.showNote;
            if (currentRoom.layoutObjs[this.indic].notes){
                notes = currentRoom.layoutObjs[this.indic].notes; //notes should have in it the text and the photos
            }else{
                note = $scope.note = ''; //do you have to explicitly clear? 
                notes = [];
                currentRoom.layoutObjs[this.indic].notes = notes;
            }
        }
        //http://docs.phonegap.com/en/1.2.0/phonegap_camera_camera.md.html
/*        var pictureSource;   // picture source
        var destinationType; // sets the format of returned value 
        function onDeviceReady() {
            pictureSource=navigator.camera.PictureSourceType;
            destinationType=navigator.camera.DestinationType;
        }
        function onPhotoDataSuccess(imageData) {
            var smallImage = document.getElementById('smallImage');
            smallImage.style.display = 'block';
            smallImage.src = imageData;
//            smallImage.src = "data:image/jpeg;base64," + imageData;
//            alert(imageData)
//            console.log(smallImage)
        }
        function onPhotoURISuccess(imageURI) {
            var largeImage = document.getElementById('largeImage');
            largeImage.style.display = 'block';
            largeImage.src = imageURI;
        }
        $scope.takePicture = function() {
	       navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20 });
	  
        }
        function capturePhotoEdit() {
            //allowEdit not on Android?
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true }); 
        };
        function getPhoto(source) {
      // Retrieve image file location from specified source
          navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 20, 
            destinationType: destinationType.FILE_URI,
            sourceType: source });
        }

        // Called if something bad happens.
        // 
        function onFail(message) {
          alert('Failed because: ' + message);
        };
        */
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
        
 });


