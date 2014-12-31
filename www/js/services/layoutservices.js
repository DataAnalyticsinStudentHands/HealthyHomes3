'use strict';
/* Services
using factories, not services, 
Now moving to controllers with Restangular
*/
//var layoutServices = angular.module('layoutModuleServices', []);
//var layoutServices = angular.module('HHServices', []);
//layoutServices.service('layoutObjectModel', ['Restangular','$state','$stateParams', 'uuid', function(Restangular,$state,$stateParams,uuid) {
angular.module('Services', [])
	
.factory('arcs',function() {
    console.log('wtf on inspections');
})
.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
		//console.log(url)
        return $sce.trustAsResourceUrl(url);
    };
}])
.factory('camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}])
// .service('magnifyGridDoesntWork',function(){
// 	return{
//
// 		gridMag: function(num){
// 			var num = 1;
// 			var newnum = 1;
// 			var gridMagnify = function(num){
// 				return num * newnum;
// 			}
//
//     		var gridElem = angular.element(document.getElementById('floor-container'));
//
//     		var elemWidth = gridElem[0].offsetWidth;
//     		if (elemWidth == 2016){elemWidth = 2000}; //have to figure out
//     		var newMag = num * (elemWidth);
// 			newnum = gridMagnify(num);
//     		return newMag
// 		}
// 	}
// })
.service('findGeom', function() {
	this.canvasSize = 2000;
	this.gridElem = angular.element(document.getElementById('floor-container'));
    this.closestLine = function(arrIn,fingerX,fingerY){
        //because of SVG path ordering, want to insert so that the finger is pointing to the beginning of the segment
        var arr = angular.copy(arrIn); //_.clone(arrIn);
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
        var cfX;
        var cfY;
        var itX;
        var itY;
        var arrX;
        var arrY;
		arr.push(arr[0]);
		for (var i = 0;i<arr.length-1;i++){
			iterator = i+1;
			if(arr.length==i+1){iterator=0};
            shrtDist = 500;
            itX = arr[iterator].points[0][0];
            itY = arr[iterator].points[0][1];
            arrX = arr[i].points[0][0];
            arrY = arr[i].points[0][1];
			xDist = Math.abs(itX-arrX);
			yDist = Math.abs(itY-arrY);
			num2iterate = 50/Math.max(xDist,yDist);
			//console.log('num2iterate'+num2iterate)
			if(arr[i].pathType =='QuadBezier'){
                cfX = arr[i].points[1][0];
                cfY = arr[i].points[1][1];
				for(t=num2iterate;t<1;t+=num2iterate){
					linex = (1 - t) * (1 - t) * itX + 2 * (1 - t) * t * cfX + t * t * arrX;
					liney = (1 - t) * (1 - t) * itY + 2 * (1 - t) * t * cfY + t * t * arrY;
					fingDist = pythagDist(fingerX,linex,fingerY,liney);
					if (fingDist<shrtDist){
						shrtDist=fingDist;
						pointIntersect = [linex,liney];
					};
				};
			}else if(arr[i].pathType =='CubicBezier'){
                cf0 = (1-num2iterate)*(1-num2iterate)*(1-num2iterate);
				cf1 = 3 * num2iterate * (1-num2iterate) * (1-num2iterate);
				cf2 = 3 * num2iterate * num2iterate * (1-num2iterate);
				cf3 = num2iterate * num2iterate * num2iterate;
				for(var t=num2iterate;t<1;t+=num2iterate){
					linex = (cf0*itX) + (cf1*arr[i].points[1][0])+(cf2*arr[i].points[2][0]) + (cf3*arrX);
					liney = (cf0*itY) + (cf1*arr[i].points[1][1])+(cf2*arr[i].points[2][1]) + (cf3*arrY);
					fingDist = pythagDist(fingerX,linex,fingerY,liney);
					if (fingDist<shrtDist){
						shrtDist=fingDist;
						pointIntersect = [linex,liney];
					};
				};
			}else{ 
                if(arrY-itY==0){
                    slope=0;
					yintercept = arrY;
				}else if(arrX-itX==0){
                    slope=100000;
					yintercept = 0;//????
                }else{
				    slope = (arrY-itY) / (arrX-itX);
					yintercept = arrY-(slope*arrX);
                };
				if (xDist>=yDist){
					for(var k=0;k<xDist;k++){
                        var xWd = k+Math.min(arrX,itX);
						liney = (slope*xWd)+yintercept;
                        fingDist = pythagDist(fingerX,xWd,fingerY,liney);
						if (fingDist<shrtDist){
							shrtDist=fingDist;
							pointIntersect = [xWd,liney];
						};
					};
				}else{  
					for(var k=1;k<yDist;k++){
						var starty = Math.min(arrY,itY);
						if (starty==arrY){
							var startx = arrX;
						}else{
							var startx = itX;
						}
                        var yHt = k+starty;
						if (slope>=10000){
							linex = startx;
						}else if (slope==0){
							linex = startx+k;
						}else if (slope<0){
							linex = (slope/k)-startx;
						}else{
							linex = (slope/k)+startx;
						}
						fingDist = pythagDist(fingerX,linex,fingerY,yHt);
						if (fingDist<shrtDist){
							shrtDist=fingDist;
							pointIntersect = [linex,yHt];
						};
					};
				};
			};
			if (shrtDist<shortestDist){
				shortestDist = shrtDist;
				ind4new = i;
				finalPts = pointIntersect;
			};
        };
        return [ind4new, finalPts];
    };
    var pythagDist = this.pythagDist = function(x1,x2,y1,y2){
        return Math.sqrt(((x1-x2)*(x1-x2))+((y1-y2)*(y1-y2)))
    };
    var segment;
    this.svgPath = function(arr){
        var rtnPathString = 'M';//+arr[0][0]+' '+arr[0][1];
        var add2rtnPathStr = '';
        //for (var key=0; k<arr.length; key++){
        for (var key in arr){
            segment = arr[key];
            /*if(segment.pathType == "newSeg"){//do I need any to be called newSeg??
                if(rtnPathString=='M'){
                    add2rtnPathStr='';
                }else{
                    add2rtnPathStr=' L';
                }
                rtnPathString += add2rtnPathStr+segment.points[0][0]+' '+segment.points[0][1];
			};*/
            if(segment.pathType == "Line"){
                if(rtnPathString=='M'){
                    add2rtnPathStr='';
                }else{
                    add2rtnPathStr=' L';
                }
                rtnPathString += add2rtnPathStr+segment.points[0][0]+' '+segment.points[0][1];
            };
            if(segment.pathType == "CubicBezier"){
                if(rtnPathString=='M'){
                    add2rtnPathStr='';
                }else{
                    add2rtnPathStr=' C';
                }
                rtnPathString += add2rtnPathStr+segment.points[2][0]+' '+segment.points[2][1]+' '+segment.points[1][0]+' '+segment.points[1][1]+' '+segment.points[0][0]+' '+segment.points[0][1];
            };
            if(segment.pathType == "QuadBezier"){
                if(rtnPathString=='M'){
                    add2rtnPathStr='';
                }else{
                    add2rtnPathStr=' Q';
                }
                rtnPathString += add2rtnPathStr+segment.points[1][0]+' '+segment.points[1][1]+' '+segment.points[0][0]+' '+segment.points[0][1];
            };
        }
		//console.log(rtnPathString)
        return rtnPathString + ' z';
    }
    this.showMeasures = function(arrIn){ //should walk based on only first value in points, and give measures and a line?
        var arrOut = [];
        if (arrIn == undefined) {
            arr = [];
        }else{
            var arr = _.clone(arrIn); //try with and without - do a path for the text on arc/CubicBezier?
			//console.log(arr); //this avoids a sometimes trap on finding no value in arr?????
            var centX = 0;
            var centY = 0;
            var dist = 0;
            var XYDist = [];
			var iterator = 0;
            arr.push(arr[0]);
            for (var i = 0; i < arr.length; i++){ 
				iterator = i+1;
				if(arr.length==i+1){iterator=0};
				if(!arr[i].points){return};
				if(!arr[iterator].points){iterator=i};
	            centX = Math.round((arr[i].points[0][0]+arr[iterator].points[0][0])/2);  //all should be positive
	            centY = Math.round((arr[i].points[0][1]+arr[iterator].points[0][1])/2);  //all should be positive
	            dist = Math.round(pythagDist(arr[i].points[0][0],arr[iterator].points[0][0],arr[i].points[0][1],arr[iterator].points[0][1]));
	            XYDist = [arr[i],arr[iterator],centX, centY, dist];
	            arrOut.push(XYDist); 
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
