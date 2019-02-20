'use strict';

/**
 * @ngdoc function
 * @name platformConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the platformConsoleApp
 */
angular.module('console.source')
    .config(function ($provide) {
        $provide.decorator('$state', function ($delegate, $stateParams) {
            $delegate.forceReload = function () {
                return $delegate.go($delegate.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            };
            return $delegate;
        });
    })
    .controller('fileUploadController', function ($scope, $state, $rootScope, $location, $http, sourceService,caseManagementServices,bpmnServices) {
        var vm = this;

        vm.s3URL = '';
        vm.uploadedFiles = [];
        vm.newFiles = [];
        vm.loginData = JSON.parse(localStorage.getItem('userInfo'));
        var solution_id = '';

        $scope.getWorkflows = function () {
            var data = {"data":{},"solution_id": solution_id} ;
            caseManagementServices.getAllWorkFlows({'sess_id':vm.loginData.sess_id,"data": data,'access_token':vm.loginData.accesstoken}).then(function(response){
               if(response.data.status.success){
                 vm.workflowlist=response.data.metadata.workflows;
               }
               else{
                    $.UIkit.notify({
                       message : response.data.status.msg,
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                   });
               }
            });
            setTimeout(() => {
                vm.s3URL = sourceService.fetchs3URL()
            }, 0);
        };

        /* Method Desc - Get files Lists
            Method - Get
            Params - Session,solution */
        $scope.getFiles = function () {
            sourceService.getFilesdata(vm.loginData.sess_id, solution_id).then(function (result) {
                if(result.data.status==="success")
                vm.uploadedFiles = result.data.data;
                else
                vm.uploadedFiles = [];
            }, function () {
                $.UIkit.notify({
                    message: "Internal server error",//'Solution name has not been updated',
                    status: 'danger',
                    timeout: 2000,
                    pos: 'top-center'
                });
            });
        }
        vm.getSolutionId = function(){
           bpmnServices.getSolnId().then(function (response) {
                               if(response.data.status=='success'){
                                   solution_id = response.data.solution_id;
                                   $scope.getWorkflows();
                                   $scope.getFiles();
                               }
           },function(err){

           });
        };
        if(vm.loginData.user!=undefined){
           if(vm.loginData.user.solution_id!=undefined){
               solution_id = vm.loginData.user.solution_id;
               $scope.getWorkflows();
               $scope.getFiles();
           }else{
               vm.getSolutionId();
           }
        }else{
           vm.getSolutionId();
        }

        $scope.ingestFiles = function () {
            document.getElementById("ingestFile").style.width = "40%";
            var sidebarOverlay  = document.getElementsByClassName('sidebar-overlay')[0];
            sidebarOverlay.style.left = '0';
        }

        $scope.cancelIngest = function () {
            vm.newFiles = [];
            document.getElementById("ingestFile").style.width = "0%";
            var sidebarOverlay  = document.getElementsByClassName('sidebar-overlay')[0];
            sidebarOverlay.style.left = '-100%';
        };
        /* function trigger on browse files */
        $scope.uploadDic = function (files) {
            if (files == null)
                return;
            vm.newFiles = [];
            vm.files = files;
            for (var i = 0; i < files.length; i++) {
                vm.newFiles.push({
                    "name": files[i].name,
                    "uploaded_by": vm.loginData.username,
                    "updated_ts": new Date(),
                    "size": formatBytes(files[i].size), // file upload gives file size in bytes
                    "workflow_id": "",
                    "status": "uploading",
                    "useforall": false,
                    "source_type": "manualupload",
                    "solution_id": solution_id
                });
            }
        };

        /* function to get GB,MB,KB */

        function formatBytes(bytes) {
            if (bytes < 1024) return bytes + " Bytes";
            else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KB";
            else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MB";
            else return (bytes / 1073741824).toFixed(3) + " GB";
        }

        /* Method Desc - Get workflow Lists


        /* Method Desc - set selected workflow for all files
            */
        $scope.setworkflow = function (index, isset, workflow) {
            for (var i = 0; i < vm.newFiles.length; i++) {
                if (i != index) {
                    vm.newFiles[i].useforall = false;
                }
                vm.newFiles[i]["workflow_id"] = workflow;
            }
        }



        /* Method Desc : method for upload files to s3 folder */

        $scope.uploadfiles = function () {
           var newfiles = angular.copy(vm.newFiles);


           var isallproceed = true;
           /* need to handle uploading files using presigned URL's */
           for (var i = 0; i < newfiles.length; i++) {
               if (newfiles[i].workflow_id == undefined || newfiles[i].workflow_id == null || newfiles[i].workflow_id == "") {
                   $.UIkit.notify({
                       message: "work flow need to be assigned to file",
                       status: 'danger',
                       timeout: 2000,
                       pos: 'top-center'
                   });
                   isallproceed = false;
                   return;
               } else {
                if(newfiles[i].file_metadata==undefined){
                       newfiles[i].file_metadata = "{}";
                 }


                  try{
                        newfiles[i].file_metadata = JSON.parse(newfiles[i].file_metadata)
                   }
                  catch(err){
                        $.UIkit.notify({
                              message: "Please enter valid JSON" + newfiles[i].file_metadata,
                              status: 'danger',
                              timeout: 2000,
                              pos: 'top-center'
                         });
                        return ;
                    }

               }
           }
            for (var i = 0; i < newfiles.length; i++) {
            $scope.presignedUpload(newfiles[i], vm.files[i]);
            }
           if (isallproceed) {
               for(var i=0;i<newfiles.length;i++){
                   vm.uploadedFiles.unshift(newfiles[i]);
               };
               vm.newFiles = [];
               $scope.cancelIngest();
           }
       }

        /*Method Desc - upload files to s3bucket using presigned URL
          for multiple files we need to create multiple presigned URL's  */

        $scope.presignedUpload = function (fileObj, file) {

            var params = { file_name: file.name, upload_type: "direct", solution_id: "Test", method: "PUT", content_type: file.type, file_metadata:fileObj.file_metadata};
            var file_keyObj;
            if(file_keyObj){
                params.file_metadata= {};
            }
            vm.s3URL = sourceService.fetchs3URL();
            sourceService.uploadfile(vm.s3URL, params).then(function (response) {
                console.log(response.data.aws_url);
                $http.put(response.data.aws_url, file, { headers: { 'Content-Type': file.type } })
                    .success(function (resp) {
                        //Finally, We're done
                        console.log(fileObj);
                        for (var i = 0; i < vm.uploadedFiles.length; i++) {
                            if (vm.uploadedFiles[i].name == fileObj.name && vm.uploadedFiles[i].status == "uploading") {
                                vm.uploadedFiles[i].status = "success";
                                var path = response.data.aws_url.split("?")[0];
                                path =  path.replace(".s3.amazonaws.com","");
                                path =  path.replace("https","s3");
                                vm.uploadedFiles[i].file_path = path;
                                var savedfile = angular.copy(vm.uploadedFiles[i]);
                                // savedfile.workflow_id = parseInt(savedfile.workflow_id);
                                delete savedfile.useforall;

                                //trigger workflow
//                                var triggerparams = {
//                                    "solution_id": solution_id,
//                                    "workflow_id": vm.uploadedFiles[i].workflow,
//                                    "caseJson": {
//                                      "files": [
//                                        {
//                                          "path": vm.uploadedFiles[i].file_path
//                                        }
//                                      ],
//                                      "metadata": {
//                                        "triggered_by": "",
//                                        "source_type": "manualupload",
//                                        "source_id":""
//                                      }
//                                    }
//                                   };
//                                sourceService.triggerworkflow(triggerparams).then(function(response){
//                                    console.log(response);
//                                });

                                sourceService.savefileinfo(savedfile, vm.loginData.sess_id, solution_id).then(function () {
                                    console.log("updated");
                                }, function () {
                                    console.log("error");
                                });
                            }
                        }
                    })
                    .error(function (resp) {
                        for (var i = 0; i < vm.uploadedFiles.length; i++) {
                            if (vm.uploadedFiles[i].name == fileObj.name && vm.uploadedFiles[i].status == "uploading") {
                                vm.uploadedFiles[i].status = "failed";
                            }
                        }
                    });
            }, function () {
                console.log("error to get presigned URL");
            })
        }


        /*Method Desc - format the date  */
        $scope.formatDate = function (date) {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct",
                "Nov", "Dec"
            ];
            var newDate = new Date(date);
            var day = newDate.getDate();
            var monthIndex = newDate.getMonth();
            var year = newDate.getFullYear();
            var hours = newDate.getHours();
            var minutes = newDate.getMinutes();
            if (minutes < 10)
                minutes = '0' + minutes;
            if (day < 10)
                day = '0' + day;
            if (hours < 10)
                hours = '0' + hours;

            return day + ' ' + monthNames[monthIndex] + ' ' + year + ' @ ' + hours + ':' + minutes;
        };

        vm.removeFile = function(index){
            vm.newFiles.splice(index,1);
        };

    });
