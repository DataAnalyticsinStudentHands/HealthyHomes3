'use strict';
/* Controllers */
//var layoutController = angular.module('HHControllers', []);

angular.module('Controllers').controller('layoutCtrl', 
	function ($scope, $window, $timeout, $state, $stateParams, Restangular, layoutObjectModel, inspections, $ionicSideMenuDelegate, $ionicNavBarDelegate, findGeom) {
        var inspectionIndex = $state.params.inspectionIndex;
        var currentInspection = $scope.currentInspection = inspections[inspectionIndex];
        var toggleLeft = $scope.toggleLeftSideMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.gridWd = $window.innerWidth*.95;
        $window.setTimeout(toggleLeft,500);
        $scope.pointPath = findGeom.pointPath;
        var gridElem = findGeom.gridElem;
        var magnifyGrid = findGeom.magnifyGrid;
		var newMag;
        $scope.magnifyGrid = function(num){
            newMag = magnifyGrid(num);
            gridElem.css({'width':newMag+'px','height':newMag+'px'});
        }
		/*$scope.showBar = function(){
			$ionicNavBarDelegate.showBar(true);
		};*/
		var hideBar = $scope.hideBar = function(){
			$ionicNavBarDelegate.showBar(false);
		};
		$timeout(hideBar,1000);
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

        $scope.floorLists = ['neighborhood', 'exterior', 'first', 'second', 'third', 'basement', 'attic', 'garage', 'section'];
        $scope.roomLists = ['exterior','living room','bath','closet','kitchen','dining room'];
        $scope.actionLists = ['add flag','add note','add image from camera','add image from file'];
		$scope.editRooms = ['change name','add point to shape','add door','add window','add stairs','add outlet']; // when edit mode
		$scope.insideRooms = ['add toilet','add sink','add refrigerator','add flame','add tub','add shower','add vent'];
		
        var floors = []; 
		var floorInd = 0;
        if ($state.params.floorInd) {floorInd = $state.params.floorInd};

        if (currentInspection.floors){
            floors = currentInspection.floors;
            var newFloorTitle = currentInspection.address + ': <b>' + floors[floorInd].name.toUpperCase() + '</b> floor';
            $ionicNavBarDelegate.changeTitle(newFloorTitle, 'left');
        } else {
            floors = currentInspection['floors'] = [ { "name" : "first", "color" : "#ed0e0e","rooms" : [] } ];
        };
		
        var currentFloor = $scope.currentFloor = currentInspection.floors[floorInd];
		
		var addNewFloorCheck = function(floor){ //this means that the floor indices change for others, too!
			for (var k=0;k<floors.length;k++){
				if (floors[k].name == floor){
					floorInd = k;
					return false; //does this break??
				} else {
					floorInd = floors.length;
					return true;
				};
			};
		}
        $scope.newFloor = function(floor){
			if(currentFloor!=floor){
				var addNewFloor = addNewFloorCheck(floor);
				if(addNewFloor){
        	        floors.push({"name" : floor, "color" : "#ed0e0e", "rooms" : []});
					currentFloor = $scope.currentFloor = currentInspection.floors[floorInd];
        	    }else{
					currentFloor = $scope.currentFloor = currentInspection.floors[floorInd];
        	    };
				setFloorContents();
			}
        };
		var testRoom = [{"type" : "Polygon", 
				"properties" : {"name" : "TestExample", "color" : "#ed0e0e"},
				"active" : true,
            	"contains" : [ 0, 4, 6 ],
            	"shares" : [ 2, 5, 7 ],  
            	"text" : [ [2,[0]], [4,[3,4]], [6,[null]] ],
            	"arcs" : [ [2,[0]], [4,[3,4]], [6,[null]] ],
            	"projections" : {
                	"transform" : [ [1,[2,3,8]], [4,[3,6,5]] ],
                	"scale" : [ 3, 0 ],
                	"translate" : [ 3 ], 
                	"rotate" : [ 0 ],
                	"eigens" : [[0,0.2223432],[2,0.00122323]] 
            	}
            	}];
		var rooms;
		var roomInd = 0;
        if (currentInspection.floors[floorInd].rooms){
            rooms = currentFloor.rooms;
        } else {
            rooms = currentFloor['rooms'] = testRoom;
        };
		if ($state.params.roomInd) {roomInd = $state.params.roomInd};
        var currentRoom = $scope.currentRoom = currentInspection.floors[floorInd].rooms[roomInd];
		var features = [];
        var shapes = [];
        var roomArcs = [];
        var notes = [];
        var images = [];
        var roomItem;
        //will I need to call this again? in a function?
		var setFloorContents = function(){
    	    for (var itemInd=0; itemInd<currentFloor.rooms.length; itemInd++){
    	        roomItem = currentFloor.rooms[itemInd]
    	        if (roomItem.type == "Feature"){
    	            features.push(roomItem)
    	        };
    	        if (roomItem.type == "Polygon"){
    	            shapes.push(roomItem)
    	        };
    	        if (roomItem.type == "openArc"){
    	            roomArcs.push(roomItem)
    	        };
    	        if (roomItem.type == "Note"){
    	            notes.push(roomItem)
    	        };
    	        if (roomItem.type == "Polygon"){
    	            shapes.push(roomItem)
    	        };
    	    };
	        $scope.features = features;
	        $scope.shapes = shapes;
	        $scope.notes = notes;
	        $scope.images = images;
		};
        setFloorContents();
		
		var addNewRoomCheck = function(room){ //this means that the floor indices change for others, too!
			for (var r=0;r<rooms.length;r++){
				if (rooms[r].name == room){
					roomInd = r;
					return false; //does this break??
				} else {
					roomInd = room.length;
					return true;
				};
			};
		}
        $scope.newRoom = function(room){
			var addNewRoom = addNewRoomCheck(room)
            if (addNewRoom) {
				console.log(testRoom[0].properties.name)
				testRoom[0].properties.name = room;
				rooms.push(testRoom);
				currentFloor.rooms = $scope.currentFloor.rooms = rooms;
			} else {
				rooms = $scope.currentFloor.rooms = currentFloor.rooms;
			};
			if (!currentRoom.roomPoints){
				currentRoom.roomPoints = $scope.roomPoints = [[520.0,320.0],[520.0,520.0],[320.0,520.0],[320.0,320.0]]; 
			};
			//$scope.currentFloor = currentFloor;
			//currentInspection.floors[floorInd] = currentFloor;
                //$scope.$apply;
		};
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
        
        //var svgItems = []; //internal descriptors go here, but are placed from directive
        //var layoutItems = [];
        
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


