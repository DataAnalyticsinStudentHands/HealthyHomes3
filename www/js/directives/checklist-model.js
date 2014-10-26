angular.module('checklist-model', [])
.directive('checklistModel', ['$parse', '$compile', '$timeout', function($parse, $compile, $timeout) {
    function contains(item) {
        //console.log('callContains');
        return item.checked;
    }

	function add(item) {
        return item.checked = true;
    }  

    function remove(item) {
        return item.checked = false;
    }

    function postLinkFn(scope, elem, attrs) {
        $compile(elem)(scope);

        var value = $parse(attrs.checklistValue)(scope.$parent);

        scope.$watch('checked', function(newValue, oldValue) {
            if (newValue === oldValue) { 
                return;
            } 
            if (newValue === true) {
                add(value);
            } else {
                remove(value);
            }
            $timeout(function(){
                scope.$apply(attrs.update);
            });
        });

        scope.$parent.$watch(attrs.checklistModel, function(newArr, oldArr) {
            scope.checked = contains(value);
        }, true);
    }

    return {
        restrict: 'A',
        priority: 1000,
        terminal: true,
        scope: true,
        compile: function(tElement, tAttrs) {
            if (tElement[0].tagName !== 'INPUT' || !tElement.attr('type', 'checkbox')) {
                throw 'checklist-model should be applied to `input[type="checkbox"]`.';
            }

            if (!tAttrs.checklistValue) {
                throw 'You should provide `checklist-value`.';
            }

            tElement.removeAttr('checklist-model');

            tElement.attr('ng-model', 'checked');

            return postLinkFn;
        }
    };
}]);
