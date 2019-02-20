(function() {
'use strict';
angular.module('console.identifyTablesServices', [])
.factory('identifyTablesServices', function($q, $http,httpPayload) {

  var _getIdentityTables = function(data) {
    var req = {
          method: 'GET',
          url: '/api/tables/',
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

  var _configureIdentityTable = function(reqObj) {
    var req = {
      method: 'POST',
      url: '/api/tables/',
      headers: httpPayload.getHeader(),
      data: reqObj.data.data
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


    var identifyTablesServices = {
        getIdentityTables:_getIdentityTables,
        configureIdentityTable:_configureIdentityTable
    };

    return identifyTablesServices;
});

})();
