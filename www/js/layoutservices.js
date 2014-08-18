'use strict';
/* Services
using factories, not services, 
Now moving to controllers with Restangular
*/
var layoutServices = angular.module('layoutModuleServices', []);
//layoutServices.service('layoutObjectModel', ['Restangular','$state','$stateParams', 'uuid', function(Restangular,$state,$stateParams,uuid) {
layoutServices.service('layoutObjectModel', ['Restangular', 'uuid', function(Restangular,uuid) {
    //console.log($state)
    var layoutObjectModel = Restangular.service('inspections');
    Restangular.extendModel('inspections',function(model) {
        model.getResult = function(){
            if (this.status == 'complete') {
          if (this.passed === null) return "Finished";
          else if (this.passed === true) return "Pass";
          else if (this.passed === false) return "Fail";
        }
        else return "Running";
      };
 
      return model;
    });
    //for now, to make 24 a defined fail
    if (layoutObjectModel['inspections'] == null) {
        layoutObjectModel['inspections'] = [[uuid.new()]];
    }
    this.inspectionId = layoutObjectModel.inspections[0][0];
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
    
    return layoutObjectModel;
  }])
.service('findGeom', function() {
    this.testFunc = function(){alert('in service')};
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
});;
    
    
    
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
