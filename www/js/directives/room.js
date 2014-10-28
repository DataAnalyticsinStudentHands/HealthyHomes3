HHApp.directive('roomManip',function(layoutObjectModel,$ionicGesture,findGeom){
    return {
        restrict: 'AE',
        link: function(scope,elem,attr) {
            scope.layoutObjectModel = layoutObjectModel;
            console.log(layoutObjectModel)
            console.log(attr)
            var handleDrag = function(e) {
                console.log(e.gesture.touches[0].pageX);
        //console.log('Drag: ', e.gesture.touches[0].pageX, e.gesture.touches[0].pageY, e.gesture.deltaX, e.gesture.deltaY);
      };
    var points = attr.roompts;
            console.log('pts'+points);
    var showMeasures = findGeom.showMeasures;
    var dragLines = function(e){ //need to work in zoom stuff - needs copy and drag from left top to smooth it 
            //var points = _.clone(currentRoom.roomPoints)
            //$event.preventDefault();
            var xtraOffX = 0;
            var xtraOffY = 0;
            if(points.length > 3){ //change to center of polygon
                xtraOffX = Math.abs(points[0][0]-points[1][0])/2;
                xtraOffY = Math.abs(points[0][1]-points[2][1])/2; //works well for squares
            }
            var dragX = ((e.gesture.center.pageX-offLeft)*gridMag)-points[0][0]-xtraOffX;
            var dragY = ((e.gesture.center.pageY-offTop)*gridMag)-points[0][1]-xtraOffY;
            for (var n = 0;n<currentRoom.roomPoints.length;n++){
                points[n][0] = 10*Math.round((points[n][0] + dragX)/10);
                points[n][1] = 10*Math.round((points[n][1] + dragY)/10);
            };
            //currentRoom.measurePoints = $scope.measurePoints = findGeom.showMeasures(currentRoom.roomPoints);
        };
        

      //var dragGesture = $ionicGesture.on('drag', handleDrag, elem);
    var dragGesture = $ionicGesture.on('drag', dragLines, elem);

      scope.$on('$destroy', function() {
        $ionicGesture.off(dragGesture, 'drag', handleDrag);
      });
        }
    };
});