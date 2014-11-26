angular.module('Directives').directive('gridManip',function($ionicGesture,$window,$timeout,findGeom){
    return {
        restrict: 'AE',
        //templateUrl: 'partials/gridlines.html',
        link: function(scope,elem,attr) {
            var offsetLeft = findGeom.offsetLeft;
            var offsetTop = findGeom.offsetTop;
            //alert($window.outerHeight);
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
            var gridMag = findGeom.gridMag;
            var canvasSize = scope.canvasSize = 2000; //200ft
            //scope.viewB = '0 0 '+canvasSize+' '+canvasSize
            var gridElem = angular.element(document.getElementById('floor-container'));
            
            var magnifyGrid = scope.magnifyGrid = function(num){
                //gridElem = angular.element(document.getElementById('floor-container'));
                var elemWidth = gridElem[0].offsetWidth;
                if (elemWidth == 2016){elemWidth = 2000}; //have to figure out where the margins are coming from
                var newNum = num * (elemWidth); 
                
                //gridElem.css({'width':(num*100)+'%','height':(num*100)+'%'});
                gridMag = newNum/canvasSize;
                findGeom.gridMag = gridMag;
                gridElem.css({'width':newNum+'px','height':newNum+'px'});
            };
        var gridElem = angular.element(document.getElementById('floor-container'));
        var gridoffTop = gridElem[0].offsetTop;
        var gridoffLeft = gridElem[0].offsetLeft;
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
        var alertTap = function(e){
            e.preventDefault();
            //console.log(attr);
            alert('inside grid.js');
        };
        var dubTap = function(e){
            e.preventDefault();
            console.log(e);
            
        };
        var startDrag = function(e){
            e.preventDefault();
        };
        var endDrag = function(e){
            e.preventDefault();
            gridoffTop = gridElem[0].offsetTop;
            gridoffLeft = gridElem[0].offsetLeft;
        };
        var holdTap = function(e){
            e.preventDefault();
            alert('inside grid.js');
        };
        var tripTap = function(e){
            e.preventDefault();
            alert('inside grid.js');
        };
            //http://hammerjs.github.io/require-failure/
        var tapGesture = $ionicGesture.on('tap', alertTap, elem);
            tapGesture.options.tap_always = false;
            tapGesture.options.requireFailure = 'doubleTap';
        console.log(tapGesture.options);
        var doubleTapGesture = $ionicGesture.on('doubletap', dubTap, elem);
            doubleTapGesture.options.recognizeWith = 'tapGesture';
        var tripleTapGesture = $ionicGesture.on('tripletap', tripTap, elem);
        var dragStartGesture = $ionicGesture.on('dragstart', startDrag, elem);
        var dragGesture = $ionicGesture.on('drag', dragGrid, elem);
        var dragEndGesture = $ionicGesture.on('dragend', endDrag, elem);
        var holdGesture = $ionicGesture.on('hold', holdTap, elem);
//        doubleTapGesture.recognizeWith(tapGesture);
//        doubleTapGesture.requireFailure(tripleTapGesture);
                
        scope.$on('$destroy', function() {
            $ionicGesture.off(tapGesture, 'tap', alertTap);
            $ionicGesture.off(doubleTapGesture, 'doubletap', dubTap);
            $ionicGesture.off(tripleTapGesture, 'tripletap', tripTap);
            $ionicGesture.off(dragStartGesture, 'dragstart', startDrag);
            $ionicGesture.off(dragGesture, 'drag', dragGrid);
            $ionicGesture.off(dragEndGesture, 'dragend', endDrag);
            $ionicGesture.off(holdGesture, 'hold', holdTap);
        });
        }
    };
});