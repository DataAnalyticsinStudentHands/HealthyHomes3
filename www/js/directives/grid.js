angular.module('Directives').directive('gridManip',function($ionicGesture,$ionicSideMenuDelegate,$window,$timeout,findGeom){
    return {
        restrict: 'A',
		scope: {
			gridmag: '='
		},
 		controller: ['$scope', function($scope){
 		}],
        link: function(scope,elem,attr) {
            var gridElem = findGeom.gridElem;
            scope.gridShow1 = true; 
            scope.gridShow5 = true;
            scope.gridlinePtsOLD = function(gridSizeHt,gridSizeWd){
                return '5,5 ' + gridSizeWd,gridSizeWd 
            };
            var canvasSize = scope.canvasSize = findGeom.canvasSize; 
            var gridoffTop = gridElem[0].offsetTop;
            var gridoffLeft = gridElem[0].offsetLeft;
            var newMag;
			var gridmag = scope.gridmag;
			var changeGridMag = function(num){
				gridmag += parseFloat(num);
				scope.gridmag = gridmag;
	    		newMag = gridmag * canvasSize; 
	    		return newMag
			}
            var dragGrid = function($event){
                $ionicSideMenuDelegate.canDragContent(false);
                $event.preventDefault();
                var deltaX = $event.gesture.deltaX;
                var deltaY = $event.gesture.deltaY;
                var offTop = gridoffTop + deltaY;
                var offLeft = gridoffLeft + deltaX;
                if (offTop > 0) { offTop = 0}; 
                if (offLeft > 0) { offLeft = 0};
                gridElem.css({'top':offTop,'left':offLeft});
            };
            var dubTap = function(e){
                e.preventDefault();
                newMag = changeGridMag(-.1);
                gridElem.css({'width':newMag+'px','height':newMag+'px'});
            };
            var startDrag = function(e){
                e.preventDefault();
            };
            var endDrag = function(e){
                e.preventDefault();
                gridoffTop = gridElem[0].offsetTop;
                gridoffLeft = gridElem[0].offsetLeft;
                $ionicSideMenuDelegate.canDragContent(false);
            };
            var holdGest = function(e){
                e.preventDefault();
                newMag = changeGridMag(.1);
                gridElem.css({'width':newMag+'px','height':newMag+'px'});
            };
            var pinchGest = function(e){
                e.preventDefault();
                console.log(e);
	            scope.touches = e.gesture.touches[0];
	            scope.touches1 = e.gesture.touches[1];
            };
            var doubleTapGesture = $ionicGesture.on('doubletap', dubTap, elem);
            var dragStartGesture = $ionicGesture.on('dragstart', startDrag, elem);
            var dragGesture = $ionicGesture.on('drag', dragGrid, elem);
            var dragEndGesture = $ionicGesture.on('dragend', endDrag, elem);
            var holdGesture = $ionicGesture.on('hold', holdGest, elem);
            var pinchGesture = $ionicGesture.on('pinch', pinchGest, elem);
                    
            scope.$on('$destroy', function() {
                $ionicGesture.off(doubleTapGesture, 'doubletap', dubTap);
                $ionicGesture.off(dragStartGesture, 'dragstart', startDrag);
                $ionicGesture.off(dragGesture, 'drag', dragGrid);
                $ionicGesture.off(dragEndGesture, 'dragend', endDrag);
                $ionicGesture.off(holdGesture, 'hold', holdGest);
                $ionicGesture.off(pinchGesture, 'pinch', pinchGest);
            });
        }
    };
});