'use strict';
/* Controllers */
//var layoutController = angular.module('HHControllers', []);

angular.module('Controllers').controller('layoutCtrl', 
	function ($scope, $window, $timeout,$localStorage, $state, $stateParams, Restangular, layoutObjectModel, inspections, $ionicSideMenuDelegate, $ionicNavBarDelegate, $ionicModal, findGeom) {
        function touchHandler(event){ //necessary for andriod, but kills ionic's side
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
        };
        document.addEventListener("touchstart", touchHandler, true);
        document.addEventListener("touchmove", touchHandler, true);
        document.addEventListener("touchend", touchHandler, true);
        document.addEventListener("touchcancel", touchHandler, true);  
        var inspectionIndex = $state.params.inspectionIndex;
        var currentInspection = $scope.currentInspection = inspections[inspectionIndex];
        var arcs = currentInspection.arcs;
        //$scope.$storage = $localStorage;
        $scope.saveInspection = function(){
            $localStorage.inspections[inspectionIndex] = $scope.currentInspection;
            alert('saved to localstorage');
        }
//        console.log('arcs');
//        console.log(arcs);
//        console.log(arcs[0][0]);
//        console.log(arcs[0][0].slice(0,arcs[0][0].length)) //(position to start- 0 ind, count to end - 1 ind)
        var toggleLeft = $scope.toggleLeftSideMenu = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.gridWd = $window.innerWidth*.95;
        $window.setTimeout(toggleLeft,500);
        $scope.complexPath = findGeom.complexPath;
        $scope.svgPath = findGeom.svgPath;
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
//		var hideBar = $scope.hideBar = function(){
//			$ionicNavBarDelegate.showBar(false);
//		};
//		$timeout(hideBar,1000);

        $scope.floorLists = ['neighborhood', 'exterior', 'first', 'second', 'third', 'basement', 'attic', 'garage', 'section'];
        $scope.roomLists = ['exterior','living room','bath','closet','kitchen','dining room'];
        $scope.actionLists = ['add flag','add note','add image from camera','add image from file'];
		$scope.editRooms = ['change name','add point to shape','add door','add window','add stairs','add outlet']; // when edit mode
		$scope.insideRooms = ['add toilet','add sink','add refrigerator','add flame','add tub','add shower','add vent'];
		
        var floors = []; 
		var floorInd = 0;
        if ($state.params.floorInd) {floorInd = $state.params.floorInd};

        var currentFloor = $scope.currentFloor = currentInspection.floors[floorInd];
        
        if (currentInspection.floors){
            floors = currentInspection.floors;
            //var newFloorTitle = currentInspection.address + ': <b>' + floors[floorInd].name.toUpperCase() + '</b> floor';
            //$ionicNavBarDelegate.changeTitle(newFloorTitle, 'left');
        } else {
            floors = currentInspection['floors'] = [ { "name" : "first", "color" : "#ed0e0e","rooms" : [] } ];
        };
        $ionicModal.fromTemplateUrl('templates/floormodal.html', {
                id: "flrModal",
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
              $scope.floorModal = modal;
        });
//        $ionicModal.fromTemplateUrl('templates/roommodal.html', {
//                id: "rmModal",
//                scope: $scope,
//                animation: 'slide-in-up'
//            }).then(function(modal) {
//              $scope.roomModal = modal;
//        });
        $scope.chooseFloor = function() {
            $scope.floorModal.show();
        };
//        $scope.add2Room = function() {
//            alert('adffads');
//            $scope.roomModal.show();
//        }; 
        $scope.closeModal = function() {
            $scope.floorModal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.floorModal.remove();
        });
//		$scope.chooseFloor = function(){
//            
//        };
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
            console.log(floor)
			if(currentFloor!=floor){
                console.log(currentFloor)
				var addNewFloor = addNewFloorCheck(floor);
				if(addNewFloor){
        	        floors.push({"name" : floor, "color" : "#ed0e0e", "rooms" : []});
					currentFloor = $scope.currentFloor = currentInspection.floors[floorInd];
        	    }else{
					currentFloor = $scope.currentFloor = currentInspection.floors[floorInd];
        	    };
                console.log(currentFloor)
                clearFloorContents();
				setFloorContents();
			};
            $scope.closeModal();
        };
        $scope.changeFloorName = function(currFloor){
            currentFloor['name'] = currFloor;
            $scope.closeModal();
        };
        
		var testRoom = [{"type" : "Path", 
                "id" : 45,
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
        var paths = [];
        var shapes = [];
        var roomArcs = [];
        var notes = [];
        var images = [];
        var roomItem;
        var clearFloorContents = function(){
            features = [];
            paths = [];
            shapes = [];
            roomArcs = [];
            notes = [];
            images = [];
        };
        //will I need to call this again? in a function?
		var setFloorContents = function(){
            console.log('current floor')
            console.log(currentFloor.rooms);
            clearFloorContents();
    	    for (var itemInd=0; itemInd<currentFloor.rooms.length; itemInd++){
    	        roomItem = currentFloor.rooms[itemInd]
                roomItem.id = itemInd;
    	        if (roomItem.type == "Feature"){
    	            features.push(roomItem)
    	        };
                if (roomItem.type == "Path"){
    	            paths.push(roomItem)
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
		};
        var newRoom;
        $scope.newRoom = function(room){
			var addNewRoom = addNewRoomCheck(room)
            if (addNewRoom) {
                console.log(rooms)
                newRoom = _.clone(testRoom[0])
				newRoom.properties.name = room;
				rooms.push(newRoom);
                console.log(rooms)
				currentFloor.rooms = $scope.currentFloor.rooms = rooms;
                console.log(rooms)
			} else {
				rooms = $scope.currentFloor.rooms = currentFloor.rooms;
			};
            clearFloorContents();
			setFloorContents();
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

        
        $scope.selectLayoutObject = function (layoutObject) {
            layoutObjectModel.setSelectedObject(layoutObject);
        };
        $scope.isSelected = function(layoutObject) {
            return layoutObject === layoutObjectModel.selectedLayoutObject;
        };


 });


