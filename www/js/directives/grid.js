angular.module('Directives').directive('gridManip',function($ionicGesture,$ionicSideMenuDelegate,$window,$timeout,findGeom){
    return {
        restrict: 'A',
		scope: {
			gridmag: '='
		},
 		//controller: ['$scope', function($scope){
 		//}],
        //templateUrl: 'partials/gridlines.html',
        link: function(scope,elem,attr) {
			console.log(scope)
			//var gridMag = attr.gridmag;
			
			//scope.gridmag()(num)
			//scope.gridLineNumber()
            var gridElem = findGeom.gridElem;
            //only started failing when started using nightly build ionic
            //var gridElem = angular.element(document.getElementById('floor-container'));
            //var offsetLeft = findGeom.offSetLeft(gridElem);
            //var offsetTop = findGeom.offSetTop(gridElem);
            scope.gridShow1 = true; 
            scope.gridShow5 = true;
            var windowHt = scope.windowHt = 1.2*$window.outerHeight; //plus the offset!!
            var windowWd = scope.windowWd = 1.2*$window.outerWidth;
            //var gridLineNumber = function(gridSize,gridInterval){
		 // var gridLineNumber = function(gridSize,gridInterval){
//                 return _.range(0,gridSize,gridInterval) //everyfive feet
//             };
			//scope.gridlinenumber = gridLineNumber();
            scope.gridlinePtsOLD = function(gridSizeHt,gridSizeWd){
                return '5,5 ' + gridSizeWd,gridSizeWd // 2000,2000'
            };
            //var gridMag = scope.gridMag = findGeom.gridMag(1);
            var canvasSize = scope.canvasSize = findGeom.canvasSize; 
            //var magnifyGrid = findGeom.magnifyGrid;
            
            var gridoffTop = gridElem[0].offsetTop;
            var gridoffLeft = gridElem[0].offsetLeft;
            var newMag;
			var gridmag = scope.gridmag;// || parseFloat($stateParams.gridMagnification);
			//var gridMagnify = function(num){
			//	return num * gridMagnification;
			//}
			var changeGridMag = function(num){
	    		//var elemWidth = gridElem[0].offsetWidth;
	    		//if (elemWidth == 2016){elemWidth = 2000}; //have to figure out
				//gridMagnification = gridMagnification*num;
				//alert(gridMagnification)
				gridmag += parseFloat(num);
				scope.gridmag = gridmag;
	    		var newMag = gridmag * canvasSize; 
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
				//console.log(magnifyGrid.gridMag(.9))
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
                //recenter on finger
            };
            var pinchGest = function(e){
                e.preventDefault();
                console.log(e);
	            scope.touches = e.gesture.touches[0];
	            scope.touches1 = e.gesture.touches[1];
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
            var pinchGesture = $ionicGesture.on('pinch', pinchGest, elem);
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
                $ionicGesture.off(pinchGesture, 'pinch', pinchGest);
            });
        }
    };
});