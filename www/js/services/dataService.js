/*global angular, console*/

/**
 * @ngdoc function
 * @name HH.service:DataService
 * @description
 * # DataService
 * Service for the Healthy Homes App
 */
angular.module('Services').factory('DataService', function ($http, $q, $sessionStorage, $localStorage, $ionicLoading, Restangular, ngNotify) {
    'use strict';
    //for BCM, would use sessionStorage - version control for questions

    //Load data 
    var inspections;
    var questions;

//    $http.get('json/inspections.json').success(function (data) {
//        inspections = data;
//    });
    
//    var asthma_questions;
//
//    $http.get('json/asthma.json').success(function (data) {
//        asthma_questions = data;
//    });
    
    var lead_questions;

    $http.get('json/lead.json').success(function (data) {
        lead_questions = data;
    });
    
    var pesticide_questions;

    $http.get('json/pesticide.json').success(function (data) {
        pesticide_questions = data;
    });

    return {
        getInspections: function () {
            //$localStorage.$reset(); //$sessionStorage.$reset();
            //need to return as a promise for resolve in app.js
            if ($localStorage['inspections'] != null){
                inspections = $localStorage['inspections'];
                return inspections;
            }
            else {
                var defer = $q.defer();
                $http.get('json/inspections.json').success(function (data) {
                    inspections = data;
                    defer.resolve(inspections);
                    $localStorage['inspections'] = inspections;
                    });
                return defer.promise;
            }
        },
//		setCurrentFloor: function () {
//			
//		}
        getQuestions: function () { //need logic for versioning etc. should return a list of questionsets, at top level, then the questions - think of arc index
            if ($localStorage['questions'] != null){
                questions = $localStorage['questions']; 
                return questions;
            }
            else {
                var defer = $q.defer();
                $http.get('json/asthma.json').success(function (data) {
                    questions = data;
                    defer.resolve(inspections);
                    $localStorage['questions'] = questions;
                    });
                return defer.promise;
            }
        },
        addItem: function (type, item) {

            return Restangular.all(type).post(item).then(

                function (result) {
                    ngNotify.set("Succesfully saved your " + type + " to the server.", {
                        position: 'bottom',
                        type: 'success'
                    });
                },
                function (error) {
                    ngNotify.set("Could not contact server to add " + type + " !", {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            );
        },
        getAllItems: function (acType) {
            $ionicLoading.show();
            return Restangular.all(acType).getList().then(
                function (result) {
                    $ionicLoading.hide();
                    result = Restangular.stripRestangular(result);
                    result.type = acType;
                    return result;
                },
                function (error) {
                    $ionicLoading.hide();
                    ngNotify.set("Something went wrong retrieving data for " + acType, {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            );

        },
        getItem: function (acType, id) {

            return Restangular.one(acType, id).get().then(
                function (result) {
                    result = Restangular.stripRestangular(result);
                    result.type = acType;
                    return result;
                },
                function (error) {
                    ngNotify.set("Something went wrong retrieving data for " + acType, {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            );

        },
        getItemList: function (acType, id) {
            $ionicLoading.show();
            return Restangular.one(acType).one('list').getList(id).then(
                function (result) {
                    $ionicLoading.hide();
                    result = Restangular.stripRestangular(result);
                    return result;
                },
                function (error) {
                    $ionicLoading.hide();
                    ngNotify.set("Something went wrong retrieving data for " + acType, {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            ).$object;
        },
        updateItem: function (type, item_id, item) {

            return Restangular.all(type).all(item_id).post(item).then(
                function (result) {
                    ngNotify.set("Succesfully updated your " + type + " on the server.", {
                        position: 'bottom',
                        type: 'success'
                    });
                },
                function (error) {
                    ngNotify.set("Could not contact server to update " + type + " !", {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            );
        },
        deleteItem: function (type, item_id) {

            return Restangular.all(type).all(item_id).remove().then(
                function (result) {
                    ngNotify.set("Succesfully deleted your from " + type + " .", {
                        position: 'bottom',
                        type: 'success'
                    });
                },
                function (error) {
                    ngNotify.set("Could not contact server to delete from " + type + " !", {
                        position: 'bottom',
                        type: 'error'
                    });
                }
            );
        }
    };
});