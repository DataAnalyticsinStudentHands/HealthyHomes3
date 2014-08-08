'use strict';
/* Services
using factories, not services, but 
*/
var layoutServices = angular.module('layoutModuleServices', []);
layoutServices.service('layoutObjectModel', [function() {
    this.localStorageSet = function(layoutObject) { 
        console.log(gridContainer) //although should be whole floor
        localStorage.setItem('grid', gridContainer);
        return
        //return this.localStorageGetAll();
    };
    this.localStorageGet = function(index) {
        return localStorage.getItem('grid')
//        return JSON.parse(localStorage.getItem('layoutObject' + index));
    };
    this.gridContainer = this.localStorageGet; // 
//    this.localStorageGetAll = function() {
//        //console.log('in the service');
//        var layoutObjects = [];
//            for (var i = 0; i < localStorage.length; i++) {
//                if (localStorage.key(i).indexOf('layoutObject') !== -1) {
//                    var layoutObject = localStorage.getItem(localStorage.key(i));
//                    layoutObjects.push(JSON.parse(layoutObject));
//                }
//            }
//        //console.log(layoutObjects);
//        return layoutObjects;
//    };
    
    this.put = function(note) {
        //alert('service');
        localStorage.setItem('note' + note.id, JSON.stringify(note));
//        console.log('localStorage')
//        console.log(note);
//        console.log(this.getAll())
      return this.getAll();
    };
    this.get = function(index) {
      return JSON.parse(localStorage.getItem('note' + index));
    };
    this.getAll = function() {
        //alert(localStorage.getItem(localStorage.key(0)));
      var notes = [];
      for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).indexOf('note') !== -1) {
          var note = localStorage.getItem(localStorage.key(i));
          notes.push(JSON.parse(note));
        }
      }
        return notes;
    };
    this.getlocalStoragelength = localStorage.length;
    

        //this.layoutData = layoutData;
        //need to rethink the push, etc.
        this.list = [];
    
        this.selectedlayoutObject = null;
        this.setSelectedLayoutObject = function(layoutObject) {
            if(this.list.indexOf(layoutObject) > -1) {
                this.selectedObject = layoutObject;
        }
    };
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