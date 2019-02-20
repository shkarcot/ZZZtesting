(function() {
'use strict';
    //require('./common/nlpTrainServices.js');

    module.exports = angular.module('console.engine.nlp', [])//'cpqAdmin.product.common.services'
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.engineslist.NLP', {
                parent: 'app.engineslist',
                url: '/NLP',
                breadcrumb: {state: 'Engines', subState: 'NLP' },
                views: {
                  'engineContent': {
                        template: require('./nlpengine.html'),
                        controller: require('./nlpengine.controller.js'),
                        controllerAs: 'vm'
                  },
                  'accuracymodel@app.engineslist.NLP': {
                    template: require('./accuracymodel/accuracymodel.html'),
                    controller: 'accuracyModelCtrl as am'
                  },
                  'generatetraining@app.engineslist.NLP': {
                    template: require('./generateTraining/generateTraining.html'),
                    controller: 'generateTrainingCtrl as gm'
                  },
                  'models@app.engineslist.NLP': {
                    template: require('./models/models.html'),
                    controller: 'modelCtrl as mm'
                  },
                  'testmodel@app.engineslist.NLP': {
                    template: require('./testmodel/testModel.html'),
                    controller: 'testModelCtrl as tm'
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