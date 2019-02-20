(function() {
	'use strict';
    angular.module('console.enginesServices', [])
		.service('solutionService', function($state,$q, $http,httpPayload) {

        var _updateResourceLibrary = function(data) {
         var req = {
              method: 'POST',
              url: 'api/load_training/data/',
              data:data,
              headers: httpPayload.getHeader()
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
    var _saveModel = function(data) {
        var req = {
              method: 'POST',
              url: 'api/trainingSetModels/create/',
              headers: httpPayload.getHeader(),
              data:data.data
        };
        var deferred = $q.defer();
        $http(req).success(function(data, status, header, config) {
          deferred.resolve({
            data: data
          });
        }).error(function(data, status, header, config) {
          /*deferred.reject({
            error: data
          });*/
          deferred.resolve({
            data: data
          });
        });

        return deferred.promise;
      };
      var _getModels = function(data) {
        var req = {
              method: 'GET',
              url: 'api/trainingSetModels/'+data.server+'/',
              headers:httpPayload.getHeader()
              //data:data.data
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

      var _setTrainingSetModelStatus = function(data) {

        var req = {
              method: 'POST',
              url:'api/trainingSetModels/'+data.status+'/',
              headers:httpPayload.getHeader(),
              data:data.data
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
      var _updateResourceLibrary = function(data) {
     var req = {
          method: 'POST',
          url: 'api/load_training/data/',
          data:data,
          headers:httpPayload.getHeader()
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



          var engineServices = {
            saveModel :_saveModel,
            getModels:_getModels,
            setTrainingSetModelStatus:_setTrainingSetModelStatus,
            updateResourceLibrary:_updateResourceLibrary
          };

          return engineServices;
		});
})();