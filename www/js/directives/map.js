HHApp.directive('mapManip',function(layoutObjectModel,$ionicGesture,$ionicSideMenuDelegate,findGeom){
    return {
        restrict: 'AE',
        link: function(scope,elem,attr) {
            console.log(elem[0])
    var viewBox = scope.viewbox = "244493.3036 3250046.3036 100000 100000"
    var newVB = "224500 3260000 100000 100000"
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