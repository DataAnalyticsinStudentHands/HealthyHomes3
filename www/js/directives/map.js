HHApp.directive('mapManip',function(layoutObjectModel,$ionicGesture,$ionicSideMenuDelegate,findGeom){
    return {
        restrict: 'AE',
        link: function(scope,elem,attr) {
            console.log(elem[0])
    var viewBox = scope.viewbox = "240000 3250000 100 100"; //"240000 3250000 100000 100000"
    var newVB = "244601.1111 3263412.1111 2000 2000"
    //elem[0].viewBox = firstVB;
    elem[0].setAttribute('viewBox', viewBox);
    scope.changeVB = function(){
        //alert('nagsd');
        elem[0].setAttribute('viewBox', newVB);
    };
            
    scope.viewbox = viewBox;
            console.log(scope);
    elem.alert = function (text) {
        alert(text+'inside map directive');
    };
    var alertTap = function(){
        alert('inside map.js');
    };
        }
    }
});