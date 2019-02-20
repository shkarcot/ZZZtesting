(function() {
	'use strict';
    angular.module('console.functionService', [])
		.service('functionService', function($state,$q, $http,httpPayload) {

		    var _getFunctions = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/customfunctions/',
                    headers:httpPayload.getHeader(),
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

            var _enableFunction = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/customfunction/enable/',
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

            var functionService = {
                getFunctions       : _getFunctions,
                enableFunction     : _enableFunction
            };

            return functionService;
		});
})();