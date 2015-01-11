angular.module('Directives').directive('circleManip',function($ionicSideMenuDelegate,$ionicGesture,findGeom){
    return {
        restrict: 'AE',
        template: '',
        scope: {
            circpoints: '=',
            circType: '=',
			gridmag: '='
        },
        controller: ['$scope', function($scope){
        }],
        link: function(scope,elem,attr) {
    var circpoints = scope.circpoints;
    var circType = scope.circType;
	var gridMag = parseFloat(scope.gridmag);
	scope.$watch(function(scope) { return scope.gridmag },
              function() {
				  gridMag = parseFloat(scope.gridmag);
              }
    );
    var gridElem = angular.element(document.getElementById('floor-container'));
    var offLeft = findGeom.offSetLeft(gridElem);
    var offTop = findGeom.offSetTop(gridElem);
    var dragXpoint;
    var dragYpoint;
    var begDragX;
    var begDragY;
    var startDrag = function(e){
        e.preventDefault();
        e.stopPropagation();
        $ionicSideMenuDelegate.canDragContent(false);
        begDragX = parseInt(circpoints[0]);
        begDragY = parseInt(circpoints[1]);
    };
    var dragPoints = function(e){ //need to work in zoom stuff
        e.stopPropagation();
        dragXpoint = parseInt(e.gesture.deltaX/gridMag);
        dragYpoint = parseInt(e.gesture.deltaY/gridMag);
        if(isNaN(dragXpoint)){console.log('wtf')};
        if(begDragX){
            circpoints[0] = begDragX + dragXpoint;};
        if(begDragY){
            circpoints[1] = begDragY + dragYpoint;};
        if(isNaN(circpoints[0])){console.log('really points?')};
        scope.$apply();
    };
    var endDrag = function(e){
        $ionicSideMenuDelegate.canDragContent(true);
        circpoints[0] = 10*Math.round(circpoints[0]/10);
        circpoints[1] = 10*Math.round(circpoints[1]/10);
        scope.$apply();
    };
    var dragPointStartGesture = $ionicGesture.on('dragstart', startDrag, elem);
    var dragPointGesture = $ionicGesture.on('drag', dragPoints, elem);
    var dragPointEndGesture = $ionicGesture.on('dragend', endDrag, elem);
            
    scope.$on('$destroy', function() {
        $ionicGesture.off(dragPointStartGesture, 'dragstart', startDrag);
        $ionicGesture.off(dragPointGesture, 'drag', dragPoints);
        $ionicGesture.off(dragPointEndGesture, 'dragend', endDrag);
    });
        }
    };
});