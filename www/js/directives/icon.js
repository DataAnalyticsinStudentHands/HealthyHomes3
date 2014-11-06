HHApp.directive('iconManip',function(layoutObjectModel,$ionicGesture,findGeom){
    return {
        restrict: 'AE',
        scope: {
            iconpts: '=iconpts',
            currentRoom: '=currentRoom',
        },
        link: function(scope,elem,attr) {
    scope.layoutObjectModel = layoutObjectModel;
    var iconpts = scope.iconpts;
    var currentRoom = scope.currentRoom; //why is this empty!!!
    console.log('inside icons');
    console.log(scope);
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
    var dragIcons = function(e){ 
        e.preventDefault();
        e.cancelBubble = 'true';
        var dragX = ((e.gesture.center.pageX-offLeft)*gridMag)-points[0][0];
        var dragY = ((e.gesture.center.pageY-offTop)*gridMag)-points[0][1];
//        console.log(e.gesture.center.pageX)
//        console.log(offLeft)
//        console.log(dragX)
//        console.log('pointsb4'+points)
        for (var n = 0;n<points.length;n++){
            points[n][0] = points[n][0] + dragX;
            points[n][1] = points[n][1] + dragY;
        };
        console.log('iconpoints'+scope.iconpts);
        scope.$apply();
        //currentRoom.measurePoints = $scope.measurePoints = findGeom.showMeasures(currentRoom.roomPoints);
    };
        
    var alertTap = function(e){
        e.preventDefault();
        e.cancelBubble = 'true';
        alert('in icon.js');
    };

      //var dragGesture = $ionicGesture.on('drag', handleDrag, elem);
    var dragGesture = $ionicGesture.on('drag', dragIcons, elem);
    var tapGesture = $ionicGesture.on('tap', alertTap, elem);

      scope.$on('$destroy', function() {
        $ionicGesture.off(dragGesture, 'drag', dragIcons);
      });
        }
    };
});