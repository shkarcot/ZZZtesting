(function() {
	'use strict';
    angular.module('console.entitiesServices', [])
		.service('entitiesService', function($state,$q, $http,httpPayload) {

//		    var entityServiceObj = {
//		        "entities": [],
//		        "owlJson": [],
//		        "actions": [],
//		        "relations": [],
//		        "rules": [],
//		        "enrichments": []
//		    }
//		    var entityLoadFlag = true;
//		    var owlFlag = true;
//		    var actionFlag = true;
//		    var relationFlag = true;
//		    var ruleFlag = true;
//		    var enrichFlag = true;

            var _saveEntity = function(config) {
                var path = 'api/solnConfig/';
                var req = {
                      method: 'POST',
                      url: 'api/solnConfig/',
                      headers:httpPayload.getHeader(),
                      data:config.obj
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

            var _downloadDomainObjects = function(config) {
                var req = {
                      method: 'GET',
                      url: 'api/solnConfig/download/'+config.file_type,
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

            var _getEntities = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'api/solnConfig/',
                    headers:httpPayload.getHeader()
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
            var _getDomainObjects = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'api/solnConfig/domainmapping/',
                    headers: httpPayload.getHeader()
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

            var _getDomainObjectsList = function(data) {
                var deferred = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'api/solnConfig/domainobject/',
                    headers:httpPayload.getHeader()
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

            var _getOwlJson = function(data) {
                var deferred = $q.defer();
                var req = {
                      method: 'GET',
                      url: '/api/solnConfig/definitions/',
                      headers: httpPayload.getHeader()
                };
//                if(data.isCache && !owlFlag){
//                    deferred.resolve({
//                        data: entityServiceObj.owlJson
//                    });
//                }
//                else{
                    $http(req).success(function(data) {
//                      owlFlag = false;
//                      entityServiceObj.owlJson = data;
                      deferred.resolve({
                        data: data
                      });
                    }).error(function(data) {
                      deferred.reject({
                        error: data
                      });
                    });
//                }

                return deferred.promise;
            };


            var _syncLearnedAttributes = function(config) {

                var req = {
                      method: 'POST',
                      url: 'api/solnConfig/entity/sync/',
                      headers:httpPayload.getHeader(),
                      data:config.obj
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

            var _getAttributes = function(id) {

               var deferred = $q.defer();
                var req = {
                      method: 'GET',
                      url: 'api/solnConfig/getEntities/',
                      //url:'scripts/jsons/entities.json',
                      headers: httpPayload.getHeader()
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

            var _deleteEntity = function(data) {
                var path = 'api/solnConfig/'+data;
                 var req = {
                      method: 'DELETE',
                      url: 'api/solnConfig/',
                      headers:httpPayload.getHeader(),
                      data:{'entity_name':data.obj}
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
                      headers:httpPayload.getHeader(),
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


            var _saveAction = function(config) {

                var req = {
                      method: 'POST',
                      url: 'api/solnConfig/action/',
                      headers:httpPayload.getHeader(),
                      data:config.obj
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

            var _getActions = function(data) {

                var deferred = $q.defer();
                var req = {
                      method: 'GET',
                      url: 'api/solnConfig/action/',
                      //url:'scripts/jsons/entities.json',
                      headers: httpPayload.getHeader()
                };
//                if(data.isCache && !actionFlag){
//                    deferred.resolve({
//                        data: entityServiceObj.actions
//                    });
//                }
//                else{
                    $http(req).success(function(data) {
//                      entityServiceObj.actions = data;
//                      actionFlag = false;
                      deferred.resolve({
                        data: data
                      });
                    }).error(function(data) {
                      deferred.reject({
                        error: data
                      });
                    });
//                }

                return deferred.promise;
            };

            var _deleteAction = function(data) {

                var deferred = $q.defer();
                var req = {
                      method: 'DELETE',
                      url: 'api/solnConfig/action/',
                      //url:'scripts/jsons/entities.json',
                      headers: httpPayload.getHeader(),
                      data:{'action_name':data.obj}
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

            var _saveRelation = function(config) {

                var req = {
                      method: 'POST',
                      url: 'api/solnConfig/relationship/',
                      headers:httpPayload.getHeader(),
                      data:config.obj
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

            var _getRelations = function(data) {

                var deferred = $q.defer();
                var req = {
                      method: 'GET',
                      url: 'api/solnConfig/relationship/',
                      //url:'scripts/jsons/entities.json',
                      headers:httpPayload.getHeader()
                };
//                if(data.isCache && !relationFlag){
//                    deferred.resolve({
//                        data: entityServiceObj.relations
//                    });
//                }
//                else{
                    $http(req).success(function(data) {
//                      entityServiceObj.relations = data;
//                      relationFlag = false;
                      deferred.resolve({
                        data: data
                      });
                    }).error(function(data) {
                      deferred.reject({
                        error: data
                      });
                    });
//                }

                return deferred.promise;
            };

            var _deleteRelation = function(data) {

                var deferred = $q.defer();
                var req = {
                      method: 'DELETE',
                      url: 'api/solnConfig/relationship/',
                      //url:'scripts/jsons/entities.json',
                      headers: httpPayload.getHeader(),
                      data:data.obj.filter_obj
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

            var _saveRule = function(config) {

                var req = {
                      method: 'POST',
                      url: 'api/rules/',
                      headers: httpPayload.getHeader(),
                      data:config.obj
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

                var deferred = $q.defer();
                var req = {
                      method: 'GET',
                      url: 'api/rules/',
                      headers:httpPayload.getHeader()
                };

//                if(data.isCache && !ruleFlag){
//                    deferred.resolve({
//                        data: entityServiceObj.rules
//                    });
//                }
//                else{
                    $http(req).success(function(data) {
//                      entityServiceObj.rules = data;
//                      ruleFlag = false;
                      deferred.resolve({
                        data: data
                      });
                    }).error(function(data) {
                      deferred.reject({
                        error: data
                      });
                    });
//                }

                return deferred.promise;
            };

            var _testRuleExecution = function(config) {

                var req = {
                      method: 'POST',
                      url: 'api/rules/test/',
                      headers: httpPayload.getHeader(),
                      data:config.obj
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

            var _getEnrichments = function(data) {

                var deferred = $q.defer();
                var req = {
                      method: 'GET',
                      url: 'api/solnConfig/enrichments/',
                      headers:httpPayload.getHeader()
                };

//                if(data.isCache && !enrichFlag){
//                    deferred.resolve({
//                        data: entityServiceObj.enrichments
//                    });
//                }
//                else{
                    $http(req).success(function(data) {
//                      entityServiceObj.enrichments = data;
//                      enrichFlag = false;
                      deferred.resolve({
                        data: data
                      });
                    }).error(function(data) {
                      deferred.reject({
                        error: data
                      });
                    });
//                }

                return deferred.promise;
            };

            var _getJobStatus = function(reqObj) {
                var req = {
                  method: 'GET',
                  url: '/api/solnConfig/status/'+reqObj.data,
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

            var _saveEntityLinkingFeedback = function(data) {
                var req = {
                      method: 'POST',
                      url: 'api/feedback/entity/',
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

            var _saveCompleteReviewEntLink = function(data) {
                var req = {
                      method: 'GET',
                      url: 'api/completeReview/entity/'+data.data+'/',
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

            var entitiesService = {
                saveEntity: _saveEntity,
                getEntities: _getEntities,
                saveAction:_saveAction,
                getActions:_getActions,
                deleteAction:_deleteAction,
                saveRelation:_saveRelation,
                getRelations:_getRelations,
                deleteRelation:_deleteRelation,
                getOwlJson:_getOwlJson,
                syncLearnedAttributes:_syncLearnedAttributes,
                getAttributes : _getAttributes,
                deleteEntity:_deleteEntity,
                postTenants:_postTenants,
                saveRule:_saveRule,
                getRules:_getRules,
                testRuleExecution:_testRuleExecution,
                getEnrichments:_getEnrichments,
                downloadDomainObjects:_downloadDomainObjects,
                getDomainObjects:_getDomainObjects,
                getDomainObjectsList:_getDomainObjectsList,
                getJobStatus:_getJobStatus,
                saveEntityLinkingFeedback:_saveEntityLinkingFeedback,
                saveCompleteReviewEntLink:_saveCompleteReviewEntLink
            };

            return entitiesService;
		});
})();