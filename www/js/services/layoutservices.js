'use strict';
/* Services
using factories, not services, 
Now moving to controllers with Restangular
*/
//var layoutServices = angular.module('layoutModuleServices', []);
//var layoutServices = angular.module('HHServices', []);
//layoutServices.service('layoutObjectModel', ['Restangular','$state','$stateParams', 'uuid', function(Restangular,$state,$stateParams,uuid) {
angular.module('Services', []).factory('layoutObjectModel', function(Restangular,uuid,$q,$http) {
    localStorage.clear();
    //console.log($state)
    //http://sauceio.com/index.php/2014/07/angularjs-data-models-http-vs-resource-vs-restangular/
//    var layoutObjectModel = Restangular.service('inspections');
    // Restangular.extendModel('inspections',function(model) {
//         model.getResult = function(){
//             if (this.status == 'complete') {
//           if (this.passed === null) return "Finished";
//           else if (this.passed === true) return "Pass";
//           else if (this.passed === false) return "Fail";
//         }
//         else return "Running";
//       };
//
//       return model;
//     });
    // Storage.prototype.setObject = function(key, value) {
    //     this.setItem(key, JSON.stringify(value));
    // };
    //
    // Storage.prototype.getObject = function(key) {
    //     var value = this.getItem(key);
    //     return value && JSON.parse(value);
    // };
    return {
		
    getInspections : function(){
        
        
            return $http.get('/json/inspections.json')
                    .success(function(data, status, headers, config) {
                        //layoutObjectModel['inspections'] = data;
                        localStorage.setObject('inspectionsNOTUSED', data);
                        //console.log(layoutObjectModel['inspections'])
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data)
                    })
    }
    }
})
    //if (layoutObjectModel['inspections'] == null) {
//    this.getInspections = function(){
      //$q(function(resolve, reject) {
        //var deferred = $q.defer();
        //if (localStorage.getObject('inspections') == null){
           // console.log('inspections is null');
            //setTimeout(5000)
            //deferred.resolve(
//            $q(function(resolve, reject) {
//                var deferred = $q.defer();
            //return    'fuck you'
//            })
            //layoutObjectModel['inspections'] = [[uuid.new()]];
        //} else {
           // console.log('we have inspections');
            //deferred.resolve(
                //layoutObjectModel['inspections'] = localStorage.getObject('inspections')
            //
        //}
//        var storedInspections = deferred.promise;
//        layoutObjectModel['inspections'] = storedInspections;
        
          //console.log(deferred)
      //}
    

    //this.storedInspections = localStorage.getObject('inspections');
    //console.log(storedInspections)
    
    
    //console.log(localStorage)
    //this.inspections = function()
    
//    var inspectionId = layoutObjectModel.inspections[0][0];
//    var inspections = layoutObjectModel.inspections;
//    console.log('insp')
//    console.log(inspections)
//    this.inspectionInd = inspections[0].indexOf(inspectionId);
//    console.log(this.inspectionInd)
//    console.log(inspections[this.inspectionInd])
//    var inspectInd = 0; //will get from service or $stateParam
//    this.currentInspection = layoutObjectModel.inspections[inspectInd];
    
    //need logic for current inspection; just have it fed in as index
//    layoutObjectModel['inspections'].push([uuid.new()]); //clean up later
    //layoutObjectModel.inspections[0]['trying'] = [['adsf','adsffds']]
    //layoutObjectModel.inspections[1]['trying2'] = [['adsf','adsffds']]
    //layoutObjectModel.inspections[0].push(['result of push'])
    
//    var inspectionId = $stateParams.inspectionId || layoutObjectModel.inspections[0][0] //to get as string;
    //var inspectionId = layoutObjectModel.inspections[0][0];
    //alert(_.indexOf([layoutObjectModel.inspections],layoutObjectModel.inspections[0]))
//    if (layoutObjectModel.inspections.floors){
//        return
//    }else{
//        layoutObjectModel.inspections['floors'] = []
//    };
.factory('arcs',function() {
    console.log('wtf on inspections');
})
.service('findGeom', function() {
    var gridMag = this.gridMag = 1;
    var gridElem = this.gridElem = angular.element(document.getElementById('floor-container'));
    var canvasSize = this.canvasSize = 2000;
    this.magnifyGrid = function(num){
        var elemWidth = gridElem[0].offsetWidth;
        if (elemWidth == 2016){elemWidth = 2000}; //have to figure out
        var newMag = num * (elemWidth); 
        return newMag
    };
    this.closestLine = function(arrIn,fingerX,fingerY){
        //because of SVG path ordering, want to insert so that the finger is pointing to the beginning of the segment
        var arr = _.clone(arrIn);
		var iterator = 0;
        var ind4new = [];
		var xDist;
		var yDist;
		var linex;
		var liney;
		var slope;
		var yintercept;
		var fingDist;
		var shrtDist = 500; //what happens if none is found shorter than this arbitrary number?
		var shortestDist = 500;
        var pointIntersect = [0,0];
		var finalPts = [0,0];
		var num2iterate; 
		var cf0;
		var cf1;
		var cf2;
		var cf3;
		arr.push([arr[0]])
		for (var i = 0;i<arr.length-1;i++){
			iterator = i+1;
			if(arr.length==i+1){iterator=0};
			xDist = Math.abs(arr[iterator][0]-arr[i][0]);
			yDist = Math.abs(arr[iterator][1]-arr[i][1]);
			num2iterate = 5/Math.max(xDist,yDist);
			if(arr[iterator].pathType =='bez4'){
				for(t=num2iterate;t<1;t+=num2iterate){
					linex = (1 - t) * (1 - t) * arr[iterator].points[0][0] + 2 * (1 - t) * t * arr[i].points[1][0] + t * t * arr[i].points[0][0];
					liney = (1 - t) * (1 - t) * arr[iterator].points[0][1] + 2 * (1 - t) * t * arr[i].points[1][1] + t * t * arr[i].points[0][1];
					fingDist = pythagDist(fingerX,linex,fingerY,liney);
					if (fingDist<shrtDist){
						shrtDist=fingDist;
						pointIntersect = [linex,liney];
					};
				};
			}
			}else if(arr[i].pathType =='bez3'){
				for(t=num2iterate;t<1;t+=num2iterate){
					cf0 = (1-num2iterate)*(1-num2iterate)*(1-num2iterate);
					cf1 = 3 * num2iterate * (1-num2iterate) * (1-num2iterate);
					cf2 = 3 * num2iterate * num2iterate * (1-num2iterate);
					cf3 = num2iterate * num2iterate * num2iterate;
					linex = (cf0*arr[iterator].points[0][0]) + (cf1*arr[i].points[1][0])+(cf2*arr[i].points[2][0]) + (cf3*arr[i].points[0][0]);
					liney = (cf0*arr[iterator].points[0][1]) + (cf1*arr[i].points[1][1])+(cf2*arr[i].points[2][1]) + (cf3*arr[i].points[0][1]);
					fingDist = pythagDist(fingerX,linex,fingerY,liney);
					if (fingDist<shrtDist){
						shrtDist=fingDist;
						pointIntersect = [linex,liney];
					};
				};
			}else{ //lines and new segments treated as lines
				slope = (arr[i].points[0][1]-arr[iterator].points[0][1]) / (arr[i].points[0][0]-arr[iterator].points[0][0]);
				yintercept = arr[i].points[0][1]/(slope*arr[i].points[0][0])
				if (xDist>yDist){
					for(var k=0;k<xDist;k++){
						liney = (slope*k)+yintercept;
						fingDist = pythagDist(fingerX,k,fingerY,liney);
						if (fingDist<shrtDist){
							shrtDist=fingDist;
							pointIntersect = [linex,liney];
						};
					};
				}else{
					for(var k=0;k<yDist;k++){
						linex = (k-yintercept)/slope;
						fingDist = pythagDist(fingerX,linex,fingerY,k);
						if (fingDist<shrtDist){
							shrtDist=fingDist;
							pointIntersect = [linex,liney];
						};
					};
				}
			}
			if (shrtDist<shortestDist){
				shortestDist = shrtDist;
				ind4new = iterator;
				finalPts = pointIntersect;
			}
        return [ind4new, pointIntersect];
    };
    this.closestLineOLD = function(arrIn,fingerX,fingerY){
        var arr = _.clone(arrIn);
        var ind4new = [];
		var testInd = 0;
        var newRatio = 0;
        var hypotRatio = 0;
        var touchLegOne = 0;
        var touchLegTwo = 0;
        var lineLength = 0;
		var pointIntersect = [100,100]; //if we return this, then places it on the line
		var shortestLine = 0;
		var secondShortestLine = 0;
		var lineInd = 0;
		//var pointInd = 0;
        //arr.push([arr[0][0],arr[0][1]])
        arr.push([arr[0]])
        for (var i = 0;i<arr.length-1;i++){
//find sides from finger to endpoints of line and then look for closest to same length and ratio for choosing point instead of line
			//seems to not work close to corners; can't figure out why
			//perhaps redo whole logic??
			touchLegOne = pythagDist(fingerX,arr[i][0],fingerY,arr[i][1]);
			touchLegTwo = pythagDist(fingerX,arr[i+1][0],fingerY,arr[i+1][1]);
			if (i==0){
				shortestLine = secondShortestLine = touchLegOne;
			};
			if (touchLegTwo<shortestLine){
				lineInd = i+1;
				secondShortestLine = shortestLine;
				shortestLine = touchLegTwo;
			};
            lineLength = pythagDist(arr[i][0],arr[i+1][0],arr[i][1],arr[i+1][1]);
            newRatio = lineLength/(touchLegOne + touchLegTwo)
            if (newRatio > hypotRatio){
                hypotRatio = newRatio;
                newRatio = 0;
                testInd = i;
            };
		};
		if (secondShortestLine/shortestLine > 3 || secondShortestLine/shortestLine == 1){
			//pointOnly = true;
			testInd = lineInd;
			if (testInd>arr.length-2){testInd=0;};
		};
		ind4new.push(testInd); 
        return [ind4new, pointIntersect];
    }
    var pythagDist = this.pythagDist = function(x1,x2,y1,y2){
        return Math.sqrt(((x1-x2)*(x1-x2))+((y1-y2)*(y1-y2)))
    };
//    this.pointPath = function(arr){
//        var rtnStr = '';
//        for (var i in arr){
//            rtnStr+=(' ' + arr[i][0]+','+arr[i][1]);
//        }
//        return rtnStr;
//    };
    var segment;
    this.svgPath = function(arr){
        var rtnPathString = 'M';//+arr[0][0]+' '+arr[0][1];
        var add2rtnPathStr = '';
        //for (var key=0; k<arr.length; key++){
        for (var key in arr){
            segment = arr[key];
            if(segment.pathType == "newSeg"){
                if(rtnPathString=='M'){
                    add2rtnPathStr='';
                }else{
                    add2rtnPathStr=' L';
                }
                rtnPathString += add2rtnPathStr+segment.points[0][0]+' '+segment.points[0][1];
            };
            if(segment.pathType == "Line"){
                if(rtnPathString=='M'){
                    add2rtnPathStr='';
                }else{
                    add2rtnPathStr=' L';
                }
                rtnPathString += add2rtnPathStr+segment.points[0][0]+' '+segment.points[0][1];
            };
            if(segment.pathType == "bez3"){
                if(rtnPathString=='M'){
                    add2rtnPathStr='';
                }else{
                    add2rtnPathStr=' C';
                }
                rtnPathString += add2rtnPathStr+segment.points[2][0]+' '+segment.points[2][1]+' '+segment.points[1][0]+' '+segment.points[1][1]+' '+segment.points[0][0]+' '+segment.points[0][1];
            };
            if(segment.pathType == "bez4"){
                if(rtnPathString=='M'){
                    add2rtnPathStr='';
                }else{
                    add2rtnPathStr=' Q';
                }
                rtnPathString += add2rtnPathStr+segment.points[1][0]+' '+segment.points[1][1]+' '+segment.points[0][0]+' '+segment.points[0][1];
            };
        }
        return rtnPathString + ' z';
    }
    this.showMeasures = function(arrIn){ //should walk based on only first value in points, and give measures and a line?
        var arrOut = [];
        if (arrIn == undefined) {
            arr = [];
        }else{
            var arr = _.clone(arrIn); //try with and without - do a path for the text on arc/bez3?
            var centX = 0;
            var centY = 0;
            var dist = 0;
            var XYDist = [];
			var iterator = 0;
			//var begSeg = false;
            arr.push(arr[0]);
			//arr.push(arr[0])
            for (var i = 0; i < arr.length; i++){ 
				iterator = i+1;
				if(arr.length==i+1){iterator=0};
				//if(arr[i].pathType=='newSeg'){
				//	begSeg = true;
				//}else{
				//	begSeg = false;
				//};
				//if(arr[iterator].pathType=='Line'){ //always start with an M
	            centX = Math.round((arr[i].points[0][0]+arr[iterator].points[0][0])/2);  //all should be positive
	            centY = Math.round((arr[i].points[0][1]+arr[iterator].points[0][1])/2);  //all should be positive
	            dist = Math.round(pythagDist(arr[i].points[0][0],arr[iterator].points[0][0],arr[i].points[0][1],arr[iterator].points[0][1]));
	            XYDist = [arr[i],arr[iterator],centX, centY, dist];
	            arrOut.push(XYDist); //push it to include the other points, so it can draw more smoothly with the lines for dragging??
					//};
				//if(arr[iterator].pathType=='bez3'){
//					//draw the same line for dragging, and then have a line for the measure - which means it can be pinched? or has a very thin line for each??
					//};
            }
        };
        return arrOut;
    };
    this.offSetLeft = function(offElem){
        return offElem[0].offsetLeft || 0;
    };
    this.offSetTop = function(offElem){
        return offElem[0].offsetTop || 0;
    };
})
.service('mapData',function($http){
    var geojson_data = {'adfs':'dafs'};
    this.mapCoords = function(){
        //return $http.get('/json/Census2010_Tracts_CoH.json')
        return $http.get('/json/houston_texas-roads_gen0-UTM.geojson')
//            .success(function(response) {
//                geojson_data = response.data;
//            });
        //return geojson_data;
    };
    //return geojson_data;
})

.factory('addObj',['$compile',function($compile) {
    var rtnObj = {
        newObj: function(scope,objType,objIndex){
            var container = scope.container;
            var objContainer = document.getElementById(container);
            var tpospx = scope.tpospx;
            var lpospx = scope.lpospx;
            var newObject = '<span hm-drag="'+objType+'" drag-save="dragStay" style="position:absolute;top:'+tpospx+';left:'+lpospx+';">addObj compile problem</span>';
            objContainer.innerHTML += newObject;
            $compile(objContainer)(scope);
//            compiled = $compile(newObject)(scope);
//            objContainer.innerHTML += compiled
    }
    }
    return rtnObj;
}])
.factory('addSvgPoint',['$compile',function($compile) {
    var rtnSvg = {
        newSvg: function(scope,svgType,svgIndex){
            var container = scope.container;
            var objContainer = document.getElementById('floor-container');
            var tpospx = scope.tpospx;
            var lpospx = scope.lpospx;
            var newLine = '';
            $compile(objContainer)(scope);
        }
    }
    return rtnSvg;
}])         
.factory('uuid', function() { 
	var svc = {
        new: function() {
            function _p8(s) {
                var p = (Math.random().toString(16)+"000000000").substr(2,8);
                return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
            }
            return _p8() + _p8(true) + _p8(true) + _p8();
        },
         
        empty: function() {
          return '00000000-0000-0000-0000-000000000000';
        }
    };
     
    return svc;
});
    
    
    
//    this.localStorageSet = function(layoutObject) { 
//        //console.log(gridContainer) //although should be whole floor
//        localStorage.setItem('grid', gridContainer);
//        return
//        //return this.localStorageGetAll();
//    };
//    this.localStorageGet = function(index) {
//        return localStorage.getItem('grid')
////        return JSON.parse(localStorage.getItem('layoutObject' + index));
//    };
//    this.gridContainer = this.localStorageGet; // 
////    this.localStorageGetAll = function() {
////        //console.log('in the service');
////        var layoutObjects = [];
////            for (var i = 0; i < localStorage.length; i++) {
////                if (localStorage.key(i).indexOf('layoutObject') !== -1) {
////                    var layoutObject = localStorage.getItem(localStorage.key(i));
////                    layoutObjects.push(JSON.parse(layoutObject));
////                }
////            }
////        //console.log(layoutObjects);
////        return layoutObjects;
////    };
//    
//    this.put = function(note) {
//        //alert('service');
//        localStorage.setItem('note' + note.id, JSON.stringify(note));
////        console.log('localStorage')
////        console.log(note);
////        console.log(this.getAll())
//      return this.getAll();
//    };
//    this.get = function(index) {
//      return JSON.parse(localStorage.getItem('note' + index));
//    };
//    this.getAll = function() {
//        //alert(localStorage.getItem(localStorage.key(0)));
//      var notes = [];
//      for (var i = 0; i < localStorage.length; i++) {
//        if (localStorage.key(i).indexOf('note') !== -1) {
//          var note = localStorage.getItem(localStorage.key(i));
//          notes.push(JSON.parse(note));
//        }
//      }
//        return notes;
//    };
//    this.getlocalStoragelength = localStorage.length;
//    
//
//        //this.layoutData = layoutData;
//        //need to rethink the push, etc.
//        this.list = [];
//    
//        this.selectedlayoutObject = null;
//        this.setSelectedLayoutObject = function(layoutObject) {
//            if(this.list.indexOf(layoutObject) > -1) {
//                this.selectedObject = layoutObject;
//        }
//    };
//}])
