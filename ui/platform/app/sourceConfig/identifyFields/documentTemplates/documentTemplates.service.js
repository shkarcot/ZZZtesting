(function() {
	'use strict';
    angular.module('console.documentServices', [])
	.service('documentService', function($state,$q, $http,httpPayload) {
        var documentService = {
           getDocumentHeldDocuments:_getDocumentHeldDocuments,
           getDocuments:_getDocuments,
           getDocumentsUnknown: _getDocumentsUnknown,
           getFieldsInfo:_getFieldsInfo,
           deleteField:_deleteField,
           sendDocument:_sendDocument,
           getDocumentDetails:_getDocumentDetails,
           removeHeldDocumentList:_removeHeldDocumentList,
           saveConfigurations:_saveConfigurations,
           removeTemplate: _removeTemplate,
           saveRule: _saveRule,
           getRule: _getRule,
           getRuleConfig: _getRuleConfig,
           saveTransformationRule:_saveTransformationRule,
           getTransformationRule:_getTransformationRule,
           deleteTransformationRule:_deleteTransformationRule,
           deleteSTRule:_deleteSTRule,
           testTransformationRule:_testTransformationRule,
           saveUnknownTemplate:_saveUnknownTemplate,
           getUnknownTestTemplates:_getUnknownTestTemplates,
           getTestHierarchyData:_getTestHierarchyData,
           getTrainList:_getTrainList,
           sendTrain:_sendTrain,
           saveCustomRule:_saveCustomRule,
           deleteCustomRule:_deleteCustomRule,
           getCustomConditionAndAction:_getCustomConditionAndAction,
           testConditionAndAction: _testConditionAndAction,
           sendFeedbackUnstruct: _sendFeedbackUnstruct,

           getEntityLinks:_getEntityLinks,
           saveEntityLinkingFeedback:_saveEntityLinkingFeedback,
           acceptEntityLinking:_acceptEntityLinking,
           saveCompleteReviewEntLink:_saveCompleteReviewEntLink,

           saveThresholds:_saveThresholds,
           getMappingEntities:_getMappingEntities
        };

        return documentService;

        function _getDocumentHeldDocuments(sess_id) {
          var req = {
                method: 'GET',
                url: 'api/documentTemplates/',
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

        function _getFieldsInfo(sess_id,template_id,page_no) {
          var req = {
                method: 'GET',
                url: 'api/templateElements/'+template_id+"/"+page_no+"/",
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

        function _getDocuments(sess_id,data) {
          var req = {
                method: 'POST',
                url: 'api/get/template/known/',
                headers:httpPayload.getHeader(),
                data : data

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

        function _getDocumentsUnknown(sess_id,data) {
          var req = {
                method: 'POST',
                url: 'api/get/template/unknown/',
                headers:httpPayload.getHeader(),
                data : data

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

        function _deleteField(sess_id,data) {
          var req = {
                method: 'POST',
                url: 'api/delete/template/elements/',
                headers:httpPayload.getHeader(),
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


        function  _sendDocument(sess_id,data) {
          var req = {
                method: 'POST',
                url: 'api/publish/template/',
                headers:httpPayload.getHeader(),
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

        function  _getDocumentDetails(sess_id,id) {
          var req = {
                method: 'GET',
                url: 'api/get/template/'+id,
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

        function  _saveConfigurations(sess_id,obj) {
          var req = {
                method: 'POST',
                url: 'api/save/template/elements/',
                headers:httpPayload.getHeader(),
                data:obj
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

        function  _removeHeldDocumentList(sess_id,data) {
          var req = {
                method: 'DELETE',
                url: 'api/documentTemplates/',
                headers:httpPayload.getHeader(),
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

        function _removeTemplate(sess_id,data) {
          var req = {
                method: 'POST',
                url: 'api/delete/template/',
                headers:httpPayload.getHeader(),
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

        function  _saveRule(sess_id,obj) {
          var req = {
                method: 'POST',
                url: 'api/jrules/',
                headers:httpPayload.getHeader(),
                data:obj
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

        function  _getRule(sess_id,obj) {
          var req = {
                method: 'GET',
                url: 'api/jrules/',
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

        function  _saveTransformationRule(sess_id,obj) {
          var req = {
                method: 'POST',
                url: 'api/documentTemplates/postprocess/'+obj.template_id+'/',
                headers:httpPayload.getHeader(),
                data:obj.rule
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

        function  _getTransformationRule(obj) {
          var req = {
                method: 'GET',
                url: 'api/documentTemplates/postprocess/'+obj.template_id+'/',
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

        function  _getRuleConfig(sess_id,obj) {
          var req = {
                method: 'GET',
                url: 'api/jrules/config/',
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

        function _deleteTransformationRule(sess_id,obj) {
          var data = {"rule_id":obj.rule_id};
          var req = {
                method: 'DELETE',
                url: 'api/documentTemplates/postprocess/'+obj.template_id+'/',
                headers:httpPayload.getHeader(),
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

        function _deleteSTRule(sess_id,obj) {
          var req = {
                method: 'DELETE',
                url: 'api/jrules/',
                headers:httpPayload.getHeader(),
                data:obj
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

        function  _testTransformationRule(sess_id,obj) {
          var req = {
                method: 'POST',
                url: 'api/jrules/test/',
                headers:httpPayload.getHeader(),
                data:{"source":obj.source,"rule":obj.rule}
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

        function  _saveUnknownTemplate(sess_id,obj) {
          var req = {
                method: 'POST',
                url: 'api/save/template/unknown/',
                headers:httpPayload.getHeader(),
                data:obj
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

        function  _getUnknownTestTemplates(sess_id,id) {
          var req = {
                method: 'GET',
                url: 'api/documentTemplates/test/'+id+'/',
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

        function  _getTestHierarchyData(sess_id,id) {
          var req = {
                method: 'GET',
                url: 'api/testdocuments/'+id+'/',
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

        function  _sendFeedbackUnstruct(sess_id,id,obj) {
          var req = {
                method: 'POST',
                url: 'api/testdocuments/'+id+'/',
                headers:httpPayload.getHeader(),
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

        function  _getTrainList(sess_id,id) {
          var req = {
                method: 'GET',
                url: 'api/documentTemplates/train/upload/'+id+'/',
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

        function  _sendTrain(sess_id,data) {
          var req = {
                method: 'POST',
                url: 'api/documentTemplates/train/trigger/',
                headers:httpPayload.getHeader(),
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

        function  _saveCustomRule(sess_id,obj) {
          var req = {
                method: 'POST',
                url: 'api/jrules/custom/',
                headers:httpPayload.getHeader(),
                data:obj
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

        function  _deleteCustomRule(sess_id,obj) {
          var req = {
                method: 'DELETE',
                url: 'api/jrules/custom/',
                headers:httpPayload.getHeader(),
                data:obj
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

        function  _getCustomConditionAndAction(sess_id,type) {
          var req = {
                method: 'GET',
                url: 'api/jrules/custom/'+type+'/',
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

        function _testConditionAndAction(sess_id,obj) {
          var req = {
                method: 'POST',
                url: 'api/jrules/customtest/',
                headers:httpPayload.getHeader(),
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

        function _getEntityLinks(id,sessId) {
            var req = {
                  method: 'GET',
                  url: 'api/entitylink/'+id+'/',
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
        function _saveEntityLinkingFeedback(data) {
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

          function _acceptEntityLinking(data) {
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

          function _saveCompleteReviewEntLink(data) {
            var req = {
                  method: 'GET',
                  url: 'api/completeReview/entity/'+data.data+'/',
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

          function _saveThresholds(data) {
            var req = {
                  method: 'POST',
                  url: 'api/thresholds/',
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

          function _getMappingEntities(id,sessId) {
            var req = {
                  method: 'GET',
                  url: 'api/mapping_entities/'+id+'/',
                  headers:httpPayload.getHeader()
            };
            var deferred = $q.defer();

            /*var data ={"status":"success","msg":"objects formed Successfully","data":["provider.email","provider.name","provider.qcare_id","provider.actual_date_recd","provider.start_date","provider.qcare_records","provider.pdo_updates_required","provider.retroactivity_contract_type","provider.image_number","provider.responsible_party","provider.retroactivity_result","provider.contract_type","provider.demographic","provider.tracking","provider.csf_purpose","provider.address_type","provider.provider_type_comments","provider.provider_type","provider.provider_group_name","provider.pho_designation","provider.medicare_number","provider.dea_expiration","provider.dea_number","provider.location_information_phone","provider.country","provider.market","provider.termination_reason","provider.specialty","provider.state_license","provider.covering_physician","provider.practictioner_language","provider.staff_language","provider.member_move","provider.billing_existing_contract_id","provider.billing_contract_status","provider.billing_format","provider.contract_other_comments","provider.contract_language_non_standard","provider.contract_language_comments","provider.contract_language","provider.contract_reimbursement_pa_exceptions","provider.contract_reimbursement_default_pricing","provider.contract_reimbursement_comments","provider.contract_reimbursement_non_standard","provider.contract_reimbursement_hca","provider.special_instructions","provider.email_content","provider.tax_id","provider.first_name","provider.last_name","provider.middle_name","provider.professional_title","provider.reports_to","provider.suffix","provider.account_name","provider.individual_npi","provider.business_intent"]};
            deferred.resolve({
              data: data
            });*/
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






	});
})();