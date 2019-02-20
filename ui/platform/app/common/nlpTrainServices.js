(function() {
	'use strict';
angular.module('console.nlpTrainServices',[])

.factory('nlpTrainService', function($q, $http) {

      var _getMeaningsForVerb=function(verb,sessId){
        var data = {"data":{
           "word": verb
           }};
        var req = {
              method: 'POST',
              url: 'api/trainingSetModels/nlp_word_disambiguation/',
              data: data,
              headers: {'sess_token': sessId}
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

    var _deleteModel=function(data){
         var req = {
            method: 'POST',
            url: 'api/trainingSetModels/delete/',
            data: data,
            headers: {'sess_token': data.sessId}
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

    var _getModelVersions=function(data){
         var req = {
            method: 'POST',
            url: 'api/trainingSetModels/get_versions/',
            data: data.data,
            headers: {'sess_token': data.sessId}
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

    var trainService = {
        getMeaningsForVerb:_getMeaningsForVerb,
        deleteModel:_deleteModel,
        getModelVersions:_getModelVersions
    };

    return trainService;
});

})();