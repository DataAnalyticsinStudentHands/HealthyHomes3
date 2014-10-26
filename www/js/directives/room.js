HHApp.directive('roomManip',function(layoutObjectModel,Gesture){
    return {
        restrict: 'AE',
        link: function($scope,$elem,$attr) {
            scope.layoutObjectModel = layoutObjectModel;
            alert('loaded');
            var handleDrag = function(e) {
        console.log('Drag: ', e.gesture.touches[0].pageX, e.gesture.touches[0].pageY, e.gesture.deltaX, e.gesture.deltaY);
      };

      var dragGesture = Gesture.on('drag', handleDrag, $element);

      $scope.$on('$destroy', function() {
        Gesture.off(dragGesture, 'drag', handleDrag);
      });
        }
    };
});