HHApp.directive('gridManip',function(layoutObjectModel,$window,findGeom){
    return {
        restrict: 'AE',
        //templateUrl: 'partials/gridlines.html',
        link: function(scope,elem,attr) {
            var offsetLeft = findGeom.offsetLeft;
            var offsetTop = findGeom.offsetTop;
            scope.layoutObjectModel = layoutObjectModel;
            //alert($window.outerHeight);
            scope.gridShow1 = true; //in case we want to turn them off for some views
            scope.gridShow5 = true;
        //$scope.gridSizeHt = 2000; //just ng-init these? or get from some settings?
        //var gridSizeWd = $window.outerWidth; //2000;
        //have this in an if that has to do with the state for the smaller ui-view
            var windowHt = scope.windowHt = 1.2*$window.outerHeight; //plus the offset!!
            var windowWd = scope.windowWd = 1.2*$window.outerWidth;
//        console.log(windowWd + ' windowWd')
        //use to only draw grid lines that are needed - combination of this and magnify - and such that it picks up on smaller version???
//        var gridElem = document.getElementById('floor-container');
//        var gridWd = gridElem.width;
            scope.gridLineNumber = function(gridSize,gridInterval){
                //console.log(gridSize);
                return _.range(0,gridSize,gridInterval) //everyfive feet
            }
        //console.log($scope.gridLineNumber(11,11))
            scope.gridlinePtsOLD = function(gridSizeHt,gridSizeWd){
                return '5,5 ' + gridSizeWd,gridSizeWd // 2000,2000'
            }
            var gridMag = findGeom.gridMag;
            var gridElem = angular.element(document.getElementById('floor-container'));
            scope.magnifyGrid = function(num){
                //gridElem = angular.element(document.getElementById('floor-container'));
                var elemWidth = gridElem[0].offsetWidth;
                if (elemWidth == 2016){elemWidth = 2000}; //have to figure out where the margins are coming from
                var newNum = num * (elemWidth); 
                //gridElem.css({'viewBox': '0 0 4000 4000' });
                gridElem.css({'width':(num*10)+'in','height':(num*10)+'in'});
                //gridElem.css({'width':(num*100)+'%','height':(num*100)+'%'});
                gridMag = 2000/newNum;
                findGeom.gridMag = gridMag;
                //findGridOffsets();
//            windowHt = $scope.windowHt = $window.outerHeight*gridMag;
//            windowWd = $scope.windowWd = $window.outerWidth*gridMag;
            }
            var dragtheGrid = scope.dragtheGrid = false;
            scope.gridDrag = function(){
                dragtheGrid =! dragtheGrid;
                scope.dragtheGrid = dragtheGrid;
            };
//            $ionicSideMenuDelegate.canDragContent(true);
            scope.dragGrid = function($event){
            if (dragtheGrid){
                $event.preventDefault();
                 
                var deltaX = $event.gesture.deltaX;
                var deltaY = $event.gesture.deltaY;
                var offTop = $event.target.offsetTop + deltaY;
                var offLeft = $event.target.offsetLeft + deltaX;
                if (offTop > 0) { offTop = 0}; //need to also keep it from going off to the right
                if (offLeft > 0) { offLeft = 0};
//                windowHt = $scope.windowHt = $window.outerHeight*gridMag+offTop;
//                windowWd = $scope.windowWd = $window.outerWidth*gridMag+offLeft;
                var gridElem = angular.element(document.getElementById('floor-container'));
                gridElem.css({'top':offTop,'left':offLeft});
                //findGridOffsets();
            };
        var gridElem = {};
//        var offLeft = 0;
//        var offTop = 0;
        
//        var findGridOffsets = function(){
//            gridElem = angular.element(document.getElementById('floor-container'));
//            offLeft = gridElem[0].offsetLeft || 0;
//            offTop = gridElem[0].offsetTop || 0;
//        }

        }
//        $scope.gridMag = windowWd/gridWd;
//        console.log('gridMag: '+$scope.gridMag);
        }
    };
});