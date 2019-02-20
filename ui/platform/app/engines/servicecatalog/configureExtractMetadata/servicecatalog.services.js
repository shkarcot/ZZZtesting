'use strict';
angular.module('console.serviceCatalogServices', [])
.factory('insightsConfigurationServices', function($q, $http,httpPayload) {

  var _getInsights = function(data) {
    var req = {
          method: 'GET',
          url: '/api/insight/insight_templates/',
          headers: httpPayload.getHeader()
    };
    var deferred = $q.defer();
    $http(req).success(function(data) {
    //var data={'status':'success','msg':'Insight templates list','data':[{"solution_id":"my_test_7_309ed2d8-532a-4546-9d81-82bccbf84a6c","template_value":{"timeout":{"value":"10","unit":"seconds"},"output":{"trigger":"processed_text","sample":{"trigger":"get_intent","metadata":{"intent_verb":"update"},"data":{}},"schema":{"type":"object","required":["metadata","trigger"],"properties":{"trigger":{"type":"string"},"metadata":{"required":["intent_verb"],"properties":{"intent_verb":{"type":"string","ui_type":"image"}}}}}},"response_trigger":"process_text","input":{"schema":{"type":"object","required":["data","trigger"],"properties":{"trigger":{"type":"string"},"data":{"required":["request_type","text"],"properties":{"request_type":{"type":"string","ui_type":"string"},"text":{"type":"string","ui_type":"string"},"commit":{"type":"string","ui_type":"image"},"sample":{"type":"string","ui_type":"string"}}}}},"sample":{"trigger":"get_insight","data":{"request_type":"get_intent","text":"please update my provider form address to xyz"}}}},"template_key":"get_intent","_id":"59ea11183785c608bc893c46","created_ts":"2017-10-20T15:07:04.730","is_active":true},{"solution_id":"my_test_7_309ed2d8-532a-4546-9d81-82bccbf84a6c","template_value":{"timeout":{"value":"10","unit":"seconds"},"output":{"schema":{"type":"object","required":["metadata","trigger"],"properties":{"trigger":{"type":"string"},"metadata":{"required":["name"],"properties":{"name":{"type":"string","ui_type":"image"}}}}},"sample":{"trigger":"get_insight","metadata":{"name":"user"},"data":{}}},"response_trigger":"get_name","input":{"schema":{"type":"object","required":["data","trigger"],"properties":{"trigger":{"type":"string"},"data":{"required":["request_type"],"properties":{"request_type":{"type":"string","ui_type":"image"}}}}},"sample":{"trigger":"get_insight","data":{"request_type":"get_name"}}}},"template_key":"get_name","_id":"59ea11183785c608bc893c45","created_ts":"2017-10-20T15:07:04.159","is_active":true}]};
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

  var _configureInsight = function(reqObj) {
    var req = {
      method: 'POST',
      url: '/api/insight/configure/',
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

  var _testInsight = function(reqObj) {
    var req = {
      method: 'POST',
      url: '/api/insight/test/',
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

    var insightServices = {
        getInsights:_getInsights,
        configureInsight:_configureInsight,
        testInsight:_testInsight
    };

    return insightServices;
});
