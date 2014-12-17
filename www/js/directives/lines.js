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
    var dragXline;
    var dragYline;
    var begDragX1;
    var begDragY1;
    var begDragX2;
    var begDragY2;
    var startDrag = function(e){
        e.preventDefault();
        e.stopPropagation();
        gridMag = findGeom.gridMag;
        begDragX1 = parseInt(linepoints[0].points[0][0]);
        begDragX2 = parseInt(linepoints[1].points[0][0]);
        begDragY1 = parseInt(linepoints[0].points[0][1]);
        begDragY2 = parseInt(linepoints[1].points[0][1]);
    };
    var drag2Points = function(e){ 
        e.preventDefault();
        e.stopPropagation();
        dragXline = parseInt(e.gesture.deltaX/gridMag);
        dragYline = parseInt(e.gesture.deltaY/gridMag);
        if(begDragX1){
            linepoints[0].points[0][0] = parseInt(begDragX1 + dragXline);};
        if(begDragX2){
            linepoints[1].points[0][0] = parseInt(begDragX2 + dragXline);};
        if(begDragY1){
            linepoints[0].points[0][1] = parseInt(begDragY1 + dragYline);};
        if(begDragY2){
            linepoints[1].points[0][1] = parseInt(begDragY2 + dragYline);};
        scope.$apply();
    };
    var endDrag = function(e){
        linepoints[0].points[0][0] = 10*Math.round(linepoints[0].points[0][0]/10);
        linepoints[0].points[0][1] = 10*Math.round(linepoints[0].points[0][1]/10);
        linepoints[1].points[0][0] = 10*Math.round(linepoints[1].points[0][0]/10);
        linepoints[1].points[0][1] = 10*Math.round(linepoints[1].points[0][1]/10);
        scope.$apply();
    };
    var dragLineStartGesture = $ionicGesture.on('dragstart', startDrag, elem);
    var dragLineGesture = $ionicGesture.on('drag', drag2Points, elem);
    var dragLineEndGesture = $ionicGesture.on('dragend', endDrag, elem);
    scope.$on('$destroy', function() {
        $ionicGesture.off(dragLineStartGesture, 'dragstart', startDrag);
        $ionicGesture.off(dragLineGesture, 'drag', drag2Points);
        $ionicGesture.off(dragLineEndGesture, 'dragend', endDrag);
    });
        }
    };
});