angular.module('Directives').directive('lineManip',function($ionicSideMenuDelegate,$ionicGesture,findGeom){
    return {
        restrict: 'AE',
        template: '',
        scope: {
            linepoints: '='
        },
        controller: ['$scope', function($scope){
            //console.log($scope);
        }],
        link: function(scope,elem,attr) {
    var linepoints = scope.linepoints;
    scope.alert = function(text){
        alert(text+'in points'+linepoints);
    }
    var gridMag = findGeom.gridMag;
//    var gridElem = angular.element(document.getElementById('floor-container'));
//    var offLeft = findGeom.offSetLeft(gridElem);
//    var offTop = findGeom.offSetTop(gridElem);
    var begDragX1;
    var begDragY1;
    var begDragX2;
    var begDragY2;
    var startDrag = function(e){
        e.preventDefault();
        e.stopPropagation();
        $ionicSideMenuDelegate.canDragContent(false);
        gridMag = findGeom.gridMag;
//        offLeft = findGeom.offSetLeft(gridElem); 
//        offTop = findGeom.offSetTop(gridElem);
        begDragX1 = linepoints[0].points[0][0];
        begDragX2 = linepoints[1].points[0][0];
        begDragY1 = linepoints[0].points[0][1];
        begDragY2 = linepoints[1].points[0][1];
		//xtraOffX = Math.abs(points[0][0] - (e.gesture.center.pageX-offLeft)/gridMag);
		//xtraOffY = Math.abs(points[0][1] - (e.gesture.center.pageY-offTop)/gridMag);
//        fingerX = (e.gesture.center.pageX/gridMag)-offLeft;
//		fingerY = (e.gesture.center.pageY/gridMag)-offTop;
    };
    var dragPoints = function(e){ //need to work in zoom stuff
        e.stopPropagation();
//        dragX = (((e.gesture.deltaX)/gridMag)-points2[0][0])+xtraOffX;
//        dragY = (((e.gesture.deltaY)/gridMag)-points2[0][1])+xtraOffY;
        dragX = e.gesture.deltaX/gridMag;
        dragY = e.gesture.deltaY/gridMag;
//        linepoints[0] = dragX;
//        linepoints[1] = dragY;
        linepoints[0].points[0][0] = begDragX1 + dragX;
        linepoints[1].points[0][0] = begDragX2 + dragX;
        linepoints[0].points[0][1] = begDragY1 + dragY;
        linepoints[1].points[0][1] = begDragY2 + dragY;
		//assignPoints(e);
		//scope.room.measurePoints = findGeom.showMeasures(points);
        scope.$apply();
    };
    var endDrag = function(e){
        $ionicSideMenuDelegate.canDragContent(true);
        linepoints[0].points[0][0] = 10*Math.round(linepoints[0].points[0][0]/10);
        linepoints[0].points[0][1] = 10*Math.round(linepoints[0].points[0][1]/10);
        linepoints[1].points[0][0] = 10*Math.round(linepoints[1].points[0][0]/10);
        linepoints[1].points[0][1] = 10*Math.round(linepoints[1].points[0][1]/10);
        console.log(linepoints)
        //scope.room.measurePoints = findGeom.showMeasures(points);
        scope.$apply();
    };
//    var testPoint = function(e){
//        alert('in points' +e.gesture.center.pageX)
//    };
            //as you drag a point, distances to other connected points show up?
            //text/titles for a room can be a directive? with the points as a range so they can be dragged together.
            //scope.floor.points = ""; //eventually have it draw perimeter automatically
            //If every measure after the first is relative to that first, so that the whole room is then measurable by it's own units....
    //var doubletapGesture = $ionicGesture.on('doubletap', testPoint, elem);
    var dragStartGesture = $ionicGesture.on('dragstart', startDrag, elem);
    var dragGesture = $ionicGesture.on('drag', dragPoints, elem);
    var dragEndGesture = $ionicGesture.on('dragend', endDrag, elem);
    //var holdGesture = $ionicGesture.on('hold', measures, elem);
            
    scope.$on('$destroy', function() {
        //$ionicGesture.off(doubletapGesture, 'doubletap', testPoint);
        $ionicGesture.off(dragStartGesture, 'dragstart', startDrag);
        $ionicGesture.off(dragGesture, 'drag', dragPoints);
        $ionicGesture.off(dragEndGesture, 'dragend', endDrag);
        //$ionicGesture.off(holdGesture, 'hold', measures);
    });
        }
    };
});