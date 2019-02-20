'use strict';

/**
 * @ngdoc function
 * @name platformConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the platformConsoleApp
 */
angular.module('console.vocabulary')
  .config(function($provide) {
      $provide.decorator('$state', function($delegate, $stateParams) {
          $delegate.forceReload = function() {
              return $delegate.go($delegate.current, $stateParams, {
                  reload: true,
                  inherit: false,
                  notify: true
              });
          };
          return $delegate;
      });
  })
  .controller('ontologiesController', function ($scope,$state,$rootScope,$location,$http,sourceService,vocabularyService,bpmnServices) {
      var vm = this;
      vm.s3URL = '';
      vm.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.searchFile = '';
      var solution_id ='';
      window.scrollTo(0,0);

      vm.getOntologiesList = function(){
        vocabularyService.getListOfOntologies(solution_id).then(function (response) {
                            if(response.data.status=='success'){
                                vm.ontologiesList = response.data.data;
                            }else{
                                $.UIkit.notify({
                                       message : response.data.msg,
                                       status  : 'danger',
                                       timeout : 3000,
                                       pos     : 'top-center'
                               });
                            }
        },function(err){
               console.log(err)
               $.UIkit.notify({
                       message : "Internal server error",
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
               });

        });
      };

      vm.getSolutionId = function(){
        bpmnServices.getSolnId().then(function (response) {
                            if(response.data.status=='success'){
                                solution_id = response.data.solution_id;
                                vm.getOntologiesList();
                            }
        },function(err){

        });
      };

      vm.changeVersion = function(ontology){
        vocabularyService.toggleOntologyVersion(solution_id,ontology.id,{"is_active":ontology.is_active}).then(function (response) {
                            if(response.data.status=='success'){
                               $.UIkit.notify({
                                       message : response.data.msg,
                                       status  : 'success',
                                       timeout : 3000,
                                       pos     : 'top-center'
                               });
                            }else{
                                $.UIkit.notify({
                                       message : response.data.msg,
                                       status  : 'danger',
                                       timeout : 3000,
                                       pos     : 'top-center'
                               });
                               version.is_active = !version.is_active;
                            }
        },function(err){
               console.log(err)
               $.UIkit.notify({
                       message : "Internal server error",
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
               });
               version.is_active = !version.is_active;

        });
      };

      if(vm.loginData.user!=undefined){
        if(vm.loginData.user.solution_id!=undefined){
            solution_id = vm.loginData.user.solution_id;
            vm.getOntologiesList();
        }else{
            vm.getSolutionId();
        }
      }else{
            vm.getSolutionId();
      }


      vm.fileStatus = function(file){
        for(var i=0;i<vm.listOfFiles.length;i++){
                                    if(vm.listOfFiles[i].file_name === file.name){
                                        vm.listOfFiles[i].status='Failed';
                                        break;
                                    }
        }
      };

      $scope.uploadOntologies = function (files) {
            vm.listOfFiles = [];
            if (files == null)
                return;
            vm.files = files;
            for (var i = 0; i < files.length; i++) {
                var obj = {};
                obj.file_name = files[i].name;
                obj.status = 'Uploading...';
                vm.listOfFiles.push(obj);
                $scope.ontologyPresignedUpload(files[i]);
            }

      };

      function formatBytes(bytes) {
            if (bytes < 1024) return bytes + " Bytes";
            else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KB";
            else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MB";
            else return (bytes / 1073741824).toFixed(3) + " GB";
      };


        /*Method Desc - upload files to s3bucket using presigned URL
          for multiple files we need to create multiple presigned URL's  */
      $scope.ontologyPresignedUpload = function (file) {
            var params = { file_name: file.name, upload_type: "ontology", solution_id: solution_id, method: "PUT", content_type: file.type };
            vm.s3URL = sourceService.fetchs3URL();
            sourceService.uploadfile(vm.s3URL, params).then(function (response) {
                console.log(response.data.aws_url);
                $http.put(response.data.aws_url, file, { headers: { 'Content-Type': file.type } })
                    .success(function (resp) {
                        //Finally, We're done
                        var fileUrl = response.data.aws_url.split("?")[0];
                        var bucket = fileUrl.split('://').pop().split('.s3')[0];
                        var fileName = fileUrl.split('.com/')[1];
                        var file_path = "s3://"+bucket+"/"+fileName;

                        var params = {
                                    "name": file.name,
                                    "file_name":file.name,
                                    "primary_property":"",
                                    "file_path":file_path,
                                    "file_url": fileUrl,
                                    "created_by":vm.loginData.username,
                                    "modified_by":'',
                                    "description":""
                        };

                        vocabularyService.uploadOntology(solution_id,params).then(function (response) {
                            if(response.data.status=='success'){
                                $.UIkit.notify({
                                   message : response.data.msg,
                                   status  : 'success',
                                   timeout : 2000,
                                   pos     : 'top-center'
                                });

                                for(var i=0;i<vm.listOfFiles.length;i++){
                                    if(vm.listOfFiles[i].file_name === file.name){
                                        vm.listOfFiles.splice(i,1);
                                        break;
                                    }
                                }

                                vm.getOntologiesList();
                            }
                            else{
                                $.UIkit.notify({
                                       message : response.data.msg,
                                       status  : 'danger',
                                       timeout : 3000,
                                       pos     : 'top-center'
                               });
                               vm.fileStatus(file);
                            }
                        },function(err){
                               console.log(err)
                               $.UIkit.notify({
                                       message : "Internal server error",
                                       status  : 'warning',
                                       timeout : 3000,
                                       pos     : 'top-center'
                               });
                               vm.fileStatus(file);
                        });



                    })
                    .error(function (resp) {
                        $.UIkit.notify({
                               message : "Internal server error",
                               status  : 'warning',
                               timeout : 3000,
                               pos     : 'top-center'
                        });
                        vm.fileStatus(file);
                    });
            }, function () {
                $.UIkit.notify({
                       message : "Internal server error",
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
               });
               vm.fileStatus(file);
            })
      };
      $scope.goToVersions =  function(data){
        $state.go('app.ontologyversions',{id:data.id});
      }




      $scope.monthShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      $scope.formatDateInList = function(ts){
           if(ts == undefined){
               return "";
           }
           else{
               var date = new Date();
               var tsDate = new Date(ts);
               var currentDate = date.getMonth() + "-" + date.getDate() + "-" + date.getYear();
               var yestrdyDate = date.getMonth() + "-" + (date.getDate()-1) + "-" + date.getYear();
               var updatedTs = tsDate.getMonth() + "-" + tsDate.getDate() + "-" + tsDate.getYear();
               if(currentDate == updatedTs){
                   if(tsDate.getHours()<12){
                       return tsDate.getHours()+':'+tsDate.getMinutes()+" "+ "AM";
                   }
                   else{
                       if(tsDate.getHours()==12)
                           return tsDate.getHours()+':'+tsDate.getMinutes()+" "+ "PM";
                       else
                           return (tsDate.getHours()-12)+':'+tsDate.getMinutes()+" "+ "PM";
                   }
               }
               else if(yestrdyDate == updatedTs){
                   if(tsDate.getHours()<12)
                       return 'Yesterday @ '+tsDate.getHours()+':'+tsDate.getMinutes()+" "+ "AM";
                   else{
                       if(tsDate.getHours()==12)
                           return 'Yesterday @ '+tsDate.getHours()+':'+tsDate.getMinutes()+" "+ "PM";
                       else
                           return 'Yesterday @ '+(tsDate.getHours()-12)+':'+tsDate.getMinutes()+" "+ "PM";
                   }
               }
               else{
                   if(tsDate.getHours()<12)
                       return tsDate.getDate()+' '+$scope.monthShort[tsDate.getMonth()]+', '+tsDate.getHours()+' '+'AM';
                   else{
                       if(tsDate.getHours()==12)
                           return tsDate.getDate()+' '+$scope.monthShort[tsDate.getMonth()]+', '+tsDate.getHours()+' '+'PM';
                       else
                           return tsDate.getDate()+' '+$scope.monthShort[tsDate.getMonth()]+', '+(tsDate.getHours()-12)+' '+'PM';
                   }
               }
           }
      };

  });
