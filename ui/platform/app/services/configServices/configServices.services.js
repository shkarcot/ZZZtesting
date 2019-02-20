(function() {
'use strict';
angular.module('console.configServices', [])
.factory('configServices', function($q, $http,httpPayload) {

  var _configureConvertDoc = function(reqObj) {
    var req = {
      method: 'POST',
      url: '/api/services/',
      headers: httpPayload.getHeader(),
      data: reqObj.data
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
  var _testService = function(reqObj) {
    var req = {
      method: 'POST',
      url: '/api/services/test/',
      headers: httpPayload.getHeader(),
      data: reqObj.data
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

  var _getJobStatus = function(reqObj) {
    var req = {
      method: 'GET',
      url: '/api/jobStatus/'+reqObj.data,
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

  var _saveHocrType = function(reqObj) {
    var req = {
      method: 'PUT',
      url: '/api/soln/',
      headers: httpPayload.getHeader(),
      data: reqObj.data
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

    var configServices = {
        configureConvertDoc:_configureConvertDoc,
        testService:_testService,
        getJobStatus: _getJobStatus,
        saveHocrType: _saveHocrType
    };

    return configServices;
});

})();
