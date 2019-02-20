module.exports = ['$scope', '$state', '$rootScope', 'caseManagementServices','config','ngDialog','bpmnServices',
function($scope, $state, $rootScope, caseManagementServices,config,ngDialog,bpmnServices) {
    'use strict';
    var vm = this;
    $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
    $rootScope.currentState = 'caseManagement';
    $scope.config = config;
    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
    $scope.sess_id= $scope.loginData.sess_id;
    $scope.access_token = $scope.loginData.accesstoken;

    vm.workFlowObj = {"description":"","name":""};
    vm.workflowSaveLoader=false;
    vm.disableSaveBtn=false;
    $scope.current_page = 1;

    vm.allCaseWorkflowsObj=[];
    var solutionObj={};
    var caseManagementApiUrl="";
    bpmnServices.getSolnId().then(function(data){
      solutionObj.solutionId =data.data.solution_id;
      localStorage.setItem("solutionId",data.data.solution_id);
      caseManagementApiUrl=data.data.case_management_url;
      vm.getAllCaseWorkflows($scope.current_page);
    });


    vm.getAllCaseWorkflows=function(currentPage){
        var data = {"data":{"filter_obj":{"page_no":currentPage,"no_of_recs":8,"sort_by":"updated_ts","order_by":false}},"solution_id": solutionObj.solutionId} ;
//        var req = {"filter_obj":{"page_no":currentPage,"no_of_recs":8,"sort_by":"updated_ts","order_by":false}};
        caseManagementServices.getAllWorkFlows({'sess_id':$scope.sess_id,"data": data,'access_token':$scope.access_token}).then(function(response){
           if(response.data.status.success){
             vm.allCaseWorkflowsObj=response.data.metadata.workflows;
             console.log(vm.allCaseWorkflowsObj);

            if(data.data.filter_obj.no_of_recs>=response.data.metadata.total_workflows){
                $scope.no_of_pages=1;
            }
            else{
                var np=response.data.metadata.total_workflows/data.data.filter_obj.no_of_recs;
                $scope.no_of_pages = Math.ceil(np);
            };

           }
           else{
                $.UIkit.notify({
                   message : response.data.status.msg,
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
               });
           }
        });
    };

    vm.changePageNum = function (type) {
        if(type == 'next')
            $scope.current_page++;
        else
            $scope.current_page--;

        vm.getAllCaseWorkflows($scope.current_page);
    };
    vm.keyEnter = function (event) {
        if(event.which === 13) {
           if($scope.current_page<=$scope.no_of_pages) {
               if($scope.current_page>0)
                 vm.getAllCaseWorkflows($scope.current_page);
               else{
                    $.UIkit.notify({
                         message : 'Please Enter  Valid Page number',
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                    });
               }
               }
               else{
                    $.UIkit.notify({
                         message : 'Please Enter Page number less than no.of pages',
                         status  : 'warning',
                         timeout : 3000,
                         pos     : 'top-center'
                    });
               }
        }
    };


    vm.createWorkflow = function(){
        vm.workFlowObj = {};
        document.getElementById("createWorkFlow").style.width = "30%";
    };
    vm.closeCreateWorkflow = function(){
        vm.workFlowObj = {};
        document.getElementById("createWorkFlow").style.width = "0%";
    };
    vm.createNewWorkflow = function(){
        if(vm.workFlowObj.name==''){
            $.UIkit.notify({
               message : 'Workflow name should not empty',
               status  : 'danger',
               timeout : 3000,
               pos     : 'top-center'
             });
            return;
        }
        else{
            vm.workflowSaveLoader=true;
                var apidata = {"caseManageUrl": caseManagementApiUrl, "solution_id": solutionObj.solutionId} ;
                if(vm.workFlowObj.id == undefined){
                    var reqData = {"data": vm.workFlowObj,"solution_id": apidata.solution_id};
                    caseManagementServices.createCaseWorkflow({'sess_id':$scope.sess_id,'data': reqData,"apidata": apidata,'access_token':$scope.access_token}).then(function(response){
                       vm.workflowSaveLoader=false;
                       vm.workFlowObj ={};
                       if(response.data.status.success){
                           vm.getAllCaseWorkflows();
                           vm.closeCreateWorkflow();
                           //vm.createDefaultBPMN(response.data.metadata.workflow.id);
                           $.UIkit.notify({
                               message : response.data.status.msg,
                               status  : 'success',
                               timeout : 3000,
                               pos     : 'top-center'
                           });
                       }
                       else{
                            $.UIkit.notify({
                               message : response.data.status.msg,
                               status  : 'danger',
                               timeout : 3000,
                               pos     : 'top-center'
                           });
                       }
                    },function(err){
                        vm.workflowSaveLoader=false;
                        vm.closeCreateWorkflow();
                        $.UIkit.notify({
                           message : 'Internal Server Error for createCaseWorkflow',
                           status  : 'warning',
                           timeout : 3000,
                           pos     : 'top-center'
                       });
                    });
                }
                else{
                    var reqData = {"data": {"id":vm.workFlowObj.id,"name":vm.workFlowObj.name,"description":vm.workFlowObj.description},"solution_id": apidata.solution_id};
                    caseManagementServices.updateWorkflow({'sess_id':$scope.sess_id,'data': reqData,"apidata": apidata,'access_token':$scope.access_token}).then(function(response){
                       vm.workflowSaveLoader=false;
                       vm.workFlowObj ={};
                       if(response.data.status.success){
                           vm.getAllCaseWorkflows();
                           vm.closeCreateWorkflow();
                           $.UIkit.notify({
                               message : response.data.status.msg,
                               status  : 'success',
                               timeout : 3000,
                               pos     : 'top-center'
                           });
                       }
                       else{
                            $.UIkit.notify({
                               message : response.data.status.msg,
                               status  : 'danger',
                               timeout : 3000,
                               pos     : 'top-center'
                           });
                       }
                    },function(err){
                        vm.workflowSaveLoader=false;
                        vm.closeCreateWorkflow();
                        $.UIkit.notify({
                           message : 'Internal Server Error for createCaseWorkflow',
                           status  : 'warning',
                           timeout : 3000,
                           pos     : 'top-center'
                       });
                    });
                }
        }
    };

    vm.createDefaultBPMN =function(workflowId){
        var r = Math.random().toString(36).substring(7);
        console.log("random", r);
        var ingest_randamString=Math.random().toString(36).substring(7);
        var classify_randamString=Math.random().toString(36).substring(7);
        var reviewClassify_randamString=Math.random().toString(36).substring(7);
        var extractText_randamString=Math.random().toString(36).substring(7);
        var reviewTextExtraction_randamString=Math.random().toString(36).substring(7);
        var extractDomainObjects_randamString=Math.random().toString(36).substring(7);
        var reviewEntityExtraction_randamString=Math.random().toString(36).substring(7);


        var xml='<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="1.16.2"><bpmn:process id="'+workflowId+'" name="'+workflowId+'" isExecutable="true"><bpmn:startEvent id="StartEvent_1"><bpmn:outgoing>SequenceFlow_1gmjska</bpmn:outgoing></bpmn:startEvent><bpmn:serviceTask id="ServiceTask_1gsto1h" name="Ingest Document" camunda:type="external" camunda:topic="ingest_document"><bpmn:extensionElements><camunda:inputOutput><camunda:inputParameter name="solutionId">'+solutionObj.solutionId+'</camunda:inputParameter></camunda:inputOutput></bpmn:extensionElements><bpmn:incoming>SequenceFlow_1gmjska</bpmn:incoming><bpmn:outgoing>SequenceFlow_0lsl9wl</bpmn:outgoing></bpmn:serviceTask><bpmn:sequenceFlow id="SequenceFlow_1gmjska" sourceRef="StartEvent_1" targetRef="ServiceTask_1gsto1h" /><bpmn:serviceTask id="ServiceTask_0pzfkdg" name="Classification" camunda:type="external" camunda:topic="classify_document"><bpmn:extensionElements><camunda:inputOutput><camunda:inputParameter name="solutionId">'+solutionObj.solutionId+'</camunda:inputParameter></camunda:inputOutput></bpmn:extensionElements><bpmn:incoming>SequenceFlow_0lsl9wl</bpmn:incoming><bpmn:outgoing>SequenceFlow_1laetje</bpmn:outgoing></bpmn:serviceTask><bpmn:sequenceFlow id="SequenceFlow_0lsl9wl" sourceRef="ServiceTask_1gsto1h" targetRef="ServiceTask_0pzfkdg" /><bpmn:serviceTask id="ServiceTask_003o0gq" name="Review Classification " camunda:type="external" camunda:topic="manual_review"><bpmn:extensionElements><camunda:inputOutput><camunda:inputParameter name="solutionId">'+solutionObj.solutionId+'</camunda:inputParameter><camunda:inputParameter name="review_id">classification_review</camunda:inputParameter></camunda:inputOutput></bpmn:extensionElements><bpmn:incoming>SequenceFlow_1laetje</bpmn:incoming><bpmn:outgoing>SequenceFlow_1bi4kaw</bpmn:outgoing></bpmn:serviceTask><bpmn:sequenceFlow id="SequenceFlow_1laetje" sourceRef="ServiceTask_0pzfkdg" targetRef="ServiceTask_003o0gq" /><bpmn:serviceTask id="ServiceTask_1i0hzgf" name="Text Extraction" camunda:type="external" camunda:topic="extract_text"><bpmn:extensionElements><camunda:inputOutput><camunda:inputParameter name="solutionId">'+solutionObj.solutionId+'</camunda:inputParameter></camunda:inputOutput></bpmn:extensionElements><bpmn:incoming>SequenceFlow_1bi4kaw</bpmn:incoming><bpmn:outgoing>SequenceFlow_0rt70bx</bpmn:outgoing></bpmn:serviceTask><bpmn:sequenceFlow id="SequenceFlow_1bi4kaw" sourceRef="ServiceTask_003o0gq" targetRef="ServiceTask_1i0hzgf" /><bpmn:serviceTask id="ServiceTask_10food8" name="Review Text Extraction " camunda:type="external" camunda:topic="manual_review"><bpmn:extensionElements><camunda:inputOutput><camunda:inputParameter name="solutionId">'+solutionObj.solutionId+'</camunda:inputParameter><camunda:inputParameter name="review_id">text_extraction_review</camunda:inputParameter></camunda:inputOutput></bpmn:extensionElements><bpmn:incoming>SequenceFlow_0rt70bx</bpmn:incoming><bpmn:outgoing>SequenceFlow_0ubb0wq</bpmn:outgoing></bpmn:serviceTask><bpmn:sequenceFlow id="SequenceFlow_0rt70bx" sourceRef="ServiceTask_1i0hzgf" targetRef="ServiceTask_10food8" /><bpmn:serviceTask id="ServiceTask_1aqo8h1" name="Entity Extraction" camunda:type="external" camunda:topic="extract_domain_objects"><bpmn:extensionElements><camunda:inputOutput><camunda:inputParameter name="solutionId">'+solutionObj.solutionId+'</camunda:inputParameter></camunda:inputOutput></bpmn:extensionElements><bpmn:incoming>SequenceFlow_0ubb0wq</bpmn:incoming><bpmn:outgoing>SequenceFlow_02enhuf</bpmn:outgoing></bpmn:serviceTask><bpmn:sequenceFlow id="SequenceFlow_0ubb0wq" sourceRef="ServiceTask_10food8" targetRef="ServiceTask_1aqo8h1" /><bpmn:serviceTask id="ServiceTask_0w6iqae" name="Review Entity Extraction " camunda:type="external" camunda:topic="manual_review"><bpmn:extensionElements><camunda:inputOutput><camunda:inputParameter name="solutionId">'+solutionObj.solutionId+'</camunda:inputParameter><camunda:inputParameter name="review_id">entity_extraction_review</camunda:inputParameter></camunda:inputOutput></bpmn:extensionElements><bpmn:incoming>SequenceFlow_02enhuf</bpmn:incoming><bpmn:outgoing>SequenceFlow_08xqgeu</bpmn:outgoing></bpmn:serviceTask><bpmn:sequenceFlow id="SequenceFlow_02enhuf" sourceRef="ServiceTask_1aqo8h1" targetRef="ServiceTask_0w6iqae" /><bpmn:endEvent id="EndEvent_0yjrgoh"><bpmn:incoming>SequenceFlow_08xqgeu</bpmn:incoming></bpmn:endEvent><bpmn:sequenceFlow id="SequenceFlow_08xqgeu" sourceRef="ServiceTask_0w6iqae" targetRef="EndEvent_0yjrgoh" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="solution1_wf_5"><bpmndi:BPMNShape id="StartEvent_0e6r49g_di" bpmnElement="StartEvent_1"><dc:Bounds x="162" y="116" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="135" y="152" width="90" height="20" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="ServiceTask_1gsto1h_di" bpmnElement="ServiceTask_1gsto1h"><dc:Bounds x="235" y="94" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_1gmjska_di" bpmnElement="SequenceFlow_1gmjska"><di:waypoint x="198" y="134" /><di:waypoint x="235" y="134" /><bpmndi:BPMNLabel><dc:Bounds x="216.5" y="113" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="ServiceTask_0pzfkdg_di" bpmnElement="ServiceTask_0pzfkdg"><dc:Bounds x="383" y="94" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_0lsl9wl_di" bpmnElement="SequenceFlow_0lsl9wl"><di:waypoint x="335" y="134" /><di:waypoint x="383" y="134" /><bpmndi:BPMNLabel><dc:Bounds x="359" y="113" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="ServiceTask_003o0gq_di" bpmnElement="ServiceTask_003o0gq"><dc:Bounds x="540" y="94" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_1laetje_di" bpmnElement="SequenceFlow_1laetje"><di:waypoint x="483" y="134" /><di:waypoint x="540" y="134" /><bpmndi:BPMNLabel><dc:Bounds x="511.5" y="113" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="ServiceTask_1i0hzgf_di" bpmnElement="ServiceTask_1i0hzgf"><dc:Bounds x="675" y="94" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_1bi4kaw_di" bpmnElement="SequenceFlow_1bi4kaw"><di:waypoint x="640" y="134" /><di:waypoint x="675" y="134" /><bpmndi:BPMNLabel><dc:Bounds x="657.5" y="113" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="ServiceTask_10food8_di" bpmnElement="ServiceTask_10food8"><dc:Bounds x="675" y="216" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_0rt70bx_di" bpmnElement="SequenceFlow_0rt70bx"><di:waypoint x="725" y="174" /><di:waypoint x="725" y="216" /><bpmndi:BPMNLabel><dc:Bounds x="740" y="189" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="ServiceTask_1aqo8h1_di" bpmnElement="ServiceTask_1aqo8h1"><dc:Bounds x="526" y="216" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_0ubb0wq_di" bpmnElement="SequenceFlow_0ubb0wq"><di:waypoint x="675" y="256" /><di:waypoint x="626" y="256" /><bpmndi:BPMNLabel><dc:Bounds x="650.5" y="235" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="ServiceTask_0w6iqae_di" bpmnElement="ServiceTask_0w6iqae"><dc:Bounds x="374" y="216" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_02enhuf_di" bpmnElement="SequenceFlow_02enhuf"><di:waypoint x="526" y="256" /><di:waypoint x="474" y="256" /><bpmndi:BPMNLabel><dc:Bounds x="500" y="235" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="EndEvent_0yjrgoh_di" bpmnElement="EndEvent_0yjrgoh"><dc:Bounds x="267" y="238" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="285" y="278" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_08xqgeu_di" bpmnElement="SequenceFlow_08xqgeu"><di:waypoint x="374" y="256" /><di:waypoint x="303" y="256" /><bpmndi:BPMNLabel><dc:Bounds x="338.5" y="235" width="0" height="12" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>';
        var reqObj= {"data" : { "workflow_id" : workflowId, "xmlContent" : xml}, "solution_id": solutionObj.solutionId};
        reqObj.data['is_published'] =true;
        console.log(reqObj);
        bpmnServices.saveBpmn(reqObj, $scope.sess_id).then(function(data){
            if(data.data.status.success){
                $.UIkit.notify({
                   message : data.data.status.msg,
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
                });
                vm.getAllBpmns("new");
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
            console.log("error@saveBpmn----"+err.error);
        });


    };

    vm.setWorkflowStatus = function(index,workflow,is_enabled){
        var reqObj={"data":{"id":workflow.id},"is_enabled":workflow.is_enabled,"solution_id":solutionObj.solutionId};
        caseManagementServices.enableWorkflow({'sess_id':$scope.sess_id,'data': reqObj,'access_token':$scope.access_token}).then(function(response){
             vm.getAllCaseWorkflows();
             if(response.data.status.success){
                   $.UIkit.notify({
                       message : response.data.status.msg,
                       status  : 'success',
                       timeout : 3000,
                       pos     : 'top-center'
                   });
               }
               else{
                    $.UIkit.notify({
                       message : response.data.status.msg,
                       status  : 'danger',
                       timeout : 3000,
                       pos     : 'top-center'
                   });
               }
            },function(err){
                vm.getAllCaseWorkflows();
                $.UIkit.notify({
                   message : 'Internal Server Error for updateCaseWorkflow',
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
               });
            });
    };

    vm.editWorkflow =function(index,workflow){
        vm.workFlowObj=angular.copy(vm.allCaseWorkflowsObj[index]);
        document.getElementById("createWorkFlow").style.width = "30%";
    };


    vm.deleteWorkflow = function(index,workflow){
        ngDialog.open({ template: 'confirmBox',
          controller: ['$scope','$state' ,function($scope,$state) {
              $scope.activePopupText = 'Are you sure you want to delete "'+workflow.name+'" ?';
              $scope.onConfirmActivation = function (){
                  ngDialog.close();
                  vm.deleteWorkflowFunc(index,workflow);
                  vm.deleteBpmn(workflow);
              };
          }]
        });
     };

    vm.deleteWorkflowFunc =function(index,workflow){
        var apidata = {"caseManageUrl": caseManagementApiUrl, "solution_id": solutionObj.solutionId} ;
        var reqObj={"data":{"id":workflow.id}, "solution_id": solutionObj.solutionId};
        caseManagementServices.deleteCaseWorkflow({'sess_id':$scope.sess_id,'data': reqObj, "apidata": apidata,'access_token':$scope.access_token}).then(function(response){
            vm.getAllCaseWorkflows();
            if(response.data.status.success){
                $.UIkit.notify({
                   message : response.data.status.msg,
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
               });
            }
            else{
                $.UIkit.notify({
                   message : response.data.status.msg,
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
               });

            }

        },function(err){
                vm.closeCreateWorkflow();
                $.UIkit.notify({
                   message : 'Internal Server Error for deleteWorkflow',
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
               });
            });


    };


    vm.gotoCaseObjects = function(workflow){
        $state.go('app.caseObjects',{name:workflow.name,id:workflow.id})
    };

    vm.deleteBpmn=function(workflow){
       var reqObj={
        "solutionId":solutionObj.solutionId,
        "bpmnId":"bpmn_"+workflow.id
        //,"bpmnName":vm.currentBpmnName
       };
        bpmnServices.deleteBpmn(reqObj,caseManagementApiUrl).then(function(response){
            if(response.data.status=="success"){
                $.UIkit.notify({
                   message : "bpmn has been deleted successfully",
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            }

        },function(err){
            console.log("error@deleteBpmn----"+err.error);
        });
    };

}];