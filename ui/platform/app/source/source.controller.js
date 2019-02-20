module.exports = ['$scope','$rootScope','$state','$stateParams','$window','sourceService',function($scope,$rootScope,$state,$stateParams,$window,sourceService) {
    'use strict';
    var vm = this;
    sourceService.gets3URL().then(function(response){
        sourceService.sets3URL(response.data.data);
    });
    $scope.height = $window.innerHeight-96;
}];