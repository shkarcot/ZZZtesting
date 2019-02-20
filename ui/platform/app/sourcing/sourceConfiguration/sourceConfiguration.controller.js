module.exports = ['$scope','$state','$rootScope','Upload','$location','ngDialog','$timeout','sourceConfigService','emailConfigData','$window',function($scope,$state,$rootScope,Upload,$location,ngDialog,$timeout,sourceConfigService,emailConfigData,$window) {
	'use strict';
     var vm = this;
      var url = $location.path();
      var arr = url.split("/");
      window.scrollTo(0,0);
      $rootScope.currentState = arr[arr.length-1];
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));


      $scope.config ={};
      $scope.config =emailConfigData.data;
      if($scope.config == "null"){
        $scope.config ={};
      }

      $(".adaptContainer").css('max-height', $(window).height()-80);

      $scope.saveData = function(){
        if($scope.pipelineConfig!=""){

          sourceConfigService.savePipelineConfig({"s3_claims_bucket":$scope.pipelineConfig},$scope.loginData.sess_id).then(function(data){
            if(data.data.status=="success"){
              $.UIkit.notify({
                message : data.data.msg,
                status  : 'success',
                timeout : 2000,
                pos     : 'top-center'
              });
            }
            else{
              $.UIkit.notify({
                message : data.data.msg,
                status  : 'danger',
                timeout : 2000,
                pos     : 'top-center'
              });
            }
          },function(err){
                  console.log(err);
                 $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
          });
        }
        else{
          $.UIkit.notify({
             message : 'Please enter the value in text field.',
             status  : 'warning',
             timeout : 2000,
             pos     : 'top-center'
          });
        }
      };

      $scope.uploadDic = function(file){
            $scope.browseName = file.map(function(e){return e.name});
            $scope.browseFile = file;
            $scope.browseFileError = false;
      };


      $scope.sendDic = function(){
          var file = $scope.browseFile;
          $scope.isDisable = true;
          if($scope.browseFile == undefined || $scope.browseFile == null){
             $scope.browseFileError = true;
             $scope.isDisable = false;
          }
          else{
             file.upload = Upload.upload({
                  url: 'api/pipeline/upload/',
                  method: 'POST',
                  headers: {"sess_token": $scope.loginData.sess_id},
                  file: file
             });
             file.upload.then(function (response) {
                  if(response.data.status == 'success'){
                      $scope.browseName = '';
                      $scope.inputModel = '';
                      $scope.fileType = '';
                      $scope.dicFile ='';
                      $.UIkit.notify({
                         message : response.data.msg,
                         status  : 'success',
                         timeout : 2000,
                         pos     : 'top-center'
                      });
                      $scope.isDisable = false;
                      $scope.browseFile= null;
                  }else{
                        $scope.isDisable = false;
                        $.UIkit.notify({
                         message : response.data.msg,
                         status  : 'danger',
                         timeout : 2000,
                         pos     : 'top-center'
                       });
                  }


             }, function (response) {
                   $scope.isDisable = false;
                   $.UIkit.notify({
                     message : 'Error in file upload',
                     status  : 'danger',
                     timeout : 2000,
                     pos     : 'top-center'
                   });
                  //alert("error");
             });
          }

      };

      $scope.resetData = function(){
        $scope.config={};
      };

      $scope.saveConfiguration = function(){
        $scope.isDisable = true;
        sourceConfigService.saveEmail($scope.config,$scope.loginData.sess_id).then(function(data){
            if(data.data.status=="success"){
              $.UIkit.notify({
                message : data.data.msg,
                status  : 'success',
                timeout : 2000,
                pos     : 'top-center'
              });

              $timeout( function(){
                $scope.isDisable = false;
              }, 2000 );


            }
            else{
              $.UIkit.notify({
                message : data.data.msg,
                status  : 'danger',
                timeout : 2000,
                pos     : 'top-center'
              });
              $scope.isDisable = false;
            }
        },function(err){
                  console.log(err);
                 $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
        });
      };

      $scope.ingestFiles = function(){

        document.getElementById("ingestFile").style.width = "40%";
      }

      $scope.cancelIngest = function(){
        document.getElementById("ingestFile").style.width = "0%";
      };

      $scope.sftpList = [];
      $scope.selection = [];


      $scope.toggleSelection = function(list) {
        var idx = $scope.selection.indexOf(list);
        if (idx > -1) {
          $scope.selection.splice(idx, 1);
        }
        else {
          $scope.selection.push(list);
        }
      };

      $scope.uploadSftp = function(){
          if($scope.selection.length>0){
             sourceConfigService.savesftpfiles($scope.loginData.sess_id,{'files':$scope.selection}).then(function(data){
                if(data.data.status=="success"){
                  $scope.selection = [];
                  $.UIkit.notify({
                    message : data.data.msg,
                    status  : 'success',
                    timeout : 2000,
                    pos     : 'top-center'
                  });

                }
                else{
                  $.UIkit.notify({
                    message : data.data.msg,
                    status  : 'danger',
                    timeout : 2000,
                    pos     : 'top-center'
                  });
                }
             },function(err){
                      console.log(err);
                     $.UIkit.notify({
                             message : "Internal server error",
                             status  : 'warning',
                             timeout : 3000,
                             pos     : 'top-center'
                     });
             });
          }else{
                 $.UIkit.notify({
                         message : "At least on file should be selected",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
          }
      }

      $scope.getSFTPList = function(){

         sourceConfigService.getsftpfiles($scope.loginData.sess_id).then(function(data){
            if(data.data.status=="success"){

              $scope.sftpList = data.data.files;

            }
            else{
              $.UIkit.notify({
                message : data.data.msg,
                status  : 'danger',
                timeout : 2000,
                pos     : 'top-center'
              });
            }
         },function(err){
                  console.log(err);
                 $.UIkit.notify({
                         message : "Internal server error",
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                 });
         });

      };
      $scope.getSFTPList();

}];