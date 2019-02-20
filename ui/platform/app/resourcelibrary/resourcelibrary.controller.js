module.exports = ['$scope', '$state', '$rootScope', '$location', 'dictionaryList', 'resourceServices', 'Upload', '$timeout', 'ngDialog','config',
function($scope, $state, $rootScope, $location, dictionaryList, resourceServices, Upload, $timeout, ngDialog, config) {
	'use strict';
	var vm = this;
	  $scope.config = config;
      $rootScope.currentState = 'resourcelibrary';
      $scope.showEditIcons={};
      $scope.url = $location.protocol() + '://'+ $location.host() +':'+  $location.port();
//      $scope.hostUrl = url.substr(0, url.indexOf('/'));
      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      $scope.showChangeBtn=false;
      $scope.blinkingRow={};
      vm.sess_id= $scope.loginData.sess_id;
      $(".collapseOne").collapse('show');
      $scope.hideAndCollapse="fa-minus";
      $scope.expand =function(){
        if($scope.hideAndCollapse=="fa-minus")
          $scope.hideAndCollapse="fa-plus";
        else
          $scope.hideAndCollapse="fa-minus";
      };

      $scope.showDescription={};

      // dictionary upload1111
      $scope.listDic = dictionaryList.data;
      $scope.diclinkArray = dictionaryList.data.data;
      if($scope.diclinkArray.length == 0){
        $scope.hideAndCollapse="fa-minus";
      };
      $scope.fileTypes ={};

      $scope.goTodomainObjects = function(){
        $state.go('app.entities');
      }

       /*angular.forEach(dictionaryList.data.file_type,function(value,key){
           if(key=="Corpus"){
            $scope.fileTypes[key]=value+",.txt,.csv";
           }
           else if(key=="Training Set"){
            $scope.fileTypes[key]=value+",.zip,.csv";
           }
           else if(key!="Intent"){
            $scope.fileTypes[key]=value;
           }

        });*/

      $scope.removeBlinking=function(){
       angular.forEach($scope.blinkingRow,function(value,index){
         $scope.blinkingRow[index]="";
       });
      };

      $scope.TSFileType =dictionaryList.data.resource_types;
      console.log($scope.TSFileType);
      $scope.listDic = [];
      $scope.propName = 'created_on';
      $scope.reverse = true;
      //$scope.reverse = false;

      $scope.uploadDic = function(file){
        if($scope.fileType!=undefined){
            if(file!=null){
              $scope.browseName = file.name;
              $scope.browseFile = file;
              $scope.browseFileError = false;
              $scope.showChangeBtn=true;
            }
        }
        else{
          $.UIkit.notify({
             message : "Please select the resource type.",
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
      var types =$scope.TSFileType[fileType].values;
        var flag=false;
        fileExtension=fileExtension.replace(".","");

         angular.forEach(types,function(value,key){
             if(value==fileExtension){
                flag=true;
             }
           });

        return flag;
      };


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

               var dataObj={"name": "","description": $scope.inputModel,"type": $scope.fileType};
               $scope.showLoaderIcon = true;
               file.upload = Upload.upload({
                    url: 'api/load_training/data/',
                    method: 'POST',
                    headers: {"sess_token": $scope.loginData.sess_id},
                    data:dataObj,
                    file: file
               });
               file.upload.then(function (response) {
                    $scope.browseName = '';
                    $scope.inputModel = '';
                    $scope.fileType = '';
                    $.UIkit.notify({
                       message : response.data.msg,
                       status  : 'success',
                       timeout : 2000,
                       pos     : 'top-center'
                    });
                    $scope.showLoaderIcon = false;
                    $scope.showChangeBtn = false;
                    resourceServices.getDictionary({'sess_id':$scope.loginData.sess_id}).then(function(response){
                        $scope.diclinkArray = response.data.data;
                        $scope.blinkingRow[$scope.diclinkArray[0]._id]="blinking";
                        $timeout($scope.removeBlinking, 3000);
                    });
               }, function (response) {
               });
            }
            else{
              $.UIkit.notify({
                 message : "Please import '"+$scope.TSFileType[$scope.fileType].values+"' extension files only",
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
      $scope.updateDesc =function(id,filename,idx){
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
      };

      $scope.showIcons=function(index){
        $scope.showEditIcons[index]=true;
      };

      $scope.hideIcons=function(index){
        $scope.showEditIcons[index]=false;
      };

}];