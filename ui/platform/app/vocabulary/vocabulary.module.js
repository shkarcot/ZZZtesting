(function() {
	'use strict';


	module.exports = angular.module('console.vocabulary', [

	])
        .controller('vocabularyController', require('./vocabulary.controller.js'))
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.vocabulary', {
               url: '/vocabulary',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./vocabulary.html'),
                        controller: 'vocabularyController',
                        controllerAs: 'vc',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         $state.go('login');
                                 }
                              }
                        }

                    },
                    'dictionariesAndCorpus@app.vocabulary': {
                      template: require('../dataManagement/dataManagement.html'),
                        controller: 'dataManagementsController as dmc'

                    },
                    'dictionary@app.vocabulary': {
                      template: require('./dictionary/dictionary.html'),
                        controller: 'dictionaryController as dcc'

                    },
                    'corpus@app.vocabulary': {
                      template: require('./corpus/corpus.html'),
                        controller: 'corpusController as cc'

                    },
                    'ontologies@app.vocabulary': {
                      template: require('./ontologies/ontologies.html'),
                        controller: 'ontologiesController as oc'

                    }
                },


				data: {
					menuConfig: {
						'title': 'Product',
						'iconCls': 'cube'
					}

				}
            });
        }]);
})();