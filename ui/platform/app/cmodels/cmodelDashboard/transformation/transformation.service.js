(function() {
	'use strict';
    angular.module('console.transformationService', [])
		.service('transformationService', function($state,$q, $http) {




             var _piplinePostDataSave = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'http://localhost:18098/pipe',
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

            var transformationPiplineService = {
                piplinePostDataSave       : _piplinePostDataSave

            };

            return transformationPiplineService;
		});
})();