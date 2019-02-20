(function() {
	'use strict';


	module.exports = angular.module('console.customModelDetails', [

	])
        .controller('customModelDetailsController', require('./customModelDetails.controller.js'))
        .directive("preventTypingGreater", function() {
          return {
            link: function(scope, element, attributes) {
              var oldVal = null;
              element.on("keydown keyup", function(e) {
            if (Number(element.val()) > Number(attributes.max) &&
                  e.keyCode != 46 // delete
                  &&
                  e.keyCode != 8 // backspace
                ) {
                  e.preventDefault();
                  element.val(oldVal);
                } else {
                  oldVal = Number(element.val());
                }
              });
            }
          };
        })
         .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('app.customModelDetails', {
               url: '/customModelDetails/:name/:id',
                views: {
                    'bodyContentContainer@app': {
                        template: require('./customModelDetails.html'),
                        controller: 'customModelDetailsController',
                        controllerAs: 'mde',
                        cache :false,
                        resolve: {
                              logedIn:function($state){
                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
                                 if(!loginData){
                                         $state.go('login');
                                 }
                              }
                        }

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