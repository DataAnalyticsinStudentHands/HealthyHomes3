angular.module('HHControllers').directive('dragSave',['$compile', function(compile) {
    var getTemplate = function(templateType){
        if (templateType == 'note') //svg as third type? Lines?? Rooms??
            {template = 'partials/'+templateType+'.html'}
        else
            {template = 'partials/layoutIcons.html'
            //iconType = templateType
            } 
        return template
        };
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        scope: {
            //layoutObject: '=layoutObject'
//            offsetTop: "&tpospx",
//            tpospx: "&top",
//            lpospx: "&left"
        },
        templateUrl: function(tElement, tAttrs) {
            return getTemplate(tAttrs.hmDrag);
        },
        link: function(scope, elem, attrs, ctrl, transclude) {
            var iconType = scope.iconType = attrs.hmDrag;
            var targetDrop = document.getElementById('grid_container');
            //console.log(attrs);
            var targetHeight = parseInt(targetDrop.style.height) || 1128;
            var targetTop = targetDrop.offsetTop + targetDrop.offsetParent.offsetTop;
            var targetWidth = parseInt(targetDrop.style.width) || 1468;
            var targetLeft = targetDrop.offsetLeft + targetDrop.offsetParent.offsetLeft;
            var targetBottom = targetTop + targetHeight;
            var targetRight = targetLeft + targetWidth;
            if (elem[0].offsetTop) { 
//            var tpos = elem[0].offsetTop + elem[0].offsetParent.offsetTop || 0;
//            var lpos = elem[0].offsetLeft + elem[0].offsetParent.offsetLeft || 0;
                var tpos = elem[0].offsetTop || 0;
                var lpos = elem[0].offsetLeft || 0;
            }else{
                var tpos = 0;
                var lpos = 0;
            };
            var tpospx = scope.tpospx = tpos+'px';
            var lpospx = scope.lpospx = lpos +'px';
            console.log(elem);
            elem.bind('dragstart', function($event) {
                elem.children().css({'z-index':'200'}); //have to make sure about stacking context
                $event.cancelBubble = true; //cancelBubble for IE (need to check)
                $event.stopPropagation(); //
                $event.preventDefault();             
                //http://stackoverflow.com/questions/10246305/android-browser-touch-events-stop-display-being-updated-inc-canvas-elements-h/10495741#10495741
                function touchHandlerDummy($event){ 
                    $event.preventDefault();
                    return false;
                }
                document.addEventListener("touchstart", touchHandlerDummy, false);
                document.addEventListener("touchmove", touchHandlerDummy, false);
                document.addEventListener("touchend", touchHandlerDummy, false);
                document.addEventListener("mousedown", touchHandlerDummy, false);
                return false;
            });
//            scope.$watch('layoutObject', function(layoutObject) {
//                angular.forEach(layoutObject, function(layoutObject, key) {
//                
//                    // do something ? This would watch for all changes on the object
//                    // I think it may be that the data-binding already has a watcher on it
//                });
//            });
//            scope.test = function() {
//                alert('test in directive scope');
//            };
            var targetId = '';
            elem.bind('drag', function($event) {
                $event.cancelBubble = true;
                $event.stopPropagation();
                $event.preventDefault();
                var gesture = scope.gesture = $event.gesture;
                if (lpos<10) {
                    lpos = 0;
                    tpos = 0;
                };
                temptpos = tpos + gesture.deltaY;
                templpos = lpos + gesture.deltaX;
                
                elem.css({'top': temptpos + 'px', 'left': templpos + 'px'});
//                if (gesture.target.id != ''){
//                targetId = gesture.target.id;};
            });
            elem.bind('dragend', function($event) {   
                var gesture = scope.gesture = $event.gesture;
                temptpos = tpos + gesture.deltaY;
                templpos = lpos + gesture.deltaX;
                //console.log(gesture.center.pageY)
//                console.log(elem[0])
                if (gesture.center.pageY > targetTop && gesture.center.pageX > targetLeft && gesture.center.pageY < targetBottom && gesture.center.pageX < targetRight){
                    //alert('dropped')
                //if (targetId == 'grid_bg') {   
                    if (attrs.dragSave == 'dragStay') {
                        tpos += gesture.deltaY; //if don't do inside, it misses first drag obj
                        lpos += gesture.deltaX;
                        tpospx = tpos + 'px';
                        lpospx = lpos + 'px';
                        elem.css({'top': tpospx, 'left': lpospx}); 
                    } else {
                        elem.css({'top': '0px', 'left': '0px'}); 
                        
                        tpos += gesture.deltaY;  
                        lpos += gesture.deltaX;
                        tpospx = tpos + 'px';
                        lpospx = lpos + 'px';
                        gridContainer = document.getElementById('grid_container');
//                        scope.$apply(function() {
                        newObject = '<span ng-click="test()" hm-drag="'+iconType+'" drag-save="dragStay" style="position:absolute;top:400px;left:300px;z-index=44;">Where Am I?</span>';
                        wrappedObj = angular.element(newObject)
                        //gridContainer.innerHTML += newObject;
//                        console.log($compile)
                        compiled = compile( wrappedObj );
//                        transclude(scope.$parent, function(newObject, scope) {
//                            elem.append(newObject);
//                        });
//                        angular.element(gridContainer).append(newObject);
                        gridContainer.innerHTML += newObject;
                        cpiled = compiled(scope.$parent)
                        scope.$apply(attrs);
                        //scope.$apply(cpiled);
//                        document.$apply;
//                        console.log(compiled);
//                        console.log(scope.$parent);
                        transclude(scope.$parent, function(cpiled, gridContainer, $scope) {
////                            //alert(newObject)
////                            console.log('inside');
////                            console.log(gridContainer);
                            console.log('cpiled')
                            console.log(cpiled);
                            gridContainer.innerHTML += cpiled;
                            cpiled.css({'top':'40px','left': '333px'});
                            scope.$apply(cpiled);
////                            cpiled.bind('click',function(){alert('click')});
////                            console.log(cpiled);
////                            console.log(gridContainer);
                        });
                        //$compile(newObject)(scope);
                    //});
                        
                        //add to innerHTML of target, with positions set from this, but as percentage
                        //create new;
                    //place marker;
                    //round to nearest foot as snap to grid replacement?
//                scope.$apply(function() {
//                    //elem.css({'top': tpospx, 'left': lpospx});
//                });
                //alert(gesture.deltaY)
                //alert('top':tpos+gesture.deltaY+'px';'left':lpos+gesture.deltaX+'px');
                    }; 
                } else { //outside target
                    //elem.css({'top': tpospx, 'left': lpospx}); //for save
                    elem.css({'top': '0px', 'left': '0px'}); //for return
                }
            });
            elem.bind('mouseover', function() {
                elem.css('cursor', 'move');
            });
            }
    }
    
}]);