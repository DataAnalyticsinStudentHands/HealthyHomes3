/*global angular*/

/**
 * @ngdoc function
 * @name terry.controller:UserService
 * @description
 * # UserService
 * Service for the terry
 */
angular.module('userServiceModule').factory('UserService', function (Restangular, $q, $filter) {
    'use strict';

    var allUsers,
        promAllUsers,
        myUser,
        updating;
    return {
        //ACCESSES SERVER AND UPDATES THE LIST OF USERS
        updateUsers: function (update) {
            if (update || (!allUsers && !updating)) {
                promAllUsers = Restangular.all("users").getList();
                updating = true;
                promAllUsers.then(function (success) {
                    updating = false;
                    success = Restangular.stripRestangular(success);
                    allUsers = success;
                }, function (fail) {

                });
                return promAllUsers;
            } else if (updating) {
                return promAllUsers;
            } else {
                var defer = $q.defer();
                defer.resolve("DONE");
                return defer.promise;
            }
        },
        getAllUsers: function () {
            return this.updateUsers().then(function (success) {
                return allUsers;
            });
        },
        getUser: function () {
            return Restangular.all("users").getList();
        },
        addUser: function (user) {
            return Restangular.all("users").post(user);
        },
        editUser: function (id, user) {
            return Restangular.all("users").all(id).post(user);
        },
        deleteUser: function (uid) {
            return Restangular.all("users").all(uid).remove();
        }
    };
});