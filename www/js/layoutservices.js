'use strict';
/* Services
using factories, not services, but 
*/
var layoutServices = angular.module('layoutModuleServices', []);
layoutServices.service('layoutObjectModel', [function() {
    this.localStorageSet = function(layoutObject) { 
        localStorage.setItem('layoutObject' + layoutObject.id, JSON.stringify(layoutObject));
        return this.localStorageGetAll();
    },
    this.localStorageGet = function(index) {
        return JSON.parse(localStorage.getItem('layoutObject' + index));
    },
    this.localStorageGetAll = function() {
        var layoutObjects = [];
            for (var i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).indexOf('layoutObject') !== -1) {
                    var layoutObject = localStorage.getItem(localStorage.key(i));
                    layoutObjects.push(JSON.parse(note));
                }
            }
        return layoutObjects;
    };
    
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
    

        this.layoutData = layoutData;
        //need to rethink the push, etc.
        this.list = [];
    
        this.selectedlayoutObject = null;
        this.setSelectedLayoutObject = function(layoutObject) {
            if(this.list.indexOf(layoutObject) > -1) {
                this.selectedObject = layoutObject;
        }
    };
}]);