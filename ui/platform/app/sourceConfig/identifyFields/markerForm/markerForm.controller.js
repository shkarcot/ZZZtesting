module.exports = ['$scope','$compile','Upload','$rootScope','ngDialog','$state','$stateParams','$window','documentService','entitiesService',function($scope,$compile,Upload,$rootScope,ngDialog,$state,$stateParams,$window,documentService,entitiesService) {
    'use strict';
    var vm = this;
    vm.documentName = $stateParams.name

    $scope.goToDocumentTemplate = function(){
        var engine = localStorage.getItem("engineName");
        $rootScope.imageBlur='';
        $state.go("app.documentTemplate");
    };









}];