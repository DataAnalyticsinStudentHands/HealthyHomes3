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
            scope.floor.points = "110,111 15,340 220,54"
        }
    };
})
.directive('floorSelect',function(){
    return {
        restrict: 'AE',
        template: '<div>This is a div</div>',
        scope: {
            floors: '=',
            rooms: '='
        },
        controller: ['$scope', function($scope){
        }],
        link: function(scope,elem,attr) {
        }
    };
});