(function() {
	'use strict';
    angular.module('console.modelDetailsService', [])
		.service('modelDetailsService', function($state,$q, $http,httpPayload) {

            var _getModelVersions = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/details/',
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

            var _getEvaluateResults = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/evaluationdetails/',
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

            var _getPreviousRuns = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/previousrundetails/',
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

            var _updateModelData = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/config/',
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

            var _getDatasetTypes = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'api/models/dataset/type',
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

            var _getModelComponents = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/components/',
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

            var _getDataSets = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'api/models/dataset/list/',
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

            var _testModelData = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/test/',
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

            var _retrainModelData = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/retrain/',
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

            var _evaluateDataset = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/evaluate/',
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

            var _updateModelFlow = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/flowupdate/',
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

            var modelDetailsService = {
                getModelVersions       : _getModelVersions,
                updateModelData        : _updateModelData,
                getDatasetTypes        : _getDatasetTypes,
                getModelComponents     : _getModelComponents,
                getDataSets            : _getDataSets,
                testModelData          : _testModelData,
                retrainModelData       : _retrainModelData,
                getEvaluateResults     : _getEvaluateResults,
                getPreviousRuns        : _getPreviousRuns,
                evaluateDataset        : _evaluateDataset,
                updateModelFlow        : _updateModelFlow,
                getJupiterSession      : _getJupiterSession,
                updateModels           : _updateModels
            };

            return modelDetailsService;
		});
})();