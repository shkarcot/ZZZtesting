(function() {
	'use strict';
    angular.module('console.createPiplineService', [])
		.service('createPiplineService', function($state,$q, $http) {




            /*  var _getQueryData = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'http://ec2-54-174-48-72.compute-1.amazonaws.com:18001/featuredata',
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
            };*/

            var createPiplineService = {
              //  getModels       : _getModels,
              //  getDataSets     : _getDataSets,
              //  archiveDataset  : _archiveDataset,

            };

            return createPiplineService;
		});
})();