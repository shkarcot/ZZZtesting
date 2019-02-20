(function() {
	'use strict';
    angular.module('console.customModelDashboardService', [])
		.service('customModelDashboardService', function($state,$q, $http) {

		    var _getModels = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'api/models/',
                    headers: {'sess_token': data.sess_id}
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

            var _getModelsFilter = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/ensembles/',
                    headers: {'sess_token': data.sess_id},
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
                    headers: {'sess_token': data.sess_id}
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

            var _getDataSetsList = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/dataset/list/',
                    headers: {'sess_token': data.sess_id},
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

            var _getBinaries = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/binaries/list/',
                    headers: {'sess_token': data.sess_id},
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

            var _archiveDataset = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/dataset/archive/',
                    headers: {'sess_token': data.sess_id},
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

            var _archiveBinary = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'api/models/binary/archive/',
                    headers: {'sess_token': data.sess_id},
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
                    headers: {'sess_token': data.sess_id}
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
             var _getFeaturePipline = function() {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'http://0.0.0.0:18098/pipes',
                    headers: {}
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
             var _getPiplinejobs = function() {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'http://0.0.0.0:18098/pipejobs',
                    headers: {}
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
             var _getPiplinejobsDetailsByID = function(id) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'http://0.0.0.0:18098/pipejobs/'+id,
                    headers: {}
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

            var modelDashboardService = {
                getModels       : _getModels,
                getDataSets     : _getDataSets,
                archiveDataset  : _archiveDataset,
                getModelsFilter : _getModelsFilter,
                getBinaries     : _getBinaries,
                getDataSetsList : _getDataSetsList,
                getDatasetTypes : _getDatasetTypes,
                archiveBinary   : _archiveBinary,
                getFeaturePipline    : _getFeaturePipline,
                getPiplinejobs     : _getPiplinejobs,
                getPiplinejobsDetailsByID :_getPiplinejobsDetailsByID
            };

            return modelDashboardService;
		});
})();