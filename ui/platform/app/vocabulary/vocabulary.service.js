(function () {
    'use strict';
    angular.module('console.vocabularyServices', [])
        .service('vocabularyService', function ($state, $q, $http,httpPayload) {

            var _uploadOntology = function (id,params) {
                var req = {
                    method: 'POST',
                    url: '/api/solution/'+id+'/ontologies/',
                    data: params,
                    headers:httpPayload.getHeader()
                };
                var deferred = $q.defer();

                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            }

            var _getListOfOntologies = function (id) {
                var req = {
                    method: 'GET',
                    url: '/api/solution/'+id+'/ontologies/',
                    headers:httpPayload.getHeader()
                };
                var deferred = $q.defer();
                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            }
            var _getListOfOntologiesById = function (id,params) {
                var req = {
                    method: 'GET',
                    url: '/api/solution/'+id+'/ontologies/'+params+'/',
                    headers:httpPayload.getHeader()
                };
                var deferred = $q.defer();
                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            }

            var _toggleOntologyVersion = function (solid,id,params) {
                var req = {
                    method: 'POST',
                    url: '/api/solution/'+solid+'/ontologies/'+id+'/enable/',
                    data: params,
                    headers:httpPayload.getHeader()
                };
                var deferred = $q.defer();

                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            };

            var _downloadUrl = function (params) {
                var req = {
                    method: 'POST',
                    url: '/api/presignedurl/',
                    data: params,
                    headers:httpPayload.getHeader()
                };
                var deferred = $q.defer();

                $http(req).success(function (data) {
                    deferred.resolve({
                        data: data
                    });
                }).error(function (data) {
                    deferred.reject({
                        error: data
                    });
                });

                return deferred.promise;
            }


            var vocabularyService = {

                uploadOntology:_uploadOntology,
                getListOfOntologies:_getListOfOntologies,
                getListOfOntologiesById:_getListOfOntologiesById,
                toggleOntologyVersion:_toggleOntologyVersion,
                downloadUrl:_downloadUrl
            };

            return vocabularyService;
        });
})();