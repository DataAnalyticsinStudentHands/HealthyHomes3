angular.module('Directives').directive('circleManip',function($ionicSideMenuDelegate,$ionicGesture,findGeom){
    return {
        restrict: 'AE',
        template: '',
        scope: {
            circpoints: '='
        },
        controller: ['$scope', function($scope){
            //console.log($scope);
        }],
        link: function(scope,elem,attr) {
            var circpoints = scope.circpoints;
            scope.alert = function(text){
                alert(text+'in points'+circpoints);
            }
    var gridMag = findGeom.gridMag;
    var gridElem = angular.element(document.getElementById('floor-container'));
    var offLeft = findGeom.offSetLeft(gridElem);
    var offTop = findGeom.offSetTop(gridElem);
    var begDragX;
    var begDragY;
    var startDrag = function(e){
        e.preventDefault();
        e.stopPropagation();
        $ionicSideMenuDelegate.canDragContent(false);
        gridMag = findGeom.gridMag;
//        offLeft = findGeom.offSetLeft(gridElem); 
//        offTop = findGeom.offSetTop(gridElem);
        begDragX = circpoints[0];
        begDragY = circpoints[1];
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
//        circpoints[0] = dragX;
//        circpoints[1] = dragY;
        circpoints[0] = begDragX + dragX;
        circpoints[1] = begDragY + dragY;
        console.log(circpoints)
        console.log(scope.circpoints)
		//assignPoints(e);
		//scope.room.measurePoints = findGeom.showMeasures(points);
        scope.$apply();
    };
    var endDrag = function(e){
        $ionicSideMenuDelegate.canDragContent(true);
        circpoints[0] = 10*Math.round(circpoints[0]/10);
        circpoints[1] = 10*Math.round(circpoints[1]/10);
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