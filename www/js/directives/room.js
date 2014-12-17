angular.module('Directives').directive('roomManip',function($ionicModal,$ionicGesture,$ionicSideMenuDelegate,findGeom){
    return {
        restrict: 'AE',
        scope: {
            room: '='//,
            //setFloorContents: '&' //doesn't seem to work
        },
//        templateNamespace: 'svg',
//        template: '<circle fill="red" stroke="blue" stroke-width="3" cx="250" cy="200" r="100" />',
        controller: ['$scope', function($scope){
		    $ionicModal.fromTemplateUrl('templates/roommodal.html', {
		            id: "rmModal",
		            scope: $scope,
		            animation: 'slide-in-up'
		        }).then(function(modalRoom) {
		          $scope.roomModal = modalRoom;
		    });
		    $scope.showAdd2Room = function() {
		        $scope.roomModal.show();
		    };
		    $scope.closeAddRoomModal = function() {
		        $scope.roomModal.hide();
		    };
			$scope.rmObj = 'Flag';
			$scope.rmobjTypes = {
				"Flag": "Flag",
				"Note" : "Note",
				"Image" : "Image"
			};
			$scope.typ = 'green';
			$scope.typs = {
				"Green": "Green",
				"Yellow" : "Yellow",
				"Red" : "Red"
			};
			// $scope.addroomObj = function(fingerX,fingerY,rmObj){
// 						alert(fingerX);
// 					}
		    $ionicModal.fromTemplateUrl('templates/linemodal.html', {
		            id: "lnModal",
		            scope: $scope,
		            animation: 'slide-in-up'
		        }).then(function(modalLine) {
		          $scope.lineModal = modalLine;
		    });
		    $scope.showAdd2Line = function() {
		        $scope.lineModal.show();
		    };
		    $scope.closeLineModal = function() {
		        $scope.lineModal.hide();
		    };
			$scope.pthTyp = 'Line';
			$scope.pathTypes = {
				"Line": "Line",
				"Window" : "Window",
				"Door" : "Door",
				"bez4" : "Quadratic Bezier",
				"bez3": "Cubic Bezier"
			};
        }],
        link: function(scope,elem,attr) {
    //scope.room.roomPoints = [[20.0,120.0],[220.0,120.0],[220.0,220.0],[320.0,320.0],[220.0,420.0],[420.0,220.0],[620.0,620.0],[720.0,720.0]];  //get from service as map from arcs
    scope.alert = function (text) {
        alert(text+'inroom');
    };
    var svgArr = [];
    var svgArrOLD = 
    [ 
        { "pathType" : "newSeg",
                   
         "points" : [[130,177]]
                   
        },
        { "pathType" : "bez3",
                   
        "points" : [[120.0,640.0],[420,540],[310,440]], //final, firstcontrol, second
                   
        },
        { "pathType" : "newSeg",
                   
         "points" : [[530,577]]
                   
        },
        { "pathType" : "Line",
                   
         "points" : [[130,777]]
                   
        },
        { "pathType" : "Line",
                   
         "points" : [[130,877]]
                   
        },        
        { "pathType" : "Line",
                   
         "points" : [[230,777]]
                   
        }
    ];
    svgArr = 
    [ 
    	{ "pathType" : "newSeg",
    	           
    	 "points" : [[130,130]]
    	           
    	},
        { "pathType" : "Line",
                   
         "points" : [[230,130]]
                   
        },
        { "pathType" : "Line",
                   
         "points" : [[230,230]]
                   
        }, 
    	{ "pathType" : "Line",
    	           
    	 "points" : [[130,230]]
                   
        }
    ];
    var nextPoints;
    if(!scope.room.svgPoints){
        scope.room.svgPoints = svgArr;//findGeom.svgPath(svgArr);
    }else{
        svgArr = scope.room.svgPoints;
    };
    var points = [];
    var setPoints = function(){
        //console.log(svgArr)
        nextPoints = [];
        points = [];
        for (item in svgArr){
            nextPoints = svgArr[item].points
            if (nextPoints){
                for (item in nextPoints){
                    points.push(nextPoints[item])
                }
            }
        } 
    };
    setPoints();
    scope.room.measurePoints = findGeom.showMeasures(svgArr);
	var fingerX;
	var fingerY;
	var closestLinePoints;
	var ind4new;
	var newX;
	var newY;
    var newXY = [];
	var dragWhole = true;

	var addPoint = function(e){ 
		e.stopPropagation();
        e.preventDefault();
        gridMag = parseFloat(findGeom.gridMag);
        offLeft = parseInt(findGeom.offSetLeft(gridElem));
        offTop = parseInt(findGeom.offSetTop(gridElem));
        scope.fingerX = parseInt((e.gesture.center.pageX/gridMag)-offLeft);
        scope.fingerY = parseInt((e.gesture.center.pageY/gridMag)-offTop);
		if (dragWhole){
	        scope.showAdd2Room();
		}else{
			scope.showAdd2Line();
		};
	}; 
	scope.addroomObj = function(fingerX,fingerY,rmObj,typ){
		//do closest line, then decide what side it's on and attach
		//note,image,flag
				//alert(fingerX);
	};
    scope.addSegment = function(fingerX,fingerY,pthTyp){
		scope.closeLineModal();
		if(pthTyp == 'Window' || pthTyp == 'Door'){
			alert('not yet implemented')
			return //idea is to have it calculated so it moves with rest of line - maybe a new segment, with points calculated in between?
		}
		closestLinePoints = findGeom.closestLine(svgArr,fingerX,fingerY)
	    ind4new = closestLinePoints[0][0];
		if (ind4new+1<points.length){
			ind4new += 1;
		}else{
			ind4new = 0;
		};		
	    newX = fingerX; //closestLinePoints[0][1][0]
	    newY = fingerY; //closestLinePoints[0][1][1]
		var ctrlX;
		var ctrlY;
		if (pthTyp == 'bez3'){
			ctrlX = (points[ind4new-1][0]+fingerX)/2;
			ctrlY = (points[ind4new-1][1]+fingerY)/2;
			newXY = [[parseInt(newX),parseInt(newY)],[parseInt(ctrlX+4),parseInt(ctrlY+4)],[parseInt(ctrlX-4),parseInt(ctrlY-4)]];
		}else if (pthTyp == 'bez4'){
			ctrlX = (points[ind4new-1][0]+fingerX)/2;
			ctrlY = (points[ind4new-1][1]+fingerY)/2;
			newXY = [[parseInt(newX),parseInt(newY)],[parseInt(ctrlX+4),parseInt(ctrlY+4)]];
		}else{
        	newXY = [[parseInt(newX),parseInt(newY)]];
		};
		if(ind4new+1>points.length){
	        points.push([[newX,newY]]); //to end??
            svgArr.push({"pathType" : pthTyp,"points":newXY})
	    }else{
	        points.splice(ind4new,0,[newX,newY]);
            svgArr.splice(ind4new,0,{"pathType" : pthTyp,"points":newXY})
	    };
		scope.room.measurePoints = findGeom.showMeasures(svgArr);
        setPoints();
        scope.svgArr = svgArr;
    }
    for (var n = 0;n<points.length;n++){
        points[n][0] = parseInt(points[n][0]);
        points[n][1] = parseInt(points[n][1]);
    };
    var gridElem = angular.element(document.getElementById('floor-container'));
    var offLeft = findGeom.offSetLeft(gridElem);
    var offTop = findGeom.offSetTop(gridElem);
    var gridMag = findGeom.gridMag; 
    var xtraOffX = 0;
    var xtraOffY = 0;
	var newIndex4line;
	var onlyPt;
	var n;
	var inPts; //can we use this for drag together sorts of things?
	var dragX;
	var dragY;
    var startDrag = function(e){
        e.preventDefault();
        e.stopPropagation();
		inPts = _.map(points,function(num){return true});
        $ionicSideMenuDelegate.canDragContent(false);
        gridMag = parseInt(findGeom.gridMag);
		xtraOffX = parseInt(points[0][0]/gridMag);
		xtraOffY = parseInt(points[0][1]/gridMag);
    };
	var points2 = [];
	var new4line;
	var assignPoints = function(e){
        points2 = points;
        dragX = (((e.gesture.deltaX)/gridMag)-points2[0][0])+xtraOffX;
        dragY = (((e.gesture.deltaY)/gridMag)-points2[0][1])+xtraOffY;
    	for (n=0;n<points2.length;n++){
			if (inPts[n]){
				points2[n][0] = parseInt(points2[n][0]) + parseInt(dragX);
				points2[n][1] = parseInt(points2[n][1]) + parseInt(dragY);
 			};
    	};
	};
    var dragLines = function(e){ //need to work in zoom stuff
        e.stopPropagation();
        if(dragWhole){
            assignPoints(e);
        };
		scope.room.measurePoints = findGeom.showMeasures(svgArr);
        scope.$apply();
    };
    //var highZ = 100; //need to figure out for dragging objects
    var endDrag = function(e){
        $ionicSideMenuDelegate.canDragContent(true);
        for (var n=0;n<points.length;n++){
            points[n][0] = parseInt(10*Math.round(points[n][0]/10));
            points[n][1] = parseInt(10*Math.round(points[n][1]/10));
        };
        scope.room.measurePoints = findGeom.showMeasures(svgArr);
        scope.$apply();
    };
    scope.room.editLines = true;
	scope.room.dashStroke = '';
	var measures = function(e){
		e.stopPropagation();
        e.preventDefault();
		if (dragWhole) {
            scope.room.editLines = false;
			scope.room.dashStroke = '3 2';
		} else {
            scope.room.editLines = true;
			scope.room.dashStroke = '';
		}
		dragWhole =! dragWhole;
        scope.$apply()
        //setTimeout(scope.$apply,100);
    };
    var doubletapGesture = $ionicGesture.on('doubletap', addPoint, elem);
    var dragStartGesture = $ionicGesture.on('dragstart', startDrag, elem);
    var dragGesture = $ionicGesture.on('drag', dragLines, elem);
    var dragEndGesture = $ionicGesture.on('dragend', endDrag, elem);
    var holdGesture = $ionicGesture.on('hold', measures, elem);
	// elem.on('$destroy', function(){
// 		scope.roomModal.remove();
// 	    console.log('elem destroyed');
// 	})
    scope.$on('$destroy', function() {
        $ionicGesture.off(doubletapGesture, 'doubletap', addPoint);
        $ionicGesture.off(dragStartGesture, 'dragstart', startDrag);
        $ionicGesture.off(dragGesture, 'drag', dragLines);
        $ionicGesture.off(dragEndGesture, 'dragend', endDrag);
        $ionicGesture.off(holdGesture, 'hold', measures);
    });

      }
                     
    };
});