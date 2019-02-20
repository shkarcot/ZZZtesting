(function() {
	'use strict';

	module.exports = ['$state','$rootScope','$scope','configServices','$stateParams','$location', 'Upload', '$timeout', 'ngDialog',
	function($state,$rootScope,$scope,configServices,$stateParams,$location, Upload, $timeout, ngDialog) {
		var vm = this;
        if($stateParams.serviceObj==null){
            vm.servicesObj = JSON.parse(localStorage.getItem('servicesObj'));
            //$state.go("app.services");
        }else{
            vm.servicesObj=$stateParams.serviceObj;
        }
        vm.serviceName= vm.servicesObj.display_name;

        $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
        vm.sess_id= $scope.loginData.sess_id;
        if($scope.loginData.user==undefined){
                $scope.loginData.user = {}
                $scope.loginData.user.solution_name = "";
                $scope.loginData.user.solution_id = "";
        }
        $scope.solution_id=$scope.loginData.user.solution_id;
        vm.extractHocrKey = vm.servicesObj.service_name;
        if($scope.loginData.user.hocr_type != undefined){
            vm.hocrType = $scope.loginData.user.hocr_type;
        }

        vm.configTabWidgets={
            "convert_document":"convertDoc"
        };
        vm.configTabWidget="default";
        if(vm.configTabWidgets[vm.servicesObj.service_name]!=undefined)
            vm.configTabWidget=vm.configTabWidgets[vm.servicesObj.service_name];

        if(vm.servicesObj.service_name == "extract_hocr"){
            vm.configTabWidget = "extract_hocr";
        }

        vm.testTabWidgets={
            "extract_document_metadata":"docTest",
            "convert_document":"docTest",
            "classify_document":"docTest",
            "extract_document_elements":"docTest",
            "extract_document_text":"docTest",
            "extract_document_entities":"docTest",
            "extract_document_page_groups":"docTest",
            "ingest_document":"ingest"
        };

        vm.testTabWidget="default";
        if(vm.testTabWidgets[vm.servicesObj.service_name]!=undefined)
            vm.testTabWidget=vm.testTabWidgets[vm.servicesObj.service_name];


        if($scope.solution_id!=undefined){
            if(localStorage.getItem($scope.solution_id)!="")
                $scope.ingestedDoc_id = JSON.parse(localStorage.getItem($scope.solution_id));
            else
            $scope.ingestedDoc_id ="";
        }
        else{
            $scope.ingestedDoc_id = "";
        }
        $scope.inputDocumentId = $scope.ingestedDoc_id;
        $scope.resposeData={};
        $scope.showTable=false;
        $scope.data={
                 "document_conversions":[{
                    "from":"pdf",
                    "to":"png",
                    "preprocess":[
                        {"type":"greyscale"},
                        {"type":"skewness"},
                        {"type":"thresholding"},
                        {"type":"resize","scale":"0.5"}
                    ],
                    "enabled":false
                    }]
                 };

        $scope.setConfig= function(id){
            var obj={};
            obj[vm.servicesObj.request_trigger]=vm.servicesObj;
            obj[vm.servicesObj.request_trigger].service_configuration=$scope.data.document_conversions[id];
                configServices.configureConvertDoc({'data':obj,'sess_id':vm.sess_id}).then(function(data){
                   if(data.data.status=="success"){
                      $.UIkit.notify({
                         message :data.data.msg,
                         status  : 'success',
                         timeout : 2000,
                         pos     : 'top-center'
                      });
                   }
                   else{
                        $.UIkit.notify({
                           message : data.data.msg,
                           status  : 'warning',
                           timeout : 2000,
                           pos     : 'top-center'
                        });

                   }
                },function(err){
                  $.UIkit.notify({
                         message : 'Internal Server Error',
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                  });
                });
        };
        vm.responseHtml=[];
        vm.showJobStatusLink = false;
        $scope.testDocId=function(val){
            if(val!=""){
                $scope.resposeData={};
                $scope.showTable=false;
                var obj={"request_type":vm.servicesObj.service_name,"doc_id": val};
                 configServices.testService({'data':obj,'sess_id':vm.sess_id}).then(function(data){
                   if(data.data.status=="success"){
                        vm.jobId = data.data.data.job_id;
                        vm.getJobStatusForServ(vm.jobId);
                        $scope.timerForJobServ = setInterval(function(){ vm.getJobStatusForServ(vm.jobId); }, 30000);
                   }
                   else{
                        $.UIkit.notify({
                           message : data.data.msg,
                           status  : 'warning',
                           timeout : 2000,
                           pos     : 'top-center'
                        });
                        vm.responseHtml=[];
                   }
                },function(err){
                  $.UIkit.notify({
                         message : 'Internal Server Error',
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                  });
                  vm.responseHtml=[];
                });
            }
            else{
                $.UIkit.notify({
                   message : "Please enter Document Id.",
                   status  : 'warning',
                   timeout : 2000,
                   pos     : 'top-center'
                });
                vm.responseHtml=[];
            }
        };

        vm.getJobStatusForServ = function(jobid){
            configServices.getJobStatus({'data':jobid,'sess_id':vm.sess_id}).then(function(data){
                if(data.data.status=="success"){
                    vm.showJobStatusLinkServ = false;
                    clearInterval($scope.timerForJobServ);
                    if(vm.servicesObj.service_name=="extract_document_metadata"){
                        vm.responseHtml[vm.servicesObj.service_name]=true;
                        $scope.resposeData=data.data;
                    }
                    else if(vm.servicesObj.service_name=="convert_document"){
                        vm.responseHtml["convert_document"]=true;
                        $scope.resposeData=data.data;
                    }
                    else if(vm.servicesObj.service_name=="extract_document_page_groups"){
                        vm.responseHtml["extract_document_page_groups"]=true;
                        $scope.resposeData=data.data;
                    }
                    else if(vm.servicesObj.service_name=="classify_document"){
                        vm.responseHtml["classify_document"]=true;
                        $scope.resposeData=data.data;
                    }
                    else{
                        vm.responseHtml["default"]=true;
                        $scope.resposeData=data.data;
                    }

                }
                else if(data.data.status=="in-progress"){
                    vm.currentTimeStamp = new Date();
                    vm.showJobStatusLinkServ = true;
                }
                else if(data.data.status=="failure"){
                    vm.currentTimeStamp = new Date();
                    vm.showJobStatusLinkServ = false;
                    clearInterval($scope.timerForJobServ);
                }
            },function(err){
              $.UIkit.notify({
                     message : 'Internal Server Error',
                     status  : 'danger',
                     timeout : 2000,
                     pos     : 'top-center'
              });
            });
        }

        $scope.$on("$destroy",function(){
            if (angular.isDefined($scope.timerForJobServ)) {
                clearInterval($scope.timerForJobServ);
            }
        });


        /******************for default test********************/
        function IsJsonString(str) {
          try {
              JSON.parse(str);
          } catch (e) {
              return false;
          }
          return true;
        }

        vm.inputJsonForTest="";
        vm.showDefaultTable=false;
        vm.showJobStatusLink = false;
        vm.onTestDefault =function(val){
            if(val!=""){
                if(IsJsonString(val)){
                    var convertedJson  = JSON.parse(val);
                    vm.resposeDefaultData={};
                    vm.showDefaultTable=false;
                    // modified structure to support current request format for test service
                    convertedJson['request_type'] =  vm.servicesObj.service_name
                    var obj=convertedJson;
                    configServices.testService({'data':obj,'sess_id':vm.sess_id}).then(function(data){
                        vm.jobId = data.data.data.job_id;
                        vm.getJobStatus(vm.jobId);
                        $scope.timerForJob = setInterval(function(){ vm.getJobStatus(vm.jobId); }, 30000);
                    },function(err){
                      $.UIkit.notify({
                             message : 'Internal Server Error',
                             status  : 'danger',
                             timeout : 2000,
                             pos     : 'top-center'
                      });
                      vm.showDefaultTable=false;
                    });
                }
                else{
                    $.UIkit.notify({
                         message : "Invalid Json",
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                    });
                }
            }else{
                $.UIkit.notify({
                   message : "Please enter the json",
                   status  : 'warning',
                   timeout : 2000,
                   pos     : 'top-center'
                });
                vm.showDefaultTable=false;
            }
        };

        vm.getJobStatus = function(jobid){
            configServices.getJobStatus({'data':jobid,'sess_id':vm.sess_id}).then(function(data){
                if(data.data.status=="success"){
                    vm.resposeDefaultData=data.data;
                    vm.showDefaultTable=true;
                    vm.showJobStatusLink = false;
                    clearInterval($scope.timerForJob);
                }
                else if(data.data.status=="in-progress"){
                    vm.currentTimeStamp = new Date();
                    vm.showJobStatusLink = true;
                }
                else if(data.data.status=="failure"){
                    vm.currentTimeStamp = new Date();
                    vm.showJobStatusLink = true;
                    clearInterval($scope.timerForJob);
                }
            },function(err){
              $.UIkit.notify({
                     message : 'Internal Server Error',
                     status  : 'danger',
                     timeout : 2000,
                     pos     : 'top-center'
              });
            });
        }

        $scope.$on("$destroy",function(){
            if (angular.isDefined($scope.timerForJob)) {
                clearInterval($scope.timerForJob);
            }
        });

        /*********************************************************/

        /**************for ingest document (test)*****************/
        $scope.showChangeBtn=false;
        $scope.showDocumentId=false;
        $scope.showDescription={};
        $scope.fileTypes ={};
        $scope.listDic = [];
        $scope.propName = 'created_on';
        $scope.reverse = true;
        $scope.uploadDic = function(file){
            if(file!=null){
              $scope.browseName = file.name;
              $scope.browseFile = file;
              $scope.browseFileError = false;
              $scope.showChangeBtn=true;
            }
            else{
              $.UIkit.notify({
                 message : "Please select the file.",
                 status  : 'success',
                 timeout : 2000,
                 pos     : 'top-center'
              });
            }
        };
        $scope.clearBrowse=function(){
            $scope.browseName="";
            $scope.fileType="";
            $scope.inputModel="";
            $scope.browseFileError = false;
            $scope.showChangeBtn=false;
        };

        $scope.doc_id="";
        $scope.sendDic = function(){
          var file = $scope.browseFile;
          if($scope.browseFile == undefined || $scope.browseFile == null){
             $scope.browseFileError = true;
          }
          else {
              var re = /(?:\.([^.]+))?$/;
              var selectedFileType=file.name;
              var ext = "."+re.exec(file.name)[1];

               var dataObj={};
               $scope.doc_id="";
               localStorage.setItem($scope.solution_id,"");

               $scope.showLoaderIcon = true;
               file.upload = Upload.upload({
                    url: 'api/services/ingest/',
                    method: 'POST',
                    headers: {"sess_token": $scope.loginData.sess_id},
                    data:dataObj,
                    file: file
               });
               file.upload.then(function (response) {
                     $scope.showLoaderIcon = false;
                     if(response.data.status=="success"){
                        $scope.browseName = '';
                        $scope.inputModel = '';
                        $scope.fileType = '';
                        $scope.showDocumentId=true;
                        $scope.doc_id=response.data.data.document[0].doc_id;
                        localStorage.setItem($scope.solution_id,JSON.stringify($scope.doc_id));
                        $scope.showChangeBtn = false;
                   }
                   else {

                        $.UIkit.notify({
                           message : response.data.msg,
                           status  : 'warning',
                           timeout : 3000,
                           pos     : 'top-center'
                        });
                    }
               }, function (response) {
                    $scope.showDocumentId=false;
                     $scope.showLoaderIcon = false;
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'warning',
                       timeout : 2000,
                       pos     : 'top-center'
                    });
               });

          }
        };


        vm.saveHocrSelection = function(){
            var obj = {"solution_id": $scope.loginData.user.solution_id,"hocr_type": vm.hocrType};
            configServices.saveHocrType({'data':obj,'sess_id':vm.sess_id}).then(function(data){
               if(data.data.status=="success"){
                    $.UIkit.notify({
                       message : "Updated hocr type",
                       status  : 'success',
                       timeout : 2000,
                       pos     : 'top-center'
                    });
               }
               else{
                    $.UIkit.notify({
                       message : data.data.msg,
                       status  : 'warning',
                       timeout : 2000,
                       pos     : 'top-center'
                    });
               }
            },function(err){
              $.UIkit.notify({
                     message : 'Internal Server Error',
                     status  : 'danger',
                     timeout : 2000,
                     pos     : 'top-center'
              });
            });
        };



    }];
})();