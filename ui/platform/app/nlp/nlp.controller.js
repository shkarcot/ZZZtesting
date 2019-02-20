module.exports = ['$scope', '$sce','$state', '$rootScope', '$location', function($scope,$sce, $state, $rootScope, $location) {
	'use strict';
	var vm = this;
    $scope.addLanguage = function(){
        document.getElementById("AddlanguageDiv").style.width = "40%";
    }
    $scope.cancelLanguage = function(){
        document.getElementById("AddlanguageDiv").style.width = "0%";
    };

    $scope.uploadModel = function(){
        document.getElementById("uploadmodelDiv").style.width = "40%";
    }
    $scope.cancelmodel = function(){
        document.getElementById("uploadmodelDiv").style.width = "0%";
    };

    $(document).ready(function() {
        $("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
            e.preventDefault();
            $(this).siblings('a.active').removeClass("active");
            $(this).addClass("active");
            var index = $(this).index();
            $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
            $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
        });
    });

}];
