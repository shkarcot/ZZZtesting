module.exports = ['$scope','$rootScope','ngDialog','Upload','$location','$state','documentService','$window','$interval',function($scope,$rootScope,ngDialog,Upload,$location,$state,documentService,$window,$interval) {
	'use strict';

        var vm = this;
        window.scrollTo(0,0);
        $rootScope.currentState = 'documentTemplate';
        vm.url = $location.protocol() + '://'+ $location.host() +':'+  $location.port();
        vm.loginData = JSON.parse(localStorage.getItem('userInfo'));

        vm.sess_id= vm.loginData.sess_id;
        vm.sendDocObj = {};
        vm.browseName='';
        $scope.goTodomainObjects = function(){
            $scope.stopTimer();
            $state.go('app.entities');
        }

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
        $scope.uploadHeight = $window.innerHeight-180;
        $scope.filter_obj ={"page_no": 1, "no_of_recs": 8, "sort_by": "created_ts","template_type":"known"};

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
           documentService.getDocuments(vm.sess_id,$scope.filter_obj).then(function(resp){
              console.log(resp);
              if(resp.data.status=='success'){
                vm.totalRecords = resp.data.total_count;
                $scope.filter_obj.totalRecords = vm.totalRecords;
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
               if(data.doc_state == 'ready'){
                   $scope.stopTimer();
                   $state.go('app.markerForm',{name:data.template_name,id:data['doc_id']});
               }

        };


        function uploadDic(file){
                vm.sendDocObj = {};
                vm.browseType = file.type;
                vm.browseName = file.name;
                vm.browseFile = file;
                vm.browseFileError = false;
                $('#myModal').modal('hide');
                $(".modal-backdrop").remove();
                vm.display = true;
//                if(vm.browseType =='image/jpg'||vm.browseType =='image/jpeg' ||vm.browseType =='image/png' ||vm.browseType =='application/pdf'){
//
//                }


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

              vm.sendDocObj.template_name =vm.fileName;
              vm.sendDocObj.fields =[];
              vm.sendDocObj.tables =[];



              var flag = true;
              vm.dupNameMessage=''
              vm.showdupMess = false
              angular.forEach(vm.documentsList,function(value,key){
                if(angular.equals(angular.lowercase(value.template_name),angular.lowercase(vm.sendDocObj.template_name))){
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
                    $scope.cancelTemplate();
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

              if(vm.browseFile == undefined || vm.browseFile == null || vm.browseFile == ''){
                 vm.browseFileError = true;
                 vm.isDisable = false;
              }
              else{
                  var flag = true;
                  vm.dupNameMessage=''
                  vm.showdupMess = false
                  angular.forEach(vm.documentsList,function(value,key){
                    if(angular.equals(angular.lowercase(value.template_name),angular.lowercase(vm.fileName))){
                      flag=false;
                    }
                  })
                  if(flag){
                     vm.isDisable = true;
                     file.upload = Upload.upload({
                          url: 'api/ingest/template/',
                          method: 'POST',
                          headers: {"sess_token": vm.loginData.sess_id},
                          data: {"template_name": vm.fileName},
                          file: file
                     })
                     file.upload.then(function (response) {
                        if(response.data.status=='success'){
                              vm.browseName = '';
                              vm.fileName = '';
                              vm.browseType ='';
                              vm.browseFile = '';
                              $.UIkit.notify({
                                 message : response.data.msg,
                                 status  : 'success',
                                 timeout : 2000,
                                 pos     : 'top-center'
                              });
                              vm.isDisable = false;
                              vm.display = false;
                              $scope.cancelTemplate();
                              setTimeout(function(){ vm.getDocumentList(); }, 3000);
                        }
                        else{
                          $.UIkit.notify({
                                 message : response.data.msg,
                                 status  : 'danger',
                                 timeout : 2000,
                                 pos     : 'top-center'
                          });
                          vm.isDisable = false;
                        }
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
              $scope.activePopupText = 'Are you sure you want to delete ' +"'" +obj.template_name+ "'" +' ' + 'Template ?';
              $scope.onConfirmActivation = function (){
                  ngDialog.close();
                documentService.removeTemplate(vm.sess_id,{'template_id':obj.doc_id,"is_deleted":true}).then(function(resp){
                  console.log(resp);

                  if(angular.equals(resp.data.status,'success')){
                      getDocumentList();
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
          d:"Status",
          e: "Actions"
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
             $scope.selectedForTableObj = vm.documentsList[index];
             if($scope.selectedForTableObj.tables!=undefined)
               vm.data = $scope.selectedForTableObj.tables;
             else{
               $scope.selectedForTableObj.tables=[];
               vm.data =[];
             }

//             $scope.errorInRule = "";
//             $scope.selectedImageUrl = '/static'+vm.documentsList[index].file_path;
//             //$scope.selectedImageUrl = 'images/working.png';
//             if($scope.selectedForRule.length==0){
//                $scope.rulesObj = [
//                                {
//                                   "content":"Content",
//                                   "contains":"Contains",
//                                   "providerValue":""
//                                }
//                              ]
//             }
//             else{
//                $scope.rulesObj = $scope.selectedForRule;
//             }
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

          //tables

          $scope.tableName="";
          $scope.showSaveBtn=false;
          $scope.showSpinner=false;
          vm.data=[];

//          $scope.getIdentityTables=function(){
//          var reqObj={"data": {"service_name": "document-microservice","configuration_field":"table_config"},
//                        "trigger": "get_configuration"};
//             identifyTablesServices.getIdentityTables({'sess_id':$scope.sess_id}).then(function(response){
//               if(response.data.status=="success"){
//                vm.data=response.data.data;
//                if(response.data.data.length>0)
//                    $scope.showSaveBtn=true;
//
//               }
//               else{
//                    $.UIkit.notify({
//                       message : response.data.msg,
//                       status  : 'warning',
//                       timeout : 3000,
//                       pos     : 'top-center'
//                   });
//               }
//            });
//          };
//          $scope.getIdentityTables();


          $scope.addTable=function(){
                if($scope.tableName!=""){
                    vm.data.unshift({"headings":["","","","","",""],"top_keys":[],"bottom_keys":[],"table_name":$scope.tableName});
                    $scope.tableName="";
                    if(vm.data.length>0){
                        $scope.showSaveBtn=true;
                    };
                }
                else{
                    $.UIkit.notify({
                       message : "Please enter the table name.",
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                   });
                };
          };

          $scope.addColumn = function(idx){
           vm.data[idx].headings.push("");
          };

          $scope.removeColumn = function (parentIndex,cellIndex) {
            vm.data[parentIndex].headings.splice(cellIndex, 1);
          };
          $scope.deleteTable = function (index,name) {
            ngDialog.open({ template: 'confirmBox',
              controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.activePopupText = 'Are you sure you want to delete ' +"'" +name+ "'" +' ' + 'table ?';
                  $scope.onConfirmActivation = function (){
                      ngDialog.close();
                      vm.data.splice(index, 1);
                      if(vm.data.length>0)
                        $scope.showSaveBtn=true;
                      //vm.saveIdentifyTables();
                  };
              }]
            });
          };


//          vm.saveIdentifyTables=function(){
//            console.log(vm.data);
//            var reqObj={"data": {"service_name": "document-microservice",
//              "configuration": {"defaults": {"table_config": vm.data},"keys": {}
//              }}};
//
//            $scope.showSpinner=true;
//            identifyTablesServices.configureIdentityTable({'sess_id':$scope.sess_id,'data':reqObj}).then(function(response){
//               if(response.data.status=="success"){
//                  $scope.showSpinner=false;
//                  vm.data=[];
//                  $.UIkit.notify({
//                       message : response.data.msg,
//                       status  : 'success',
//                       timeout : 3000,
//                       pos     : 'top-center'
//                   });
//                  $scope.getIdentityTables();
//               }
//               else{
//                    $.UIkit.notify({
//                       message : response.data.msg,
//                       status  : 'warning',
//                       timeout : 3000,
//                       pos     : 'top-center'
//                   });
//               }
//            });
//          };
           vm.saveIdentifyTables = function(){
               $scope.selectedForTableObj.tables = vm.data;
               documentService.saveConfigurations(vm.sess_id,$scope.selectedForTableObj).then(function(resp){
                 if(resp.data.status == "success"){
                   $.UIkit.notify({
                           message : resp.data.msg,
                           status  : 'success',
                           timeout : 3000,
                           pos     : 'top-center'
                   });
                   $scope.ruleListShow = true;
                 }
                 else{
                   $.UIkit.notify({
                           message : resp.data.msg,
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

    $scope.callAtInterval = function() {
        var flag = false
        if(vm.documentsList.length>0){
            angular.forEach(vm.documentsList,function (value,key) {
                if(value.hasOwnProperty('doc_state')){
                    if(value.doc_state == 'pending' || value.doc_state == 'processing'){
                        flag = true;
                    }
                }
            })
        }
        if(flag){
            getDocumentList();
        }
    };
    $scope.stopTimer = function () {
                if (angular.isDefined($scope.timer)) {
                    $interval.cancel($scope.timer);
                }
    };

    $scope.timer = $interval( function(){ $scope.callAtInterval(); }, 30000);

    $scope.pageChanged = function (page) {
            $scope.filter_obj.page_no = page;
            getDocumentList()
    };

    $scope.$on("$destroy",function(){
        $scope.stopTimer();
    });

    $scope.addTemplate = function(){

        document.getElementById("createTemplate").style.width = "40%";
     }

    $scope.cancelTemplate = function(){
        vm.browseName = '';
        vm.fileName = '';
        vm.showdupMess = false;
        vm.browseFile = '';
        vm.browseFileError = false;
        document.getElementById("createTemplate").style.width = "0%";
    };


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

}];