angular.module('Directives').directive('roomManip',function($ionicGesture,$ionicSideMenuDelegate,findGeom){
    return {
        restrict: 'AE',
        scope: {
            room: '='
        },
//        templateNamespace: 'svg',
//        template: '<circle fill="red" stroke="blue" stroke-width="3" cx="250" cy="200" r="100" />',
        controller: ['$scope', function($scope){
            
        }],
        link: function(scope,elem,attr) {
    scope.room.roomPoints = [[120.0,120.0],[220.0,120.0],[220.0,220.0],[120.0,220.0]];  //get from service as map from arcs
    console.log(scope.room)
    var points = scope.room.roomPoints;
    //scope.room.roomNameX = points[0][0] + 10;
    //scope.room.roomNameY = points[0][1] + 10;        
    //scope.room.measurePoints = findGeom.showMeasures(points);
	var fingerX;
	var fingerY;
	var ind4new;
	var newX;
	var newY;
	var dragWhole = true;
	var addPoint = function(e){ //needs to add circles properly
		e.stopPropagation();
		if (dragWhole){
			addTap(e);
		}else{
		    fingerX = e.gesture.center.pageX;
		    fingerY = e.gesture.center.pageY;
		    ind4new = findGeom.closestLine(points,fingerX,fingerY)[0][0];
			if (ind4new+1<points.length){
				ind4new += 1;
			}else{
				ind4new = 0;
			};
    		gridMag = findGeom.gridMag;
		    newX = fingerX*gridMag;
		    newY = fingerY*gridMag;
		    if(ind4new+1>points.length || ind4new == 0 ){
		        points.push([newX,newY]); //to end??
		    }else{
		        points.splice(ind4new,0,[newX,newY]);
		    };
			scope.room.measurePoints = findGeom.showMeasures(points);
			scope.$apply();
		};
	};
    var addTap = function(e){
	    //fingerX = e.gesture.center.pageX;
	    //fingerY = e.gesture.center.pageY; //in case needed after select?
        e.preventDefault();
        e.stopPropagation();
		var selectBox = document.getElementById('roomAction');
		selectBox.size = 5;
		selectBox.value = 3;
    };
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
	//var clonePts = _.clone(points);
	var n;
	var inPts;
	var dragX;
	var dragY;
    var startDrag = function(e){
        e.preventDefault();
        e.stopPropagation();
		//clonePts = _.clone(points);
		inPts = _.map(points,function(num){return true});
		fingerX = e.gesture.center.pageX;
		fingerY = e.gesture.center.pageY;
		newIndex4line = findGeom.closestLine(points,fingerX,fingerY);
        $ionicSideMenuDelegate.canDragContent(false);
        gridMag = findGeom.gridMag;
        offLeft = findGeom.offSetLeft(gridElem); 
        //write this to json for this room? or for floor as a whole?
        offTop = findGeom.offSetTop(gridElem);
		xtraOffX = Math.abs(points[0][0] - (e.gesture.center.pageX-offLeft)/gridMag);
		xtraOffY = Math.abs(points[0][1] - (e.gesture.center.pageY-offTop)/gridMag);
    };
	var points2 = [];
	var new4line;
	var assignPoints = function(e){ //have to force it to iterate from n=0
		if (!dragWhole){
	        new4line = newIndex4line[0][0];
			onlyPt = newIndex4line[1];
			points2 = [];
			points2.push(points[new4line]);
			if (!onlyPt){
				if ((new4line+1)<points.length){
					points2.push(points[new4line+1]);
				}else{
					points2.push(points[0]);
				}
				xtraOffX = (points2[1][0] - points2[0][0])/(2*gridMag);
				xtraOffY = (points2[1][1] - points2[0][1])/(2*gridMag);
			}else{
				xtraOffX = 0;
				xtraOffY = 0;
			}
		}else{
			points2 = points;
		};
        dragX = (((e.gesture.center.pageX)/gridMag)-points2[0][0])-offLeft-xtraOffX;
        dragY = (((e.gesture.center.pageY)/gridMag)-points2[0][1])-offTop-xtraOffY;
    	for (n=0;n<points2.length;n++){
			if (inPts[n]){
				points2[n][0] = points2[n][0] + dragX;
				points2[n][1] = points2[n][1] + dragY;
 			};
    	};
	};
    var dragLines = function(e){ //need to work in zoom stuff
        e.stopPropagation();
		assignPoints(e);
		scope.room.measurePoints = findGeom.showMeasures(points);
        scope.$apply();
    };
    var endDrag = function(e){
        $ionicSideMenuDelegate.canDragContent(true);
        for (var n=0;n<points.length;n++){
            points[n][0] = 10*Math.round(points[n][0]/10);
            points[n][1] = 10*Math.round(points[n][1]/10);
        };
        scope.room.measurePoints = findGeom.showMeasures(points);
        //elem.find('polygon').css('display','none');
        points2 = [];
        scope.$apply();
    };
	var measures = function(e){
		e.stopPropagation();
		if (dragWhole) {
			elem.find('circle').removeClass('roomEditLine');
			elem.find('text').removeClass('roomEditLine');
			angular.element(elem.find('text')[0]).addClass('roomEditLine');
		} else {
			elem.find('circle').addClass('roomEditLine');
			elem.find('text').addClass('roomEditLine');
			angular.element(elem.find('text')[0]).removeClass('roomEditLine');
		}
		dragWhole =! dragWhole;
		//  elem.find('polygon').css('stroke-dasharray','3,3,3,3,3,3');
		elem.find('polygon').toggleClass('roomDashArray');
		//elem.find('circle').toggleClass('roomEditLine');//css('display','block');
		//elem.find('text').toggleClass('roomEditLine');
    };
    var doubletapGesture = $ionicGesture.on('doubletap', addPoint, elem);
    var dragStartGesture = $ionicGesture.on('dragstart', startDrag, elem);
    var dragGesture = $ionicGesture.on('drag', dragLines, elem);
    var dragEndGesture = $ionicGesture.on('dragend', endDrag, elem);
    var holdGesture = $ionicGesture.on('hold', measures, elem);
            
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