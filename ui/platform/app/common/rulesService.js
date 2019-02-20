(function() {
	'use strict';

angular.module('console.rulesServices',[])

.factory('rulesService', function($q, $http,$location) {

  var _getOperators = function(data) {
    //var fullPath=$location.absUrl();
    //var baseUrl=fullPath.split("#");
    var path = 'api/rulesConfig/operators/';
    var req = {
          method: 'GET',
          url: 'api/rulesConfig/operators/',
          //url: 'http://localhost:9000/scripts/data/operator.json',
          //url: baseUrl+'scripts/data/operator.json',
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

  var _saveRule = function(data) {

    var req = {
          method: 'POST',
          url: 'api/rulesConfig/ruleflows/'+data.id+'/rules/',
          headers: {'sess_token': data.sess_id},
          data:data.obj
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

  var _saveTest = function(data) {
    var req = {
          method: 'POST',
          url: 'api/rulesConfig/test/',
          headers: {'sess_token': data.sess_id},
          data:data.obj
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

  var _ruleFlow = function(data) {
    var req = {
          method: 'GET',
          url: 'api/rulesConfig/ruleflow/',
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

  var _getDictionary = function(data) {

    var req = {
          method: 'GET',
          //url: 'api/training/data',
          url:'api/load_training/data/',
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
  var _getDictionaryList = function(data) {

    var req = {
          method: 'GET',
          url:'api/trainingSet/'+data.server_type+'/',
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
  var _postDictionaryList = function(data) {

    var req = {
          method: 'POST',
          url:'api/trainingSet/'+data.server_type+'/',
          headers: {'sess_token': data.sess_id},
          data:data
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


  var _getRules = function(data) {
   var req = {
          method: 'GET',
          //url: 'api/rulesConfig/',
           url:'api/rulesConfig/ruleflows/'+data.id+'/rules/',
          headers: {'sess_token': data.sess_id}
        };
        var deferred = $q.defer();
        $http(req).success(function(res){
           deferred.resolve(res);
        }).error(function(resdata) {
           deferred.reject({
               error: resdata
           });
        });
       return deferred.promise;
  };

  var _deleteRule = function(data) {

     var req = {
          method: 'DELETE',
          url: 'api/rulesConfig/ruleflows/'+data.obj+'/rules/',
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

  var _delDictionary = function(data) {

     var req = {
          method: 'DELETE',
          url: 'api/load_training/data/',
          data: {'_id': data.id},
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

  var _getEngineConfig = function(data) {

    var req = {
          method: 'GET',
          url:'api/engine_config/'+data.server_type+'/',
          headers: {'sess_token': data.sess_id},
          data:data
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
  var _postEngineConfig = function(data) {

    var req = {
          method: 'POST',
          url:'api/engine_config/'+data.server_type+'/',
          headers: {'sess_token': data.sess_id},
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
var _saveModel = function(data) {
    var req = {
          method: 'POST',
          url: 'api/trainingSetModels/create/',
          headers: {'sess_token': data.sess_id},
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
          headers: {'sess_token': data.sess_id}
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
          headers: {'sess_token': data.sess_id},
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



  var rulesService = {
    saveModel :_saveModel,
    getModels:_getModels,
    setTrainingSetModelStatus:_setTrainingSetModelStatus,
    getOperators: _getOperators,
    saveRule :_saveRule,
    saveTest:_saveTest,
    ruleFlow:_ruleFlow,
    getDictionary:_getDictionary,
    getDictionaryList:_getDictionaryList,
    postDictionaryList:_postDictionaryList,
    getRules:_getRules,
    deleteRule:_deleteRule,
    delDictionary:_delDictionary,
    getEngineConfig:_getEngineConfig,
    postEngineConfig:_postEngineConfig,
    updateResourceLibrary:_updateResourceLibrary

  };

  return rulesService;
});

})();