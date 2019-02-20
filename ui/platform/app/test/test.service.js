(function() {
	'use strict';
    angular.module('console.testService', [])
		.service('testService', function($state,$q, $http,httpPayload) {

            var _getPresignedUrl = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'http://console.d-1109.stack.dev.xpms.ai:8080/api/getpresignedurl/',
                    //headers:httpPayload.getHeader(),
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

            var testService = {
                getPresignedUrl   : _getPresignedUrl
            };

            return testService;
		});
})();