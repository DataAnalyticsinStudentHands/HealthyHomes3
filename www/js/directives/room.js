angular.module('Directives').directive('roomManip',function($ionicGesture,$ionicSideMenuDelegate,findGeom){
    return {
        restrict: 'AE',
        scope: {
            room: '='
        },
//        templateNamespace: 'svg',
//        template: '<circle fill="red" stroke="blue" stroke-width="3" cx="250" cy="200" r="100" />',
        controller: ['$scope', function($scope){
            
        }],
        link: function(scope,elem,attr) {
    scope.room.roomPoints = [[120.0,120.0],[220.0,120.0],[220.0,220.0],[120.0,220.0]];  //get from service as map from arcs
            
    var points = scope.room.roomPoints;
    scope.room.roomNameX = points[0][0] + 10;
    scope.room.roomNameY = points[0][1] + 10;        
    var measurepts = scope.room.measurepts;
    var measurepts = findGeom.showMeasures(points)
    var addTap = function(e){
        e.preventDefault();
        e.stopPropagation();
		var selectBox = document.getElementById('roomAction');
		selectBox.size = 5;
		selectBox.value = 3;
    };
    for (var n = 0;n<points.length;n++){
        points[n][0] = parseInt(points[n][0]);
        points[n][1] = parseInt(points[n][1]);
    };
    var showMeasures = findGeom.showMeasures;
    var gridElem = angular.element(document.getElementById('floor-container'));
    var offLeft = findGeom.offSetLeft(gridElem);
    var offTop = findGeom.offSetTop(gridElem);
    var gridMag = 50;/ findGeom.gridMag; //findGeom.gridMag;
//            
    var startDrag = function(e){
        e.preventDefault();
        e.stopPropagation();
        $ionicSideMenuDelegate.canDragContent(false);
        gridMag = findGeom.gridMag;
        offLeft = findGeom.offSetLeft(gridElem); 
        //write this to json for this room? or for floor as a whole?
        offTop = findGeom.offSetTop(gridElem);
        //console.log(gridMag)
    };
//    
    var dragLines = function(e){ //need to work in zoom stuff
        e.stopPropagation();
        var xtraOffX = 0;
        var xtraOffY = 0;
        if(points.length > 3){ //change to center of polygon
            xtraOffX = (Math.abs(points[0][0]-points[1][0])/2);//+offLeft;
            xtraOffY = (Math.abs(points[0][1]-points[2][1])/2);//+offTop; //works well for squares
        }
        var dragX = (((e.gesture.center.pageX-offLeft)/gridMag)-points[0][0])-xtraOffX;
        var dragY = (((e.gesture.center.pageY-offTop)/gridMag)-points[0][1])-xtraOffY;
        for (var n = 0;n<points.length;n++){
            points[n][0] = points[n][0] + dragX;
            points[n][1] = points[n][1] + dragY;
        };
        scope.measurepts = findGeom.showMeasures(points);
        scope.$apply();
    };
//        
    var endDrag = function(e){
        $ionicSideMenuDelegate.canDragContent(true);
        for (var n = 0;n<points.length;n++){
            points[n][0] = 10*Math.round(points[n][0]/10);
            points[n][1] = 10*Math.round(points[n][1]/10);
        };
        scope.measurepts = findGeom.showMeasures(points);
        //elem.find('polygon').css('display','none');
        
        scope.$apply();
    };
    //var newElem = angular.element(elem);
//    scope.measurePoints = findGeom.showMeasures(points);
    var measures = function(e){
        e.stopPropagation();
//        elem.find('polygon').css('stroke-dasharray','3,3,3,3,3,3');
        elem.find('polygon').toggleClass('roomDashArray');
        elem.find('circle').toggleClass('roomEditLine');//css('display','block');
        elem.find('text').toggleClass('roomEditLine');
        var dragType = 'segment';
    };
    var tapGesture = $ionicGesture.on('tap', addTap, elem);
    var dragStartGesture = $ionicGesture.on('dragstart', startDrag, elem);
    var dragGesture = $ionicGesture.on('drag', dragLines, elem);
    var dragEndGesture = $ionicGesture.on('dragend', endDrag, elem);
    var holdGesture = $ionicGesture.on('hold', measures, elem);

            
    scope.$on('$destroy', function() {
        $ionicGesture.off(tapGesture, 'tap', addTap);
        $ionicGesture.off(dragStartGesture, 'dragstart', startDrag);
        $ionicGesture.off(dragGesture, 'drag', dragLines);
        $ionicGesture.off(dragEndGesture, 'dragend', endDrag);
        $ionicGesture.off(holdGesture, 'hold', measures);
    });
      }
    };
});