(function() {
	'use strict';
    angular.module('console.processDetailsServices', [])
		.service('processDetailsServices', function($state,$q, $http,httpPayload) {

            var _getProcessList = function(data) {
            var req = {
                  method: 'GET',
                  url: 'api/getData/'+data.days+'/'+data.documentType+'/'+data.searchKey,
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

          var _postProcessList = function(recId,page,sess_id) {
            var req = {
                  method: 'GET',
                  url: 'api/documents/'+recId+'/'+page+'/',
                  headers: httpPayload.getHeader(),
                  data: recId
            };
            var deferred = $q.defer();
            //var data1 = {"status": "success", "data": [{"value_coordinates": {"x1": 81, "x2": 1546, "y1": 405, "y2": 509}, "has_label": false, "is_deleted": false, "is_variable_field": false, "page_no": 1, "solution_id": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7", "map_to": "Claim.other_details.insurance_type", "type": "omr", "created_ts": "2018-04-05T08:44:39.604730", "groups": [{"is_multiOption": false, "options": [{"label": "MEDICARE", "value_coordinates": {"x1": 83, "x2": 131, "y1": 449, "y2": 498}}, {"label": "MEDICAID", "value_coordinates": {"x1": 284, "x2": 334, "y1": 450, "y2": 498}}, {"label": "TRICARE", "value_coordinates": {"x1": 495, "x2": 546, "y1": 450, "y2": 500}}, {"label": "CHAMPVA", "value_coordinates": {"x1": 767, "x2": 816, "y1": 448, "y2": 497}}, {"label": "GROUP HEALTH PLAN", "value_coordinates": {"x1": 975, "x2": 1024, "y1": 448, "y2": 499}}, {"label": "FECA BLK LUNG", "value_coordinates": {"x1": 1215, "x2": 1265, "y1": 446, "y2": 499}}, {"label": "OTHER", "value_coordinates": {"x1": 1395, "x2": 1446, "y1": 449, "y2": 499}}]}], "section_id": "default", "element_id": "a03be9e2-c97a-4f1f-a844-de217fd362d2", "is_doc_var": false, "domain_mapping": "Claim.other_details.insurance_type", "template_id": "f2b50865-c9cb-4f6f-a625-246f36147438", "is_multiGroup": false, "updated_ts": "2018-04-05T08:44:39.604722"}, {"value_coordinates": {"x1": 940, "x2": 1545, "y1": 638, "y2": 703}, "has_label": false, "is_deleted": false, "is_variable_field": false, "page_no": 1, "solution_id": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7", "map_to": "Claim.Patient.relationship_to_insured", "type": "omr", "created_ts": "2018-04-05T08:46:29.100651", "groups": [{"is_multiOption": false, "options": [{"label": "Self", "value_coordinates": {"x1": 1039, "x2": 1088, "y1": 649, "y2": 699}}, {"label": "Spouse", "value_coordinates": {"x1": 1189, "x2": 1239, "y1": 648, "y2": 702}}, {"label": "Child", "value_coordinates": {"x1": 1305, "x2": 1357, "y1": 650, "y2": 702}}, {"label": "Other", "value_coordinates": {"x1": 1457, "x2": 1505, "y1": 646, "y2": 699}}]}], "section_id": "default", "element_id": "e1513e3c-d3d6-45d5-b447-0dfa3ee46af0", "is_doc_var": false, "domain_mapping": "Claim.Patient.relationship_to_insured", "template_id": "f2b50865-c9cb-4f6f-a625-246f36147438", "is_multiGroup": false, "updated_ts": "2018-04-05T08:46:29.100642"}, {"value_coordinates": {"x1": 1270, "x2": 1547, "y1": 541, "y2": 600}, "has_label": false, "is_deleted": false, "is_variable_field": false, "page_no": 1, "solution_id": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7", "map_to": "Claim.Patient.sex", "type": "omr", "created_ts": "2018-04-05T08:47:33.664522", "groups": [{"is_multiOption": false, "options": [{"label": "M", "value_coordinates": {"x1": 1306, "x2": 1355, "y1": 547, "y2": 596}}, {"label": "F", "value_coordinates": {"x1": 1456, "x2": 1501, "y1": 548, "y2": 594}}]}], "section_id": "default", "element_id": "31d04f55-f2b9-4952-a6f4-fc0180fedfc1", "is_doc_var": false, "domain_mapping": "Claim.Patient.sex", "template_id": "f2b50865-c9cb-4f6f-a625-246f36147438", "is_multiGroup": false, "updated_ts": "2018-04-05T08:47:33.664512"}, {"value_coordinates": {"x1": 2030, "x2": 2457, "y1": 1037, "y2": 1107}, "has_label": false, "is_deleted": false, "is_variable_field": false, "page_no": 1, "solution_id": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7", "map_to": "Claim.Insured.sex", "type": "omr", "created_ts": "2018-04-05T08:48:35.090515", "groups": [{"is_multiOption": false, "options": [{"label": "M", "value_coordinates": {"x1": 2086, "x2": 2140, "y1": 1047, "y2": 1097}}, {"label": "F", "value_coordinates": {"x1": 2300, "x2": 2359, "y1": 1051, "y2": 1100}}]}], "section_id": "default", "element_id": "49c934fb-8273-44f1-aa23-d47ab887d193", "is_doc_var": false, "domain_mapping": "Claim.Insured.sex", "template_id": "f2b50865-c9cb-4f6f-a625-246f36147438", "is_multiGroup": false, "updated_ts": "2018-04-05T08:48:35.090506"}, {"value_coordinates": {"x1": 80, "x2": 945, "y1": 601, "y2": 704}, "has_label": true, "is_deleted": false, "label_coordinates": {"x1": 80, "x2": 523, "y1": 602, "y2": 638}, "page_no": 1, "is_variable_field": false, "solution_id": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7", "map_to": "Claim.Patient.address", "type": "field", "created_ts": "2018-04-05T08:51:14.812790", "section_id": "default", "element_id": "2b689c85-f45d-41d8-a59e-4d8b145fbad7", "is_doc_var": false, "domain_mapping": "Claim.Patient.address", "template_id": "f2b50865-c9cb-4f6f-a625-246f36147438", "updated_ts": "2018-04-05T08:51:14.812782"}, {"value_coordinates": {"x1": 79, "x2": 834, "y1": 704, "y2": 800}, "has_label": true, "is_deleted": false, "label_coordinates": {"x1": 79, "x2": 177, "y1": 703, "y2": 746}, "page_no": 1, "is_variable_field": false, "solution_id": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7", "map_to": "Claim.Patient.city", "type": "field", "created_ts": "2018-04-05T08:51:58.369792", "section_id": "default", "element_id": "f59fd9bb-4a64-49c9-b222-9e797d729dc9", "is_doc_var": false, "domain_mapping": "Claim.Patient.city", "template_id": "f2b50865-c9cb-4f6f-a625-246f36147438", "updated_ts": "2018-04-05T08:51:58.369784"}, {"value_coordinates": {"x1": 80, "x2": 946, "y1": 508, "y2": 603}, "has_label": true, "is_deleted": false, "label_coordinates": {"x1": 81, "x2": 774, "y1": 507, "y2": 543}, "page_no": 1, "is_variable_field": false, "solution_id": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7", "map_to": "Claim.Patient.name", "type": "field", "created_ts": "2018-04-05T08:54:55.532637", "section_id": "default", "element_id": "d982a731-8cc8-4d30-99d7-4733f37901f9", "is_doc_var": false, "domain_mapping": "Claim.Patient.name", "template_id": "f2b50865-c9cb-4f6f-a625-246f36147438", "updated_ts": "2018-04-05T08:54:55.532629"}, {"value_coordinates": {"x1": 79, "x2": 472, "y1": 798, "y2": 906}, "has_label": true, "is_deleted": false, "label_coordinates": {"x1": 80, "x2": 248, "y1": 799, "y2": 837}, "page_no": 1, "is_variable_field": false, "solution_id": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7", "map_to": "Claim.Patient.zip_code", "type": "field", "created_ts": "2018-04-05T08:55:36.747710", "section_id": "default", "element_id": "a82c4459-4798-4a30-a079-d6cb2c363064", "is_doc_var": false, "domain_mapping": "Claim.Patient.zip_code", "template_id": "f2b50865-c9cb-4f6f-a625-246f36147438", "updated_ts": "2018-04-05T08:55:36.747701"}, {"value_coordinates": {"x1": 830, "x2": 945, "y1": 701, "y2": 799}, "has_label": true, "is_deleted": false, "label_coordinates": {"x1": 835, "x2": 941, "y1": 705, "y2": 740}, "page_no": 1, "is_variable_field": false, "solution_id": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7", "map_to": "Claim.Patient.state", "type": "field", "created_ts": "2018-04-05T08:56:14.838555", "section_id": "default", "element_id": "750d075e-ee56-47c2-92ee-fae6d2b3b075", "is_doc_var": false, "domain_mapping": "Claim.Patient.state", "template_id": "f2b50865-c9cb-4f6f-a625-246f36147438", "updated_ts": "2018-04-05T08:56:14.838546"}, {"value_coordinates": {"x1": 467, "x2": 943, "y1": 799, "y2": 907}, "has_label": true, "is_deleted": false, "label_coordinates": {"x1": 470, "x2": 896, "y1": 801, "y2": 837}, "page_no": 1, "is_variable_field": false, "solution_id": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7", "map_to": "Claim.Patient.telephone", "type": "field", "created_ts": "2018-04-05T08:57:19.787178", "section_id": "default", "element_id": "e4a3b991-b5ee-4af2-aa65-91ac706beea6", "is_doc_var": false, "domain_mapping": "Claim.Patient.telephone", "template_id": "f2b50865-c9cb-4f6f-a625-246f36147438", "updated_ts": "2018-04-05T08:57:19.787170"}, {"value_coordinates": {"x1": 1544, "x2": 1935, "y1": 802, "y2": 905}, "has_label": true, "is_deleted": false, "label_coordinates": {"x1": 1543, "x2": 1696, "y1": 801, "y2": 835}, "page_no": 1, "is_variable_field": false, "solution_id": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7", "map_to": "Claim.Insured.zip_code", "type": "field", "created_ts": "2018-04-05T08:58:55.448605", "section_id": "default", "element_id": "e75ef50b-d162-4b94-988b-9acc64051652", "is_doc_var": false, "domain_mapping": "Claim.Insured.zip_code", "template_id": "f2b50865-c9cb-4f6f-a625-246f36147438", "updated_ts": "2018-04-05T08:58:55.448598"}, {"value_coordinates": {"x1": 1541, "x2": 2260, "y1": 700, "y2": 800}, "has_label": true, "is_deleted": false, "label_coordinates": {"x1": 1542, "x2": 1656, "y1": 701, "y2": 741}, "page_no": 1, "is_variable_field": false, "solution_id": "ranger1_5f2a66b5-382a-4a37-8161-01a7491a06a7", "map_to": "Claim.Insured.city", "type": "field", "created_ts": "2018-04-05T09:00:40.949395", "section_id": "default", "element_id": "4f8da4c7-f1e5-4cb5-8ff2-072a70d9a1f4", "is_doc_var": false, "domain_mapping": "Claim.Insured.city", "template_id": "f2b50865-c9cb-4f6f-a625-246f36147438", "updated_ts": "2018-04-05T09:00:40.949385"}]};
            // deferred.resolve({
            //    data: data1
            // });

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

          var _getListOfGroups = function(recId,sess_id) {
            var req = {
                  method: 'GET',
                  url: 'api/getInsights/'+recId,
                  headers: httpPayload.getHeader(),
                  data: recId
            };
            var deferred = $q.defer();

//            deferred.resolve({
//                data: tempObj
//            });

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

          var _getFieldLevelData = function(obj) {
            var req = {
                  method: 'GET',
                  url: 'api/chart/one/'+obj.days,
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

          var _getDocumentLevelData = function(obj) {
            var req = {
                  method: 'GET',
                  url: 'api/chart/two/'+obj.days,
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

          var _getListDays = function(obj) {
            var req = {
                  method: 'GET',
                  url: 'api/selectors/one/',
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

          var _getUrls = function(obj) {
            var req = {
                  method: 'GET',
                  url: 'api/pipeline/settings/',
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

          var _getNifiStatus = function(obj) {
            var req = {
                  method: 'GET',
                  url: 'api/pipeline/status/',
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

          var _getDocumentTypesList = function(data) {
            var req = {
                  method: 'GET',
                  url: 'api/documentTypes/',
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

          var processDetailsServices = {
            getProcessList:_getProcessList,
            postProcessList:_postProcessList,
            getListOfGroups:_getListOfGroups,
            getFieldLevelData:_getFieldLevelData,
            getDocumentLevelData:_getDocumentLevelData,
            getListDays:_getListDays,
            getUrls:_getUrls,
            getNifiStatus:_getNifiStatus,
            getDocumentTypesList:_getDocumentTypesList
          };

          return processDetailsServices;
		});
})();