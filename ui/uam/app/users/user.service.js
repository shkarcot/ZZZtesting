(function() {
	'use strict';
    angular.module('console.userServices', [])
		.service('userService', function($state,$q, $http, httpPayload) {
              var _createUsers = function(data,sessId) {

                var req = {
                      method: 'POST',
                      url: 'api/users/',
                      data: data,
                      headers: httpPayload.getHeader()
                };
                var deferred = $q.defer();

                $http(req).success(function(data) {
                  deferred.resolve({
                    data: data
                  });
                }).error(function(data) {
                  deferred.reject({
                    error: data
                  });
                });

                return deferred.promise;
              };
              var _editUsers = function(data,sessId) {

                var req = {
                      method: 'POST',
                      url: 'api/users/',
                      data: data,
                      headers: httpPayload.getHeader()
                };
                var deferred = $q.defer();

                $http(req).success(function(data) {
                  deferred.resolve({
                    data: data
                  });
                }).error(function(data) {
                  deferred.reject({
                    error: data
                  });
                });

                return deferred.promise;
              };


              var _getUsers = function(sess_id) {

                var req = {
                      method: 'GET',
                      url: 'api/users/',
                      headers: httpPayload.getHeader()
                };
                var deferred = $q.defer();

                $http(req).success(function(data) {
                  deferred.resolve({
                    data: data
                  });
                }).error(function(data) {
                  deferred.reject({
                    error: data
                  });
                });

                return deferred.promise;
              };

              var _getUserRoles = function(sess_id) {

                var req = {
                      method: 'GET',
                      url: 'api/userroles/',
                      headers: httpPayload.getHeader()
                };
                var deferred = $q.defer();

                $http(req).success(function(data) {
                  deferred.resolve({
                    data: data
                  });
                }).error(function(data) {
                  deferred.reject({
                    error: data
                  });
                });

                return deferred.promise;
              };

              var _deleteUser = function(data,sess_id) {

                var req = {
                      method: 'DELETE',
                      url: 'api/users/'+data.id,
                      headers: httpPayload.getHeader()
                };
                var deferred = $q.defer();

                $http(req).success(function(data) {
                  deferred.resolve({
                    data: data
                  });
                }).error(function(data) {
                  deferred.reject({
                    error: data
                  });
                });

                return deferred.promise;
              };



              var userService = {
                createUsers:_createUsers,
                editUsers:_editUsers,
                getUsers:_getUsers,
                getUserRoles: _getUserRoles,
                deleteUser:_deleteUser
              };

              return userService;
		});
})();