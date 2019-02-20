(function() {
	'use strict';

angular.module('console.platformServices',[])
.factory('platformService', function($q, $http) {
  var _loadNLP = function(data) {

    var req = {
          method: 'POST',
          url: 'api/platformConfig/nlpEngine/upload/spec',
          headers: {'sess_token': data.sess_id},
          data:{"url":data.url}
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

  var _getTraningSet = function(data) {

    var req = {
          method: 'GET',
          url: 'api/training/data',
          headers: {'sess_token': data.sess_id}
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

  var _getTrainingAtr = function(data) {

    var req = {
          method: 'GET',
          url: 'api/training/data/config/attributes',
          headers: {'sess_token': data.sess_id}
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

  var _updateTrainingSet = function(obj,data) {
    var req = {
          method: 'POST',
          url: 'api/training/data/'+data.id,
          headers: {'sess_token': data.sess_id},
          data: obj
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

  var _getNlp = function(data) {

    var req = {
          method: 'GET',
          url: 'api/platformConfig/nlpEngine/processors',
          headers: {'sess_token': data.sess_id}
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

  var _updateNlp = function(data,sessId) {

    var req = {
          method: 'POST',
          url: 'api/platformConfig/nlpEngine/processors/'+data.id+'/enabled/'+data.status,
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

  var _saveKeys = function(data,sessId) {

    var req = {
          method: 'POST',
          url: 'api/keys/'+data.server_type+'/',
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

  var _getKeys = function(type,sess_id) {

    var req = {
          method: 'GET',
          url: 'api/keys/'+type+'/',
          headers: {'sess_token': sess_id}
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

  var _saveConfig = function(data,sessId) {

    var req = {
          method: 'POST',
          url: 'api/config/'+data.server_type+'/',
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

  var _deleteConfig = function(data,sessId) {

    var req = {
          method: 'DELETE',
          url: 'api/config/none/',
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

  var _getConfigs = function(type,sess_id) {

    var req = {
          method: 'GET',
          url: 'api/config/'+type+'/',
          headers: {'sess_token': sess_id}
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

  var _getTenants = function(sess_id) {

    var req = {
          method: 'GET',
          url: 'api/activeTenant/',
          headers: {'sess_token': sess_id}
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
  var _postTenants = function(type,sess_id) {

    var req = {
          method: 'POST',
          url: 'api/activeTenant/',
          headers: {'sess_token': sess_id},
          data: type
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

  var _testModelData = function(data,sessId) {

    var req = {
          method: 'POST',
          url: '',
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

  var _getTrainData = function(sess_id) {

    var req = {
          method: 'GET',
          url: 'api/learning/',
          headers: {'sess_token': sess_id}
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

    var _testSentence=function(sentenceData,sessId){

        var req = {
              method: 'POST',
              url: 'api/trainingSetModels/test/',
              data: sentenceData,
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

    var _retrain=function(sentenceData,sessId){

        var req = {
              method: 'POST',
              url: 'api/trainingSetModels/retrain/',
              data: sentenceData,
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

    var _retrainAction=function(retrainObj,sessId){

        var req = {
              method: 'POST',
              url: 'api/trainingSetModels/retrain_action_model/',
              data: retrainObj,
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

    var _saveSentences=function(verbsArray,sessId){
        var req = {
              method: 'POST',
              url: '',
              data: verbsArray,
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

    var _createSolution = function(data,sess_id) {

      var req = {
            method: 'POST',
            url: 'api/soln/',
            headers: {'sess_token': sess_id},
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

    var _getSolutions = function(sess_id) {

      var req = {
            method: 'GET',
            url: 'api/soln/',
            headers: {'sess_token': sess_id}
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

   var _delSolution = function(data,sessId) {

    var req = {
          method: 'DELETE',
          url: 'api/soln/',
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

  var _getModelData = function(data,sess_id) {

      var req = {
            method: 'POST',
            url: 'api/trainingSetModels/get_model_data/',
            headers: {'sess_token': sess_id},
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

//  var _getTestVerbMeanings = function(data,sess_id) {
//
//      var req = {
//            method: 'POST',
//            url: 'api/trainingSetModels/get_model_data/',
//            headers: {'sess_token': sess_id},
//            data: data
//      };
//      var deferred = $q.defer();
//
//      $http(req).success(function(data) {
//        deferred.resolve({
//          data: data
//        });
//      }).error(function(data) {
//        deferred.reject({
//          error: data
//        });
//      });
//
//      return deferred.promise;
//  };

  var _getTestVerbMeanings = function(data,sess_id) {

      var req = {
            method: 'POST',
            url: 'api/trainingSetModels/test_action/',
            headers: {'sess_token': sess_id},
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

  var platformService = {
    loadNLP: _loadNLP,
    getTraningSet:_getTraningSet,
    updateTrainingSet:_updateTrainingSet,
    getTrainingAtr:_getTrainingAtr,
    getNlp:_getNlp,
    updateNlp:_updateNlp,
    saveKeys:_saveKeys,
    getKeys:_getKeys,
    saveConfig:_saveConfig,
    getConfigs:_getConfigs,
    deleteConfig:_deleteConfig,
    getTenants:_getTenants,
    postTenants:_postTenants,
    trainData:_trainData,
    testModelData:_testModelData,
    getTrainData:_getTrainData,
    sentence:_sentence,
    saveSentences:_saveSentences,
    createSolution:_createSolution,
    getSolutions:_getSolutions,
    delSolution:_delSolution,
    testSentence:_testSentence,
    retrain:_retrain,
    retrainAction:_retrainAction,
    getModelData:_getModelData,
    getTestVerbMeanings:_getTestVerbMeanings
  };

  return platformService;
});

})();