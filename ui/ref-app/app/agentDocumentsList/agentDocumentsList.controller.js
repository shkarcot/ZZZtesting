module.exports = ['$scope','$state','$compile','$timeout', '$rootScope','$sce','$location','agentDocumentsListService','$stateParams','supervisorDocumentsListService', function($scope,$state,$compile,$timeout,$rootScope,$sce,$location,agentDocumentsListService,$stateParams,supervisorDocumentsListService) {
	  'use strict';

	  var vm = this;
      var url = $location.path();
      window.scrollTo(0,0);
      $rootScope.currentState = 'agentDocumentsList';
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= $scope.loginData.sess_id;
      vm.queueType = $stateParams.id;
      $scope.filterObj = {"page_no": 1,"no_of_recs":8};
      $scope.searchText = "";
      $scope.currentQueueName = localStorage.getItem("queueName");
      $scope.caseDocSelection = [];
      $scope.caseDocSelectionChild = [];
      vm.reviewStates = [
          {
            "id": "classification_review",
            "name":"Review Classification",
            "screen_uri": "http://console.r46x.stack.qa.xpms.ai:8080/#/app/multiPage"
          },
          {
            "id": "text_extraction_review",
            "name":"Review Text Extraction",
            "screen_uri": "http://console.r46x.stack.qa.xpms.ai:8080/#/app/extraction"
          },
          {
            "id": "entity_extraction_review",
            "name":"Review Entity Extraction",
            "screen_uri": "http://console.r46x.stack.qa.xpms.ai:8080/#/app/entityLinking"
          },
          {
            "id": "post_processed_review",
            "name":"Review Post Processed",
            "screen_uri": "http://console.r46x.stack.qa.xpms.ai:8080/#/app/post-processed"
          }
        ]

//      vm.agentsList = [{'id': '123',
//				    'name': 'arun'},{'id': '234',
//				    'name': 'vijay'},{'id': '345',
//				    'name': 'sandeep'}];

      vm.getQueueCases = function(){
          var reqObj = {
              "solution_id": $scope.loginData.solutionId,
              "data": {
                "filter_by": {
                  "search_by": $scope.searchText,
                  "queue_id": $stateParams.id,
                  "pagination": {
                    "page_no": $scope.filterObj.page_no,
                    "no_of_recs": $scope.filterObj.no_of_recs,
                    "sort_by": "created_ts",
                    "order_by": false
                  }
                }
              }
          };

          agentDocumentsListService.getQueueDocuments(reqObj,vm.sess_id,$scope.loginData.accesstoken).then(function(data){
                   if(data.data.status.success){
                       vm.caseDocumentsList = data.data.metadata.documents;
//                       vm.agentsList = data.data.agents;
//                       vm.stateOfDocument = data.data.state;
                       if(data.data.metadata.total_documents != undefined)
                           vm.documentsLength = data.data.metadata.total_documents;
//                       vm.queueList = data.data.queue_name;
                   }
                   else{
                         $.UIkit.notify({
                                   message : data.data.status.msg,
                                   status  : 'danger',
                                   timeout : 3000,
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

      setTimeout(function request() {
            vm.getQueueCases();
      }, 1500);

      vm.getAgentsList = function(){
           var userGroups = JSON.parse(localStorage.getItem("userGroups"));
           if(userGroups != null && $stateParams.id != "Uncategorized"){
               var reqObj = {
                                'solution_id': $scope.loginData.solutionId,
                                'data':{'roles': ['bu'],"user_groups": userGroups.user_groups,"queue_id":userGroups.id}
                            };
           }
           else{
               var reqObj = {
                                'solution_id': $scope.loginData.solutionId,
                                'data':{'roles': ['bu'],"user_groups":[],"queue_id": "Uncategorized"}
                            };
           }

           agentDocumentsListService.getAgents(reqObj,vm.sess_id,$scope.loginData.accesstoken).then(function(data){
               if(data.data.status.success){
                   vm.agentsList = data.data.metadata.agents;
               }
               else{
                   $.UIkit.notify({
                           message : data.data.status.msg,
                           status  : 'danger',
                           timeout : 3000,
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

      vm.getAgentsList();

      //setTimeout(vm.getQueueCases(), 2000);

      vm.assignAgentFromDrop = function(obj){
            var reqObj = angular.copy(obj);
            reqObj.assignee = vm.agentSelected;
            reqObj.queue_id = $stateParams.id;
            var reqArray = [];
            reqArray.push(reqObj);
            vm.updateAgentDoc(reqArray);
      };

      vm.assignAgent = function(obj){
            var reqObj = {
              "data": {
                "cases": [{
                    "user_id": $scope.loginData._id,
                    "case_id": obj.case_id,
                    "user_name": $scope.loginData.username
                }]
              },
              "solution_id": $scope.loginData.solutionId
            }

            vm.updateAgentDoc(reqObj);
      };

      vm.updateAgentDoc = function(reqObj){
           supervisorDocumentsListService.assignAgent(reqObj,vm.sess_id,$scope.loginData.accesstoken).then(function(data){
                   if(data.data.status.success){
//                       vm.getQueueCases();
                       for(var i=0;i<reqObj.data.cases.length;i++){
                           var indexVal = vm.caseDocumentsList.findIndex(x => x.case_id==reqObj.data.cases[i].case_id);
                           vm.caseDocumentsList[indexVal].user_id = reqObj.data.cases[i].user_id;
                           vm.caseDocumentsList[indexVal].user_name = reqObj.data.cases[i].user_name;
                       };
                       $scope.caseDocSelection = [];
                       $scope.caseDocSelectionChild = [];
                       vm.agentSelected = "";
                       $.UIkit.notify({
                                   message : data.data.status.msg,
                                   status  : 'success',
                                   timeout : 3000,
                                   pos     : 'top-center'
                         });
                   }
                   else{
                         $.UIkit.notify({
                                   message : data.data.status.msg,
                                   status  : 'danger',
                                   timeout : 3000,
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

      vm.getProcessListDetails =function(obj,type,index,parentfilename){
           localStorage.setItem("parentfilename",parentfilename);
            if(obj.child_cases.length>0)
              return;
            if(obj.assignee != null){
                $rootScope.queueId = $stateParams.id;
                if(obj.doc_state == 'processing'){
                }
                else if(obj.doc_state == 'classified'){
                    $state.go("app.multiPage",{id:obj.doc_id,queue:$stateParams.id})
                }
                else if(obj.doc_state == 'extracted'){
                    $state.go("app.extraction",{id:obj.doc_id,type:'none',queue:$stateParams.id})
                }
                else if(obj.doc_state == 'processed'){
                    $state.go("app.entityLinking",{id:obj.doc_id,type:'none',queue:$stateParams.id})
                }
                else if(obj.doc_state == 'post_processed'){
                    $state.go("app.review",{id:obj.doc_id, type:"none",queue:$stateParams.id,state: obj.doc_state})
                }
                else if(obj.doc_state == 'reviewed'){
                    $state.go("app.review",{id:obj.doc_id, type:"none",queue:$stateParams.id,state: obj.doc_state})
                }
                else{
                    if(obj.extn != "email"){
                        if(obj.is_failed==undefined)
                           $scope.stateChange(obj,type,index);
                        else{
                           if(!obj.is_failed)
                             $scope.stateChange(obj,type,index);
                        }
                    }
                    else{
                        $state.go("app.review",{id:obj.doc_id, type:"email",queue:$stateParams.id,state: obj.doc_state})
                    }
                }
            }
            else{
                $.UIkit.notify({
                       message : "Please assign agent to review this document",
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                });
            }

      };

      vm.navigateReview = function(obj,type,index,parentfilename){
            localStorage.setItem("parentfilename",parentfilename);
            if(obj.user_id != null){
                $rootScope.queueId = $stateParams.id;
                if(obj.review_id != undefined){
                    if(obj.review_id != null){
                        var arr = vm.reviewStates.filter(function(e){if(e.id==obj.review_id){return e}});
                        if(arr[0].id=="classification_review"){
                            $state.go("app.multiPage",{id:obj.doc_id,queue:$stateParams.id});
                        }
                        else if(arr[0].id=="text_extraction_review"){
                            $state.go("app.extraction",{id:obj.doc_id,type:'none',queue:$stateParams.id})
                        }
                        else if(arr[0].id=="entity_extraction_review"){
                            $state.go("app.entityLinking",{id:obj.doc_id,type:'none',queue:$stateParams.id})
                        }
                        else if(arr[0].id=="post_processed_review"){
                            $state.go("app.review",{id:obj.doc_id, type:"none",queue:$stateParams.id,state: obj.state})
                        }
                    }
                }
            }
            else{
                $.UIkit.notify({
                       message : "Please assign agent to review this document",
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                });
            }
      };

      $scope.getChildDetails = function(obj,index){
            if(obj.child_cases.length>0){
              if(!obj.isExpanded){

                  var reqObj = {'solution_id': $scope.loginData.solutionId,
                      'data':{
                            "parent_id": obj.case_id,
                            'queue_id': $stateParams.id
                         }
                     }
                  obj.spinner = true;
                  agentDocumentsListService.childDocs(reqObj,vm.sess_id,$scope.loginData.accesstoken).then(function(data){
                       if(data.data.status.success){
                          //$scope.processListData=data.data.data;
                          obj.child_cases = data.data.metadata.documents;
                          obj.isExpanded = !obj.isExpanded;
                          obj.spinner = false;
                       }
                       else{
                         $.UIkit.notify({
                                   message : data.data.status.msg,
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
              }
              else{
                obj.isExpanded = !obj.isExpanded
                obj.spinner = false;
              }

            }

      };

      $scope.pageChanged = function(newPage) {
        $scope.filterObj.page_no = newPage;
        $scope.caseDocSelection = [];
        $scope.caseDocSelectionChild = [];
        vm.getQueueCases();
      };


      $scope.monthShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

      $scope.formatDateInList = function(ts){
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
     };

     $scope.caseSelectFunct = function(){
        var setFlag = false;
        for(var i=0;i<$scope.caseDocSelection.length;i++){
            if($scope.caseDocSelection[i]){
                setFlag = true;
            }
        };
        $scope.transferSelectionFlag = setFlag;
     };

     $scope.caseSelectFunctChild = function(){
        var setFlag = false;
        console.log($scope.caseDocSelectionChild);
        for(var i=0;i<$scope.caseDocSelectionChild.length;i++){
            angular.forEach($scope.caseDocSelectionChild[i],function(value,key){
                if(value){
                    setFlag = true;
                }
            });
        };
        $scope.transferSelectionFlagChild = setFlag;
     };

     $scope.showEditDropdown = function(index,e){
        e.stopPropagation();
        $scope.showAgentDrop = [];
        $scope.showAgentDrop[index] = true;
     };

     vm.transferTo = function(){
        var transferDocs = [];
        var casesSelected = [];
        for(var i=0;i<$scope.caseDocSelection.length;i++){
            if($scope.caseDocSelection[i]){
                transferDocs.push(vm.caseDocumentsList[i]);
            }
        };
        for(var i=0;i<$scope.caseDocSelectionChild.length;i++){
            angular.forEach($scope.caseDocSelectionChild[i],function(value,key){
                if(value){
                    transferDocs.push(vm.caseDocumentsList[i].child_cases[key]);
                }
            });
        };
        for(var i=0;i<transferDocs.length;i++){
            casesSelected.push(transferDocs[i].case_id);
        };

        var casesList = [];
        var selectedUser = vm.agentsList.filter(function(e){if(e.id==vm.agentSelected){return e}});

        for(var i=0;i<casesSelected.length;i++){
            casesList.push({"user_id": vm.agentSelected,"case_id":casesSelected[i],"user_name":selectedUser[0].name});
        }

        var reqObj = {
          "data": {
            "cases": casesList
          },
          "solution_id": $scope.loginData.solutionId
        }
        vm.updateAgentDoc(reqObj);
     };

     $scope.returnFilename = function(arr){
        if("metadata_properties_filename" in  arr && arr["metadata_properties_filename"] != null){
            return arr["metadata_properties_filename"];
        } else  if("metadata.properties.filename" in  arr && arr["metadata.properties.filename"] != null){
            return arr["metadata.properties.filename"];
        } else if("source" in arr && arr["source"] != null) {
            var filePath = arr.source.file_path;
            var splitArr = filePath.split("/");
            var fileName = splitArr[splitArr.length-1];
            return fileName;
        }
        return "";
     };

     $scope.returnTemplatename = function(arr){
        if("metadata_template_info_name" in  arr && arr["metadata_template_info_name"] != null){
            return arr["metadata_template_info_name"];
        } else  if("metadata.template_info.name" in  arr && arr["metadata.template_info.name"] != null){
            return arr["metadata.template_info.name"];
        }
        return "";
     };

     $scope.checkForReview = function(state){
        var arr = vm.reviewStates.filter(function(e){if(state == e.id){return e}});
        if(arr.length > 0)
            return true;
        else
            return false;
     };

     vm.checkErrDetail = function(list){
        document.getElementById("errPanel").style.width = "40%";
        if(list.error_details != undefined)
            $scope.errDetail = JSON.parse(list.error_details.message);
        else
            $scope.errDetail = "";
     };

     $scope.cancelErr = function () {
        document.getElementById("errPanel").style.width = "0%";
     };

     vm.reprocessState = function(obj){
        agentDocumentsListService.reprocessDoc(reqObj,vm.sess_id,$scope.loginData.accesstoken).then(function(data){
                   if(data.data.status.success){
                       $.UIkit.notify({
                                   message : data.data.status.msg,
                                   status  : 'success',
                                   timeout : 3000,
                                   pos     : 'top-center'
                       });
                   }
                   else{
                         $.UIkit.notify({
                                   message : data.data.status.msg,
                                   status  : 'danger',
                                   timeout : 3000,
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

     vm.proceedToNextState = function(obj){
        agentDocumentsListService.proceedTo(reqObj,vm.sess_id,$scope.loginData.accesstoken).then(function(data){
                   if(data.data.status.success){
                       $.UIkit.notify({
                                   message : data.data.status.msg,
                                   status  : 'success',
                                   timeout : 3000,
                                   pos     : 'top-center'
                       });
                   }
                   else{
                         $.UIkit.notify({
                                   message : data.data.status.msg,
                                   status  : 'danger',
                                   timeout : 3000,
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


}];