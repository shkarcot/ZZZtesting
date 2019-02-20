(function() {
	'use strict';
    angular.module('console.createEnsembleService', [])
		.service('createEnsembleService', function($state,$q, $http,httpPayload) {

            var _getDataSets = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'api/models/dataset/list/',
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

            var _saveEnsemble = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/train/',
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

            var _saveModel = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: '',
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

            var _saveAllModel = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: '',
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

            var _getModelTypes = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'api/models/type',
                    headers:httpPayload.getHeader()
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

            var _getJupiterSession = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/session/get/',
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

            var _updateModels = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/save/',
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

            var createEnsembleService = {
                getDataSets    : _getDataSets,
                saveEnsemble   : _saveEnsemble,
                saveModel      : _saveModel,
                saveAllModel   : _saveAllModel,
                getModelTypes  : _getModelTypes,
                getJupiterSession : _getJupiterSession,
                updateModels   : _updateModels
            };

            return createEnsembleService;
		});
})();