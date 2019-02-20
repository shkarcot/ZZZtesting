(function() {
	'use strict';
    angular.module('console.functionDetailService', [])
		.service('functionDetailService', function($state,$q, $http,httpPayload) {

		    var _getFunctionDetail = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'api/customfunctions/'+data.name,
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

            var _enableVersion = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/customfunction/enable_version/',
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

            var _deleteVersion = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'DELETE',
                    url: 'api/customfunctions/',
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

            var _testVersion = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/customfunction/test/',
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

            var _openVersion = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/customfunction/open/',
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

            var _saveVersion = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/customfunction/save/',
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

            var _publishVersion = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/customfunction/publish/',
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

            var _checkLogs = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/customfunction/logs/',
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

            var functionDetailService = {
                getFunctionDetail       : _getFunctionDetail,
                enableVersion           : _enableVersion,
                deleteVersion           : _deleteVersion,
                testVersion             : _testVersion,
                openVersion             : _openVersion,
                saveVersion             : _saveVersion,
                publishVersion          : _publishVersion,
                checkLogs               : _checkLogs
            };

            return functionDetailService;
		});
})();