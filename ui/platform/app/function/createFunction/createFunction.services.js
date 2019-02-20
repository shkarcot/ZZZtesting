(function() {
	'use strict';
    angular.module('console.createFunctionService', [])
		.service('createFunctionService', function($state,$q, $http,httpPayload) {

		    var _createFunction = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/customfunction/create/',
                    headers: httpPayload.getHeader(),
                    data: data.data
                };

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

            var _postJupiter = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/customfunction/save/',
                    headers: httpPayload.getHeader(),
                    data: data.data
                };

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

            var createFunctionService = {
                createFunction       : _createFunction,
                postJupiter          : _postJupiter
            };

            return createFunctionService;
		});
})();