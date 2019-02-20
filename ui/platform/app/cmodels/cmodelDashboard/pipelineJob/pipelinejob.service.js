(function() {
	'use strict';
    angular.module('console.piplinejobService', [])
		.service('xstageconfigService', function($state,$q, $http) {




             var _getDataList = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'POST',
                    url: 'http://localhost:18098/pipes',
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

            var xStageConfigService = {
                getDataList       : _getDataList

            };

            return xStageConfigService;
		});
})();