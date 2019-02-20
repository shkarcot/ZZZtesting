'use strict';

/**
 * @ngdoc function
 * @name platformConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the platformConsoleApp
 */
angular.module('console.createUnStructuredForm')
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
  .controller('trainUnStructuredCtrl', function ($scope,$state,$rootScope,$location,Upload,$stateParams,ngDialog,documentService) {
      var vm = this;

      $(".train").height($(window).height());
      vm.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= vm.loginData.sess_id;
      $scope.uploadedDocuments = [];
      $scope.uploadImageShow = true;

      $rootScope.getTrainDetails = function(id){
          documentService.getTrainList(vm.loginData.sess_id,id).then(function(resp){
              if(angular.equals(resp.data.status,'success')){
                 $scope.uploadedDocuments = [];
                 if(resp.data.data!= undefined){
                    if(resp.data.data.length != 0){
                       $scope.uploadImageShow = false;
                       $scope.uploadedDocuments = resp.data.data;

                    }
                 }
              }
              else{
                 $.UIkit.notify({
                    message : resp.data.msg,
                    status  : 'danger',
                    timeout : 2000,
                    pos     : 'top-center'
                 });
              }
          },function(err){
              $.UIkit.notify({
                message : "Internal server error",
                status  : 'warning',
                timeout : 3000,
                pos     : 'top-center'
              });
          });
      };

      $scope.uploadFiles = function (files) {
          if (files && files.length) {
              Upload.upload({
                    url: 'api/documentTemplates/train/upload/',
                    method: 'POST',
                    headers: {"sess_token": vm.loginData.sess_id},
                    file: files,
                    data:{'data':JSON.stringify({"template_id":$rootScope.state_id})}
              }).then(function (response) {
                         if(response.data.status=='success'){
                             $rootScope.getTrainDetails($rootScope.state_id);
                              $.UIkit.notify({
                                 message : response.data.msg,
                                 status  : 'success',
                                 timeout : 2000,
                                 pos     : 'top-center'
                              });
                         }else{
                            $.UIkit.notify({
                                 message : response.data.msg,
                                 status  : 'danger',
                                 timeout : 2000,
                                 pos     : 'top-center'
                            });
                         }

              }, function (response) {
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

      $scope.trainigSet = function(){
          vm.sendDocObj = {};
          vm.sendDocObj.template_id = $rootScope.state_id;
          vm.sendDocObj.documents =[];
          angular.forEach($scope.uploadedDocuments,function(value,key){
                if(value.doc_state=='ready'){
                    vm.sendDocObj.documents.push(value.doc_id)
                }
          })
          if(vm.sendDocObj.documents.length>0){
              documentService.sendTrain(vm.loginData.sess_id,vm.sendDocObj).then(function(resp){
                 console.log(resp);
                 if(resp.data.status == "success"){
                     $rootScope.getTrainDetails($rootScope.state_id);
                     $.UIkit.notify({
                             message : resp.data.msg,
                             status  : 'success',
                             timeout : 2000,
                             pos     : 'top-center'
                     });
                 }
                 else{
                     $.UIkit.notify({
                             message : resp.data.msg,
                             status  : 'danger',
                             timeout : 2000,
                             pos     : 'top-center'
                     });
                 }
              });
          }
          else{
                $.UIkit.notify({
                             message : 'At least one sample should be in ready state to request training',
                             status  : 'danger',
                             timeout : 2000,
                             pos     : 'top-center'
                });
          }
      };

      vm.deleteTrainData = function(index){
        $scope.uploadedDocuments.splice(index,1);
      };

      $scope.deleteFile = function(data,index){
         ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.activePopupText = 'Are you sure you want to delete ' +"'" +data.metadata.file_name+ "'" +' ' + '?';
                  $scope.onConfirmActivation = function (){
                     ngDialog.close();
                     vm.deleteTrainData(index);

                  };
              }]
         });

      };

  });
