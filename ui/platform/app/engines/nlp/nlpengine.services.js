(function() {
	'use strict';
    angular.module('console.nlpTrainService', [])
    .service('nlpTrainService', function($state,$q, $http,httpPayload) {

      var _getMeaningsForVerb=function(verb,sessId){
            var data = {"data":{
               "word": verb
               }};
            var req = {
                  method: 'POST',
                  url: 'api/trainingSetModels/nlp_word_disambiguation/',
                  data: data,
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

      var _deleteModel=function(data){
         var req = {
            method: 'POST',
            url: 'api/trainingSetModels/delete/',
            data: data,
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

      var _getModelVersions=function(data){
         var req = {
            method: 'POST',
            url: 'api/trainingSetModels/get_versions/',
            data: data.data,
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

    var _sentence=function(sentenceData,sessId){
        var data = {"data":{
           "sentences": sentenceData
           }};
        var req = {
              method: 'POST',
              url: 'api/createTrainingSet/',
              data: data,
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

    var _testSentence=function(sentenceData,sessId){

        var req = {
              method: 'POST',
              url: 'api/trainingSetModels/test/',
              data: sentenceData,
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

    var _retrain=function(sentenceData,sessId){

        var req = {
              method: 'POST',
              url: 'api/trainingSetModels/retrain/',
              data: sentenceData,
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

    var _retrainAction=function(retrainObj,sessId){

        var req = {
              method: 'POST',
              url: 'api/trainingSetModels/retrain_action_model/',
              data: retrainObj,
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

    var _saveSentences=function(verbsArray,sessId){
        var req = {
              method: 'POST',
              url: '',
              data: verbsArray,
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

    var _getTrainData = function(sess_id) {

        var req = {
              method: 'GET',
              url: 'api/learning/',
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

      var _testModelData = function(data,sessId) {

        var req = {
              method: 'POST',
              url: '',
              data: data,
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

      var _trainData = function(data,sessId) {

        var req = {
              method: 'POST',
              url: 'api/learning/',
              data: data,
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

      var _getModelData = function(data,sess_id) {

          var req = {
                method: 'POST',
                url: 'api/trainingSetModels/get_model_data/',
                headers:httpPayload.getHeader(),
                data: data
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

      var _getTestVerbMeanings = function(data,sess_id) {

          var req = {
                method: 'POST',
                url: 'api/trainingSetModels/test_action/',
                headers:httpPayload.getHeader(),
                data: data
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

      var _saveModel = function(data) {
        var req = {
              method: 'POST',
              url: 'api/trainingSetModels/create/',
              headers:httpPayload.getHeader(),
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

      var trainService = {
          getMeaningsForVerb:_getMeaningsForVerb,
          deleteModel:_deleteModel,
          getModelVersions:_getModelVersions,
          testModelData:_testModelData,
          getTrainData:_getTrainData,
          trainData:_trainData,
          sentence:_sentence,
          saveSentences:_saveSentences,
          retrain:_retrain,
          retrainAction:_retrainAction,
          getModelData:_getModelData,
          getTestVerbMeanings:_getTestVerbMeanings,
          getModels:_getModels,
          saveModel:_saveModel,
          setTrainingSetModelStatus:_setTrainingSetModelStatus
      };

        return trainService;
    });
})();