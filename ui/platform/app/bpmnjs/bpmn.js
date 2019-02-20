'use strict';
angular.module('console.caseManagement')
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
.controller('bpmnController', function ($scope, $state,$rootScope,$stateParams,bpmnServices,$http,ngDialog,$element,$timeout,$window,$location,caseManagementServices) {

    var vm = this;
    vm.wf_id = $stateParams.id;
    vm.seleted_workflow_name  = $stateParams.name;

    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
    $scope.sess_id= $scope.loginData.sess_id;
    $scope.access_token = $scope.loginData.accesstoken;

    vm.currentBpmnName="";
    vm.selectedBpmn="";
    vm.currentBpmnObj="";
    vm.currentBpmnObj=bpmnServices.getSelectedBpmn();

    vm.newWorkflowFlag=false;

    vm.bpmnStatus={"state":"Active","show":true};


    if(vm.currentBpmnObj.hasOwnProperty('$$hashKey'))
        delete vm.currentBpmnObj.$$hashKey;

    vm.selectedBpmn =JSON.stringify(vm.currentBpmnObj);
    vm.currentBpmnName= vm.currentBpmnObj.name!=undefined ? vm.currentBpmnObj.name : "";

    vm.serviceObj=$stateParams.selctdBpmnObj;

    var caseManagementApiUrl='';
    var filepath ='/efs/bpmn';

    $rootScope.currentState = 'bpmn';
    var userData=localStorage.getItem('userInfo');
    userData=JSON.parse(userData);
    if(userData.user==undefined ){
        userData.user = {};
    }

    vm.sess_id = userData.sess_id;
    vm.username = userData.username;
    $scope.selectedOptionsOfServices={};
    $scope.selectedOptionsOfUris={};
    $scope.selectedOptionsOfManualReview={};
    $scope.listOFEndEvents={};
    $scope.showNewWorkflow=true;
    var solutionObj= {};
    $scope.enteredSeqFlowValue={};
    vm.taskIdMappingList={};

    $scope.selectedOptionsOfSequenceFlow={};
    bpmnServices.getSolnId().then(function(data){
      solutionObj.solutionId =data.data.solution_id;
      userData.user.solution_id=data.data.solution_id;
      caseManagementApiUrl=data.data.case_management_url;
      vm.getAllBpmns("");
      vm.getPipelinesList();
      $rootScope.getAllTaskLevelVariables();
    });


    var BpmnModeler = require('./bpmn-js/lib/Modeler'),
    propertiesPanelModule = require('./bpmn-js-properties-panel'),
    propertiesProviderModule = require('./bpmn-js-properties-panel/lib/provider/camunda'),
    camundaModdleDescriptor = require('./camunda-bpmn-moddle/resources/camunda'),
    container = $('#js-drop-zone'),
    canvas = $('#js-canvas');

    vm.isExistBpmn={'save':true,'update':false,'delete':false};

    var time = Date.now || function() {
      return +new Date;
    };

    var bpmnId=angular.copy(time());
     var newDiagram='<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="1.16.2"><bpmn:process id="'+vm.wf_id+'" name="'+vm.wf_id+'" isExecutable="true"><bpmn:startEvent id="StartEvent_1" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="vm.wf_id"><bpmndi:BPMNShape id="StartEvent_0e6r49g_di" bpmnElement="StartEvent_1"><dc:Bounds x="173" y="102" width="36" height="36" /></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>';
     // var newDiagram='<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="1.16.2"><bpmn:process id="ExternalJsExample" name="External JS Example" isExecutable="true" camunda:versionTag="1.0.0"><bpmn:startEvent id="StartEvent_1" name="Collect String to Parse"><bpmn:extensionElements><camunda:formData><camunda:formField id="jsonString" label="String to be Parsed into JSON Object" type="string" /></camunda:formData></bpmn:extensionElements><bpmn:outgoing>SequenceFlow_1khj7oq</bpmn:outgoing></bpmn:startEvent><bpmn:sequenceFlow id="SequenceFlow_1khj7oq" sourceRef="StartEvent_1" targetRef="ScriptTask_0ew4gp3" /><bpmn:sequenceFlow id="SequenceFlow_047ibd3" sourceRef="UserTask_1w4j0e2" targetRef="EndEvent_0ugc86n" /><bpmn:userTask id="UserTask_1w4j0e2" name="Review Parsed Value" camunda:assignee="demo"><bpmn:extensionElements><camunda:formData><camunda:formField id="returnedParsedValue" label="Returned Number" type="string" defaultValue="${jsonParsed}"><camunda:validation><camunda:constraint name="readonly" /></camunda:validation></camunda:formField></camunda:formData></bpmn:extensionElements><bpmn:incoming>SequenceFlow_0xpqtxa</bpmn:incoming><bpmn:outgoing>SequenceFlow_047ibd3</bpmn:outgoing></bpmn:userTask><bpmn:scriptTask id="ScriptTask_0ew4gp3" name="Parse String6" scriptFormat="groovy" camunda:resultVariable="jsonParsed" camunda:resource="dddddddddddd"><bpmn:incoming>SequenceFlow_1khj7oq</bpmn:incoming><bpmn:outgoing>SequenceFlow_0xpqtxa</bpmn:outgoing></bpmn:scriptTask><bpmn:sequenceFlow id="SequenceFlow_0xpqtxa" sourceRef="ScriptTask_0ew4gp3" targetRef="UserTask_1w4j0e2" /><bpmn:endEvent id="EndEvent_0ugc86n" name="Complete"><bpmn:incoming>SequenceFlow_047ibd3</bpmn:incoming></bpmn:endEvent></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="ExternalJsExample"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"><dc:Bounds x="60" y="42" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="33" y="78" width="90" height="20" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_1khj7oq_di" bpmnElement="SequenceFlow_1khj7oq"><di:waypoint x="96" y="60" /><di:waypoint x="146" y="60" /><bpmndi:BPMNLabel><dc:Bounds x="-43" y="35" width="90" height="20" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="SequenceFlow_047ibd3_di" bpmnElement="SequenceFlow_047ibd3"><di:waypoint x="399" y="60" /><di:waypoint x="459" y="60" /><bpmndi:BPMNLabel><dc:Bounds x="268.5" y="35" width="90" height="20" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="UserTask_1w4j0e2_di" bpmnElement="UserTask_1w4j0e2"><dc:Bounds x="299" y="20" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="ScriptTask_0ew4gp3_di" bpmnElement="ScriptTask_0ew4gp3"><dc:Bounds x="146" y="20" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNEdge id="SequenceFlow_0xpqtxa_di" bpmnElement="SequenceFlow_0xpqtxa"><di:waypoint x="246" y="60" /><di:waypoint x="299" y="60" /><bpmndi:BPMNLabel><dc:Bounds x="290" y="56" width="90" height="20" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNShape id="EndEvent_0ugc86n_di" bpmnElement="EndEvent_0ugc86n"><dc:Bounds x="459" y="42" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="432" y="78" width="90" height="20" /></bpmndi:BPMNLabel></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>';


    vm.modelerServices=[];
    vm.selectBoxOptions="";
    vm.generateSelectBoxOptions=function(obj, previousValue){
       var html="";
        angular.forEach(obj,function(val,key){
            if(previousValue!="" && val.value==previousValue)
                html+='<option selected value="'+val.value+'">'+val.name+'</option>'
            else
                html+='<option value="'+val.value+'">'+val.name+'</option>'
        });
        vm.selectBoxOptions=html;
        console.log("vm.selectBoxOptions-->",vm.selectBoxOptions);
        return vm.selectBoxOptions;
    };

    vm.selectBoxTopicOptions="";
    vm.generateSelectBoxTopicOptions=function(obj, previousValue){
       var html="";
        angular.forEach(obj,function(val,key){
            if(previousValue!="" && val.value==previousValue)
                html+='<option selected value="'+val.value+'">'+val.name+'</option>'
            else
                html+='<option value="'+val.id+'">'+val.name+'</option>'
        });
        vm.selectBoxTopicOptions=html;
        console.log("vm.selectBoxTopicOptions-->",vm.selectBoxTopicOptions);
        return vm.selectBoxTopicOptions;
    };


    vm.modelerServices=[];
    vm.serviceTopics=[
           {
              "name": "Email Listener",
              "value": "emailListener"
            },
            {
              "name": "Case Creation",
              "value": "caseCreation"
            },
            {
              "name": "Ingestion",
              "value": "ingestion"
            },
            {
              "name": "Classify",
              "value": "classify"
            },
            {
              "name": "End Task",
              "value": "endTask"
            }
          ];

   $scope.selectedManualReviewObj={};
   vm.listForManualReview=[
                            {
                                "id": "classification_review",
                                "name":"Review Classification",
                                "screen_uri": ""
                            },
                            {
                                "id": "text_extraction_review",
                                "name":"Review Text Extraction",
                                "screen_uri": ""
                            },
                            {
                                "id": "entity_extraction_review",
                                "name":"Review Entity Extraction",
                                "screen_uri": ""
                            },
                            {
                                "id": "post_processed_review",
                                "name":"Review Post Processed",
                                "screen_uri": ""
                            }
                        ];

    vm.getManualReviewName=function(id){
        var name="";
        angular.forEach(vm.listForManualReview, function(value, key){
            if(id==value.id){
               name= value.name;
            }
        });
        return name;
    };


    vm.getPipelinesList = function(){
        var reqObj={"data": {"tag" : "default"},"solution_id": solutionObj.solutionId};
        bpmnServices.getAllPipelinesList(reqObj).then(function(data){
            var obj=JSON.parse(data.data);
            if(obj.status=="success"){
                vm.modelerServicesData=obj.data;
                //vm.modelerServices = []
                angular.forEach(vm.modelerServicesData,function(value,key){
                   var obj = {};
                       obj.name = value.display_name;
                       obj.value = value.pipeline_name;
                       vm.modelerServices.push(obj);

                });
                console.log("getPipelinesList==>",obj);
            }
        },function(err){
            console.log("error@getPipelinesList----"+err.error);
        });
    };
    //vm.getPipelinesList();


    vm.apiSpecEndpoints=[];
    vm.optionsForSpecEndpoints="";
    vm.generateOptionsForSpecEndpoints=function(obj, previousValue){
       var html="";
        angular.forEach(obj,function(val,key){
            if(previousValue!="" && val.endpoint_uri==previousValue)
                html+='<option selected value="'+val.endpoint_uri+'">'+val.name+'</option>'
            else
                html+='<option value="'+val.endpoint_uri+'">'+val.name+'</option>'
        });
        vm.optionsForSpecEndpoints=html;

        return vm.optionsForSpecEndpoints;
    };

    vm.optionsForManualReview="";
    vm.generateOptionsForManualReview=function(obj, elementId, currentValue){
      var seltdValue = $scope.selectedOptionsOfManualReview[elementId];
      if(currentValue!=""&&currentValue!=undefined){
        seltdValue=currentValue;
      }
      var html="";
        angular.forEach(obj,function(val,key){
            if(seltdValue!="" && val.id==seltdValue)
                html+='<option selected value="'+val.id+'">'+val.name+'</option>'
            else
                html+='<option value="'+val.id+'">'+val.name+'</option>'
        });
        vm.optionsForManualReview=html;

        return vm.optionsForManualReview;
    };


    vm.getApiSpec = function(){
        bpmnServices.getApiSpec().then(function(data){
           if(data.data.data.status=="success"){
                console.log("getApiSpec",data.data.data.result.api_spec);
                vm.apiSpecEndpoints=data.data.data.result.api_spec;
                vm.generateOptionsForSpecEndpoints(vm.apiSpecEndpoints,"");
                //vm.addApiEndPoints();
           }
        },function(err){
            console.log("error@getApiSpec----"+err.error);
        });
    };
    vm.getApiSpec();

    vm.addApiEndPoints =function(){
        angular.forEach(vm.apiSpecEndpoints, function(value,key){
            vm.modelerServices.push({"name": $scope.setDisplayLabel(value.name),"value":value.endpoint_uri});
        });
    };
    console.log("vm.modelerServices=>",vm.modelerServices);

    $scope.setDisplayLabel=function(key){
            if(key!=""){
                var text = key.replace(/_/g, " ");

                var res = text.split(' ')
               .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
               .join(' ')

                return res;
            }
            else{
                return "";
            }
        };

    vm.selectedIndxOfBPMN=0;
    vm.getAllBpmns = function(eventType){

        var reqObj={"data": {"workflow_id": vm.wf_id}, "solution_id": solutionObj.solutionId };
        bpmnServices.getListOfBpmnFiles(reqObj,$scope.sess_id,$scope.access_token).then(function(response){
            var defaultBpmnSelection="";
            defaultBpmnSelection = newDiagram;

            if(response.data.status.success){

                if(response.data.metadata.workflow.xmlContent){
                    defaultBpmnSelection=response.data.metadata.workflow.xmlContent;

                    angular.forEach(response.data.metadata.workflow.tasks, function(val, key){
                       vm.taskIdMappingList[val.id]=val.name;
                    });

                    vm.isExistBpmn={'publish':true,'draft':true,'delete':false};
                    if(response.data.metadata.workflow.is_published!=undefined){
                        if(response.data.metadata.workflow.is_published){
                            $scope.isPublished=true;
                            $scope.isDrafted=false;
                        }
                        else{
                            $scope.isDrafted=true;
                            $scope.isPublished=false;
                        }
                    }
                }
                else{
                    vm.isExistBpmn={'publish':true,'draft':true,'delete':false};
                }


                    /*if(vm.listOfBpmnFiles.length>0){
                        angular.forEach(vm.listOfBpmnFiles,function(val,key){

                            if("bpmn_"+vm.wf_id==val.bpmnId){
                                defaultBpmnSelection=val.xml;
                                vm.currentBpmnName=val.name;
                                vm.isExistBpmn={'save':true,'update':false,'delete':true};
                            }
                        });
                    }else{
                        defaultBpmnSelection = newDiagram;
                        vm.newWorkflowFlag=true;
                        vm.currentBpmnName="newWorkFlow";
                        vm.isExistBpmn={'save':true,'update':false,'delete':false};
                    }*/


                //vm.selectedBpmn =JSON.stringify(vm.listOfBpmnFiles[0]);
                vm.openDiagram(defaultBpmnSelection);
            }
            else{
                vm.isExistBpmn={'publish':true,'draft':true,'delete':false};
                vm.openDiagram(defaultBpmnSelection);
                $.UIkit.notify({
                   message : response.data.status.msg,
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            }
        },function(err){
            console.log("error----"+err.error);
        });
    }



    var propertiesPanelConfig = {
        'config.propertiesPanel': ['value', {parent: $('#js-properties-panel')}]
    };
    // the diagram we are going to display
    var bpmnModeler = new BpmnModeler({
          container: canvas,
          propertiesPanel: {
            parent: '#js-properties-panel'
          },
          additionalModules: [
            propertiesPanelModule,
            propertiesProviderModule,
            propertiesPanelConfig,
            vm.modelerServices
          ],
          moddleExtensions: {
            camunda: camundaModdleDescriptor
          }
    });

    vm.openDiagram = function(xml) {
        if(xml!=""){

          var xmlFormat = formatXml(xml);
          xml=xmlFormat;
          bpmnModeler.importXML(xml, function(err) {
            if (err) {
              container
                .removeClass('with-diagram')
                .addClass('with-error');
              container.find('.error pre').text(err.message);
              console.error(err);
            } else {
              container
                .removeClass('with-error')
                .addClass('with-diagram');
            }
          });
        }
    };

    vm.openDiagram(newDiagram);

    vm.saveDiagram=function(saveType){
        if(vm.selectedBpmn=="" || vm.selectedBpmn=="{}"){
            var txt_camundaId = document.getElementById("camunda-id");
            var enteredBpmnName ="";
            enteredBpmnName = document.getElementById("camunda-name").innerText;
            if(enteredBpmnName==""){
                //enteredBpmnName.focus();
                $.UIkit.notify({
                   message : "Name should not be empty",
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            }
            else if(txt_camundaId.value==""){
                txt_camundaId.focus();
                $.UIkit.notify({
                   message : "Camunda Id should not be empty",
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            }
            else if(txt_camundaId.value=="Process_1"){
                $.UIkit.notify({
                   message : "Camunda Id should not be 'Process_1', Please change the id",
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            }
            else{
                vm.createOrUpdateBpmn(txt_camundaId.value,enteredBpmnName,saveType);
            }
        }
        else{
            vm.createOrUpdateBpmn();
        }
    };

    vm.createOrUpdateBpmn=function(camundaId, bpmnName,saveType){
        bpmnModeler.saveXML({ format: true }, function(err, xml) {
            if(xml!=undefined){
                var enteredBpmnName ="";
                enteredBpmnName = document.getElementById("camunda-name").innerText;
                if(enteredBpmnName!=""){

                    //url:"http://camunda-dev.ranger.xpms.ai/camunda_poc/rest/servicecalls/uploadBpmn",
                    //var uploadUrl=caseManagementApiUrl+"case-management/rest/servicecalls/uploadBpmn";
                    var uploadUrl=caseManagementApiUrl+"/workflow/bpmn/save";

                    var fd = new FormData();

                    var xmlParser = new DOMParser();
                    var xmlParserDoc = xmlParser.parseFromString(xml,"text/xml");
                    var arrayxmlParserDoc=xmlParserDoc.all;

                    var subProcessId="nifi_pipeline";
                    for(var i=0; i<=arrayxmlParserDoc.length; i++){
                        if(arrayxmlParserDoc[i]!=undefined && arrayxmlParserDoc[i].nodeName=="bpmn:subProcess"){
                            var subProcessId=arrayxmlParserDoc[i].id;
                        }
                    }

                    for(var i=0; i<=arrayxmlParserDoc.length; i++){
                        if(arrayxmlParserDoc[i]!=undefined && arrayxmlParserDoc[i].nodeName=="bpmn:multiInstanceLoopCharacteristics"){
                            if(arrayxmlParserDoc[i].firstElementChild==null){
                                //if(arrayxmlParserDoc[i].firstElementChild.nodeName!= "bpmn:loopCardinality"){
                                    var addloopCardinality=xmlParserDoc.createElement("bpmn:loopCardinality");
                                    addloopCardinality.setAttribute("xsi:type", "bpmn:tFormalExpression");
                                    addloopCardinality.textContent="${instanceCount}";
                                    arrayxmlParserDoc[i].appendChild(addloopCardinality);
                                //}
                            }

                            /*var addloopCardinality = xmlDoc4.getElementById(eKey);
                            if(addConditionExpression!=null){

                                var hasSeqFlow = addConditionExpression.getElementsByTagName("bpmn:sequenceFlow");
                                if(hasSeqFlow.length==0){
                                    var conditionExpression=xmlDoc4.createElement("bpmn:conditionExpression");
                                    conditionExpression.setAttribute("xsi:type", "bpmn:tFormalExpression");
                                    conditionExpression.textContent=val;

                                    addConditionExpression.appendChild(conditionExpression);
                                    xml=xmlToString(xmlDoc4);
                                    var xmlFormat4 = formatXml(xml);
                                    console.log(xmlFormat4);
                                    xml=xmlFormat4;
                                };
                            };*/

                        }
                        if(arrayxmlParserDoc[i]!=undefined && arrayxmlParserDoc[i].nodeName=="bpmn:userTask"){

                            var usertaskElement = xmlParserDoc.getElementById(arrayxmlParserDoc[i].id);

                            if(usertaskElement!=null){

                                var hasUEE = usertaskElement.getElementsByTagName("bpmn:extensionElements");

                                if(hasUEE.length>0){
                                    var y = usertaskElement.getElementsByTagName("bpmn:extensionElements")[0];
                                    usertaskElement.removeChild(y);
                                }

                                var extensionElements = xmlParserDoc.createElement("bpmn:extensionElements")
                                var executionListener=xmlParserDoc.createElement("camunda:executionListener");
                                executionListener.setAttribute("event", "start");

                                var executionListener_script=xmlParserDoc.createElement("camunda:script");
                                executionListener_script.setAttribute("scriptFormat", "groovy");
                                //executionListener_script.setAttribute("scriptFormat", "Javascript");


                                var apiurl= caseManagementApiUrl;
                                apiurl=apiurl.replace('camunda','api');

                                  var scriptContent='var pipelineTrigger="pipeline/trigger";var urlStr='+apiurl+'+pipelineTrigger;var url= new java.net.URL(urlStr);var caseObject = {"updated_ts":{"name":"updated_ts_2","type":"datetime","is_default":true,"dimension":"Document"},"file_path":{"name":"file_path","type":"text","is_default":true,"dimension":"Document"}};if(execution.getVariable("caseObject")!=null) caseObject=execution.getVariable("caseObject");var loopCounter = 0;if (execution.getVariable("loopCounter") != null) {	loopCounter = execution.getVariable("loopCounter");}var docId=caseObject.doc_id.value;var rootId=caseObject.root_id.value;var solutionId=execution.getVariable("solutionId");var taskId=execution.getId();var request =  {"state":{"id":taskId,"case_object":caseObject,"loop_counter":loopCounter},"data":{"doc_id":docId,"root_id":rootId,"pipeline_name":"manual_review"},"solution_id":solutionId};var conn = url.openConnection();conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");conn.setDoOutput(true);conn.setDoInput(true);conn.setRequestMethod("POST");var os = conn.getOutputStream();os.write(JSON.stringify(request).getBytes("UTF-8"));os.close();var inputStream = new java.io.InputStreamReader(conn.getInputStream());var bufferedReader = new java.io.BufferedReader(inputStream);var inputLine ="";var text="";while ((inputLine = bufferedReader.readLine()) != null) {text+=inputLine;}bufferedReader.close();execution.setVariable("responseFromNifi",text);';
                                //var newCDATA1 = xmlParserDoc9.createCDATASection(scriptContent);
                                //executionListener_script.appendChild(newCDATA1);

                                //executionListener_script.textContent=scriptContent;
                                executionListener_script.textContent="";
                                executionListener.appendChild(executionListener_script);
                                extensionElements.appendChild(executionListener);
                                usertaskElement.insertBefore(extensionElements, usertaskElement.firstChild);
                            }
                        };

                        if(arrayxmlParserDoc[i]!=undefined &&
                            (arrayxmlParserDoc[i].nodeName=="bpmn:serviceTask" ||
                            arrayxmlParserDoc[i].nodeName=="bpmn:task" ||
                            arrayxmlParserDoc[i].nodeName=="bpmn:sendTask" ||
                            arrayxmlParserDoc[i].nodeName=="bpmn:scriptTask" ||
                            arrayxmlParserDoc[i].nodeName=="bpmn:receiveTask" ||
                            arrayxmlParserDoc[i].nodeName=="bpmn:businessRuleTask" ||
                            arrayxmlParserDoc[i].nodeName=="bpmn:manualTask" ||
                            arrayxmlParserDoc[i].nodeName=="bpmn:callActivity" ||
                            arrayxmlParserDoc[i].nodeName=="bpmn:userTask")
                        ){
                            var adduri = xmlParserDoc.getElementById(arrayxmlParserDoc[i].id);
                            if(adduri!=null){
                                var hasEE = adduri.getElementsByTagName("bpmn:extensionElements");
                                var existingManualReviewArray=[];
                                if(hasEE.length>0){
                                    var y = adduri.getElementsByTagName("bpmn:extensionElements")[0];
                                    if(y.children[0].childElementCount==3){
                                        existingManualReviewArray=y.children[0].children;
                                    }
                                    adduri.removeChild(y);
                                }
                                var extensionElements = xmlParserDoc.createElement("bpmn:extensionElements")
                                var inputOutput=xmlParserDoc.createElement("camunda:inputOutput");

                                var inputParameter=xmlParserDoc.createElement("camunda:inputParameter");
                                inputParameter.setAttribute("name", "solutionId");
                                inputParameter.textContent=solutionObj.solutionId;
                                inputOutput.appendChild(inputParameter);

                                var inputParameter_dn=xmlParserDoc.createElement("camunda:inputParameter");
                                inputParameter_dn.setAttribute("name", "taskName");
                                inputParameter_dn.textContent=adduri.attributes["name"].nodeValue;
                                inputOutput.appendChild(inputParameter_dn);

                                if(existingManualReviewArray.length>0){
                                    angular.forEach(existingManualReviewArray, function(nodeValue, nodeKey){
                                        if(nodeValue.attributes[0].nodeValue=='review_id'){
                                            var inputParameter_rv=xmlParserDoc.createElement("camunda:inputParameter");
                                            inputParameter_rv.setAttribute("name", "review_id");
                                            inputParameter_rv.textContent=nodeValue.childNodes[0].nodeValue;
                                            inputOutput.appendChild(inputParameter_rv);
                                        };
                                    });
                                };

                                extensionElements.appendChild(inputOutput);
                                adduri.insertBefore(extensionElements, adduri.childNodes[0]);

                            };
                        };

                        /*if(arrayxmlParserDoc[i]!=undefined && arrayxmlParserDoc[i].nodeName=="bpmn:serviceTask"){
                            if(arrayxmlParserDoc[i].attributes[3].nodeValue=="manual_review"){
                                console.log("selectedManualReviewObj==>",$scope.selectedManualReviewObj[arrayxmlParserDoc[i].id]);
                            }
                        };*/

                        /*if(arrayxmlParserDoc[i]!=undefined && arrayxmlParserDoc[i].nodeName=="bpmn:serviceTask"){
                            var attributes= arrayxmlParserDoc[i].attributes;

                            if(attributes.hasOwnProperty("camunda:type")){

                               if (attributes['camunda:type'].value=="external"){
                                    if(attributes['name']==undefined || attributes['name'].value==""){
                                         $.UIkit.notify({
                                           message : "ServiceTask Name should not be empty when selected service is 'External'",
                                           status  : 'warning',
                                           timeout : 3000,
                                           pos     : 'top-center'
                                         });
                                         return false;
                                    }
                                    else{
                                        //arrayxmlParserDoc[i].attributes['camunda:topic']=attributes['name'].value;
                                        arrayxmlParserDoc[i].setAttribute("camunda:topic", attributes['name'].value);
                                    }
                               }
                            }
                        }*/
                    };
                    xml=xmlToString(xmlParserDoc);

                     angular.forEach($scope.selectedOptionsOfServices,function(val,sKey){
                        var selectedValue=val;
                        if(selectedValue!=""){

                            var parser, xmlDoc;
                            parser = new DOMParser();
                            xmlDoc = parser.parseFromString(xml,"text/xml");
                            var extensionElements=xmlDoc.createElement("bpmn:extensionElements");
                            var inputOutput=xmlDoc.createElement("camunda:inputOutput");

                            var adduri = xmlDoc.getElementById(sKey);
                            if(adduri!=null){

                                var attr=adduri.attributes[name];


                                var hasEE = adduri.getElementsByTagName("bpmn:extensionElements");

                                var existingManualReviewArray=[];

                                if(hasEE.length>0){
                                    var y = adduri.getElementsByTagName("bpmn:extensionElements")[0];
                                    if(y.children[0].childElementCount==3){
                                        existingManualReviewArray=y.children[0].children;
                                    }
                                    adduri.removeChild(y);
                                }


                                var inputParameter=xmlDoc.createElement("camunda:inputParameter");
                                inputParameter.setAttribute("name", "solutionId");
                                inputParameter.textContent=solutionObj.solutionId;
                                inputOutput.appendChild(inputParameter);

                                var inputParameter_dn=xmlDoc.createElement("camunda:inputParameter");
                                inputParameter_dn.setAttribute("name", "taskName");
                                inputParameter_dn.textContent=adduri.attributes["name"].nodeValue;
                                inputOutput.appendChild(inputParameter_dn);

                                if(existingManualReviewArray.length>0){
                                    angular.forEach(existingManualReviewArray, function(nodeValue, nodeKey){
                                        if(nodeValue.attributes[0].nodeValue=='review_id'){
                                            var inputParameter_rv=xmlDoc.createElement("camunda:inputParameter");
                                            inputParameter_rv.setAttribute("name", "review_id");
                                            inputParameter_rv.textContent=nodeValue.childNodes[0].nodeValue;
                                            inputOutput.appendChild(inputParameter_rv);
                                        };
                                    });
                                };

                                //console.log("==========>",adduri.attributes["name"].nodeValue);

                                /*var inputParameter_url=xmlDoc.createElement("camunda:inputParameter");
                                inputParameter_url.setAttribute("name", "endpoint_uri");
                                inputParameter_url.textContent="pipeline/trigger/"+val;
                                inputOutput.appendChild(inputParameter_url);*/
                                //var x=vm.modelerServices;
                                /*if(vm.isCheckPipilineService(val)){
                                    var executionListener=xmlDoc.createElement("camunda:executionListener");
                                    executionListener.setAttribute("event", "end");
                                    var executionListener_script=xmlDoc.createElement("camunda:script");
                                    executionListener_script.setAttribute("scriptFormat", "Javascript");
                                    var s='var co="caseObject_"+execution.getProcessInstanceId()+"_"+execution.getVariable("loopCounter");var coJSON=execution.getVariable(co);if(coJSON){var jsonStr=coJSON.toString();execution.setVariable("caseObject", jsonStr,"'+subProcessId+'");execution.removeVariable(co);}';
                                    //executionListener_script.AppendChild(xmlDoc.CreateCDataSection(s));

                                    var newCDATA = xmlDoc.createCDATASection(s);
                                    executionListener_script.appendChild(newCDATA);

                                    //executionListener_script.textContent='<![CDATA[var co="caseObject_"+execution.getProcessInstanceId()+"_"+execution.getVariable("loopCounter");var coJSON=execution.getVariable(co);var jsonStr=coJSON.toString();execution.setVariable("caseObject", jsonStr,"nifi_pipeline");execution.removeVariable(co)]]>';
                                    executionListener.appendChild(executionListener_script);
                                    extensionElements.appendChild(executionListener);
                                }*/
                                /*if(selectedValue=="ingest"){

                                    angular.forEach(vm.apiSpecEndpoints,function(uriVal,uriKey){
                                        if(uriVal.name=="ingest_doc_flow"){
                                            angular.forEach(uriVal,function(val1,key1){
                                                var inputParameter1=xmlDoc.createElement("camunda:inputParameter");
                                                inputParameter1.setAttribute("name", key1);
                                                if(typeof val1 === 'object'){
                                                    inputParameter1.textContent='<![CDATA['+JSON.stringify(val1)+']]>';
                                                }
                                                else{
                                                    inputParameter1.textContent=val1;
                                                }
                                                inputOutput.appendChild(inputParameter1);
                                            });
                                        };
                                    });
                                }*/

                                /*var selectedUriValue =$scope.selectedOptionsOfUris[sKey];
                                if(selectedUriValue!=undefined){
                                    angular.forEach(vm.apiSpecEndpoints,function(uriVal,uriKey){
                                        if(uriVal.endpoint_uri==selectedUriValue){
                                            angular.forEach(uriVal,function(val1,key1){
                                                var inputParameter1=xmlDoc.createElement("camunda:inputParameter");
                                                inputParameter1.setAttribute("name", key1);
                                                if(typeof val1 === 'object'){
                                                    inputParameter1.textContent='<![CDATA['+JSON.stringify(val1)+']]>';
                                                }
                                                else{
                                                    inputParameter1.textContent=val1;
                                                }
                                                inputOutput.appendChild(inputParameter1);
                                            });
                                        };
                                    });
                                };*/

                                extensionElements.appendChild(inputOutput);
                                adduri.insertBefore(extensionElements, adduri.childNodes[0]);

                                xml=xmlToString(xmlDoc);

                                var xmlFormat = formatXml(xml);

                               // var xmlFormat=htmlEntities(xml);

                                var re1 = /&lt;/g;
                                var newXml1 = re1[Symbol.replace](xmlFormat, '<');

                                var re2 = /&gt;/g;
                                var newXml2 = re2[Symbol.replace](newXml1, '>');
                                xml=newXml2;
                            };
                        };
                     });


                     angular.forEach($scope.selectedManualReviewObj,function(val,sKey){
                        var parser_mr, xmlDoc_mr;
                        parser_mr = new DOMParser();
                        xmlDoc_mr = parser_mr.parseFromString(xml,"text/xml");
                        var extensionElements=xmlDoc_mr.createElement("bpmn:extensionElements");
                        var inputOutput=xmlDoc_mr.createElement("camunda:inputOutput");
                        var addMRValue = xmlDoc_mr.getElementById(sKey);
                        if(addMRValue!=null){
                            var hasEE = addMRValue.getElementsByTagName("bpmn:extensionElements");

                            if(hasEE.length>0){
                                var y = addMRValue.getElementsByTagName("bpmn:extensionElements")[0];
                                addMRValue.removeChild(y);
                            }
                        }
                        var inputParameter=xmlDoc_mr.createElement("camunda:inputParameter");
                        inputParameter.setAttribute("name", "solutionId");
                        inputParameter.textContent=solutionObj.solutionId;
                        inputOutput.appendChild(inputParameter);


                        var inputParameter_dn=xmlDoc_mr.createElement("camunda:inputParameter");
                        inputParameter_dn.setAttribute("name", "taskName");
                        inputParameter_dn.textContent=vm.getManualReviewName(val);
                        inputOutput.appendChild(inputParameter_dn);

                        var inputParameter_mr=xmlDoc_mr.createElement("camunda:inputParameter");
                        inputParameter_mr.setAttribute("name", "review_id");
                        inputParameter_mr.textContent=val;
                        inputOutput.appendChild(inputParameter_mr);

                        extensionElements.appendChild(inputOutput);
                        if(addMRValue!=null){
                            addMRValue.insertBefore(extensionElements, addMRValue.childNodes[0]);
                            xml=xmlToString(xmlDoc_mr);
                            var xmlFormat = formatXml(xml);
                            xml=xmlFormat;
                        }

                     });

                     angular.forEach($scope.enteredSeqFlowValue,function(val,eKey){
                        var parser4, xmlDoc4;
                        parser4 = new DOMParser();
                        xmlDoc4 = parser4.parseFromString(xml,"text/xml");
                        var addConditionExpression = xmlDoc4.getElementById(eKey);
                        if(addConditionExpression!=null){

                            var hasSeqFlow = addConditionExpression.getElementsByTagName("bpmn:sequenceFlow");
                            if(hasSeqFlow.length==0){
                                var conditionExpression=xmlDoc4.createElement("bpmn:conditionExpression");
                                conditionExpression.setAttribute("xsi:type", "bpmn:tFormalExpression");


                                //conditionExpression.textContent=val;

                                var newCDATA = xmlDoc4.createCDATASection(val);
                                conditionExpression.appendChild(newCDATA);


                                addConditionExpression.appendChild(conditionExpression);
                                xml=xmlToString(xmlDoc4);
                                var xmlFormat4 = formatXml(xml);
                                console.log(xmlFormat4);
                                xml=xmlFormat4;
                            };
                        };
                     });


                    /* angular.forEach($scope.selectedOptionsOfSequenceFlow,function(val,eKey){
                        var parser4, xmlDoc4;
                        parser4 = new DOMParser();
                        xmlDoc4 = parser4.parseFromString(xml,"text/xml");
                        var addConditionExpression = xmlDoc4.getElementById(eKey);
                        if(addConditionExpression!=null){

                            var hasSeqFlow = addConditionExpression.getElementsByTagName("bpmn:sequenceFlow");
                            if(hasSeqFlow.length==0){
                                var conditionExpression=xmlDoc4.createElement("bpmn:conditionExpression");
                                conditionExpression.setAttribute("xsi:type", "bpmn:tFormalExpression");
                                conditionExpression.textContent=val;

                                addConditionExpression.appendChild(conditionExpression);
                                xml=xmlToString(xmlDoc4);
                                var xmlFormat4 = formatXml(xml);
                                console.log(xmlFormat4);
                                xml=xmlFormat4;
                            };
                        };
                     });*/

                     /*angular.forEach($scope.listOFEndEvents,function(val,eKey){
                        var parser3, xmlDoc3;
                        parser3 = new DOMParser();
                        xmlDoc3 = parser3.parseFromString(xml,"text/xml");
                        var addEndParam = xmlDoc3.getElementById(eKey);
                        if(addEndParam!=null){

                            var hasMED = addEndParam.getElementsByTagName("bpmn:messageEventDefinition");
                            if(hasMED.length==0){
                                //var hasMED = addEndParam.Elements("bpmn:messageEventDefinition").Any();
                                console.log("bpmn:messageEventDefinition==>", hasMED);

                                var messageEventDefinition=xmlDoc3.createElement("bpmn:messageEventDefinition");
                                messageEventDefinition.setAttribute("camunda:class", "com.delegates.EndTaskDelegate");

                                addEndParam.appendChild(messageEventDefinition);
                                xml=xmlToString(xmlDoc3);
                                var xmlFormat3 = formatXml(xml);
                                console.log(xmlFormat3);
                                xml=xmlFormat3;
                            };
                        };
                     });*/

                    var xmlParser9 = new DOMParser();
                    var xmlParserDoc9 = xmlParser9.parseFromString(xml,"text/xml");
                    var arrayxmlParserDoc9=xmlParserDoc9.all;
                    for(var i=0; i<=arrayxmlParserDoc9.length; i++){
                        /*if(vm.allowedBpmnTypes.indexOf(arrayxmlParserDoc9[i].nodeName)==-1){
                            $.UIkit.notify({
                               message : "Ooops, '"+arrayxmlParserDoc9[i].nodeName+"' is not allowed",
                               status  : 'warning',
                               timeout : 3000,
                               pos     : 'top-center'
                             });
                            return false;
                        }*/

                        if(arrayxmlParserDoc9[i]!=undefined && (
                        arrayxmlParserDoc9[i].nodeName=="bpmn:serviceTask" ||
                        arrayxmlParserDoc9[i].nodeName=="bpmn:userTask" ||
                        arrayxmlParserDoc9[i].nodeName=="bpmn:task" ||
                        arrayxmlParserDoc9[i].nodeName=="bpmn:sendTask" ||
                        arrayxmlParserDoc9[i].nodeName=="bpmn:scriptTask" ||
                        arrayxmlParserDoc9[i].nodeName=="bpmn:receiveTask" ||
                        arrayxmlParserDoc9[i].nodeName=="bpmn:businessRuleTask" ||
                        arrayxmlParserDoc9[i].nodeName=="bpmn:subProcess" ||
                        arrayxmlParserDoc9[i].nodeName=="bpmn:manualTask" ||
                        arrayxmlParserDoc9[i].nodeName=="bpmn:callActivity") ){

                            var attributes= arrayxmlParserDoc9[i].attributes;

                            console.log(arrayxmlParserDoc9[i].nodeName);

                            if(attributes['name']!=undefined){

                                if(attributes['name'].nodeValue==""){
                                    $.UIkit.notify({
                                       message : "Task name should not be empty.",
                                       status  : 'warning',
                                       timeout : 3000,
                                       pos     : 'top-center'
                                     });
                                    return false;
                                }
                               /* if(attributes['camunda:topic'].value!="emailListener" && attributes['camunda:topic'].value!="caseCreation" && attributes['camunda:topic'].value!="ingest"){
                                    arrayxmlParserDoc9[i].attributes['camunda:topic'].value=attributes['name'].value;
                                }*/
                            }else{
                                $.UIkit.notify({
                                   message : "Task Name should not be empty.",
                                   status  : 'warning',
                                   timeout : 3000,
                                   pos     : 'top-center'
                                 });
                                 return false;
                            }
                        }
                    };
                    xml=xmlToString(xmlParserDoc9);
                    var xmlFormat9 = formatXml(xml);
                    xml=xmlFormat9;

                    var txt_camundaId = document.getElementById("camunda-id");

                    if(vm.wf_id!=txt_camundaId.value){
                        $.UIkit.notify({
                           message : "Please unselect the task and save it again.",
                           status  : 'warning',
                           timeout : 3000,
                           pos     : 'top-center'
                         });
                         return false;
                    }

                    /*var reqObj={};
                    reqObj['xmlContent'] =xml;
                    reqObj['filePathLocation'] =filepath;
                    reqObj['solutionId'] =solutionObj.solutionId;
                    reqObj['bpmnId'] =txt_camundaId.value;
                    reqObj['bpmnName'] =enteredBpmnName;
                    */

                   var reqObj= {"data" : { "workflow_id" : vm.wf_id, "xmlContent" : xml}, "solution_id": solutionObj.solutionId};
                    if(saveType=='publish')
                        reqObj.data['is_published'] =true;
                    else
                        reqObj.data['is_published'] =false;


                    console.log(reqObj);

                    //console.log(JSON.stringify(reqObj));

                    bpmnServices.saveBpmn(reqObj, $scope.sess_id,$scope.access_token).then(function(data){
                        if(data.data.status.success){
                            $.UIkit.notify({
                               message : data.data.status.msg,
                               status  : 'success',
                               timeout : 3000,
                               pos     : 'top-center'
                            });
                            vm.getAllBpmns("new");
                            $scope.selectedManualReviewObj={};
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

                    /*fd.append('xmlContent', xml);
                    fd.append('filePathLocation', filepath);
                    fd.append('solutionId', solutionObj.solutionId);

                    fd.append('bpmnId', txt_camundaId.value);
                    fd.append('bpmnName', enteredBpmnName);

                    if(saveType=='publish')
                        fd.append('is_publish', true);
                    else
                        fd.append('is_publish', false);

                    $http.post(uploadUrl, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                    .success(function(response){
                        $rootScope.$emit("addFileToSelectbox", response.fileName);
                        $scope.enteredSeqFlowValue={};
                        $.UIkit.notify({
                           message : response.fileName + " file has been saved",
                           status  : 'success',
                           timeout : 3000,
                           pos     : 'top-center'
                        });
                        vm.getAllBpmns("new");
                    })
                    .error(function(error){
                        console.log('error--'+error.message);
                        $.UIkit.notify({
                           message : error.message,
                           status  : 'warning',
                           timeout : 3000,
                           pos     : 'top-center'
                        });
                        vm.getAllBpmns("");
                    });*/
                }
                else{
                     $.UIkit.notify({
                       message : "Name should not be empty",
                       status  : 'warning',
                       timeout : 3000,
                       pos     : 'top-center'
                    });
                };
            };
        });
    };

    vm.isCheckPipilineService=function(val){
        var flag=false;
        angular.forEach(vm.modelerServices, function(value, key){
            if(val!="emailListener" && val!="caseCreation" && val == value.value){
                flag=true;
            }
        });
        return flag;
    };

    vm.mySplit = function(string) {
        var array = string.split('/');
        return array;
    };

    vm.selectedDiagram = function (obj, indx) {
        /*var filteredData = vm.listOfBpmnFiles.filter(function (response) {
            return response === JSON.parse(vm.selectedBpmn);
        })
        console.log(filteredData);*/

       $scope.selectedOptionsOfServices={};
       $scope.selectedOptionsOfUris={};
       $scope.selectedOptionsOfManualReview={};
       $scope.listOFEndEvents={};
       $scope.selectedOptionsOfSequenceFlow={};
       if(obj!=""){
            //var obj = JSON.parse(obj);
            vm.currentBpmnName=obj.name;
            vm.openDiagram(obj.xml);
            vm.newWorkflowFlag=false;
            vm.isExistBpmn={'save':true,'update':false,'delete':true};
       }else{
            vm.openDiagram(newDiagram);
            vm.isExistBpmn={'save':true,'update':false,'delete':true};
            vm.selectedBpmn="";
       }
       //vm.selectedIndxOfBPMN=filteredData;
    };

    function isObject(obj) {
      return obj === Object(obj);
    }

    $scope.callSequenceFlow = function(evt, fieldId, fieldValue, className, elementId){

        $scope.selectedOptionsOfSequenceFlow[elementId]=fieldValue;

    };
    $scope.getSelectedValuesForSequenceFlow = function (id){

        if($scope.selectedOptionsOfSequenceFlow[id]!=undefined && $scope.selectedOptionsOfSequenceFlow[id]!=""){
            return $scope.getSelectedValuesForSequenceFlow[id];
        }
        else{
            return "";
        }
    };

    $scope.sequenceFlowSetValue = function (evt, fieldId, fieldValue, className, elementId){
         $scope.enteredSeqFlowValue[elementId]=fieldValue;
         console.log("enteredSeqFlowValue===>" , $scope.enteredSeqFlowValue);
    };
    $scope.sequenceFlowGetValue = function (id){
        if($scope.enteredSeqFlowValue[id]!=undefined && $scope.enteredSeqFlowValue[id]!=""){
            return $scope.enteredSeqFlowValue[id];
        }
        else{
            return "";
        }
    };

    $scope.getServicesForServiceTask = function (previousValue){
        return vm.generateSelectBoxOptions(vm.modelerServices, previousValue);
    };
    $scope.getServiceUrisForGeneric = function(previousValue){
        return vm.generateOptionsForSpecEndpoints(vm.apiSpecEndpoints, previousValue);
    };
    $scope.getServiceUrisForManualReview = function(id, previousValue){
        return vm.generateOptionsForManualReview(vm.listForManualReview, id,previousValue);
    };
    $scope.getServiceTopicsForServiceTask = function (previousValue){
        return vm.generateSelectBoxTopicOptions(vm.serviceTopics, previousValue);
    };
    $scope.setManualReviewValue =function(selectedValue, elementId){
        console.log("getManualReviewValue==>selectedValue==>", selectedValue);
        $scope.selectedManualReviewObj[elementId]=selectedValue;
    };

    $scope.callFromServiceTask=function (evt, id, val,className, servicesOptsText,elementId){

        if(servicesOptsText!="Select"){
            if(className=="servicetask-services"){
                $scope.selectedOptionsOfServices[elementId]=val;
            }

            if(className=="servicetask-uris"){
                $scope.selectedOptionsOfUris[elementId]=val;
                $scope.selectedOptionsOfServices[elementId]=servicesOptsText;
            }
            if(className=="servicetask-manualreview"){
                $scope.selectedOptionsOfManualReview[elementId]=val;
            }

        }
        else{
            $scope.selectedOptionsOfServices[elementId]="";
            $scope.selectedOptionsOfUris[elementId]="";
            $scope.selectedOptionsOfManualReview[elementId]="";
        }
    };

    $scope.setCamundaClassForEndTask = function(elementId){
        $scope.listOFEndEvents[elementId]=true;
    };

    $scope.getServiceUrisAndAllObj =function(selectedValue){
        if(vm.apiSpecEndpoints.length>0){
            //console.log("getServiceUrisAndAll",getServiceUrisAndAll);
            var inputParameters =[];
            angular.forEach(vm.apiSpecEndpoints,function(val,key){
                if(selectedValue!="" && val.endpoint_uri==selectedValue){
                    var currentObj={};
                    currentObj=vm.apiSpecEndpoints[key];
                    angular.forEach(currentObj,function(val,key){

                            inputParameters.push({
                                "$type": "camunda:InputParameter",
                                "name": key,
                                "value": typeof val === 'object' ? JSON.stringify(val) : val
                            })

                    });
                }
            });
            if(inputParameters.length>0)
                return inputParameters;
            else
                return "";
        }
        else{
         return "";
        }
    };


    $scope.getServiceUrisAndAllObjForIngest =function(selectedValue){
        if(vm.apiSpecEndpoints.length>0){
            //console.log("getServiceUrisAndAll",getServiceUrisAndAll);
            var inputParameters =[];
            angular.forEach(vm.apiSpecEndpoints,function(val,key){
                if(selectedValue!="" && selectedValue=="ingest"){
                    var currentObj={};
                    currentObj=vm.apiSpecEndpoints[key];
                    angular.forEach(currentObj,function(val,key){

                            inputParameters.push({
                                "$type": "camunda:InputParameter",
                                "name": key,
                                "value": typeof val === 'object' ? JSON.stringify(val) : val
                            })

                    });
                }
            });
            if(inputParameters.length>0)
                return inputParameters;
            else
                return "";
        }
        else{
         return "";
        }
    };

    $scope.getSelectedServiceItem = function(selectedClass){
        var item="";
        angular.forEach(vm.modelerServices, function(val,key){
        if(val.value==selectedClass)
            item = val.name;
        });
        return item;
    };

    vm.addNewWorkflow=function(){

        $scope.selectedOptionsOfServices={};
        $scope.selectedOptionsOfUris={};
        $scope.listOFEndEvents={};
        vm.currentBpmnName="";

        vm.newWorkflowFlag=true;

        vm.openDiagram(newDiagram);
        vm.isExistBpmn={'save':true,'update':false,'delete':false};
        vm.selectedBpmn="";
    };
    vm.deleteWorkflow =function(){
        var txt_camundaId = document.getElementById("camunda-id");
        var enteredBpmnName ="";
        enteredBpmnName = document.getElementById("camunda-name").innerText;
        if(txt_camundaId.value==""){
            $.UIkit.notify({
               message : "Camunda Id should not be empty"+txt_camundaId.value,
               status  : 'warning',
               timeout : 3000,
               pos     : 'top-center'
            });
        }
        else{

             ngDialog.open({ template: 'confirmBox-bpmn', controller: ['$scope','$state' ,function($scope,$state) {
                  $scope.activePopupText = "Are you sure you want to delete " +enteredBpmnName+ ".bpmn?";
                  $scope.onConfirmActivation = function (){
                      ngDialog.close();
                        var reqObj={"solutionId":solutionObj.solutionId,"bpmnId":txt_camundaId.value,"bpmnName":vm.currentBpmnName};
                        bpmnServices.deleteBpmn(reqObj,caseManagementApiUrl).then(function(response){
                            console.log(response);
                            if(response.data.status=="success"){
                                $.UIkit.notify({
                                   message : enteredBpmnName +" has been deleted successfully",
                                   status  : 'success',
                                   timeout : 3000,
                                   pos     : 'top-center'
                                });
                                vm.currentBpmnName="";
                                vm.getAllBpmns("delete");
                            }

                        },function(err){
                            console.log("error@deleteBpmn----"+err.error);
                        });
                  };
              }]
          });
        }
    };

    $scope.callFromProcessTask =function(text,elementId){
       if(vm.newWorkflowFlag==true)
            vm.currentBpmnName=text;
        $timeout( function(){
            //angular.element("#camunda-name").removeAttr('contenteditable');
            angular.element("#process_"+elementId).hide();
            angular.element("#bpmn-name").remove();
            angular.element(".wf-id-div").append('<div id="bpmn-name"><div style="font-weight: bold;margin-top: 18px;margin-bottom: 2px;">Name</div><div>'+$stateParams.name+'</div></div>');
        }, 400);
    };

    $scope.setTaskIdForMapping=function(id,name){
        console.log("setTaskIdForMapping===>", id, name);
        if(name == undefined)
            name="";

        vm.taskIdMappingList[id]=name;

        return 0;
    };

    $scope.setTaskIdMapping=function(id,name){
        if(name!="" && name!="Select"){

            var count=0;
            angular.forEach(vm.taskIdMappingList, function(val,key){
                console.log("id===>", val);
                var nameString=angular.copy(val);
                var nameAry = nameString.split("_");
                if(nameAry[0]==name && id!=key){
                    count++;
                }
            });
            if(count>0){
                count++;
                vm.taskIdMappingList[id]=name+"_"+count;
                return name+"_"+count;
            }
            else{
                vm.taskIdMappingList[id]=name;
                return name;
            }

        }
        else{
            return "";
        }
    };


    function xmlToString(xmlData) {
        var xmlString;
        //IE
        if (window.ActiveXObject){
            xmlString = xmlData.xml;
        }
        // code for Mozilla, Firefox, Opera, etc.
        else{
            xmlString = (new XMLSerializer()).serializeToString(xmlData);
        }
        return xmlString;
    };

    function formatXml(xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;     /**/
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        jQuery.each(xml.split('\r\n'), function(index, node) {
            var indent = 0;
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w([^>]*[^\/])?>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    }

    $scope.thresholdExist=true;
    vm.thresholdObj={};
    vm.thresholdValue=0;

    $scope.toggleThresholdApplicable=function(isThreshods){
        //alert(isThreshods);
        $scope.slider.options.disabled=isThreshods;
    };
    vm.thresholdsApplicable={};
    $scope.slider = {
        value: vm.thresholdObj[vm.currentServiceTaskId],
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          minLimit: 0,
          maxLimit: 100,
          showSelectionBar: true,
          hidePointerLabels: true,
          hideLimitLabels: true,
          autoHideLimitLabels: true,
          disabled: vm.thresholdsApplicable[vm.currentServiceTaskId],
          getSelectionBarColor: function(value) {return '#8c8c8c';},
          id: 'slider1-id',
          onEnd: function(id, modelValue) {
                                                vm.thresholdObj[vm.currentServiceTaskId]=vm.thresholdValue;
                                                var reqObj ={};
                                                reqObj.workflow_id=vm.wf_id;
                                                reqObj.solution_id=solutionObj.solutionId;
                                                if(solutionObj.solutionId==null){
                                                    var userSesData = JSON.parse(localStorage.getItem('userInfo'));
                                                    if(userSesData!="" && userSesData!=null){
                                                      reqObj.solution_id=userSesData.user.solution_id;
                                                    }
                                                }
                                                reqObj.task_id=vm.currentServiceTaskId;
                                                reqObj.threshold=modelValue;

                                                /*bpmnServices.updateThresholdForTask(reqObj).then(function(response){
                                                    console.log(response);
                                                    if(response.data.status=="success"){
                                                        $.UIkit.notify({
                                                           message : response.data.msg,
                                                           status  : 'success',
                                                           timeout : 3000,
                                                           pos     : 'top-center'
                                                        });
                                                    }
                                                    else if(response.data.status=="failure"){
                                                        $.UIkit.notify({
                                                           message : response.data.msg,
                                                           status  : 'danger',
                                                           timeout : 3000,
                                                           pos     : 'top-center'
                                                        });
                                                    }

                                                },function(err){
                                                    console.log("error@deleteBpmn----"+err.error);
                                                });*/





                                            },
          onStart: function(id, modelValue) {
                                             console.log("onStart=>",vm.thresholdValue);
                                             }
        }
    };

    vm.thresholdsData={};


    $rootScope.getAllTaskLevelVariables =function(){

        var obj = {"data":{},"solution_id":solutionObj.solutionId};
        obj.w_id = vm.wf_id;
        caseManagementServices.getCaseVariablesForWF({"sess_id":vm.sess_id,"data":obj,'access_token':$scope.access_token}).then(function(response){
               if(response.data.status.success){
                    vm.existingVariables = response.data.metadata.workflow.case_object;
                    console.log("existingVariables===>",vm.existingVariables);

                   /* angular.forEach(vm.existingVariables,function(value,key){
                        var index = $scope.selectdCaseVariables.filter(function(e,index){
                           if(e.name === value.name)
                              return index;
                        });

                        if(index.length==0){
                            $scope.selectdCaseVariables.push(value);
                        }
                    })

                    angular.forEach($scope.selectdCaseVariables, function(value,key){
                        if(value.is_default){
                            $scope.taggedFlagArr1[value.variable_id] = true;
                        }
                        var index = $scope.caseQueuesDate.findIndex( record => record.name === value.name );
                        $scope.caseQueuesDate.splice(index, 1);
                    });

                    console.log("$scope.caseQueuesDate===>",$scope.caseQueuesDate);
                    console.log("$scope.selectdCaseVariables===>",$scope.selectdCaseVariables);*/
               }
               else{
                    $.UIkit.notify({
                       message : "getCaseVariablesForWF==>"+ response.data.status.msg,
                       status  : 'danger',
                       timeout : 3000,
                       pos     : 'top-center'
                   });
               }
        },function(err){
            $.UIkit.notify({
                   message : 'Internal Server Error',
                   status  : 'warning',
                   timeout : 3000,
                   pos     : 'top-center'
               });
        });

    };



    vm.currentServiceTaskId="";
    $scope.currentPropertyTab = function(currentTabId, elementId){
       console.log(currentTabId);
       angular.element('[data-group="serviceTaskThreshold"]').removeClass('hide');
       angular.element(".bpmn-threshold").show();

       vm.currentServiceTaskId=elementId;

       var reqObj ={};
       reqObj.workflow_id=vm.wf_id;
       reqObj.solution_id=solutionObj.solutionId;
       if(solutionObj.solutionId==null){
            var userSesData = JSON.parse(localStorage.getItem('userInfo'));
            if(userSesData!="" && userSesData!=null){
              reqObj.solution_id=userSesData.user.solution_id;
            }
       }
       reqObj.task_id=elementId;

       if(!vm.thresholdObj[elementId])
            vm.thresholdObj[elementId]=0;

       vm.thresholdValue=vm.thresholdObj[elementId];


       if(!vm.thresholdsData[vm.currentServiceTaskId])
            vm.thresholdsData[vm.currentServiceTaskId]={};

       if(!vm.thresholdsApplicable[vm.currentServiceTaskId])
            vm.thresholdsApplicable[vm.currentServiceTaskId]=true;

       $scope.taskThresholds={};
       angular.forEach(vm.existingVariables,function(value,key){
        $scope.taskThresholds[value.variable_id]=0;
       });
       vm.thresholdsData[vm.currentServiceTaskId]=$scope.taskThresholds;

       console.log("elementId==>", elementId);
       console.log("vm.thresholdsData==>",vm.thresholdsData);


       bpmnServices.getThresholdForTask(reqObj).then(function(response){
            console.log(response);
            if(response.data.status=="success"){

                if(response.data.data.thresholds){
                    //vm.thresholdObj[vm.currentServiceTaskId]=response.data.data.thresholds.task_th;
                    //vm.thresholdValue=response.data.data.thresholds.task_th;
                    vm.thresholdsData[vm.currentServiceTaskId]=response.data.data.thresholds;
                    if(response.data.data.applicable==true)
                        vm.thresholdsApplicable[vm.currentServiceTaskId]=false;
                    else if(response.data.data.applicable==false)
                        vm.thresholdsApplicable[vm.currentServiceTaskId]=true;
                }
                else{
                    //vm.thresholdObj[vm.currentServiceTaskId]=0;
                    //vm.thresholdValue=0;
                    vm.setNewThresholdForTask(reqObj);
                }
                 vm.refreshSlider();
            }

        },function(err){
            console.log("error@deleteBpmn----"+err.error);
        });


        //var myElements = angular.element('[data-group="serviceTaskThreshold"]');
       	//var html = '<div id="thold">test</div>';
       	/*html =html+'<div id="threshold-bpmn" class="" style="width: 200px;adding: 0;margin: 0;">';
        html =html+ '<rzslider rz-slider-model="objOfNewThreshold"';
        html =html+  '         rz-slider-hide-limit-labels="true"';
        html =html+  '        rz-slider-always-show-bar="true"';
        html =html+  '       rz-slider-options="slider1.options"></rzslider>';
        html =html+ '</div>';
        html =html+ '<div class="" style="width: 200px;adding: 0;margin:0;">';
        html =html+ '  <input type="number" style="margin:0;" min="0" max="100" data-ng-model="objOfNewThreshold" class="input-slider-value">';
        html =html+ '  <span>%</span>';
        html =html+ '</div>';*/
        //myElements.append( html);

       //return "<====>"+currentTabId
    };

    vm.setNotApplicable =function(flag, taskid){
        vm.thresholdsApplicable[taskid]=flag;
    };

    vm.setNewThresholdForTask =function(reqObj){
        reqObj.threshold=vm.thresholdsData[vm.currentServiceTaskId];
        bpmnServices.postThresholdForTask(reqObj).then(function(response){
            console.log(response);
            if(response.data.status=="success"){

            }
        },function(err){
            console.log("error@deleteBpmn----"+err.error);
        });
    };

    vm.refreshSlider = function() {
      setTimeout(function(){
            $scope.$broadcast('rzSliderForceRender');
        },500);
    };

    vm.saveThresholds =function(){
        console.log("saveThresholds==>",vm.thresholdsData[vm.currentServiceTaskId]);
        var reqObj ={};
        reqObj.workflow_id=vm.wf_id;
        reqObj.solution_id=solutionObj.solutionId;
        if(solutionObj.solutionId==null){
            var userSesData = JSON.parse(localStorage.getItem('userInfo'));
            if(userSesData!="" && userSesData!=null){
              reqObj.solution_id=userSesData.user.solution_id;
            }
        }
        reqObj.task_id=vm.currentServiceTaskId;
        reqObj.threshold=vm.thresholdsData[vm.currentServiceTaskId];

        reqObj.applicable=!vm.thresholdsApplicable[vm.currentServiceTaskId];

        bpmnServices.updateThresholdForTask(reqObj).then(function(response){
            console.log(response);
            if(response.data.status=="success"){
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'success',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            }
            else if(response.data.status=="failure"){
                $.UIkit.notify({
                   message : response.data.msg,
                   status  : 'danger',
                   timeout : 3000,
                   pos     : 'top-center'
                });
            }

        },function(err){
            console.log("error@deleteBpmn----"+err.error);
        });
    };

    /*Script Task custom code starts here*/
    $scope.selectedScriptTaskFormats={};
    vm.scriptTaskSelectFormats=[
           {
              "name": "JavaScript",
              "value": "javascript"
            },
            {
              "name": "Groovy",
              "value": "groovy"
            }
          ];
     vm.generateScriptTaskSelectFormats=function(obj, previousValue, id){
       var html="";
        angular.forEach(obj,function(val,key){
            if(previousValue!="" && val.value==previousValue){
                html+='<option selected value="'+val.value+'">'+val.name+'</option>'
            }else{

                if(id!=""){
                    var value=$scope.selectedScriptTaskFormats[id];
                    if(value==val.value)
                        html+='<option selected value="'+val.value+'">'+val.name+'</option>';
                    else
                        html+='<option value="'+val.value+'">'+val.name+'</option>';
                }
            }
        });
        console.log("vm.generateScriptTaskSelectFormats-->",html);
        return html;
    };


    $scope.selectedScriptTaskConditionType={};
    vm.scriptTaskSelectBoxOptions=[
           {
              "name": "Inline Script",
              "value": "InlineScript"
            },
            {
              "name": "External Resource",
              "value": "ExternalResource"
            }
          ];

    vm.selectOptionsOfScriptTask="";
    vm.generateSelectBoxScriptTask=function(obj, previousValue, id){
       var html="";
        angular.forEach(obj,function(val,key){
            if(previousValue!="" && val.value==previousValue){
                html+='<option selected value="'+val.value+'">'+val.name+'</option>'
            }else{

                if(id!=""){
                    var value=$scope.selectedScriptTaskConditionType[id];
                    if(value==val.value)
                        html+='<option selected value="'+val.value+'">'+val.name+'</option>';
                    else
                        html+='<option value="'+val.value+'">'+val.name+'</option>';
                }
            }
        });
        vm.selectOptionsOfSequenceFlow=html;
        console.log("vm.selectOptionsOfSequenceFlow-->",vm.selectOptionsOfSequenceFlow);
        return vm.selectOptionsOfSequenceFlow;
    };

    $scope.getScriptTaskFormats = function (previousValue, id){
        return vm.generateScriptTaskSelectFormats(vm.scriptTaskSelectFormats, previousValue, id);
    };
    $scope.getScriptTaskOptions = function (previousValue, id){
        return vm.generateSelectBoxScriptTask(vm.scriptTaskSelectBoxOptions, previousValue, id);
    };

    $scope.scriptTaskConditionType = function (evt, fieldId, fieldValue, className, elementId){
         $scope.selectedScriptTaskConditionType[elementId]=fieldValue;
         console.log("selectedScriptTaskConditionType===>" , $scope.selectedScriptTaskConditionType);
    };
    $scope.getSltdScriptTaskConditionType=function(id){
        return $scope.selectedScriptTaskConditionType[id];
    };

    $scope.ScriptTaskSetTxtboxValue = function (evt, fieldId, fieldValue, className, elementId){
         $scope.enteredScriptTaskValue[elementId]=fieldValue;
         console.log("enteredScriptTaskValue===>" , $scope.enteredScriptTaskValue);
    };
    $scope.ScriptTaskGetValue = function (id){
        if($scope.enteredSeqFlowValue[id]!=undefined && $scope.enteredSeqFlowValue[id]!=""){
            return $scope.enteredSeqFlowValue[id];
        }
        else{
            return "";
        }
    };
    $scope.ScriptTaskSetTextareaValue = function (evt, fieldId, fieldValue, className, elementId){
         $scope.enteredSeqFlowValue[elementId]=fieldValue;
         console.log("enteredSeqFlowValue===>" , $scope.enteredSeqFlowValue);
    };

    /*Script Task custom code ends here*/



});
