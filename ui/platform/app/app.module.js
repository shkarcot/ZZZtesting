(function() {

	'use strict';

	require('./vendor')();
	require('./solution/solution.module.js');
	require('./solution/solution.service.js');
	require('./common/platformService.js');
	require('./common/rulesService.js');
	require('./common/searchFilterforObject.js');
	require('./layout/layout.module.js');
	require('./httpConfiguration/httpConfiguration.service.js');

	require('./dashboard/dashboard.module.js');
	require('./test/test.module.js');
	require('./domainDashboard/domainDashboard.module.js');
	require('./domainDashboard/domainDashboard.service.js');
	require('./dataManagement/dataManagement.module.js');
    require('./dataManagement/dataManagement.service.js');
	require('./resourcelibrary/resourcelibrary.module.js');
	require('./resourcelibrary/resourcelibrary.services.js');
	require('./entities/entities.module.js');
	require('./entities/entities.services.js');
	require('./monitoring/logs/logging.module.js');
	require('./nlp/nlp.module.js');
	require('./sourcing/pipeline/pipeline.module.js');
	require('./sourcing/pipeline/pipeline.service.js');
	require('./models/modelDashboard/modelDashboard.module.js');
	require('./models/modelDashboard/modelDashboard.service.js');
	require('./models/modelDetails/modelDetails.module.js');
	require('./models/modelDetails/modelDetails.service.js');
	require('./models/createEnsemble/createEnsemble.module.js');
	require('./models/createEnsemble/createEnsemble.service.js');
	require('./sourcing/sourcetemplates/sourceTemplate.module.js');
	require('./sourcing/sourcetemplates/sourceTemplate.services.js');
	require('./sourcing/sourceConfiguration/sourceConfiguration.module.js');
	require('./sourcing/sourceConfiguration/sourceConfiguration.service.js');
	require('./sourcing/sourceConfiguration/ingestFile/ingestFile.module.js');
	require('./sourcing/sourceConfiguration/emailConfig/emailConfig.module.js');
	require('./sourcing/sourceConfiguration/multipleEmailConfig/multipleEmailConfig.module.js');
	require('./common/massautocomplete.js');
	require('./common/angular-csv-import.js');
	require('./common/csv-import.js');
	require('./common/jquery-ui.js');
    require('./common/markerFormDirective.js');
	require('./common/tags-autoComplete.js');
	require('./common/ui-ace.js');
	require('./source/source.module.js');
	require('./source/email/email.js');
	require('./source/fileUpload/fileUpload.js');
	require('./source/sftp/sftp.js');
	require('./source/source.service.js');
	require('./vocabulary/vocabulary.module.js');
	require('./vocabulary/vocabulary.service.js');
	require('./vocabulary/corpus/corpus.js');
	require('./vocabulary/dictionary/dictionary.js');
	require('./vocabulary/ontologies/ontologies.js');
	require('./dataManagement/dataManagement.js');
	require('./vocabulary/ontologyVersions/ontologyVersions.module.js');
	require('./sourceConfig/identifyFields/documentTemplates/documentTemplates.module.js');
	require('./sourceConfig/identifyFields/documentTemplates/documentTemplates.service.js');
	require('./sourceConfig/identifyFields/markerForm/markerForm.module.js');
	require('./sourceConfig/identifyFields/markerForm/markerFormTab/markerFormTab.js');
	require('./sourceConfig/identifyFields/markerForm/markerFormTab/abn_tree_directive.js');
	require('./sourceConfig/identifyFields/markerForm/train/train.js');
	require('./sourceConfig/identifyFields/markerForm/threshold/threshold.js');
	require('./sourceConfig/identifyFields/markerForm/postProcessingrules/postProcessingrules.js');

	require('./engines/engines.module.js');
	require('./engines/engine.module.js');
//	require('./engines/extraction/extractionengine.module.js');
	require('./engines/nlp/nlpengine.module.js');
	require('./engines/nlp/accuracymodel/accuracymodel.js');
	require('./engines/nlp/generateTraining/generateTrainingSet.module.js');
	require('./engines/nlp/models/models.js');
	require('./engines/nlp/testmodel/testModel.js');
	require('./engines/nlp/nlpengine.services.js');
	require('./engines/engine.module.js');
	require('./common/engine-tabs.js');
	require('./engines/insights/insightengine.module.js');
	require('./engines/insights/defineinsights/defineInsights.js');
	require('./engines/insights/testinsights/testInsights.js');
	require('./engines/insights/insightsConfigurationServices.js');

	require('./services/services.module.js');
	require('./services/extractMetadata/extractmetadata.module.js');
	require('./services/identifyFields/identifyfields.module.js');
    require('./services/identifyTables/identifytables.module.js');
    require('./services/identifyTables/configureTable/configureTable.controller.js');
	require('./services/extractElements/extractelements.module.js');
	require('./services/IngestDocument/IngestDocument.module.js');
	require('./services/ConvertDocument/ConvertDocument.module.js');
	require('./services/ClassifyDocument/ClassifyDocument.module.js');
	require('./services/ExtractDocumentText/ExtractDocumentText.module.js');
	require('./services/ExtractDocumentEntities/ExtractDocumentEntities.module.js');
	require('./services/configServices/configServices.module.js');

	require('./caseManagement/workFlows.module.js');
	require('./caseManagement/caseObjects/caseObjects.module.js');
	require('./caseManagement/caseQueues/caseQueues.js');
	require('./caseManagement/caseQueues/caseQueueService.js');



	require('./bpmnjs/bpmn.module.js');
	require('./bpmnjs/bpmn.js');
	require('./sourcing/camunda/camunda.module.js');
	require('./adapt/adapt.module.js');
	require('./adapt/createModel/createmodel.module.js');
	require('./unstructuredForm/unstructuredForm.module.js');
	require('./unstructuredForm/newUnstructuredForm/newUnstructuredForm.module.js');



	require('./unstructuredForm/createUnstructuredForm/createUnStructuredForm.module.js');
	require('./unstructuredForm/createUnstructuredForm/template/template.js');
	require('./unstructuredForm/createUnstructuredForm/train/trainUnStructured.js');
	require('./unstructuredForm/createUnstructuredForm/threshold/thresholdUnStructured.js');
	require('./unstructuredForm/createUnstructuredForm/test/test.js');
	require('./unstructuredForm/createUnstructuredForm/test/imageCrop.directive.js');
	//var CustomModeler  = require('./custom-modeler/index.js');


	require('./test/test.service.js');

	require('./function/functionDashboard/function.module.js');
	require('./function/functionDashboard/function.services.js');
	require('./function/createFunction/createFunction.module.js');
	require('./function/createFunction/createFunction.services.js');
	require('./function/functionDetail/functionDetail.module.js');
	require('./function/functionDetail/functionDetail.services.js');

	require('./thresholds/thresholds.module.js');
	// feedback
    require('./cmodels/cmodelDashboard/feedback/feedback.module.js');

	//
	require('./flowchart/svg_class.js');
	require('./flowchart/mouse_capture_service.js');
	require('./flowchart/dragging_service.js');
	require('./flowchart/flowchart_directive.js');

	// Custom Model files


	require('./cmodels/cmodelDashboard/customModelDashboard.module.js');
	require('./cmodels/cmodelDashboard/customModelDashboard.service.js');
	require('./cmodels/cmodelDetails/customModelDetails.module.js');
	require('./cmodels/cmodelDetails/customModelDetails.service.js');
	require('./cmodels/cmodelDashboard/stageConfiguration/stageConfig.module.js');
	require('./cmodels/cmodelDashboard/transformation/transformation.module.js');
	require('./cmodels/cmodelDashboard/transformation/transformation.service.js');
	require('./cmodels/cmodelDashboard/pipelineJob/pipelinejob.module.js');
	require('./cmodels/cmodelDashboard//pipelineJob/pipelinejob.service.js');
	// create pipline new model addd
	require('./cmodels/cmodelDashboard/createPipeline/createPipeline.controller1.js');
   	require('./cmodels/cmodelDashboard/createPipeline/createPipeline.module.js');
	require('./cmodels/cmodelDashboard/createPipeline/createPipeline.service.js');
	require('./cmodels/ccreateEnsemble/customCreateEnsemble.module.js');
	require('./cmodels/ccreateEnsemble/customCreateEnsemble.service.js');


	module.exports = angular.module('console', [
			'ui.router',
			'ui.bootstrap',
			'console.httpPayload',
			'console.layout',
			'console.dashboard',
			'console.testCases',
            'console.domainDashboard',
            'console.domainDashboardService',
			'console.resourcelibrary',
			'console.resourceServices',
			'console.entities',
			'console.entitiesServices',
			'console.logging',
			'console.pipeline',
			'console.sourceConfiguration',
			'console.ingestFile',
			'console.emailConfig',
			'console.multipleEmailConfig',
			'console.sourceConfigServices',
			'console.sourceTemplate',
			'console.sourceTemplateServices',
			'console.solution',
			'console.solutionServices',
			'console.platformServices',
			'console.rulesServices',
			'ngDialog',
			'ngTagsInput',
            'ngFileUpload',
            'ui.ace',
            'console.MassAutoComplete',
            'console.csvImport',
            'console.ngCsvImport',
            'console.enginetabs',
            'console.engines',
            'console.engine',
            'angularUtils.directives.dirPagination',
            'angular-loading-bar',
//            'console.engine.extraction',
            'console.documentServices',
            'console.engine.nlp',
            'console.nlpTrainService',
            'console.markerDirective',
            'console.tagsAutocomplete',
            'console.engine.Insights',
            'console.insightsConfigurationServices',
            'console.documentTemplate',
            'console.markerForm',
            'console.services',
            'console.pipelineServices',
            'console.modelDashboard',
			'console.modelDashboardService',
			'console.modelDetails',
			'console.modelDetailsService',
			'console.createEnsemble',
			'console.createEnsembleService',
            'console.services.extractmetadata',
            'console.services.identifytables',
            'console.services.extractelements',
            'angularResizable',
            'toggle-switch',
            'console.services.IngestDocument',
            'console.services.ConvertDocument',
            'console.services.ClassifyDocument',
            'jsonFormatter',
            'console.services.ExtractDocumentText',
            'console.services.ExtractDocumentEntities',
            'console.services.configServices',
            'console.nlp',
            'console.dataManagement',
            'console.dataManagementServices',
            'ui.tree',
            'rzModule',
            'angularBootstrapNavTree',
			'console.bpmn',
			'console.camundaDiagram',
			'console.adapt',
			'console.adapt.createmodel',
			'console.unstructuredForm',
			'console.newUnstructuredForm',
			'console.createUnStructuredForm',
			'console.imageCropDirective',
			'btorfs.multiselect',
			'searchFilter',
			'console.caseManagement',
			'console.caseQueueService',
			'console.caseObjects',
			'console.testService',
			'console.function',
			'console.functionService',
			'console.createFunction',
            'console.createFunctionService',
			'console.functionDetail',
			'console.functionDetailService',
			'console.source',
			'console.vocabulary',
			'console.sourceServices',
			'console.functionDetailService',
			'console.thresholds',
			'console.ontologyVersions',
			'console.vocabularyServices',
			'angular-jwt',
			'console.customModelDashboard',
			'console.customModelDashboardService',
			'console.customModelDetails',
			'console.customModelDetailsService',
			'console.customCreateEnsemble',
			'console.createEnsembleService',
		    'console.feedback',
		    'console.createPipline',
			'console.createPiplineService1',
			'console.flowChart',
			'console.stageConfig',
			'console.transformation',
			'console.transformationService',
			'console.pipelinejob',
			'console.piplinejobService'
		])
		.constant('config', {
		    'solution_name' : '',
           'base_url' : '.'
            //'base_url' : '/static/se'
        })
		.run(function($http,jwtHelper) {
		    var sess_info = JSON.parse(localStorage.getItem('userInfo'));
            var accessToken = "";
            var flag = true;
            if(sess_info && sess_info.accesstoken)
                accessToken = sess_info.accesstoken;
            if(accessToken==""){
                    localStorage.clear();
                    window.location.href = "http://"+ location.host+"/logout";
            }else{
                var token_date = jwtHelper.getTokenExpirationDate(accessToken);
                var current_date = new Date();
                if(token_date > current_date){
                   flag = true;
                }else{
                  localStorage.clear();
                  window.location.href = "http://"+ location.host+"/logout";
                }
            }

		   $http.get("/user/status/",{
             headers: {'Authorization': accessToken}})
              .success(function(response) {
                  if(response.data.logged_in){
                    if(response.data.role!='se'){
		              window.location.href = "http://"+ location.host+"/";
		            }
		            else{
		              localStorage.setItem('userInfo',JSON.stringify(response.data))
		            }
                  }
                  else{
                     localStorage.clear();
                  }
           });
		})
		.config(require('./app.config.js'))
		.config(function($interpolateProvider){
           $interpolateProvider.startSymbol('{$');
           $interpolateProvider.endSymbol('$}');
        }).directive('breadcrumbDropdown', function() {
			return {
				replace: true,
				restrict: 'E',  
				template: `<ul class="customdropdown-menu dropdown-menu">
                <li>
                    <a ui-sref="app.domainDashboard" class="noDecoration">
                        <img src="/app/images/Domain.png" />
                        <span>Domain Configuration</span>
                    </a>
                </li>
                <li>
                    <a class="noDecoration" ui-sref="app.modelDashboard">
                        <img src="/app/images/model.png" />
                        <span>SA-Models</span>
                    </a>
                </li>
                <li>
                    <a class="noDecoration" ui-sref="app.customModelDashboard">
                        <img src="/app/images/model.png" />
                        <span>Models</span>
                    </a>
                </li>
                <li>
                    <a class="noDecoration" ui-sref="app.function">
                        <img src="/app/images/functionIcon.png" />
                        <span>Functions</span>
                    </a>
                </li>
                <li>
                    <a ui-sref="app.services" class="noDecoration">
                        <img src="/app/images/Services-01.png" />
                        <span>Service Configuration</span>
                    </a>
                </li>
                <li>
                    <a ui-sref="app.pipeline" class="noDecoration">
                        <img src="/app/images/pipeline.png" />
                        <span>Pipeline Configuration</span>
                    </a>
                </li>
                <li>
                    <a ui-sref="app.sourceConfiguration" class="noDecoration">
                        <img src="/app/images/sources.png" />
                        <span>Sources</span>
                    </a>
                </li>
            </ul>`
			};
		});;
        //.constant('Modeler', window.BpmnJSCustom.Modeler)
        //.constant('Viewer', window.BpmnJSCustom.Viewer);
        //.constant('PropertiesProviders', window.BpmnJSCustom.PropertiesProviders)
        //.constant('ContextMenu', window.$.contextMenu);


})();