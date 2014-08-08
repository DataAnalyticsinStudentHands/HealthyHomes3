angular.module('HHControllers').directive('dragSave',['addObj', 'layoutObjectModel', function(addObj, layoutObjectModel) {
//angular.module('HHControllers').directive('dragSave',['layoutObjectModel', function(layoutObjectModel) {
    var getTemplate = function(templateType){
        if (templateType == 'note') //svg as third type? Lines?? Rooms??
            {template = 'partials/'+templateType+'.html';
            }
        else if (templateType.split('_')[0] == 'svg')
            {template = 'partials/'+templateType+'.html';
            }
        else if (templateType.split('_')[1] == 'floor')
            {template = 'partials/floor.html';
            }
        else
            {template = 'partials/layoutIcons.html'
            //console.log(templateType)
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
        link: function(scope, elem, attrs, ctrl, transclude) { //might need it as distance from it's origin, if floor is moving underneath...
            var objType = scope.objType = attrs.hmDrag;
            var floorPoints = scope.floorPoints = [[0,0],[100,0],[100,100],[0,100]]  //need to have them change by percentages!!
            scope.testElem = function($event){
                console.log($event)
                newelem = angular.element($event.target)
                newelem.css({'display':'none'});
            };
            
            scope.arrayPoints = function(){
                var arrPts = ''
                for (var p=0;p < scope.floorPoints.length; p++) {
                    arrPts += floorPoints[p][0]+','+floorPoints[p][1]+' ';
                }
                return arrPts
            };
            scope.polyPointPath = function(){
                var path = [], point, i;
                for (i=0;i<floorPoints.length;i++){
                    point = floorPoints[i];
                    path.push(point[0]+','+point[1]);
                }
                return path.join(" "); // + 'z'; //z added if you want to close figure automatically
            }
            scope.pointPath = function(){
                var path = [], point, i;
                for (i=0;i<floorPoints.length;i++){
                    point = floorPoints[i];
                    path.push(point[0]+','+point[1]);
                }
                return "M" + path.join(" L"); // + 'z'; //z added if you want to close figure automatically
            }
            scope.alert = function(){alert('adsf')};
            var targetDrop = document.getElementById('grid-container'); //also from objectModel?
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
            elem.bind('dragstart', function($event) {
                //elem.children().css({'z-index':'200'}); //have to make sure about stacking context
                $event.cancelBubble = true; //cancelBubble for IE (need to check)
                $event.stopPropagation(); //
                $event.preventDefault();
                //http://stackoverflow.com/questions/10246305/android-browser-touch-events-stop-display-being-updated-inc-canvas-elements-h/10495741#10495741
                function touchHandlerDummy($event){ 
//                    $event.preventDefault();
//                    return false;
                }
                document.addEventListener("touchstart", touchHandlerDummy, false);
                document.addEventListener("touchmove", touchHandlerDummy, false);
                document.addEventListener("touchend", touchHandlerDummy, false);
                document.addEventListener("mousedown", touchHandlerDummy, false);
                return false;
            });
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
                if(!scope.svgEdit){
                    temptpos = tpos + gesture.deltaY;
                    templpos = lpos + gesture.deltaX;
                    elem.css({'top': temptpos + 'px', 'left': templpos + 'px'}); 
                }else{
                    console.log($event)
                };
            });
            elem.bind('dragend', function($event) {   
                var gesture = scope.gesture = $event.gesture;
                temptpos = tpos + gesture.deltaY;
                templpos = lpos + gesture.deltaX;
                //console.log(gesture.center.pageY)
//                console.log(elem[0])
                if (gesture.center.pageY > targetTop && gesture.center.pageX > targetLeft && gesture.center.pageY < targetBottom && gesture.center.pageX < targetRight){
                    if(!scope.svgEdit){
                    if (attrs.dragSave == 'dragStay') { //probably don't need dragStay at all
                        tpos += gesture.deltaY; //if don't do here, it misses first drag obj
                        lpos += gesture.deltaX;
                        tpospx = tpos + 'px';
                        lpospx = lpos + 'px';
                        elem.css({'top': tpospx, 'left': lpospx}); 
                    } else {                        
                        elem.css({'top': '0px', 'left': '0px'}); 
                        xCorrect = document.getElementById('menubg');
                        tpos = gesture.center.pageY;  
                        lpos = gesture.center.pageX - xCorrect.offsetWidth; //http://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively
                        scope.tpospx = tpos + 'px';
                        scope.lpospx = lpos + 'px';
                        scope.container = 'grid_container'; //need to figure out nearest room?
                        addObj.newObj(scope,objType); 
//                        gridContainer = document.getElementById('grid_container');
//                        newObject = '<span ng-click="test()" hm-drag="'+iconType+'" drag-save="dragStay" style="position:absolute;top:'+tpospx+';left:'+lpospx+';z-index=44;">Where Am I?</span>';
//                        gridContainer.innerHTML += newObject;
//                        layoutObject = $compile(gridContainer)(scope);
//                        //layoutObjectModel.addObject(newObject); //do it in service, because of how scope/$scope work
//                        console.log(layoutObjectModel)
                        //layoutObjectModel.save();
                        //layoutObjectModel.localStorageSet(gridContainer);
                        //console.log(gridContainer);
                    }; };
                } else { //outside target
                    //elem.css({'top': tpospx, 'left': lpospx}); //for save
                    elem.css({'top': '0px', 'left': '0px'}); //for return -- need to rethink!!
                }
            });
//            elem.bind('mouseover', function() { //do in css, depending on which icon
//                elem.css('cursor', 'move');
//            });
            scope.floorHeight = function(){ //idea is to then have height/width set dynamically from dragging whole. Everything else will happen within the floor. Need to have it only attach to the lines... perhaps make them the draggables??? Hmm. Not a bad idea...
                return '100px'
            };
            scope.floorWidth = function(){
                return '100px'
            };
        }  
    }
    
}])
.directive('addSvg',['$compile',function($compile) {
    var rtnObj = {
        newObj: function(scope,objType){
            var container = scope.container;
            var objContainer = document.getElementById('floor-container');
            var tpospx = scope.tpospx;
            var lpospx = scope.lpospx;
            var newObject = '<image hm-drag="'+objType+'" drag-save="dragStay" style="position:absolute;top:'+tpospx+';left:'+lpospx+';z-index=44;">Where Am I?</span>';
            objContainer.innerHTML += newObject;
            $compile(objContainer)(scope);
            //$compile(newObject)(scope);
    }
    }
    return rtnObj;
}])
.directive('dragcopy',function(){
    return {
        restrict: 'AE',
        replace: false,
        transclude: true,
        scope: {
            //layoutObject: '=layoutObject'
//            offsetTop: "&tpospx",
//            tpospx: "&top",
//            lpospx: "&left"
        },
//        templateUrl: function(tElement, tAttrs) {
//            return getTemplate(tAttrs.hmDrag);
//        },
    link: function(scope, elem, attrs) {
        scope.draggingCopy = function($event,copyPoints){
            $event.preventDefault();
            for (var n = 0;n<copyPoints.length;n++){
                var deltaX = $event.gesture.deltaX;
                var deltaY = $event.gesture.deltaY;
                var tmpX = copyPoints[n][0]
                var tmpY = copyPoints[n][1]
                var pageDistX = $event.gesture.center.pageX-tmpX
                var pageDistY = $event.gesture.center.pageY-tmpY
                copyPointsPoints[n][0] = $event.gesture.center.pageX+pageDistX;
                copyPoints[n][1] = $event.gesture.center.pageY+pageDistY;
                console.log(copyPoints)
        }
    }
    }
    }
})
.directive('testDrag',function(){
    return {
        restrict: 'AE',
        replace: false,
        transclude: true,
        scope: {
            //layoutObject: '=layoutObject'
//            offsetTop: "&tpospx",
//            tpospx: "&top",
//            lpospx: "&left"
        },
//        templateUrl: function(tElement, tAttrs) {
//            return getTemplate(tAttrs.hmDrag);
//        },
    link: function(scope, elem, attrs, ctrl, transclude) {
        var tpos = 100;
        var lpos = 100;
        console.log(elem)
            elem.bind('dragend', function($event) {
                $event.cancelBubble = true;
                $event.stopPropagation();
                $event.preventDefault();
                var gesture = scope.gesture = $event.gesture;
                console.log($event)
                alert($event.gesture.deltaX)
                //looks like it makes the whole svg into the target, and not the line, althought the line is the elem, so can be repositioned...
//                if (lpos<10) {
//                    lpos = 0;
//                    tpos = 0;
//                };
//                if(!scope.svgEdit){
//                    temptpos = tpos + gesture.deltaY;
//                    templpos = lpos + gesture.deltaX;
//                    elem.css({'top': temptpos + 'px', 'left': templpos + 'px'}); 
//                }else{
//                    console.log($event)
//                };
            });
    }
    }
})
.directive('addObj',['$compile',function($compile) {
    var rtnObj = {
        newObj: function(scope,objType){
            var container = scope.container;
            var objContainer = document.getElementById(container);
            var tpospx = scope.tpospx;
            var lpospx = scope.lpospx;
            var newObject = '<span hm-drag="'+objType+'" drag-save="dragStay" style="position:absolute;top:'+tpospx+';left:'+lpospx+';z-index=44;">Where Am I?</span>';
            objContainer.innerHTML += newObject;
            $compile(objContainer)(scope);
            //$compile(newObject)(scope);
    }
    }
    return rtnObj;
}])
;