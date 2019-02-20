module.exports = ['$scope', '$state','$rootScope',function($scope,$state,$rootScope) {
	'use strict';
	var lc = this;
	lc.layoutMessage="layout page rendered............";
    $scope.goToDashboard=function(){
        $state.go("app.dashboard");
        //$state.go('app.product.details',{id:'new'});
    };


}];