angular.module('Directives').directive('rmobjManip',function($ionicSideMenuDelegate,$ionicModal,$ionicGesture,findGeom){
    return {
        restrict: 'AE',
        template: '',
        scope: {
            rmobj: '=',
			gridmag: '='
        },
        controller: ['$scope', function($scope){
            $scope.rmobjModal = [];
		    $ionicModal.fromTemplateUrl('templates/rmobjmodal.html', {
		            id: "rmobjModal",
		            scope: $scope,
		            animation: 'slide-in-up'
		        }).then(function(modalRoomObj) {
		          $scope.roomobjModal = modalRoomObj;
		    });
		    $scope.showRmObjModal = function() {
		        $scope.roomobjModal.show();
		    };
		    $scope.closeRmObjModal = function() {
		        $scope.roomobjModal.hide();
		    };
        }],
        link: function(scope,elem,attr) {
	console.log(scope.rmobj) //is there a way to add/link a flag to a question??
			//if I also pass the room object, can I then add the right links to populate roommodal? 
			//or should I have a diff. modal anyway???
	var rmobjpts = scope.rmobj[0].points[0];
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
        begDragX = parseInt(rmobjpts[0]);
        begDragY = parseInt(rmobjpts[1]);
    };
    var dragPoints = function(e){ //need to work in zoom stuff
        e.stopPropagation();
        dragXpoint = parseInt(e.gesture.deltaX/gridMag);
        dragYpoint = parseInt(e.gesture.deltaY/gridMag);
        if(isNaN(dragXpoint)){console.log('wtf')};
        if(begDragX){
            rmobjpts[0] = begDragX + dragXpoint;};
        if(begDragY){
            rmobjpts[1] = begDragY + dragYpoint;};
        if(isNaN(rmobjpts[0])){console.log('really points?')};
        scope.$apply();
    };
    var endDrag = function(e){
        $ionicSideMenuDelegate.canDragContent(true);
        // rmobjpts[0] = 10*Math.round(rmobjpts[0]/10);
//         rmobjpts[1] = 10*Math.round(rmobjpts[1]/10);
//         scope.$apply();
    };
    var openModalWindow = function(e){
		e.stopPropagation();
        e.preventDefault();
        scope.showRmObjModal();
    }
    var doubletapGesture = $ionicGesture.on('doubletap', openModalWindow, elem);
    var dragPointStartGesture = $ionicGesture.on('dragstart', startDrag, elem);
    var dragPointGesture = $ionicGesture.on('drag', dragPoints, elem);
    var dragPointEndGesture = $ionicGesture.on('dragend', endDrag, elem);
            
    scope.$on('$destroy', function() {
        $ionicGesture.off(doubletapGesture, 'dragstart', openModalWindow);
        $ionicGesture.off(dragPointStartGesture, 'dragstart', startDrag);
        $ionicGesture.off(dragPointGesture, 'drag', dragPoints);
        $ionicGesture.off(dragPointEndGesture, 'dragend', endDrag);
    });
        }
    };
});