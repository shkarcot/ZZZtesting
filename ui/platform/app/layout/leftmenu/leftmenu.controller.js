(function() {
	'use strict';
	module.exports = [function() {
		var leftmenuController;

		leftmenuController = function($scope, $state, $rootScope, $location, solutionService, $window, config) {
			var vm = this;
            var url = $location.path();
            var arr = url.split("/");
            $scope.whenDisplay =[];
            $scope.config = config;
            $rootScope.currentState = arr[arr.length-1];
            $rootScope.inSolution = true;
            $scope.iconshow = [true,true];
            $scope.hoverFlag=false;
            $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
            vm.sess_id= $scope.loginData.sess_id;

            $scope.changeTanant = function(tenantOption){
              var tenant=tenantOption;
              if(tenant!=""){
                  //tanant= JSON.parse(tenant);
                  solutionService.postTenants({"solution_name":tenantOption.solution_name},vm.sess_id).then(function(result){
                    if(result.data.status=="success"){
                      $.UIkit.notify({
                           message : result.data.msg,//'Solution name has been updated successfully',
                           status  : 'success',
                           timeout : 2000,
                           pos     : 'top-center'
                       });

                       $state.go($state.current, {}, {reload: true});
                    }
                    else{
                      $.UIkit.notify({
                           message : result.data.msg,//'Solution name has not been updated',
                           status  : 'danger',
                           timeout : 2000,
                           pos     : 'top-center'
                      });
                    }
                  });
              }

            };
            $rootScope.subMenuParentActive=[];
            $rootScope.subMenuStyle=[];
            $rootScope.currentParentMenu="";
            var $myGroup = $('#myGroup');
        /*    if($rootScope.currentState == "nlpengine" || $rootScope.currentState == "contextengine" || $rootScope.currentState == "insightsengine" || $rootScope.currentState == "notificationsengine" || $rootScope.currentState == "utilsengine" || $rootScope.currentState == "learning"){
               $scope.activeClass1='in';
               $scope.backgroundActive1 = 'bg-nav';
               $scope.iconshow[0] = false;
               $scope.iconshow[1] = false;
               $scope.iconshow[2] = false;
               $scope.iconshow[3] = false;
            }
            if($rootScope.currentState == "solutionconfiguration" || $rootScope.currentState == "entitiesList" || $rootScope.currentState == "config" || $rootScope.currentState == "sourcetemplates" || $rootScope.currentState == "trainingset"){
               $scope.activeClass='in';
               $scope.backgroundActive = 'bg-nav';
               $scope.iconshow[0] = false;
               $scope.iconshow[1] = true;
               $scope.iconshow[2] = false;
               $scope.iconshow[3] = false;
            }*/
            if($rootScope.currentState == "dashboard"){
               $myGroup.find('.collapse.in').collapse('hide');
            }
            if($rootScope.currentState == "pipeline" || $rootScope.currentState == "sourcetemplate" || $rootScope.currentState == "sourceConfiguration"){
                $("#sourcing").addClass("in");
                $rootScope.currentParentMenu="#sourcing";
               //$rootScope.subMenuParentActive['sourcing']="subMenuParentActive";
               $rootScope.subMenuParentActive.sourcing="subMenuParentActive";
               $rootScope.subMenuStyle[$rootScope.currentState]="subNavActive";

            }
            if($rootScope.currentState == "performance" || $rootScope.currentState == "logging"){
                $("#monitoring").addClass("in");
                $rootScope.currentParentMenu="#monitoring";
               //$rootScope.subMenuParentActive['monitoring']="subMenuParentActive";
               $rootScope.subMenuParentActive.monitoring="subMenuParentActive";
               $rootScope.subMenuStyle[$rootScope.currentState]="subNavActive";
            }

            $myGroup.on('show.bs.collapse','.collapse', function() {
                $myGroup.find('.collapse.in').collapse('hide');
            });

            $scope.removeCollapse = function(){
                $rootScope.subMenuStyle=[];
                $rootScope.subMenuParentActive=[];
                $rootScope.currentParentMenu="";
                $myGroup.find('.collapse.in').collapse('hide');
                $scope.backgroundActive = "";
                $scope.backgroundActive1 = "";
                $scope.iconshow[2] = true;
                $scope.iconshow[3] = true;
                $(".hoverSubmenu").hide();
                $rootScope.subMenuParentActive=[];
                $rootScope.activeSubmeu=[];
                $rootScope.popMenuParentClass={};
            };
            $scope.navSubMenu=function(submenu,parentmenu){
              $rootScope.subMenuStyle=[];
              $rootScope.subMenuParentActive=[];
              $rootScope.subMenuStyle[submenu]="subNavActive";
              $rootScope.subMenuParentActive[parentmenu]="subMenuParentActive";
              $rootScope.currentParentMenu="#"+parentmenu;
              $rootScope.submenuClickEvent(submenu,parentmenu);
              $rootScope.currentState = submenu;
            };
        /*var refreshIntervalId = setInterval(fname, 10000);
        $scope.removeSubmenuCollapse=function(menuId){
          $(menuId).removeClass("in");
        }
        var rc =setInterval(function(){$("#sourcing").removeClass("in");}, 600);
          */
             $scope.changeIcon = function(key){
               if(key == 'sourcing'){
                  if($scope.hoverFlag==true){
                      var rc1 = setInterval(function(){
                        $("#sourcing").removeClass("in");
                        clearInterval(rc1);
                      }, 600);
                    }
                  $scope.iconshow[2] = !$scope.iconshow[2];
                  if($scope.iconshow[3] == true){
                     $scope.iconshow[3] = false;
                  }
                }
                else if(key == 'monitoring'){
                  if($scope.hoverFlag==true){
                     var rc= setInterval(function(){
                        $("#monitoring").removeClass("in");
                        clearInterval(rc);
                      }, 600);
                    }

                  $scope.iconshow[3] = !$scope.iconshow[3];
                  if($scope.iconshow[2] == true){
                     $scope.iconshow[2] = false;
                  }
                }
             };
             $scope.showHoverSubmenu =function(menuType){
               if($scope.hoverFlag==true){
                $(".hoverSubmenu").hide();
                $("#hoverSubmenu-"+menuType).show();
               }
               console.log("showHoverSubmenu");
             };

            $scope.reloadKeys = function(type){
                 $rootScope.serverType= angular.copy(type);

                 if(type == 'nlp'){
                  $state.go('app.nlpengine');
                 }
                 else if(type == 'context'){
                  $state.go('app.contextengine');
                 }
                 else if(type == 'insight'){
                  $state.go('app.insightsengine');
                 }
                 else if(type == 'notifications'){
                  $state.go('app.notifications');
                 }
                 else if(type == 'utils'){
                  $state.go('app.utilsengine');
                 }
                 else if(type == 'learning'){
                  $state.go('app.learning');
                 }
            };

             $("#menu-toggle-2").click(function(e) {
                e.preventDefault();
                $(".hoverSubmenu").hide();
                $("#wrapper").toggleClass("toggled-2");
                $("#menu-toggle-2 i").toggleClass("fa-angle-double-left fa-angle-double-right");
                $("#menu-toggle-2").toggleClass("move-right move-left");
                $('#menu ul').hide();
                if($rootScope.currentParentMenu!="" && $($rootScope.currentParentMenu).hasClass('in')){
                  $($rootScope.currentParentMenu).removeClass("in");
                }
                else{
                  $($rootScope.currentParentMenu).addClass("in");
                  $($rootScope.currentParentMenu).removeAttr("style");
                }
                if($("#menu-toggle-2").hasClass('move-left')){
                  $scope.hoverFlag=true;
                  $myGroup.find('.collapse.in').collapse('hide');
                }
                else{
                  $scope.hoverFlag=false;
                }
                console.log($scope.hoverFlag);
            });
            $scope.logout =function(){

                localStorage.clear();
                window.location.href = "http://"+ location.host+"/logout";
            };
            $scope.goToSolution = function(){
              if($rootScope.currentState == 'solution'){
                $state.reload();
              }
              else{
                $state.go("solution");
              }
            };

            angular.element($window).bind("scroll", function() {
              $(".hoverSubmenu").hide();
            });

            var userData=localStorage.getItem('userInfo');
            userData=JSON.parse(userData);
            if(userData.user==undefined){
              userData.user = {}
            }
            $scope.solutionId=userData.user.solution_id;
            $scope.userName=userData.user.first_name+" "+userData.user.last_name;
		};

        leftmenuController.$inject = ['$scope', '$state','$rootScope' ,'$location' ,'solutionService' ,'$window', 'config'];

		return {
			restrict: 'E',
			controller: leftmenuController,
			controllerAs: 'fc',
			scope: {},
			bindToController: {
				menus: '='
			},
			template: require('./leftmenu.html')
		};

	}];
})();