(function() {
	'use strict';
    angular.module('console.solutionServices', [])
		.service('solutionService', function($state,$q, $http, httpPayload) {

              var _getTenants = function(sess_id) {

                var req = {
                      method: 'GET',
                      url: 'api/activeTenant/',
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

              var _postTenants = function(type,sess_id) {

                var req = {
                      method: 'POST',
                      url: 'api/activeTenant/',
                      headers: httpPayload.getHeader(),
                      data: type
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

              var _createSolution = function(data,sess_id) {

                  var req = {
                        method: 'POST',
                        url: 'api/soln/',
                        headers: httpPayload.getHeader(),
                        data: data
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

                var _getSolutions = function(sess_id) {

                  var req = {
                        method: 'GET',
                        url: 'api/soln/',
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

               var _delSolution = function(data,sessId) {

                var req = {
                      method: 'DELETE',
                      url: 'api/soln/',
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

              var _createUsers = function(data,sessId) {

                var req = {
                      method: 'POST',
                      url: 'api/user/',
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
                      url: 'api/updateuser/',
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
                      url: 'api/user/',
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
                      url: 'api/user/',
                      headers: httpPayload.getHeader(),
                      data:data
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



              var solutionService = {
                getTenants:_getTenants,
                postTenants:_postTenants,
                createSolution:_createSolution,
                getSolutions:_getSolutions,
                delSolution:_delSolution,
                createUsers:_createUsers,
                editUsers:_editUsers,
                getUsers:_getUsers,
                deleteUser:_deleteUser
              };

              return solutionService;
		});
})();