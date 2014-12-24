angular.module('Directives').directive('roomManip',function($ionicModal,$ionicGesture,$ionicSideMenuDelegate,$stateParams,$ionicPopup,findGeom){
    return {
        restrict: 'AE',
        scope: {
            room: '=',
			gridmag: '='
        },
//        templateNamespace: 'svg',
//        template: '<circle fill="red" stroke="blue" stroke-width="3" cx="250" cy="200" r="100" />',
        controller: ['$scope', function($scope){
            $scope.rmModal = [];
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
			$scope.rmModal.rmObj = 'Flag';
			$scope.rmModal.rmobjTypes = {
				"Flag": "Flag",
				"Note" : "Note",
				"Image" : "Image"
			};
			$scope.rmModal.typ = 'green';
			$scope.rmModal.typs = {
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
		            animation: 'slide-in-up',
                    height:'100%'
		        }).then(function(modalLine) {
		          $scope.lineModal = modalLine;
		    });
		    $scope.showAdd2Line = function() {
		        $scope.lineModal.show();
		    };
		    $scope.closeLineModal = function() {
		        $scope.lineModal.hide();
		    };
			$scope.rmModal.pthTyp = 'Line';
            $scope.rmModal.pathTypes = [
				"Line",
				"Flag", //then flag types include appliances, etc.
				"QuadBezier",
				"CubicBezier",
				"Window",
				"Door"
                ];
            
//			$scope.rmModal.pathTypes = {
//				"Line": "Line",
//				"Window" : "Window",
//				"Door" : "Door",
//				"QuadBezier" : "QuadBezier",
//				"CubicBezier" : "CubicBezier"
//			};
//            $scope.$watch(
//                'rmModal.pthTyp',
//                function( newValue, oldValue ) {
//                    console.log(oldValue,newValue)
//                    if ( newValue === oldValue ) {
//                        return;
//                    };
//                    if ( $scope.rmModal.pthTyp === newValue ) {
//                            return;
//                    };
//                    $scope.rmModal.pthTyp = newValue;
//                }
//            );
        }],
        link: function(scope,elem,attr) {
    //scope.room.roomPoints = [[20.0,120.0],[220.0,120.0],[220.0,220.0],[320.0,320.0],[220.0,420.0],[420.0,220.0],[620.0,620.0],[720.0,720.0]];  //get from service as map from arcs
    scope.alert = function (text) {
        alert(text+'inroom');
    };
    scope.showRemConfirm = function(ind4new) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Remove Point From Path',
            template: 'Are you sure?'
        });
        confirmPopup.then(function(res) { 
        if(res) {
            removeSegment(ind4new);
        }
        });
    };
    var svgArr = [];
    var svgArrOLD = 
    [ 
        { "pathType" : "newSeg",
                   
         "points" : [[130,177]]
                   
        },
        { "pathType" : "CubicBezier",
                   
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
    	{ "pathType" : "Line",
    	           
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
	var gridMag = scope.gridmag;
	scope.$watch(function(scope) { return scope.gridmag },
              function() {
				  gridMag = scope.gridmag;
              }
    );
    //var nextPoints;
    if(!scope.room.svgPoints){
        scope.room.svgPoints = svgArr;//findGeom.svgPath(svgArr);
    }else{
        svgArr = scope.room.svgPoints;
    };
	scope.modalSvgPath = findGeom.svgPath;
    var points = [];
    var setPoints = function(){
        nextPoints = [];
        points = [];
        var rmMinX = null;
        var rmMinY = null;
        var rmMaxX = null;
        var rmMaxY = null;
        for (item in svgArr){
            nextPoints = svgArr[item].points
            if (nextPoints){
                for (item in nextPoints){
                    points.push(nextPoints[item])
                    if(rmMinX==null){
                        rmMinX = rmMaxX = nextPoints[item][0];
                        rmMinY = rmMaxY = nextPoints[item][1];
                    };
					if (nextPoints[item][0]<(rmMinX)){
						rmMinX=nextPoints[item][0]
                    };
					if (nextPoints[item][1]<(rmMinY)){
                        rmMinY=nextPoints[item][1]
                    };
					if (nextPoints[item][0]>(rmMaxX)){
                        rmMaxX=nextPoints[item][0]
                    };
					if (nextPoints[item][1]>(rmMaxY)){
                        rmMaxY=nextPoints[item][1]};
                }
            }
        }
        scope.rmMinX = rmMinX-15;//-50;
	    scope.rmMinY = rmMinY-15;//-50;
	    scope.rmMaxX = (rmMaxX-rmMinX)+35;//+150;
	    scope.rmMaxY = (rmMaxY-rmMinY)+35;//+150;
    };
   	setPoints();
    scope.room.measurePoints = findGeom.showMeasures(svgArr);
	var fingerX;
	var fingerY;
	var gridElem = findGeom.gridElem;
    var gridoffTop = gridElem[0].offsetTop;
    var gridoffLeft = gridElem[0].offsetLeft;
	var closestLinePoints;
	var ind4new;
	var newX;
	var newY;
    var newXY = [];
	var dragWhole = true;

	var addPoint = function(e){ 
		e.stopPropagation();
        e.preventDefault();
        offLeft = parseInt(gridElem[0].offsetLeft);
        offTop = parseInt(gridElem[0].offsetTop);
		fingerX = parseInt((e.gesture.center.pageX-offLeft)/gridMag);
		fingerY = parseInt((e.gesture.center.pageY-offTop)/gridMag);
		closestLinePoints = findGeom.closestLine(svgArr,fingerX,fingerY);
		scope.fingerX = fingerX;
		scope.fingerY = fingerY;
	    scope.ind4new = ind4new = closestLinePoints[0];
	    scope.newX = closestLinePoints[1][0];
	    scope.newY = closestLinePoints[1][1];
        setPoints();
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
	scope.slopeAnchorPts = function(arr,atype){ //have this read as a separate SVG, white bckgrnd; has a directive for dragging and reshaping -- would be in rooms.js
		var arrX0 = arr[0][0]
		var arrX1 = arr[1][0]
		var arrY0 = arr[0][1]
		var arrY1 = arr[1][1]
		var linex = 0;
		var liney = 0;
        if(arrY1-arrY0==0){
            slope=0;
			yintercept = arrY0;
		}else if(arrX1-arrX0==0){
            slope=100000;
			yintercept = 0; //????
        }else{
		    slope = (arrY1-arrY0) / (arrX1-arrX0);
			yintercept = arrY0-(slope*arrX0);
        };
		if (slope<0){ //k is?
			linex = (slope/k)-arrX0;
		}else{
			linex = (slope/k)+arrX0;
		};
		liney = (slope*xWd)+yintercept;
	};
    var removeSegment = function(ind4new){
        scope.closeLineModal();
		//if (svgArr[ind4new-1].pathType!='Line')
		var iter = ind4new;
		if (iter==0){iter=svgArr.length};
        var newArr = [];
        for (item in svgArr){
            if (item!=ind4new){
				if (svgArr[iter-1].pathType!='Line'){
					newArr.push(svgArr[ind4new]);
				}else{
                	newArr.push(svgArr[item]);
				};
            };
        };
        svgArr = newArr;
        setPoints();
		scope.room.svgPoints = svgArr;
		scope.room.measurePoints = findGeom.showMeasures(svgArr);
    };
    scope.addSegment = function(fingerX,fingerY,pthTyp,ind4new,newX,newY){
		scope.closeLineModal();
		if(pthTyp == 'Window' || pthTyp == 'Door'){
			alert('not yet implemented')
			return 
		}
		var ctrlX;
		var ctrlY;
		var ctlInd4new = points.length-1;
		if (ind4new!=0){ctlInd4new=ind4new-1;}
		if (pthTyp == 'CubicBezier'){
			ctrlX = (points[ctlInd4new][0]+newX)/4;
			ctrlY = (points[ctlInd4new][1]+newY)/4;
			newXY = [[parseInt(newX),parseInt(newY)],[parseInt(ctrlX*1.9),parseInt(ctrlY*1.9)],[parseInt(ctrlX*2.7),parseInt(ctrlY*2.7)]];
		}else if (pthTyp == 'QuadBezier'){
			ctrlX = (points[ctlInd4new][0]+newX)/4;
			ctrlY = (points[ctlInd4new][1]+newY)/4;
			newXY = [[parseInt(newX),parseInt(newY)],[parseInt(ctrlX),parseInt(ctrlY)]];
		}else{
        	newXY = [[parseInt(newX),parseInt(newY)]];
		};
		if(ind4new+1>points.length){
            svgArr.push({"pathType" : pthTyp,"points":newXY})
	    }else{
            svgArr.splice(ind4new+1,0,{"pathType" : pthTyp,"points":newXY})
	    };
        setPoints();
		scope.pthTyp = pthTyp = 'Line';
		scope.room.svgPoints = svgArr;
		scope.room.measurePoints = findGeom.showMeasures(svgArr);
    };
    for (var n = 0;n<points.length;n++){
        points[n][0] = parseInt(points[n][0]);
        points[n][1] = parseInt(points[n][1]);
    };
    var gridElem = angular.element(document.getElementById('floor-container'));
    var offLeft = findGeom.offSetLeft(gridElem);
    var offTop = findGeom.offSetTop(gridElem);
    //var gridMag = findGeom.gridMag; 
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
		xtraOffX = parseInt(points[0][0]); 
		xtraOffY = parseInt(points[0][1]); 
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
        e.preventDefault();
        e.stopPropagation();
        if(!dragWhole){
            return
        }else{
            assignPoints(e);
		    scope.room.measurePoints = findGeom.showMeasures(svgArr);
            scope.$apply();
        };
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