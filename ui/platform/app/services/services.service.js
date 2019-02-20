(function() {
	'use strict';
    angular.module('console.docServices', [])
		.service('docServices', function($state,$q, $http,httpPayload) {
        var _getServices = function(data) {
            var req = {
            method: 'GET',
            url: 'api/services/',
            headers:httpPayload.getHeader()
            };
            var deferred = $q.defer();
            $http(req).success(function(data, status, header, config) {
                deferred.resolve({
                    data: data
                });
            }).error(function(data, status, header, config) {
                deferred.resolve({
                    data: data
                });
            });

            return deferred.promise;
        };

        var _postServices = function(reqObj) {
            var req = {
              method: 'POST',
              url: 'api/services/',
              headers:httpPayload.getHeader(),
              data: reqObj.data
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

        var _configureInsight = function(reqObj) {
            var req = {
              method: 'POST',
              url: '/api/insight/configure/',
              headers:httpPayload.getHeader(),
              data: reqObj.data
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

        var _createService = function(reqObj) {
            var req = {
              method: 'POST',
              url: '/api/services/create/',
              headers: httpPayload.getHeader(),
              data: reqObj.data
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

        var docService = {
            getServices:_getServices,
            postServices:_postServices,
            configureInsight:_configureInsight,
            createService:_createService
        };

        return docService;
});
})();