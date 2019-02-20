(function() {
	'use strict';
    angular.module('console.createPiplineService1', [])
		.service('createPiplineService1', function($state,$q, $http) {



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
        var _getTypeSyscd = function(data) {
        	//console.log(""+JSON.stringify(page));
            var deferred = $q.defer();



            var req = {
                method: 'get',
                url:  'http://localhost:18098/sysvalue/pipe_type',
                headers: {'Content-Type' : 'application/json'}
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

            var PiplineService = {
                piplinePostDataSave       : _piplinePostDataSave,
                getTypeSyscd  :  _getTypeSyscd,
              //  getDataSets     : _getDataSets,
              //  archiveDataset  : _archiveDataset,

            };

            return PiplineService;
		});
})();