module.exports = ['$scope', '$state', '$rootScope','ngDialog','queueService','solutionService', function($scope, $state, $rootScope,ngDialog,queueService,solutionService) {
	'use strict';
      $rootScope.currentState = 'queue';
      var vm=this;
      vm.createQueueObj = {};
      vm.createQueueObj.agents = [];
      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
      vm.sess_id= $scope.loginData.sess_id;
      $(".image-style1").css('max-height', $(window).height()-80);

      solutionService.getSolutions(vm.sess_id).then(function(result){
          if(result.data.status == "success"){
               $scope.solutionsList=result.data.data;
          }
      });

      vm.getAllQueues = function(){
           queueService.getQueues(vm.sess_id).then(function(result){
               if(result.data.status == "success"){
                   vm.queue = result.data.data.all_queues;
                   vm.allSolutions = result.data.data.solutions;
                   var convArray = [];
                   angular.forEach(result.data.data.doc_state,function(value,key){
                       var objec = {"display":key,"value":value};
                       convArray.push(objec);
                   });
                   vm.docStates = convArray;
                   vm.allAgentsObjects = result.data.data.agents;
                   vm.allSupervisors = result.data.data.supervisors;
                   vm.allSolutionBasedDocument = result.data.data.soln_template_data;
               }
               else{
                   $.UIkit.notify({
                       message : result.data.msg,
                       status  : 'danger',
                       timeout : 2000,
                       pos     : 'top-center'
                   });
               }
           });
      };

      vm.getAllQueues();

      vm.createQueue = function(){
        vm.labelForUpload="Create New Queue";
        vm.createQueueObj = {};
        vm.createQueueObj.agents = [];
        vm.solutionTemplatesList = [];
        vm.filteredSupervisor = [];
        vm.allAgents = [];
        vm.showForEdit = false;
        document.getElementById("createQueue").style.width = "40%";
      };

      vm.cancelQueue = function(){
        document.getElementById("createQueue").style.width = "0%";
      };

      vm.saveQueue = function(){
         if(vm.createQueueObj.solution == undefined || vm.createQueueObj.solution == ""){
             $.UIkit.notify({
                   message : "Solution is mandatory",//'Solution name has not been updated',
                   status  : 'danger',
                   timeout : 2000,
                   pos     : 'top-center'
             });
         }
         else{
             if(vm.createQueueObj.document_type == undefined || vm.createQueueObj.document_type.length == 0){
                 $.UIkit.notify({
                       message : "Document type is mandatory",//'Solution name has not been updated',
                       status  : 'danger',
                       timeout : 2000,
                       pos     : 'top-center'
                 });
             }
             else{
                 var allSolutionIds = "";
                 var arr = $scope.solutionsList.filter(function(e){if(e.solution_name==vm.createQueueObj.solution){return e}});
                 allSolutionIds = arr[0].solution_id;
                 vm.createQueueObj.solution_id = angular.copy(allSolutionIds);
                 var doc_array = vm.createQueueObj.document_type.map(function(e){return e.template_id});
                 vm.createQueueObj.document_type = angular.copy(doc_array);
                 var pro_state = vm.createQueueObj.processing_state.map(function(e){return e.value});
                 vm.createQueueObj.processing_state = angular.copy(pro_state);
                 vm.createQueueObjCopy = angular.copy(vm.createQueueObj);
                 if(vm.createQueueObjCopy.document_type.length==vm.solutionTemplatesList.length){
                    vm.createQueueObjCopy.document_type = ['all'];
                 }
                 if(vm.createQueueObj.processing_state == undefined || vm.createQueueObj.processing_state.length == 0){
                     $.UIkit.notify({
                           message : "Processing state is mandatory",//'Solution name has not been updated',
                           status  : 'danger',
                           timeout : 2000,
                           pos     : 'top-center'
                     });
                 }
                 else{
                     if(vm.createQueueObj.supervisor == undefined || vm.createQueueObj.supervisor.length == 0){
                         $.UIkit.notify({
                               message : "Supervisor is mandatory",//'Solution name has not been updated',
                               status  : 'danger',
                               timeout : 2000,
                               pos     : 'top-center'
                         });
                     }
                     else{
                         queueService.createQueue(vm.createQueueObjCopy,vm.sess_id).then(function(result){
                            if(result.data.status=="success"){
                                $.UIkit.notify({
                                       message : result.data.msg,//'Solution name has not been updated',
                                       status  : 'success',
                                       timeout : 2000,
                                       pos     : 'top-center'
                                });
                                vm.getAllQueues();
                                vm.cancelQueue();
                            }
                            else{
                              $.UIkit.notify({
                                   message : result.data.msg,//'Solution name has not been updated',
                                   status  : 'danger',
                                   timeout : 2000,
                                   pos     : 'top-center'
                              });
                            }
                         },function(err){
                            $.UIkit.notify({
                                   message : "Internal server error",//'Solution name has not been updated',
                                   status  : 'danger',
                                   timeout : 2000,
                                   pos     : 'top-center'
                            });
                         });
                     }
                 }
             }
         }
      };

      vm.solutionTemplates = function(){
            vm.solutionTemplatesList = [];
            vm.allAgents = [];
            vm.filteredSupervisor = [];
            vm.allAgents = vm.allAgents.concat(vm.allAgentsObjects[vm.createQueueObj.solution]);
            vm.filteredSupervisor = vm.filteredSupervisor.concat(vm.allSupervisors[vm.createQueueObj.solution]);
            for(var j=0;j<vm.allSolutionBasedDocument[vm.createQueueObj.solution].length;j++){
                vm.allSolutionBasedDocument[vm.createQueueObj.solution][j].solution_name = vm.createQueueObj.solution;
                vm.allSolutionBasedDocument[vm.createQueueObj.solution][j].displayNameInSelect = vm.allSolutionBasedDocument[vm.createQueueObj.solution][j].template_name;
                vm.solutionTemplatesList.push(vm.allSolutionBasedDocument[vm.createQueueObj.solution][j]);
            }
            let unique_array = vm.allAgents.filter(function(elem, index, self) {
                return index == self.indexOf(elem);
            });
            vm.allAgents = [];
            angular.forEach(unique_array,function(value,key){
                if(value!=undefined){
                   vm.allAgents.push(value);
                }
            })

            let unique_array1 = vm.filteredSupervisor.filter(function(elem, index, self) {
                return index == self.indexOf(elem);
            });
            vm.filteredSupervisor = [];
            angular.forEach(unique_array1,function(value,key){
                if(value!=undefined){
                   vm.filteredSupervisor.push(value);
                }
            })

      };

      vm.editQueue = function(val){
          vm.createQueueObj = angular.copy(val);
          vm.solutionTemplates();
          var selectedTemplates = [];
          if(vm.createQueueObj.document_type.length>0){
              if(vm.createQueueObj.document_type[0] == 'all'){
                  selectedTemplates = angular.copy(vm.solutionTemplatesList);
              }else{
                  for(var i = 0;i<vm.createQueueObj.document_type.length;i++){
                      var arr = vm.solutionTemplatesList.filter(function(e){if(vm.createQueueObj.document_type[i] == e.template_id){return e}});
                      selectedTemplates.push(arr[0]);
                  }
              }
          }
          vm.createQueueObj.document_type = angular.copy(selectedTemplates);
          vm.labelForUpload="Edit Queue";
          vm.showForEdit = true;
          document.getElementById("createQueue").style.width = "40%";
      };

      vm.deleteQueue = function(val){
          ngDialog.open({ template: 'confirmBox',
            controller: ['$scope','$state' ,function($scope,$state) {
                $scope.activePopupText = 'Are you sure you want to delete ' +"'" +val.queue_name+ "'" +' ' + 'queue ?';
                $scope.onConfirmActivation = function (){
                    ngDialog.close();
                    queueService.delQueue({"queue_id":val.queue_id},vm.sess_id).then(function(result){
                        if(result.data.status=="success"){
                           $.UIkit.notify({
                               message : result.data.msg,
                               status  : 'success',
                               timeout : 2000,
                               pos     : 'top-center'
                            });
                            vm.getAllQueues();
                        }
                        if(result.data.status=="failure"){
                           $.UIkit.notify({
                               message : result.data.msg,
                               status  : 'danger',
                               timeout : 2000,
                               pos     : 'top-center'
                            });
                        }
                    });
                };
            }]
          });
      };

      vm.selectionComplete = function(){
          vm.solutionTemplates();
      };

      $scope.showData = function(){
          $scope.showMore = true;
      };
      $scope.showLess = function(){
         $scope.showMore = false;
      }

}];