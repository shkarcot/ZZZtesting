(function() {
	'use strict';
    angular.module('console.pipelineServices', [])
		.service('pipelineServices', function($state,$q, $http,httpPayload) {

              var _getUrls = function(obj) {
                var req = {
                      method: 'GET',
                      url: 'api/pipeline/settings/',
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

              var _getNifiStatus = function(obj) {
                var req = {
                      method: 'GET',
                      url: 'api/pipeline/status/',
                      headers:httpPayload.getHeader()

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

              var _getCamundaUrl = function(obj) {
                var req = {
                      method: 'GET',
                      url: 'api/pipeline/settings/',
                      headers:httpPayload.getHeader()

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


              var pipelineServices = {
                getUrls:_getUrls,
                getNifiStatus:_getNifiStatus,
                getCamundaUrl:_getCamundaUrl
              };

              return pipelineServices;
		});
})();