angular.module('Directives').directive('lineManip',function($ionicSideMenuDelegate,$ionicGesture,findGeom){
    return {
        restrict: 'AE',
        template: '',
        scope: {
            linepoints: '='
        },
        controller: ['$scope', function($scope){
        }],
        link: function(scope,elem,attr) {
    var linepoints = scope.linepoints;
    var gridMag = findGeom.gridMag;
    var begDragX1;
    var begDragY1;
    var begDragX2;
    var begDragY2;
    var startDrag = function(e){
        e.preventDefault();
        e.stopPropagation();
        $ionicSideMenuDelegate.canDragContent(false);
        gridMag = findGeom.gridMag;
        begDragX1 = linepoints[0].points[0][0];
        begDragX2 = linepoints[1].points[0][0];
        begDragY1 = linepoints[0].points[0][1];
        begDragY2 = linepoints[1].points[0][1];
    };
    var dragPoints = function(e){ //need to work in zoom stuff
        e.stopPropagation();
        dragX = e.gesture.deltaX/gridMag;
        dragY = e.gesture.deltaY/gridMag;
        linepoints[0].points[0][0] = begDragX1 + dragX;
        linepoints[1].points[0][0] = begDragX2 + dragX;
        linepoints[0].points[0][1] = begDragY1 + dragY;
        linepoints[1].points[0][1] = begDragY2 + dragY;
		scope.room.measurePoints = findGeom.showMeasures(points);
        scope.$apply();
    };
    var endDrag = function(e){
        $ionicSideMenuDelegate.canDragContent(true);
        linepoints[0].points[0][0] = 10*Math.round(linepoints[0].points[0][0]/10);
        linepoints[0].points[0][1] = 10*Math.round(linepoints[0].points[0][1]/10);
        linepoints[1].points[0][0] = 10*Math.round(linepoints[1].points[0][0]/10);
        linepoints[1].points[0][1] = 10*Math.round(linepoints[1].points[0][1]/10);
        scope.room.measurePoints = findGeom.showMeasures(points);
        scope.$apply();
    };
    var dragStartGesture = $ionicGesture.on('dragstart', startDrag, elem);
    var dragGesture = $ionicGesture.on('drag', dragPoints, elem);
    var dragEndGesture = $ionicGesture.on('dragend', endDrag, elem);
            
    scope.$on('$destroy', function() {
        $ionicGesture.off(dragStartGesture, 'dragstart', startDrag);
        $ionicGesture.off(dragGesture, 'drag', dragPoints);
        $ionicGesture.off(dragEndGesture, 'dragend', endDrag);
    });
        }
    };
});