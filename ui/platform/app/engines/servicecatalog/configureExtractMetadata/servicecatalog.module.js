(function() {
'use strict';
    //require('./common/nlpTrainServices.js');

    module.exports = angular.module('console.engine.ServiceCatalog', [])//'cpqAdmin.product.common.services'
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.engineslist.ServiceCatalog', {
                parent: 'app.engineslist',
                url: '/ServiceCatalog',
                breadcrumb: {state: 'Engines', subState: 'Service Catalog' },
                views: {
                  'engineContent': {
                        template: require('./servicecatalog.html'),
                        controller: require('./servicecatalog.controller.js'),
                        controllerAs: 'vm'
                  }/*,
                  'defineinsights@app.engineslist.Insights': {
                  template: require('./defineinsights/defineInsights.html'),
                    controller: 'defineInsightsCtrl as dic'

                  },
                  'testinsights@app.engineslist.Insights': {
                    template: require('./testinsights/testInsights.html'),
                    controller: 'testInsightsCtrl as tic'

                  }*/
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