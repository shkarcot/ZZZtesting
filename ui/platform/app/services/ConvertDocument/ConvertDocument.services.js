(function() {
'use strict';
angular.module('console.ConvertDocumentServices', [])
.factory('ConvertDocumentServices', function($q, $http,httpPayload) {

  var _configureConvertDoc = function(reqObj) {
    var req = {
      method: 'POST',
      url: '/api/services/',
      headers:httpPayload.getHeader(),
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
  var _testConvertDoc = function(reqObj) {
    var req = {
      method: 'POST',
      url: '/api/services/test/',
      headers:httpPayload.getHeader(),
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


    var ConvertDocumentServices = {
        configureConvertDoc:_configureConvertDoc,
        testConvertDoc:_testConvertDoc
    };

    return ConvertDocumentServices;
});

})();
