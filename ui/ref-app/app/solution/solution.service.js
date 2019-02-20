(function() {
	'use strict';
    angular.module('console.solutionServices', [])
		.service('solutionService', function($state,$q, $http,httpPayload) {


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

                var _getSolutions = function(sess_id) {

                  var req = {
                        method: 'GET',
                        url: 'api/solutions/',
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

              var solutionService = {
                postTenants:_postTenants,
                getSolutions:_getSolutions,
                delSolution:_delSolution
              };

              return solutionService;
		});
})();