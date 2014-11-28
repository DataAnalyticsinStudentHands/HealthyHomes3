angular.module('Directives').directive('gridManip',function($ionicGesture,$window,$timeout,findGeom){
    return {
        restrict: 'AE',
        //templateUrl: 'partials/gridlines.html',
        link: function(scope,elem,attr) {
            var gridElem = angular.element(document.getElementById('floor-container'));
            var offsetLeft = findGeom.offSetLeft(gridElem);
            var offsetTop = findGeom.offSetTop(gridElem);
            scope.gridShow1 = true; //in case we want to turn them off for some views
            scope.gridShow5 = true;
            var windowHt = scope.windowHt = 1.2*$window.outerHeight; //plus the offset!!
            var windowWd = scope.windowWd = 1.2*$window.outerWidth;
            scope.gridLineNumber = function(gridSize,gridInterval){
                //console.log(gridSize);
                return _.range(0,gridSize,gridInterval) //everyfive feet
            };
        //console.log($scope.gridLineNumber(11,11))
            scope.gridlinePtsOLD = function(gridSizeHt,gridSizeWd){
                return '5,5 ' + gridSizeWd,gridSizeWd // 2000,2000'
            };
            var gridMag = scope.gridMag = findGeom.gridMag;
            var canvasSize = scope.canvasSize = findGeom.canvasSize; 
            var magnifyGrid = findGeom.magnifyGrid;
            var gridElem = findGeom.gridElem;
            var gridoffTop = gridElem[0].offsetTop;
            var gridoffLeft = gridElem[0].offsetLeft;
            var newMag;
            var dragGrid = function($event){
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
                newMag = magnifyGrid(.9);
                gridElem.css({'width':newMag+'px','height':newMag+'px'});
            };
            var startDrag = function(e){
                e.preventDefault();
            };
            var endDrag = function(e){
                e.preventDefault();
                gridoffTop = gridElem[0].offsetTop;
                gridoffLeft = gridElem[0].offsetLeft;
            };
            var holdGest = function(e){
                e.preventDefault();
                newMag = magnifyGrid(1.1);
                gridElem.css({'width':newMag+'px','height':newMag+'px'});
                //recenter on finger
            };
            var pinchGest = function(e){
                e.preventDefault();
                console.log(e);
                //put in some logic for magnifyGrid;
                //magnifyGrid(1.1);
                //recenter on finger
            };
            var doubleTapGesture = $ionicGesture.on('doubletap', dubTap, elem);
//                doubleTapGesture.options.recognizeWith = 'tapGesture';
//            var tripleTapGesture = $ionicGesture.on('tripletap', tripTap, elem);
            var dragStartGesture = $ionicGesture.on('dragstart', startDrag, elem);
            var dragGesture = $ionicGesture.on('drag', dragGrid, elem);
            var dragEndGesture = $ionicGesture.on('dragend', endDrag, elem);
            var holdGesture = $ionicGesture.on('hold', holdGest, elem);
            var pinchGesture = $ionicGesture.on('hold', pinchGest, elem);
//            doubleTapGesture.recognizeWith(tapGesture);
//            doubleTapGesture.requireFailure(tripleTapGesture);
                    
            scope.$on('$destroy', function() {
//                $ionicGesture.off(tapGesture, 'tap', alertTap);
                $ionicGesture.off(doubleTapGesture, 'doubletap', dubTap);
//                $ionicGesture.off(tripleTapGesture, 'tripletap', tripTap);
                $ionicGesture.off(dragStartGesture, 'dragstart', startDrag);
                $ionicGesture.off(dragGesture, 'drag', dragGrid);
                $ionicGesture.off(dragEndGesture, 'dragend', endDrag);
                $ionicGesture.off(holdGesture, 'hold', holdGest);
                $ionicGesture.off(pinchGesture, 'hold', pinchGest);
            });
        }
    };
});