'use strict';
/* Controllers */
//var layoutController = angular.module('HHControllers', []);

angular.module('Controllers').controller('layoutCtrl', 
	function ($scope, $window, $timeout,$localStorage, $state, $stateParams, Restangular, layoutObjectModel, inspections,currentInspection,currentFloor,$ionicSideMenuDelegate, $ionicNavBarDelegate, $ionicModal,$ionicPopup, findGeom) {
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
        var inspectionIndex = $stateParams.inspectionIndex;
        //var currentInspection = $scope.currentInspection;// = inspections[inspectionIndex];
		//console.log(currentInspection)
		var gridElem = findGeom.gridElem;
        var gridoffTop = gridElem[0].offsetTop;
        var gridoffLeft = gridElem[0].offsetLeft;
        var windowHt = $scope.windowHt = (2.2*$window.outerHeight)-gridoffTop; //plus the offset!!
        var windowWd = $scope.windowWd = (2.2*$window.outerWidth)-gridoffLeft; //won't work without watcher in grid.js
        var arcs = currentInspection.arcs;
		//currentInspection['currentFloor'] = currentFloor;
		$scope.currentInspection = currentInspection;
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
            //$scope.qsOpen = !$scope.qsOpen;
        };
        $scope.$watch(function() { 
            return $ionicSideMenuDelegate.isOpenLeft() },
              function() {
				  $scope.qsOpen = $ionicSideMenuDelegate.isOpenLeft();
              }
        );
        //$scope.qsOpen = !$ionicSideMenuDelegate.isOpenRight();
		$scope.gridShow5 = true;
        $scope.gridShow1 = true; 
		$scope.gridLineNumber = function(gridSize,gridInterval){
		     return _.range(0,gridSize,gridInterval) //everyfive feet
		};
		var canvasSize = $scope.canvasSize = findGeom.canvasSize;
        $scope.gridWd = $window.innerWidth*.95;
        $window.setTimeout(toggleLeft,500);
        $scope.complexPath = findGeom.complexPath;
        $scope.svgPath = findGeom.svgPath;
        $scope.pointPath = findGeom.pointPath;
		var gridmag = $scope.gridmag = $stateParams.gridmag || 1;
		//if($stateParams.gridmag){var gridmag = }
        // var gridElem = findGeom.gridElem;
//         var magnifyGrid = findGeom.magnifyGrid;
// 		var newMag;
//         $scope.magnifyGrid = function(num){
//             newMag = magnifyGrid(num);
//             gridElem.css({'width':newMag+'px','height':newMag+'px'});
//         }
		/*$scope.showBar = function(){
			$ionicNavBarDelegate.showBar(true);
		};*/
//		var hideBar = $scope.hideBar = function(){
//			$ionicNavBarDelegate.showBar(false);
//		};
//		$timeout(hideBar,1000);
		$scope.flrModal = [];
        $scope.flrModal.floorLists = ['neighborhood', 'exterior', 'first', 'second', 'third', 'basement', 'attic', 'garage', 'section'];
		$scope.flrModal.roomLists = ['exterior','living room','bath','closet','kitchen','dining room'];
        $scope.actionLists = ['add flag','add note','add image from camera','add image from file'];
		$scope.editRooms = ['change name','add point to shape','add door','add window','add stairs','add outlet']; // when edit mode
		$scope.insideRooms = ['add toilet','add sink','add refrigerator','add flame','add tub','add shower','add vent'];
		
        var floors = []; 
		var floorInd = 0;
        if ($stateParams.floorInd) {floorInd = $stateParams.floorInd};
        
        // if (currentInspection.floors){
//             floors = currentInspection.floors;
//         } else {
//             floors = currentInspection['floors'] = [ { "name" : "first", "color" : "#ed0e0e","rooms" : [] } ];
//         };
        //var currentFloor = $scope.currentInspection.currentFloor = currentInspection.floors[floorInd];
		
        
        $ionicModal.fromTemplateUrl('templates/floormodal.html', {
                id: "flrModal",
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
              $scope.floorModal = modal;
        });
        $scope.chooseFloor = function() {
			setFlrPoints();
            $scope.floorModal.show();
        };
        $scope.closeModal = function() {
            $scope.floorModal.hide();
        };
		// $scope.$on('modal.hidden', function() {
// 			//$scope.showFloorAccord = false;
// 			$scope.showRoomAccord = true;
// 		});
        $scope.$on('$destroy', function() {
            $scope.floorModal.remove();
        });
	    $scope.remRoomConfirm = function(timeId) {
			var toRemove = angular.element(document.getElementById(timeId));
	        var confirmRmPopup = $ionicPopup.confirm({
	            title: 'Remove Room and Contents',
	            template: 'Are you sure (cannot undo)?'
	        });
	        confirmRmPopup.then(function(res) { 
	        if(res) {
	            removeRoom(timeId);
				toRemove.remove();
	        }
	        });
	    };
		var removeRoom = function(timeId){
			$scope.closeModal();
			var newRooms = [];
			for (var rm in currentFloor.rooms){
				if (currentFloor.rooms[rm].timeId != timeId){
					newRooms.push(currentFloor.rooms[rm])
				};
			};
			currentFloor['rooms'] = [];
			currentFloor.rooms = newRooms;
			setFloorContents;
		};
        /*$ionicModal.fromTemplateUrl('templates/addroomModal.html', {
                id: "addrmModal",
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(addrmmodal) {
              $scope.addRoomModal = addrmmodal;
        });
        $scope.showAddRoomModal = function() {
            $scope.addRoomModal.show();
        };
        $scope.closeAddRoomModal = function() {
            $scope.addRoomModal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.addRoomModal.remove();
        });*/
		var addNewFloorCheck = function(floor){ //this means that the floor indices change for others, too!
			for (var k=0;k<currentInspection.floors.length;k++){
				if (currentInspection.floors[k].name == floor){
					floorInd = k;
					return false; //does this break??
				} else {
					floorInd = currentInspection.floors.length;
					return true;
				};
			};
		}
		var rooms;
        $scope.newFloor = function(floor){
			console.log(floor)
			if(currentFloor!=floor){
				var addNewFloor = addNewFloorCheck(floor);
				if(addNewFloor){
        	        floors.push({"name" : floor, "color" : "#ed0e0e", "rooms" : []});
					currentFloor = $scope.currentInspection.currentFloor = currentInspection.floors[floorInd] = floors[0];
        	    }else{
					currentFloor = $scope.currentInspection.currentFloor = currentInspection.floors[floorInd];
        	    };
				inspections[inspectionIndex] = currentInspection
				$stateParams.floorInd = floorInd;
 				$state.go("secure.inspections.layout",{floorInd:floorInd});
				if (currentFloor.rooms){
               		rooms = currentFloor.rooms;
				}else{
					currentFloor['rooms'] = [];
				}
                clearFloorContents();
				setFloorContents();
			};
			//how to deal with $state.params??
            $scope.closeModal();
        };
        $scope.changeFloorName = function(currFloor){
            currentFloor['name'] = currFloor;
            $scope.closeModal();
        };
        
		var testRoom = {"type" : "Path", 
                "timeId" : 45,
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
            	}//,
			};
                // "svgPoints" : [
 //        { "pathType" : "newSeg",
 //
 //         "points" : [[130,177]]
 //
 //        },
 //        { "pathType" : "Line",
 //
 //         "points" : [[130,777]]
 //
 //        },
 //        { "pathType" : "Line",
 //
 //         "points" : [[630,877]]
 //
 //        },
 //        { "pathType" : "Line",
 //
 //         "points" : [[130,177]]
 //
 //        }
 //   ]
 //           	};
 		var roomInd;
        if ($stateParams.roomInd) {
			roomInd = $stateParams.roomInd
		}else{
			$stateParams.roomInd = roomInd = 0;
		};
        //how am I tracking this between rooms when change floors?
        if (currentFloor.rooms){
            rooms = currentFloor.rooms;
        } else {
            rooms = currentFloor['rooms'] = testRoom;
        };
        //need to catch if not exist, or seed with a "blank room" - could be good for click
        var currentRoom = currentFloor.rooms[roomInd];
//		var features = [];
//        var paths = [];
//        var shapes = [];
//        var roomArcs = [];
//        var notes = [];
//        var images = [];
        var roomItem;
        var clearFloorContents = function(){
            currentFloor.features = [];
            currentFloor.paths = [];
            currentFloor.shapes = [];
            currentFloor.roomArcs = [];
            currentFloor.notes = [];
            currentFloor.images = [];
        };
        //will I need to call this again? in a function?
		var setFloorContents = function(){
            clearFloorContents();
    	    for (var itemInd=0; itemInd<currentFloor.rooms.length; itemInd++){
				//timeId = d.getTime();
    	        roomItem = currentFloor.rooms[itemInd];
    	        if (roomItem.type == "Feature"){
    	            currentFloor.features.push(roomItem)
    	        };
                if (roomItem.type == "Path"){
					//roomItem.id = timeId;
    	            currentFloor.paths.push(roomItem)
    	        };
    	        if (roomItem.type == "Polygon"){
    	            currentFloor.shapes.push(roomItem)
    	        };
    	        if (roomItem.type == "openArc"){
    	            currentFloor.roomArcs.push(roomItem)
    	        };
    	        if (roomItem.type == "Note"){         //notes and images at room level are in room.js - or should there by a "room" that encompasses the floor and has the "exterior notes in it?" Maybe make it the default room, and have a class on it that makes it a diff. color? not sure...
    	            currentFloor.notes.push(roomItem)
    	        };
    	        if (roomItem.type == "Image"){
    	            currentFloor.images.push(roomItem)
    	        };
    	    };
			currentInspection.currentFloor = currentFloor;
			setFlrPoints;
			$scope.currentInspection = currentInspection;
//            $scope.currentRoom.paths = paths;
//	        $scope.currentRoom.features = features;
//	        $scope.currentRoom.shapes = shapes;
//	        $scope.currentRoom.notes = notes;
//	        $scope.currentRoom.images = images;
		};
        setFloorContents();
	    var setFlrPoints = function(){ //for feeding to the modal window for fewer directives, etc.
	        var nextPoints = [];
			var rmArrs = [];
	        //var points = [];
	        var flrMinX = null;
	        var flrMinY = null;
	        var flrMaxX = null;
	        var flrMaxY = null;
	        for (var rmItem in currentFloor.rooms){
				rmArrs = currentFloor.rooms[rmItem].svgPoints;
				for (var item in currentFloor.rooms[rmItem].svgPoints){
	            	nextPoints = rmArrs[item].points;
	            	if (nextPoints){
	            		for (item in nextPoints){
	            			if(flrMinX==null){
	            			    flrMinX = flrMaxX = nextPoints[item][0];
	            			    flrMinY = flrMaxY = nextPoints[item][1];
	            			};
							if (nextPoints[item][0]<(flrMinX)){
								flrMinX=nextPoints[item][0]
	            		    };
							if (nextPoints[item][1]<(flrMinY)){
	            				flrMinY=nextPoints[item][1]
	            			};
							if (nextPoints[item][0]>(flrMaxX)){
	            				flrMaxX=nextPoints[item][0]
	            			};
							if (nextPoints[item][1]>(flrMaxY)){
	            				flrMaxY=nextPoints[item][1]};
	            			};
						};
					};
	        }
			$scope.flrPts = [];
	        $scope.flrPts.flrMinX = flrMinX-15;//-50;
		    $scope.flrPts.flrMinY = flrMinY-15;//-50;
		    $scope.flrPts.flrMaxX = (flrMaxX-flrMinX)+35;//+150;
		    $scope.flrPts.flrMaxY = (flrMaxY-flrMinY)+35;//+150;
	    };
	   	setFlrPoints(); //-- before opening Modal
		
		var addNewRoomCheck = function(room){ //this means that the floor indices change for others, too!
			if(rooms.length==0){
				return true;
			}else{
            	for (var rm in rooms){
					if (rooms[rm].properties.name == room){
						roomInd = rm;
						return false; //does this break??
					} else {
						roomInd = rooms.length;
						return true;
					};
				};
			};
		};
        var newRoom;
        $scope.newRoom = function(room){
			var addNewRoom = addNewRoomCheck(room)
            if (addNewRoom) {
				var d = new Date();
				var timeId = d.getTime();
                newRoom = angular.copy(testRoom);
				newRoom.properties.name = room;
				newRoom.timeId = timeId;
				rooms.push(newRoom);
				currentFloor.rooms = $scope.currentInspection.currentFloor.rooms = rooms;
                //clearFloorContents();
                setFloorContents();
			} else {
				rooms = $scope.currentInspection.currentFloor.rooms = currentFloor.rooms;
			};
            $scope.closeModal();
		};
		var currPosition = {lat:'',lon:''};
		console.log(navigator)
		//if(navigator.geolocation){
			//console.log(navigator.geolocation.getCurrentPosition())
			// var getPositions = function(pos){
// 				currPosition = [];
// 				currPosition['lat']=pos.coords.latitude;
// 				currPosition['lon']=pos.coords.longitude;
// 				console.log(currPosition)
// 			}
			var onSuccess = function(position) {
				currPosition.lat = position.coords.latitude;
				currPosition.lon = position.coords.longitude;
			    alert('Latitude: '          + position.coords.latitude          + '\n' +
			          'Longitude: '         + position.coords.longitude         + '\n' +
			          'Altitude: '          + position.coords.altitude          + '\n' +
			          'Accuracy: '          + position.coords.accuracy          + '\n' +
			          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
			          'Heading: '           + position.coords.heading           + '\n' +
			          'Speed: '             + position.coords.speed             + '\n' +
			          'Timestamp: '         + position.timestamp                + '\n');
			};

			// onError Callback receives a PositionError object
			//
			function onError(error) {
			    alert('code: '    + error.code    + '\n' +
			          'message: ' + error.message + '\n');
			}
			
			navigator.geolocation.getCurrentPosition(onSuccess, onError);
			//currPosition = navigator.geolocation.getCurrentPosition();
			//};
		$scope.currPosition = currPosition;
        // $scope.selectLayoutObject = function (layoutObject) {
        //     layoutObjectModel.setSelectedObject(layoutObject);
        // };
        // $scope.isSelected = function(layoutObject) {
        //     return layoutObject === layoutObjectModel.selectedLayoutObject;
        // };


 });


