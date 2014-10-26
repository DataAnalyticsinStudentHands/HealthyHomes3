HHApp.directive('roomManip',function(layoutObjectModel){
    return {
        restrict: 'E',
        template: '',
        link: function(scope,elem,attr) {
            scope.layoutObjectModel = layoutObjectModel;
            alert('loaded');
        }
    };
});