module.exports = ['$scope', '$state','$rootScope','config', function($scope,$state,$rootScope,config) {
	'use strict';
	var userData=localStorage.getItem('userInfo');
    userData=JSON.parse(userData);
    //$scope.solutionId=userData.user.solution_id;
    $rootScope.activeSubmeu=[];
    $rootScope.popMenuParentClass={};
    if(userData.user==undefined){
        userData.user ={};
        userData.user.solution_name = ''
    }

    $rootScope.solutionName=userData.user.solution_name;
    $scope.hoverSubmenu=[];

    $scope.$on("ActiveSolution", function(event,solutionName) {
      $rootScope.solutionName=solutionName;
    });

    /*var state =$state.current.name;

    if(state=="app.solution")
      $scope.notSolution=false;
    else
      $scope.notSolution=true;*/

//    $scope.$on("breadcrumbObj", function(event,obj) {
//    $scope.breadCrumb = "";
//    if(obj.state == "Solutions"){
//      $scope.breadCrumb = '<span class="breadCrumbImgSpan"><img class="breadCrumbImg0 MyClass0"/></span>'
//    }
//
//    if(obj.state == "Dashboard"){
//      $scope.breadCrumb = '<span class="breadCrumbImgSpan"><img class="breadCrumbImg MyClass1"/></span>'
//    }
//    if(obj.state == "Resource Library"){
//      $scope.breadCrumb = '<span class="breadCrumbImgSpan"><img class="breadCrumbImg MyClass2"/></span>'
//    }
//    if(obj.state == "Entities"){
//      $scope.breadCrumb = '<span class="breadCrumbImgSpan"><img class="breadCrumbImg MyClass3"/></span>'
//    }
//    if(obj.state == "Engines"){
//      $scope.breadCrumb = '<span class="breadCrumbImgSpan"><img class="breadCrumbImg MyClass4"/></span>'
//    }
//    if(obj.state == "Sourcing"){
//      $scope.breadCrumb = '<span class="breadCrumbImgSpan"><img class="breadCrumbImg MyClass5"/></span>'
//    }
//    if(obj.state == "Monitoring"){
//      $scope.breadCrumb = '<span class="breadCrumbImgSpan"><img class="breadCrumbImg MyClass6"/></span>'
//    }
//
//    if(obj.subState!=""){
//        if(obj.state=="Engines"){
//          $scope.breadCrumb+="<span class='activeColor placeBottom'><a href='#/app/engines' class='breadcrumb-link'>"+obj.state+"</a></span><span class='breadSymbol'> > </span>"+"<span class='inActiveColor placeBottom'>"+obj.subState+"</span>";
//        }
//        else
//          $scope.breadCrumb+="<span class='activeColor placeBottom'>"+obj.state+"</span><span class='breadSymbol'> > </span>"+"<span class='inActiveColor placeBottom'>"+obj.subState+"</span>";
//    }
//    else
//        $scope.breadCrumb+="<span class='inActiveColor placeBottom'>"+obj.state+"</span>";
//    });

    $rootScope.submenuClickEvent = function(submenu,parentmenu){
      $rootScope.activeSubmeu=[];
      $rootScope.activeSubmeu[submenu]="active";
      $rootScope.popMenuParentClass={};
      $rootScope.popMenuParentClass[parentmenu]="blue";
      $rootScope.subMenuParentActive=[];
      $rootScope.subMenuParentActive[parentmenu]="subMenuParentActive";
      $rootScope.subMenuStyle=[];
      $rootScope.subMenuStyle[submenu]="subNavActive";
      $rootScope.currentParentMenu="";
      $rootScope.currentParentMenu="#"+parentmenu;
    };
    $scope.hideSubmenu=function(){
      $(".hoverSubmenu").hide();
    };

//    document.addEventListener("click", function(){
//       var userData=localStorage.getItem('userInfo');
//       userData=JSON.parse(userData);
//       var href = location.href;
//       var array = href.split('/');
//       var lastsegment = array[array.length-1];
//       if(document.getElementById("slnName").innerHTML != userData.user.solution_name && document.getElementById("slnName").innerHTML != "" && lastsegment != "solution"){
//          location.reload();
//       }
//    });

    //$scope.breadCrumb='<span>'+$scope.solutionId+'</span> > <span>'+$state.current.name+'</span> ';
}];