(function() {
	'use strict';

	module.exports = ['$state','$rootScope','$scope','IngestDocumentServices','$location', 'Upload', '$timeout', 'ngDialog',
	function($state,$rootScope,$scope,IngestDocumentServices,$location, Upload, $timeout, ngDialog) {
        var vm = this;
        $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
        $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
        vm.sess_id= $scope.loginData.sess_id;
         if($scope.loginData.user==undefined){
                $scope.loginData.user = {}
                $scope.loginData.user.solution_name = "";
                $scope.loginData.user.solution_id = "";
         }
        $scope.solution_id=$scope.loginData.user.solution_id;
        $rootScope.currentState = 'services';
        $scope.configMessage="Default configuration setting have been applied.";
        $scope.inputModel = '';
        $scope.inputDocumentId = '';
        $scope.servicesObj = JSON.parse(localStorage.getItem('servicesObj'));

        $scope.showEditIcons={};
        $scope.url = $location.protocol() + '://'+ $location.host() +':'+  $location.port();
        //    $scope.hostUrl = url.substr(0, url.indexOf('/'));
        $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
        $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
        $scope.showChangeBtn=false;
        $scope.blinkingRow={};
        $scope.showDocumentId=false;


        /*$scope.saveDocId=function(){
            if($scope.inputDocumentId != ""){
                IngestDocumentServices.saveDocumentId({'obj':{"document_id":$scope.inputDocumentId},'sess_id':vm.sess_id}).then(function(data){
                   if(data.data.status=="success"){
                      $scope.documentId="";
                        $scope.showTable=true;
                            $scope.resposeData=data.data.data.insights[0].insight.document_metdata.mime_type;
                        }
                        else
                        {
                            $scope.showTable=false;
                        }
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

            }
            else{
                $.UIkit.notify({
                   message : "Please enter document Id.",
                   status  : 'warning',
                   timeout : 2000,
                   pos     : 'top-center'
                });
            }
        };*/



        $scope.showDescription={};
        $scope.fileTypes ={};

        $scope.removeBlinking=function(){
            angular.forEach($scope.blinkingRow,function(value,index){
                $scope.blinkingRow[index]="";
            });
        };

      //$scope.TSFileType =dictionaryList.data.resource_types;
      //console.log($scope.TSFileType);
      $scope.listDic = [];
      $scope.propName = 'created_on';
      $scope.reverse = true;
      //$scope.reverse = false;

      $scope.uploadDic = function(file){
        //if($scope.fileType!=undefined){
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

      $scope.download = function(id){
         var downloadUrl = $scope.url+'/api/download/'+id;
         window.location.assign(downloadUrl);
      };

      $scope.editDiscription = function(index,id,description){
        $scope.showDescription[id]=!$scope.showDescription[id];
      };
      function validateFileType(fileType,fileExtension){
    /*  var types =$scope.TSFileType[fileType].values;
        var flag=false;
        fileExtension=fileExtension.replace(".","");

         angular.forEach(types,function(value,key){
             if(value==fileExtension){
                flag=true;
             }
           });

        return flag;*/
        return true;
      }

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

                if(validateFileType($scope.fileType,ext)){

              //if($scope.TSFileType[$scope.fileType]==ext){

               var dataObj={};
               $scope.doc_id="";
               localStorage.setItem($scope.solution_id,"");
               //var dataObj=$scope.servicesObj;
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
                        $scope.doc_id=response.data.data.insights[0].insight.doc_id;
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
            else{
                $scope.showDocumentId=false;
                 $scope.showLoaderIcon = false;
                $.UIkit.notify({
                 message : "Please import . doc extension files only",
                 status  : 'warning',
                 timeout : 3000,
                 pos     : 'top-center'
                });
            }
          }
      };

      $scope.sort = function(property){
         $scope.propName = property;
         $scope.reverse = !$scope.reverse;
      };

      $scope.dicDelete = function(id, name){
          $scope.deleteDicName = name;
          ngDialog.open({ template: 'deleteDicBox' ,scope: $scope});
          $scope.activePopupText = 'Are you sure you want to delete ' +"'" +name+ "'"+'?';
          $scope.onConfirmActivation = function(){
              ngDialog.close();
              resourceServices.delDictionary({'id':id,'sess_id':$scope.loginData.sess_id}).then(function(response){
                 if(response.data.status=="success"){

                    $.UIkit.notify({
                       message : "'" +name+ "' has been deleted successfully" ,//response.data.msg,
                       status  : 'success',
                       timeout : 2000,
                       pos     : 'top-center'
                    });

                    resourceServices.getDictionary({'sess_id':$scope.loginData.sess_id}).then(function(response){
                        $scope.diclinkArray = response.data.data;
                        if($scope.diclinkArray.length == 0){
                          $scope.hideAndCollapse="fa-minus";
                        }
                    });
                 }
              });
          };
          $scope.dialogClose = function(){
             ngDialog.close();
          };
      };
      /*$scope.updateDesc =function(id,filename,idx){
        var obj={};
        angular.forEach($scope.diclinkArray, function(value, key) {
          if(value._id==id)
            obj = $scope.diclinkArray[key];
        });
        resourceServices.updateResourceLibrary({'data':obj,'sess_id':$scope.loginData.sess_id}).then(function(response){
           if(response.data.status=="success"){
              $.UIkit.notify({
                 message : "'" +filename+ "' description has been updated successfully" ,//response.data.msg,
                 status  : 'success',
                 timeout : 2000,
                 pos     : 'top-center'
              });
              $scope.showDescription[id]=!$scope.showDescription[id];
              resourceServices.getDictionary({'sess_id':$scope.loginData.sess_id}).then(function(response){
                  $scope.diclinkArray = response.data.data;
                  $scope.blinkingRow[id]="blinking";
                  $timeout($scope.removeBlinking, 3000);
              });
           }
        });
      };*/

      $scope.showIcons=function(index){
        $scope.showEditIcons[index]=true;
      };

      $scope.hideIcons=function(index){
        $scope.showEditIcons[index]=false;
      };



    }];
})();