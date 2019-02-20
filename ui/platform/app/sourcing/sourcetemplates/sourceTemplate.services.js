(function() {
	'use strict';
    angular.module('console.sourceTemplateServices', [])
		.service('sourceTemplateService', function($state,$q, $http,httpPayload) {

            var _saveTemplate = function(config) {

                var req = {
                      method: 'POST',
                      url: 'api/solnConfig/template/',
                      headers: httpPayload.getHeader(),
                      data:config.obj
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

            var _getTemplates = function(data) {
                var deferred = $q.defer();
                var req = {
                      method: 'GET',
                      url: 'api/solnConfig/template/',
                      headers: httpPayload.getHeader()
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

            var _removeTemplate = function(data) {
                var req = {
                      method: 'DELETE',
                      url: 'api/solnConfig/template/',
                      headers:httpPayload.getHeader(),
                      data:{'template_name':data.obj}
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

            var sourceTemplateService = {
                getTemplates :_getTemplates,
                saveTemplate:_saveTemplate,
                removeTemplate:_removeTemplate
            };

            return sourceTemplateService;
		});
})();