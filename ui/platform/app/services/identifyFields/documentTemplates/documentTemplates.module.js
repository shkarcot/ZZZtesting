'use strict';

/**
 * @ngdoc function
 * @name platformConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the platformConsoleApp
 */
angular.module('console.services.identifyfields')
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
  .controller('documentTemplateCtrl', documentTemplateCtrl)

    function documentTemplateCtrl($scope,$rootScope,ngDialog,Upload,$location,$state,documentService) {
        var vm = this;
        $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
        window.scrollTo(0,0);
        $rootScope.currentState = 'services';
        vm.url = $location.protocol() + '://'+ $location.host() +':'+  $location.port();
        vm.loginData = JSON.parse(localStorage.getItem('userInfo'));

        vm.sess_id= vm.loginData.sess_id;
        vm.sendDocObj = {};
        vm.browseName='';

//        vm.getHeldDocumentsList = getHeldDocumentsList;
        vm.getDocumentList = getDocumentList;
        vm.openModal  = openModal;
        vm.goTo = goTo;
        vm.uploadDic = uploadDic;
        vm.download = download;
        vm.sendDocument = sendDocument;
        vm.sendDic =  sendDic;
        vm.onchangePage = onchangePage;
        vm.deleteRecord = deleteRecord;
        //vm.selectedCls = selectedCls;
        //vm.changeSorting = changeSorting;
        vm.removeHeldDocument = removeHeldDocument;
        vm.reqForDocumentList ={};
        vm.reqForDocumentList.page_no=1;
        vm.reqForDocumentList.recs_per_page=10;
        vm.reqForDocumentList.created_ts = -1;
        vm.totalRecords =0;


//        function getHeldDocumentsList(){
//           documentService.getDocumentHeldDocuments(vm.sess_id).then(function(resp){
//              console.log(resp);
//              if(angular.equals(resp.data.status,'success')){
//                vm.heldDocuments=resp.data.data;
//              }
//              else{
//                $.UIkit.notify({
//                         message : resp.data.msg,
//                         status  : 'danger',
//                         timeout : 2000,
//                         pos     : 'top-center'
//                });
//              }
//           },function(err){
//               console.log(err)
//               $.UIkit.notify({
//                       message : "Internal server error",
//                       status  : 'warning',
//                       timeout : 3000,
//                       pos     : 'top-center'
//               });
//           });
//        };

        function getDocumentList(){
           documentService.getDocuments(vm.sess_id,vm.reqForDocumentList).then(function(resp){
              console.log(resp);
              if(resp.data.status=='success'){
                vm.totalRecords = resp.data.total_count;
                vm.documentsList=resp.data.data;
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
               console.log(err)
               $.UIkit.notify({
                       message : "Internal server error",
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
               });
           });
        };

        getDocumentList();
//        getHeldDocumentsList();

        function openModal(type){

             if(angular.equals(type,'modal'))
              $('#myModal').modal();
             else{
               if(vm.fileName !='' && vm.fileName!=undefined){
                 vm.sendDic();
               }
             }


        };


        function goTo(data){
          if(data.classification_values.length>=5){
               $state.go('app.markerFormService',{id:data['form_type']})
            }
            else{
               $.UIkit.notify({
                       message : "Please add template rules to proceed",
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
               });
            }
        };


        function uploadDic(file){
                vm.sendDocObj = {};
                vm.browseType = file.type;
                vm.browseName = file.name;
                vm.browseFile = file;
                vm.browseFileError = false;
                if(vm.browseType =='image/jpg'||vm.browseType =='image/jpeg' ||vm.browseType =='image/png'){
                  $('#myModal').modal('hide');
                  $(".modal-backdrop").remove();
                  vm.display = true;
                }
                else{
                  vm.browseFileError = true;
                }

        };

        function download(id){
           var downloadUrl = vm.url+'/api/download/'+id
           window.location.assign(downloadUrl);
        }

        function sendDocument(data){

           vm.sendDocObj = {};

           vm.sendDocObj.file_path = data.url;
           vm.sendDocObj.rec_id = data.rec_id;
           var str =  data.url
           var last = str.substring(str.lastIndexOf("/") + 1, str.length);
           vm.browseName = last;
           $('#myModal').modal('hide');
           $(".modal-backdrop").remove();
           vm.display = true;

        };

        function sendDic(){
            if(Object.keys(vm.sendDocObj).length>0){

              vm.sendDocObj.form_type =vm.fileName;
              vm.sendDocObj.config_type ="";
              vm.sendDocObj.configuration ={};
              vm.sendDocObj.classification_values =[];
              vm.sendDocObj.marker_config ={};


              var flag = true;
              vm.dupNameMessage=''
              vm.showdupMess = false
              angular.forEach(vm.documentsList,function(value,key){
                if(angular.equals(angular.lowercase(value.form_type),angular.lowercase(vm.sendDocObj.form_type))){
                  flag=false;
                }
              })
              if(flag){
                vm.isDisable = true;
                documentService.sendDocument(vm.sess_id,vm.sendDocObj).then(function(resp){
                  console.log(resp);
                  vm.isDisable = false;
                  if(angular.equals(resp.data.status,'success')){
                    vm.browseName = '';
                    vm.browseType = '';
                    vm.fileName = '';
                    vm.display = false;
                    vm.getDocumentList();
//                    vm.getHeldDocumentsList();

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
                   console.log(err)
                   vm.isDisable = false;
                   $.UIkit.notify({
                           message : "Internal server error",
                           status  : 'warning',
                           timeout : 3000,
                           pos     : 'top-center'
                   });
                });

              }
              else{
                vm.dupNameMessage = 'Template name already exists';
                vm.showdupMess = true;
              }
            }
            else{
              var file = vm.browseFile;

              if(vm.browseFile == undefined || vm.browseFile == null){
                 vm.browseFileError = true;
                 vm.isDisable = false;
              }
              else{
                  var flag = true;
                  vm.dupNameMessage=''
                  vm.showdupMess = false
                  angular.forEach(vm.documentsList,function(value,key){
                    if(angular.equals(angular.lowercase(value.form_type),angular.lowercase(vm.fileName))){
                      flag=false;
                    }
                  })
                  if(flag){
                     vm.isDisable = true;
                     file.upload = Upload.upload({
                          url: 'api/documentTemplates/',
                          method: 'POST',
                          headers: {"sess_token": vm.loginData.sess_id},
                          data:{'data':JSON.stringify({"form_type": vm.fileName,"config_type":"","configuration":{},"classification_values":[],"marker_config":{}})},
                          file: file
                     })
                     file.upload.then(function (response) {
                          vm.browseName = '';
                          vm.fileName = '';
                          vm.browseType ='';
                          $.UIkit.notify({
                             message : response.data.msg,
                             status  : 'success',
                             timeout : 2000,
                             pos     : 'top-center'
                          });
                          vm.isDisable = false;
                          vm.display = false;
                          vm.getDocumentList();
                     }, function (response) {
                         vm.isDisable = false;
                         $.UIkit.notify({
                             message : 'Error in file upload',
                             status  : 'danger',
                             timeout : 2000,
                             pos     : 'top-center'
                         });

                     });
                  }
                  else{
                    vm.dupNameMessage = 'Template name already exists';
                    vm.showdupMess = true;
                  }
              }
            }
        };

        function deleteRecord(obj){

          ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to delete ' +"'" +obj.form_type+ "'" +' ' + 'Template ?';
              $scope.onConfirmActivation = function (){
                  ngDialog.close();
                documentService.removeTemplate(vm.sess_id,{'form_type':obj.form_type}).then(function(resp){
                  console.log(resp);

                  if(angular.equals(resp.data.status,'success')){
                      getDocumentList();
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
                   console.log(err)
                   vm.isDisable = false;
                   $.UIkit.notify({
                           message : "Internal server error",
                           status  : 'warning',
                           timeout : 3000,
                           pos     : 'top-center'
                   });
                }
                );

              }
          }]
          });

        };

        function removeHeldDocument(data){
           documentService.removeHeldDocumentList(vm.sess_id,{'rec_id':data.rec_id}).then(function(resp){
                  console.log(resp);

                  if(angular.equals(resp.data.status,'success')){
//                      $.UIkit.notify({
//                         message : resp.data.msg,
//                         status  : 'success',
//                         timeout : 2000,
//                         pos     : 'top-center'
//                      });
//                      getHeldDocumentsList();
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
                   console.log(err)
                   vm.isDisable = false;
                   $.UIkit.notify({
                           message : "Internal server error",
                           status  : 'warning',
                           timeout : 3000,
                           pos     : 'top-center'
                   });
                }
           );
        };

        function onchangePage(current,old){
          vm.reqForDocumentList.page_no = current;
          getDocumentList()
          //alert(current+","+old)
        };

        function toggleIcon(e) {
            $(e.target)
            .prev('.panel-heading')
            .find(".more-less")
            .toggleClass('fa fa-plus-square-o fa fa-minus-square-o');
        }
        $('.panel-group').on('hidden.bs.collapse', toggleIcon);
        $('.panel-group').on('shown.bs.collapse', toggleIcon);

        vm.sort = {
            column: 'b',
            descending: false
        };



        $scope.head = {
          a: "Name",
          b: "Created",
          c: "Modified",
          d: "Actions"
        };
//        $scope.columnVal = 'b'
//        $scope.descendingVal = false
//
//        function selectedCls(column) {
//            return column == vm.sort.column && 'sort-' + vm.sort.descending;
//        };
//
//        function changeSorting(column) {
//            var sort = vm.sort;
//            if (sort.column == column) {
//                $scope.columnVal = column
//                sort.descending = !sort.descending;
//                $scope.descendingVal = !sort.descending;
//            } else {
//                sort.column = column;
//                $scope.columnVal = column
//                sort.descending = false;
//                $scope.descendingVal = false
//            }
//        };

         // template rules code

          $scope.activeClass = "buttonActive";
          $scope.selectedButton = [];
          $scope.ruleListShow = true;
          $scope.showTemplate = true;

          $scope.switchCondition = function(prop,index){
             $scope.selectedButton[index] = prop;
             if(prop != 'DEL'){
               if($scope.rulesObj[index].content != '' && $scope.rulesObj[index].contains != '' && $scope.rulesObj[index].providerValue != ''){
                 $scope.rulesObj[index+1] = {
                                               "content":"Content",
                                               "contains":"Contains",
                                               "providerValue":"",
                                               "condition" : prop
                                            }
                 $scope.errorInRule = "";
               }
               else{
                 $scope.errorInRule = "Should specify the provider value";
               }
             }
             else if($scope.rulesObj.length != 1){
               $scope.rulesObj.splice(index,1);
               $scope.errorInRule = "";
             }
          }

          $scope.documentSelect = function(index){
             $scope.ruleListShow = false;
             $scope.documentIndex = index;
             $scope.selectedForRule = vm.documentsList[index].classification_values;
             $scope.selectedForRuleObj = vm.documentsList[index];
             $scope.errorInRule = "";
             $scope.selectedImageUrl = '/static'+vm.documentsList[index].file_path;
             //$scope.selectedImageUrl = 'images/working.png';
             if($scope.selectedForRule.length==0){
                $scope.rulesObj = [
                                {
                                   "content":"Content",
                                   "contains":"Contains",
                                   "providerValue":""
                                }
                              ]
             }
             else{
                $scope.rulesObj = $scope.selectedForRule;
             }
          }

          $scope.saveTemplateRules = function(){
             if($scope.rulesObj.length >= 5){
               $scope.selectedForRuleObj.classification_values = $scope.rulesObj;
               documentService.saveConfigurations(vm.sess_id,$scope.selectedForRuleObj).then(function(resp){
                 if(resp.data.status == "success"){
                   $.UIkit.notify({
                           message : resp.data.msg,
                           status  : 'success',
                           timeout : 3000,
                           pos     : 'top-center'
                   });
                   $scope.ruleListShow = true;
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
             }
             else{
               $.UIkit.notify({
                       message : "Minimum five rules has to specify",
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
               });
             }
          }

    };
