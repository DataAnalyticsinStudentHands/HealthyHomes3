angular.module('Directives').directive('circleManip',function($ionicSideMenuDelegate,$ionicGesture,findGeom){
    return {
        restrict: 'AE',
        template: '',
        scope: {
            circpoints: '=',
            circcnt: '='
        },
        controller: ['$scope', function($scope){
        }],
        link: function(scope,elem,attr) {
    var circpoints = scope.circpoints;
    var circcnt = scope.circcnt;
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
        begDragX = circpoints[0];
        begDragY = circpoints[1];
    };
    var dragPoints = function(e){ //need to work in zoom stuff
        e.stopPropagation();
        dragX = e.gesture.deltaX/gridMag;
        dragY = e.gesture.deltaY/gridMag;
        circpoints[0] = begDragX + dragX;
        circpoints[1] = begDragY + dragY;
        scope.$apply();
    };
    var endDrag = function(e){
        $ionicSideMenuDelegate.canDragContent(true);
        circpoints[0] = 10*Math.round(circpoints[0]/10);
        circpoints[1] = 10*Math.round(circpoints[1]/10);
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