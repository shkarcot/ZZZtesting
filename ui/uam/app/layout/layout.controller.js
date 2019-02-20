module.exports = ['$scope', '$state','$rootScope',function($scope,$state,$rootScope) {
	'use strict';
	var userData=localStorage.getItem('userInfo');
    userData=JSON.parse(userData);
    //$scope.solutionId=userData.user.solution_id;
    $rootScope.activeSubmeu=[];
    $rootScope.popMenuParentClass={};
}];