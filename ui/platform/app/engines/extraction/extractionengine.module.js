(function() {
'use strict';
    //require('./common/nlpTrainServices.js');

    module.exports = angular.module('console.engine.extraction', [])//'cpqAdmin.product.common.services'
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.engineslist.Extraction', {
                parent: 'app.engineslist',
                url: '/Extraction',
                breadcrumb: {state: 'Engines', subState: 'Extraction' },
                views: {
                  'engineContent': {
                        template: require('./extractionengine.html'),
                        controller: require('./extractionengine.controller.js'),
                        controllerAs: 'vm'
                  },
                  'documenttemplate@app.engineslist.Extraction': {
                    controller: 'documentTemplateCtrl as dtc',
                    template: require('./documentTemplates/documentTemplates.html')
                  }
                }
                /*resolve: {
                    viewsList: ['productService', function(productService) {
                        return productService.getViewsList();
                    }]
                }*/

                 /*'accuracymodel@app.engineslist.NLP': {
                    templateUrl: 'views/accuracymodel.html',
                    controller: 'accuracyModelCtrl as am'
                  },
                  'generatetraining@app.engineslist.NLP': {
                    templateUrl: 'views/generateTraining.html',
                    controller: 'generateTrainingCtrl as gm'
                  },
                  'models@app.engineslist.NLP': {
                    templateUrl: 'views/models.html',
                    controller: 'modelCtrl as mm'
                  },
                  'testmodel@app.engineslist.NLP': {
                    templateUrl: 'views/testModel.html',
                    controller: 'testModelCtrl as tm'
                  }*/
            });
        }]);

})();