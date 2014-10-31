HHApp.directive('iconManip',function(layoutObjectModel,$ionicGesture,findGeom){
    return {
        restrict: 'AE',
        scope: {
            iconpts: '=iconpts'
        },
        link: function(scope,elem,attr) {
    scope.layoutObjectModel = layoutObjectModel;
    console.log(iconpts);
    var points = scope.iconpts;
    for (var n = 0;n<points.length;n++){
        points[n][0] = parseInt(points[n][0]);
        points[n][1] = parseInt(points[n][1]);
    };
//    console.log(points)
//    console.log(points[0])
//    console.log(points[0][0])
//    console.log('pts'+points);
//    console.log(scope.roompts);
    var showMeasures = findGeom.showMeasures;
    var gridElem = angular.element(document.getElementById('floor-container'));
    var offLeft = findGeom.offSetLeft(gridElem);
    var offTop = findGeom.offSetTop(gridElem);
    var gridMag = 1; //findGeom.gridMag;
    var dragLines = function(e){ //need to work in zoom stuff - needs copy and drag from left top to smooth it 
            //var points = _.clone(currentRoom.roomPoints)
            //$event.preventDefault();
        e.preventDefault();
        //console.log(e)
        var xtraOffX = 0;
        var xtraOffY = 0;
        
        if(points.length > 3){ //change to center of polygon
            xtraOffX = Math.abs(points[0][0]-points[1][0])/2;
            xtraOffY = Math.abs(points[0][1]-points[2][1])/2; //works well for squares
        }
        var dragX = ((e.gesture.center.pageX-offLeft)*gridMag)-points[0][0]-xtraOffX;
        var dragY = ((e.gesture.center.pageY-offTop)*gridMag)-points[0][1]-xtraOffY;
//        console.log(e.gesture.center.pageX)
//        console.log(offLeft)
//        console.log(dragX)
//        console.log('pointsb4'+points)
        for (var n = 0;n<points.length;n++){
            points[n][0] = (10*Math.round(points[n][0] + dragX)/10);
            points[n][1] = (10*Math.round(points[n][1] + dragY)/10);
        };
        console.log('iconpoints'+scope.iconpts);
        scope.$apply();
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