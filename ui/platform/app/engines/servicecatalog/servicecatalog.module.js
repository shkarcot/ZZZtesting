(function() {
'use strict';

    //require('./configureExtractMetadata/configure.module.js');
    require('./servicecatalog.services.js');

    module.exports = angular.module('console.engine.ServiceCatalog', [
    //'console.engine.ServiceCatalog.configureMetadata'
    'console.serviceCatalogServices'
    ])
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
                  },
                  'configureCatalogService@app.engineslist.ServiceCatalog': {
                    template: require('./configureExtractMetadata/configure.html'),
                    controller: require('./configureExtractMetadata/configure.controller.js'),
                    controllerAs: 'configureController as ccs'

                  },
                  'testCatalogService@app.engineslist.ServiceCatalog': {
                    template: require('./testMetadata/testmetadata.html'),
                    controller: require('./testMetadata/testmetadata.controller.js')
                    //controller: 'testMetadataCtrl as tmc'

                  }
                }
            });
        }]);

})();