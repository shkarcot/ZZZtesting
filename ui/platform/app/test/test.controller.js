module.exports = ['$scope', '$state', '$rootScope', '$stateParams', 'testService', '$http', 'Upload',
    function ($scope, $state, $rootScope, $stateParams, testService, $http, Upload) {
        'use strict';
        var vm = this;
        $scope.testObj = {};

        var testJsonObj = {
            "validateDoObj": { "entity_relation": { "name": "eee1", "cardinality": "1" }, "ts": "2018-09-03T05:50:50", "solution_id": "default_e39f4b5c-0dc5-40d9-98b5-57a4b8dc25fb", "entity_type": "entity", "synonym": [], "type": "entity", "ner_type": "", "entity_synonym": [], "entity_name": "eee1", "key_name": "eee1", "attributes": [{ "key_name": "httr", "type": "related_entity", "ner_type": "", "rule_id": [], "synonym": [], "entity_relation": { "cardinality": "1", "name": "httr" }, "is_new": true }, { "key_name": "dfgh", "type": "related_entity", "ner_type": "GPE", "rule_id": [], "synonym": [], "entity_relation": { "cardinality": "1", "name": "dfgh" } }, { "key_name": "attr212", "type": "string", "ner_type": "", "rule_id": [], "synonym": [] }] }
        }

        $scope.testRun = function () {
            $scope.successShow = false;
            $scope.failureShow = false;
            if ($stateParams.name == "entity") {
                if ($scope.testObj.testCaseName == "validateDoObj") {
                    var msg = $rootScope.testCaseForEntities($scope.testObj.testCaseName, JSON.parse($scope.testObj.requestJson));
                    if (msg == "") {
                        $scope.successShow = true;
                        $scope.failureShow = false;
                    }
                    else {
                        $scope.failureShow = true;
                        $scope.successShow = false;
                        $scope.validateMsg = msg;
                    };
                }
            }
        };

        $scope.uploadFile = function (file) {
            if (file == null)
                return;
            // if(file!=null){
            //       $scope.browseFileName = file.name;
            //       $scope.browseFile = file;
            //       var requestObj =  {
            //                             "file_name":file.name,
            //                             "solution_id":"Test",
            //                             "upload_type":"dataset"
            //                         };
            //       testService.getPresignedUrl({"data":requestObj}).then(function(response){
            //             if(response.data.status=="success"){
            //                 console.log(response.data);
            //                 $scope.preSignedUrl = response.data.aws_url;
            //             }
            //             else{
            //                 $.UIkit.notify({
            //                    message : response.data.msg,
            //                    status  : 'warning',
            //                    timeout : 3000,
            //                    pos     : 'top-center'
            //                 });
            //             }
            //       },function(err){
            //             $.UIkit.notify({
            //                message : "Internal server error",
            //                status  : 'danger',
            //                timeout : 3000,
            //                pos     : 'top-center'
            //             });
            //       });
            // }

            //   var requestObj =  {
            //                         "file_name":file.name,
            //                         "solution_id":"Test",
            //                         "upload_type":"dataset"
            //                     };
            $http.post('http://console.d-1109.stack.dev.xpms.ai:8080/api/presignedurl/',
                { file_name: file.name, upload_type: file.type, solution_id: "Test", method: "PUT", content_type: file.type })
                .success(function (resp) {
                    // Perform The Push To S3
                    $http.put(resp.aws_url, file,{headers: {'Content-Type': file.type}})
                        .success(function (resp) {
                            //Finally, We're done
                            alert('Upload Done!')
                        })
                        .error(function (resp) {
                            alert("Occurred Attaching Your File");
                        });
                })
                .error(function (resp) {
                    alert("An Error Occurred Attaching Your File");
                });



        };

        vm.sendFile = function () {
            var file = $scope.browseFile;
            //        file.upload = Upload.upload({
            //              url: $scope.preSignedUrl,
            //              data: $scope.browseFile,
            //              method: 'PUT',
            //              headers: {"Content-Type": $scope.browseFile.type}
            //         });


            var config = {
                url: $scope.preSignedUrl,
                headers: {
                    "Content-Type": $scope.browseFile.type != '' ? $scope.browseFile.type : 'application/octet-stream'
                },
                method: 'PUT',
                data: $scope.browseFile
            };
            Upload.http(config);



            //         file.upload.then(function (response) {
            //             if(response.data.status=="success"){
            //                alert("success");
            //             }
            //             alert("success");
            //         }, function (response) {
            //              alert("error" + response);
            //         });
        };


    }];