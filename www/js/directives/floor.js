angular.module('Directives').directive('floorManip',function(){
    return {
        restrict: 'AE',
        template: '',
        scope: {
            floor: '='
        },
        controller: ['$scope', function($scope){
            //console.log($scope);
        }],
        link: function(scope,elem,attr) {
            console.log(scope.floor)
            scope.floor.points = "110,111 15,440 220,54"
        }
    };
});