angular.module('Directives').directive('firstcircle',function(){
    return {
        restrict: 'AE',
        template: '',
        scope: {
            points: '='
        },
        controller: ['$scope', function($scope){
            //console.log($scope);
        }],
        link: function(scope,elem,attr) {
            console.log(scope.points)
            //as you drag a point, distances to other connected points show up?
            //text/titles for a room can be a directive? with the points as a range so they can be dragged together.
            //scope.floor.points = ""; //eventually have it draw perimeter automatically
            //If every measure after the first is relative to that first, so that the whole room is then measurable by it's own units....
        }
    };
});