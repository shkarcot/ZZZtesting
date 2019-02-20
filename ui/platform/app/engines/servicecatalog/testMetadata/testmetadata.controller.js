/*module.exports = ['$scope', '$state', '$rootScope',
                function($scope, $state, $rootScope) {
	'use strict';

}];*/

(function() {
	'use strict';

	module.exports = ['$state','$rootScope','$scope',
	function($state,$rootScope,$scope) {
		var vm = this;
        $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
        $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
        $scope.msg="";
        $scope.configureMetadata=function(){
          $scope.msg="Extract document metadata has been configured.";
        };
        vm.extractMetadata={
                            "capabilities":{

                                "extract_document_metadata":{
                                "name": "Extract Document Metadata",
                                "description": "",
                                "timeout": {
                                  "unit": "seconds",
                                  "value": "10"
                                },
                                "request_trigger": "extract_document_metadata",
                                "response_trigger": "extracted_document_metadata",
                                "request_schema": {
                                  "type": "object",
                                  "properties": {
                                    "request_id": {
                                      "type": "string"
                                    },
                                    "solution_id": {
                                      "type": "string"
                                    },
                                    "data": {
                                      "type": "object",
                                      "properties": {
                                        "document_id": {
                                          "type": "string"
                                        },
                                        "file_path": {
                                          "type": "string"
                                        }
                                      },
                                      "required": [
                                        "file_path",
                                        "document_id"
                                      ]
                                    },
                                    "metadata": {
                                      "type": "object",
                                      "properties": {
                                        "insight_id": {
                                          "type": "string"
                                        }
                                      }
                                    },
                                    "status": {
                                      "type": "object"
                                    },
                                    "trigger": {
                                      "enum": [
                                        "extract_document_metadata"
                                      ]
                                    }
                                  },
                                  "required": [
                                    "request_id",
                                    "solution_id",
                                    "trigger",
                                    "data",
                                    "metadata"
                                  ]
                                },
                                "response_schema": {
                                  "type": "object",
                                  "properties": {
                                    "request_id": {
                                      "type": "string"
                                    },
                                    "solution_id": {
                                      "type": "string"
                                    },
                                    "metadata": {
                                      "type": "object",
                                      "properties": {
                                        "document_metadata": {
                                          "type": "object",
                                          "properties": {
                                            "mime_type": {
                                              "type": "string"
                                            }
                                          },
                                          "required": [
                                            "mime_type"
                                          ]
                                        }
                                      },
                                      "required": [
                                        "document_metadata"
                                      ]
                                    },
                                    "data": {
                                      "type": "object",
                                      "properties": {
                                        "insight_id": {
                                          "type": "string"
                                        }
                                      }
                                    },
                                    "status": {
                                      "type": "object"
                                    },
                                    "trigger": {
                                      "enum": [
                                        "extract_document_metadata"
                                      ]
                                    }
                                  },
                                  "required": [
                                    "request_id",
                                    "solution_id",
                                    "trigger",
                                    "data",
                                    "metadata"
                                  ]
                                },
                                "microservice": "document-microservice"
                              }
                            }
                           };


    }];

})();