webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(3);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals window __webpack_hash__ */
	if(true) {
		var lastData;
		var upToDate = function upToDate() {
			return lastData.indexOf(__webpack_require__.h()) >= 0;
		};
		var check = function check() {
			module.hot.check(true, function(err, updatedModules) {
				if(err) {
					if(module.hot.status() in {
							abort: 1,
							fail: 1
						}) {
						console.warn("[HMR] Cannot apply update. Need to do a full reload!");
						console.warn("[HMR] " + err.stack || err.message);
						window.location.reload();
					} else {
						console.warn("[HMR] Update failed: " + err.stack || err.message);
					}
					return;
				}
	
				if(!updatedModules) {
					console.warn("[HMR] Cannot find update. Need to do a full reload!");
					console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
					window.location.reload();
					return;
				}
	
				if(!upToDate()) {
					check();
				}
	
				__webpack_require__(2)(updatedModules, updatedModules);
	
				if(upToDate()) {
					console.log("[HMR] App is up to date.");
				}
	
			});
		};
		var addEventListener = window.addEventListener ? function(eventName, listener) {
			window.addEventListener(eventName, listener, false);
		} : function(eventName, listener) {
			window.attachEvent("on" + eventName, listener);
		};
		addEventListener("message", function(event) {
			if(typeof event.data === "string" && event.data.indexOf("webpackHotUpdate") === 0) {
				lastData = event.data;
				if(!upToDate() && module.hot.status() === "idle") {
					console.log("[HMR] Checking for updates on the server...");
					check();
				}
			}
		});
		console.log("[HMR] Waiting for update signal from WDS...");
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(updatedModules, renewedModules) {
		var unacceptedModules = updatedModules.filter(function(moduleId) {
			return renewedModules && renewedModules.indexOf(moduleId) < 0;
		});
	
		if(unacceptedModules.length > 0) {
			console.warn("[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
			unacceptedModules.forEach(function(moduleId) {
				console.warn("[HMR]  - " + moduleId);
			});
		}
	
		if(!renewedModules || renewedModules.length === 0) {
			console.log("[HMR] Nothing hot updated.");
		} else {
			console.log("[HMR] Updated modules:");
			renewedModules.forEach(function(moduleId) {
				console.log("[HMR]  - " + moduleId);
			});
		}
	};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	
		'use strict';
	
		__webpack_require__(4)();
		__webpack_require__(72);
		__webpack_require__(75);
	    __webpack_require__(77);
		__webpack_require__(80);
		__webpack_require__(81);
		__webpack_require__(96);
		__webpack_require__(99);
		__webpack_require__(102);
		__webpack_require__(103);
		__webpack_require__(106);
		__webpack_require__(107);
	    __webpack_require__(110);
	    __webpack_require__(113);
	
	    __webpack_require__(114);
		__webpack_require__(117);
		__webpack_require__(118);
	
	
	
		module.exports = angular.module('console', [
				'ui.router',
				'console.httpPayload',
				'console.login',
				'console.login.services',
				'console.solution',
				'console.createSolution',
				'console.solutionServices',
	            'console.layout',
	            'console.createUser',
	            'console.users',
	            'console.userServices',
	            'console.userGroups',
	            'console.userGroupServices',
	            'console.userRoles',
	            'console.userRoleServices',
	            'console.queue',
	            'console.queueServices',
	            'angular-loading-bar',
	            'ngDialog',
	            'ngTagsInput',
	            'angularResizable',
	            'btorfs.multiselect',
	            'ui.tree',
	            'angular-jwt'
	
			])
	
			.run(["$http", "jwtHelper", function($http,jwtHelper) {
	            var sess_info = JSON.parse(localStorage.getItem('userInfo'));
	            var accessToken = "";
	            var flag = true;
	            if(sess_info && sess_info.accesstoken)
	                accessToken = sess_info.accesstoken;
	            if(accessToken==""){
	                    localStorage.clear();
	                    flag = false;
	            }else{
	                var token_date = jwtHelper.getTokenExpirationDate(accessToken);
	                var current_date = new Date();
	                if(token_date > current_date){
	                   flag = true;
	                }else{
	                  localStorage.clear();
	                  flag = false;
	                }
	            }
	
	            if(flag){
	                $http.get("/user/status/",{
	                     headers: {'Authorization': accessToken}})
	                      .success(function(response) {
	                          if(response.data.logged_in){
	                            if(response.data.role!='sa'){
	                              window.location.href = "http://"+ location.host+"/";
	                            }
	                          }
	                          else{
	                             localStorage.clear();
	
	                          }
	                });
	            }
	
			}])
			.config(__webpack_require__(119))
			.config(["$interpolateProvider", function($interpolateProvider){
	           $interpolateProvider.startSymbol('{$');
	           $interpolateProvider.endSymbol('$}');
	        }]);
	
	})();

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
		module.exports = angular.module('console.login', ['ui.router'])
		.controller('loginController', __webpack_require__(73))
			//.directive('aptLogin', require('./login.controller.js'));
			.config(['$stateProvider', function($stateProvider) {
				$stateProvider.state('login', {
					url: '/login',
					views: {
						'pageContent@': {
							template: __webpack_require__(74),
							controller: 'loginController',
							controllerAs: 'lc'
						}
					}
	
					/*data: {
						menuConfig: {
							'title': 'Product',
							'iconCls': 'cube'
						}
	
					}*/
				});
			}]);
	
	})();

/***/ }),
/* 73 */
/***/ (function(module, exports) {

	module.exports = ['$scope', '$state','$rootScope','AuthService',function($scope,$state,$rootScope,AuthService) {
		'use strict';
		$scope.doLogin = function(email,pwd){
	        $scope.invalidEmail = "";
	        $scope.invalidPwd = "";
	        $scope.invalidRequest="";
	
	        if(email == undefined || email   == ''){
	          //$scope.invalidEmail='email Id is Mandatory';
	          $.UIkit.notify({
	               message : 'Email Id is Mandatory',
	               status  : 'danger',
	               timeout : 2000,
	               pos     : 'top-center'
	            });
	        } else if(pwd ==undefined || pwd == ''){
	            $scope.invalidUname = "";
	            //$scope.invalidPwd='Please enter your password';
	            $.UIkit.notify({
	               message : 'Please enter your password',
	               status  : 'danger',
	               timeout : 2000,
	               pos     : 'top-center'
	            });
	
	        } else {
	            $scope.invalidEmail = "";
	            $scope.invalidPwd = "";
	            $scope.invalidRequest="";
	            var params = { "email":email, "password":pwd };
	            //$state.go('app.solution');
	
	            AuthService.login(params).then(function(data){
	                if(data!=null){
	                    if(data.status=="success"){
	//                      localStorage.setItem('loginData',JSON.stringify(data));
	//                       var x = location.host;
	//                       var y = "http://"+x+"/dashboard";
	                      localStorage.setItem('userInfo',JSON.stringify(data))
	
	                      if(data.role == 'sa')
	                        $state.go('app.solution');
	                      else
	                      window.location.href = "http://"+ location.host+"/";
	                    } else if(data.status=="failure"){
	                        // TODO: handle failure case
	                        // $scope.invalidRequest=data.result;
	                        $.UIkit.notify({
	                           message : data.msg,
	                           status  : 'danger',
	                           timeout : 2000,
	                           pos     : 'top-center'
	                        });
	                    }
	                    else if(data.status==500){
	                        // TODO: handle failure case
	                        $scope.invalidRequest=data.error;
	                    }
	
	                }
	                else{
	                    $scope.invalidRequest="Oops! Connection failed";
	                }
	            }, function(err){
	                  console.log(err);
	                 $.UIkit.notify({
	                         message : "Internal server error",
	                         status  : 'warning',
	                         timeout : 3000,
	                         pos     : 'top-center'
	                 });
	            });
	        }
	      };
	
	
	}];

/***/ }),
/* 74 */
/***/ (function(module, exports) {

	module.exports = "<!--<div class=\"deloitte-login\">-->\n  <!--<div class=\"login-bg\">-->\n    <!--<div class=\"container login-widget row\">-->\n      <!--<div class=\"col-md-6 col-md-offset-6 container-top\" >-->\n        <!--<div class=\"pull-right login-right\">-->\n          <!--<div class=\"form\">-->\n            <!--<form  role=\"form\"  ng-submit=\"doLogin(email,pwd)\" validate-form>-->\n              <!--<div class=\"form-group has-feedback\">-->\n                <!--<input type=\"text\" class=\"form-control login-form\" placeholder=\"Username\" ng-model=\"email\" >-->\n                <!--<i class=\"fa fa-user form-control-feedback icon-style\"></i>-->\n\n                <!--<div class=\"errorMsg\">{$ invalidEmail $}</div>-->\n              <!--</div>-->\n\n              <!--<div class=\"form-group has-feedback\">-->\n                <!--<input type=\"password\" class=\"form-control login-form\" placeholder=\"Password\" ng-model=\"pwd\" >-->\n                <!--<i class=\"fa fa-lock form-control-feedback icon-style\"></i>-->\n\n                <!--<div class=\"errorMsg\">{$ invalidPwd $}</div>-->\n              <!--</div>-->\n              <!--<button type=\"submit\" class=\"btn btn-block mt-lg\">Sign In</button>-->\n              <!--<div class=\"errorMsg\">{$ invalidRequest $}</div>-->\n            <!--</form>-->\n            <!--<br>-->\n          <!--</div>-->\n        <!--</div>-->\n      <!--</div>-->\n    <!--</div>-->\n  <!--</div>-->\n<!--</div>-->\n\n\n<div class=\"row row-eq-height\">\n  <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-6 no-padding\">\n      <div class=\"login-page login-page-leftbackground\"></div>\n  </div>\n  <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-6 no-padding\">\n      <div class=\"login-page login-page-rightContent row\">\n            <div class=\"login-form custom-top\">\n              <form class=\"form-signin\" ng-submit=\"doLogin(email,pwd)\" validate-form >\n                <h3 class=\"form-signin-heading\">Login</h3>\n                <br>\n                <div class=\"input-group has-feedback\">\n                  <label class=\"login-labels\">Username</label>\n                  <input type=\"text\" class=\"form-control login-form\" placeholder=\"Email Address\" ng-model=\"email\">\n                  <img src=\"/static/uam/app/images/UserID.png\" class=\"form-control-feedback icon-style\"/>\n                </div>\n                <div class=\"errorMsg\">{$ invalidEmail $}</div>\n                <br>\n                <div class=\"input-group has-feedback\">\n                  <label class=\"login-labels\">Password</label>\n                  <input type=\"password\" class=\"form-control login-form\" placeholder=\"Password\" ng-model=\"pwd\">\n                  <img src=\"/static/uam/app/images/password.png\" class=\"form-control-feedback icon-style\"/>\n                </div>\n                <div class=\"errorMsg\">{$ invalidPwd $}</div>\n                <br>\n                <button class=\"btn btn-lg btn-custom btn-text\" type=\"submit\">LOGIN</button>\n                <div class=\"errorMsg\">{$ invalidRequest $}</div>\n              </form>\n            </div>\n      </div>\n  </div>\n</div>"

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
	
		angular.module('console.login.services', [])
			.service('AuthService', __webpack_require__(76));
	})();
	
	
	


/***/ }),
/* 76 */
/***/ (function(module, exports) {

	(function() {
		'use strict';
	
		module.exports = ['$state','$q','$http',
			function($state,$q, $http) {
	
	            var _login=function(loginData){
	                var path = '/api/auth/';
	                var deferred = $q.defer();
	                $http.post(path, loginData).success(function(data, status, headers, config) {
	                    deferred.resolve(data);
	                }).error(function(data, status, headers, config) {
	                    deferred.resolve(data);
	                });
	                return deferred.promise;
	            };
	
	            var _resetPassword=function(userinfo){
	                var path = 'api/resetPassword';
	                var deferred = $q.defer();
	                $http.post(path, userinfo,{timeout:10000}).success(function(data, status, headers, config) {
	                    deferred.resolve(data);
	                }).error(function(data, status, headers, config) {
	                    deferred.resolve(data);
	                });
	                return deferred.promise;
	            };
	
	            var AuthService = {
	                login:_login,
	                resetPassword:_resetPassword
	            };
	
	            return AuthService;
			}
		];
	})();

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
	
		//require('./dashboard/dashboard.module.js');
	
		module.exports = angular.module('console.solution', ['ui.router'])
		    .controller('solutionController', __webpack_require__(78))
			//.directive('bodyContentContainer', require('./dashboard.controller.js'));
			 .config(['$stateProvider', function($stateProvider) {
				$stateProvider.state('app.solution', {
					url: '/solution',
					views: {
						'bodyContentContainer@app': {
							template: __webpack_require__(79),
							controller: 'solutionController',
							controllerAs: 'sl',
							cache:false,
							resolve: {
	                              logedIn:["$state", function($state){
	                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
	                                 if(!loginData){
	                                        $state.go('login')
	                                 }
	                              }],
	                        }
						}
					}
				});
			}]);
	})();

/***/ }),
/* 78 */
/***/ (function(module, exports) {

	module.exports = ['$scope', '$state', '$rootScope', 'solutionService','ngDialog' ,function($scope, $state, $rootScope, solutionService,ngDialog) {
		'use strict';
		  $scope.solutionType = "";
	      $rootScope.currentState = 'solution';
	      $scope.classSolutionType={};
	      $scope.imgSolutionType={};
	      $scope.classSolutionType['1']="solutionTypeDiv";
	      $scope.classSolutionType['2']="solutionTypeDiv";
	      $scope.classSolutionType['3']="solutionTypeDiv";
	      $scope.imgSolutionType['1']=false;
	      $scope.imgSolutionType['2']=false;
	      $scope.imgSolutionType['3']=false;
	      var vm = this;
	      $scope.showDeleteIcon={};
	      $scope.solutionActiveClass = [];
	      window.scrollTo(0,0);
	
	      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
	      vm.sess_id= $scope.loginData.sess_id;
	      $rootScope.inSolution = false;
	      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
	
	      solutionService.getSolutions(vm.sess_id).then(function(result){
	          $scope.solutionsList=result.data.data;
	          if(result.data.result == undefined){
	            $scope.createSolution = true;
	            $scope.solutionDash = false;
	            $scope.solutionName = "";
	          }
	          else if($scope.solutionsList.length >= 1){
	            $scope.solutionDash = true;
	            $scope.createSolution = false;
	            for(var i=0;i<$scope.solutionsList.length;i++){
	              if($scope.solutionsList[i].solution_id == $scope.loginData.user.solution_id){
	                $scope.solutionActiveClass[i] = "wellActiveSolution";
	              }
	              else{
	                $scope.solutionActiveClass[i] = "wellSolution";
	              }
	            }
	          }
	//          if($scope.solutionsList.length == 1){
	//            $state.go("app.dashboard");
	//          }
	      });
	
	      $scope.solutionSelection = function(obj){
	         var userData=localStorage.getItem('userInfo');
	         userData=JSON.parse(userData);
	         userData.user.solution_id = obj.solution_id;
	         userData.user.solution_name = obj.solution_name;
	         solutionService.postTenants({"solution_id":obj.solution_id},vm.sess_id).then(function(result){
	            if(result.data.status=="success"){
	               $rootScope.solutionName=obj.solution_name;
	               $rootScope.inSolution = true;
	               $state.go("app.dashboard");
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
	      };
	
	      $scope.createSolutionFunction = function(){
	          $scope.solutionType = "automation";
	           var obj = {
	              "solution_name" : angular.copy($scope.solutionName),
	              "solution_type" : $scope.solutionType,
	              "description" : $scope.solutionDes
	           };
	           solutionService.createSolution(obj,vm.sess_id).then(function(result){
	                if(result.data.status=="success"){
	                     $.UIkit.notify({
	                        message : result.data.msg,
	                        status  : 'success',
	                        timeout : 2000,
	                        pos     : 'top-center'
	                     });
	                     $scope.solutionName = "";
	                     $scope.solutionDes = "";
	                     $scope.solutionDash = true;
	                     $scope.createSolution = false;
	                     $scope.setTenantAfterCreate(obj.solution_name);
	                     $state.reload();
	                }
	                else{
	
	                   $.UIkit.notify({
	                       message : result.data.msg,
	                       status  : 'danger',
	                       timeout : 2000,
	                       pos     : 'top-center'
	                    });
	                }
	
	           },function(err){
	                       $.UIkit.notify({
	                               message : 'Internal Server Error',
	                               status  : 'warning',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                       });
	           });
	
	      };
	
	      $scope.setTenantAfterCreate = function(solName){
	         solutionService.getSolutions(vm.sess_id).then(function(result){
	            $scope.solutionsList=result.data.data;
	            $rootScope.inSolution = true;
	//            for(var i=0;i<$scope.solutionsList.length;i++){
	//              if($scope.solutionsList[i].solution_name == solName){
	//                 var userData=localStorage.getItem('userInfo');
	//                 userData=JSON.parse(userData);
	//                 userData.user.solution_id = $scope.solutionsList[i].solution_id;
	//                 userData.user.solution_name = $scope.solutionsList[i].solution_name;
	//                 localStorage.setItem('loginData',JSON.stringify(userData));
	//                 var sol_ref_id=$scope.solutionsList[i].solution_id;
	//                 /*solutionService.postTenants({"solution_id":sol_ref_id},vm.sess_id).then(function(result){
	//                    if(result.data.status=="success"){
	//                       $rootScope.solutionName=$scope.solutionsList[i].solution_name;
	//                       $rootScope.inSolution = true;
	//                       $state.go("app.dashboard");
	//                    }
	//                    else{
	//                      $.UIkit.notify({
	//                           message : result.data.msg,//'Solution name has not been updated',
	//                           status  : 'danger',
	//                           timeout : 2000,
	//                           pos     : 'top-center'
	//                      });
	//                    }
	//                 });
	//                 break;*/
	//              }
	//            }
	         });
	      };
	
	      $scope.deleteSolution = function(list,$event){
	          $event.stopPropagation();
	          var data = {"solution_id":list.solution_id};
	          ngDialog.open({ template: 'confirmBox',
	            controller: ['$scope','$state' ,function($scope,$state) {
	                $scope.activePopupText = 'Are you sure you want to delete ' +"'" +list.solution_name+ "'" +' ' + 'solution ?';
	                $scope.onConfirmActivation = function (){
	                    ngDialog.close();
	                    solutionService.delSolution(data,vm.sess_id).then(function(result){
	                        if(result.data.status=="success"){
	                           $.UIkit.notify({
	                               message : result.data.msg,
	                               status  : 'success',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                            });
	                            $state.reload();
	                        }
	                        else{
	                           $.UIkit.notify({
	                               message : result.data.msg,
	                               status  : 'danger',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                            });
	                        }
	                    }).catch(function(response) {
	                          console.log(response);
	                          $.UIkit.notify({
	                               message : 'Internal Server Error',
	                               status  : 'danger',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                          });
	                    });
	                };
	            }]
	          });
	      };
	
	      //ng-style="solutionType=='insights' && {'border': '2px solid #25aae1' ,'box-shadow': '1px 1px 1px 1px #f9ecec'} || {}"
	      // ng-style="solutionType=='automation' && {'border': '2px solid #25aae1' ,'box-shadow': '1px 1px 1px 1px #f9ecec'} || {}"
	      //ng-style="solutionType=='engagement' && {'border': '2px solid #25aae1' ,'box-shadow': '1px 1px 1px 1px #f9ecec'} || {}"
	      $scope.solutionTypeChange = function(selection){
	        if(selection=='1'){
	          $scope.solutionType = "insights";
	          $scope.classSolutionType['2']="solutionTypeDiv";
	          $scope.classSolutionType['3']="solutionTypeDiv";
	          $scope.imgSolutionType['2']=false;
	          $scope.imgSolutionType['3']=false;
	        }
	        if(selection=='2'){
	          $scope.solutionType = "automation";
	          $scope.classSolutionType['1']="solutionTypeDiv";
	          $scope.classSolutionType['3']="solutionTypeDiv";
	          $scope.imgSolutionType['1']=false;
	          $scope.imgSolutionType['3']=false;
	        }
	        if(selection=='3'){
	          $scope.solutionType = "engagement";
	          $scope.classSolutionType['1']="solutionTypeDiv";
	          $scope.classSolutionType['2']="solutionTypeDiv";
	          $scope.imgSolutionType['1']=false;
	          $scope.imgSolutionType['2']=false;
	        }
	        $scope.classSolutionType[selection]="solutionTypeActiveDiv";
	        $scope.imgSolutionType[selection]=true;
	      };
	
	      $scope.navigateToCreate = function(){
	        $scope.solutionDash = false;
	        $scope.createSolution = true;
	        $scope.solutionName = "";
	      };
	
	      $scope.showDeleteSolution=function(index){
	        $scope.showDeleteIcon[index]=true;
	      };
	      $scope.hideDeleteSolution=function(index){
	        $scope.showDeleteIcon[index]=false;
	      };
	
	}];

/***/ }),
/* 79 */
/***/ (function(module, exports) {

	module.exports = "<script type=\"text/ng-template\" id=\"confirmBox\">\n  <div class=\"popup-header\">\n    <h3 class=\"text-primary\"> Confirm Action </h3>\n    <hr class=\"popup-hr\"/>\n    <p class=\"text-info\" style=\"padding:10px\"> {$ activePopupText $}  </p>\n    <br/>\n    <div class=\"row\">\n      <div class=\"col-lg-12 col-sm-12 col-xs-12 co-md-12\">\n        <button class=\"btn btn-primary right\" ng-click=\"onConfirmActivation()\"> Confirm </button>\n      </div>\n    </div>\n  </div>\n</script>\n<!--<div class=\"container\">-->\n  <br>\n  <div class=\"row\">\n    <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\n      <!--<p class=\"solDashHeading\">Hi {$ Username $}</p>-->\n      <!--<p class=\"solDashHeading\">Welcome to User Management Page</p>-->\n      <p class=\"solDashHeading\" style=\"font-weight:500;font-size:22px;\">Solutions</p>\n      <p class=\"subhead\" ng-show=\"createSolution && solutionsList.length == undefined\">Get started by creating your first solution:</p>\n    </div>\n  </div>\n  <br>\n  <!--<div class=\"row\">-->\n    <!--<div class=\"col-lg-12 col-sm-12 col-md-12 col-xs-12\">-->\n      <!--<label>Your Solutions</label>-->\n    <!--</div>-->\n  <!--</div>-->\n  <!--<br>-->\n  <div class=\"row services\">\n    <div class=\"col-lg-4 col-sm-4 col-md-4 col-xs-6 solutionsList\" ng-mouseover=\"showDeleteSolution($index)\" ng-mouseout=\"hideDeleteSolution($index)\" ng-repeat=\"listdata in solutionsList track by $index\" >\n      <div class=\"engine-box enable\">\n        <div class=\"panel panel-custom\">\n          <div class=\"panel-heading\">\n            <p class=\"lbl-solution-name\">{$ listdata.solution_name $}</p>\n            <i class=\"fa fa-trash-o pull-right sol-delete-icon\" title=\"Delete\" alt=\"Delete\" ng-show=\"showDeleteIcon[$index]\" ng-click=\"deleteSolution(listdata,$event)\"></i>\n          </div>\n          <div class=\"panel-body panel-height\" style=\"border-bottom:1px solid #ddd;\">\n            <div class=\"lbl-solution-des textLimit\" style=\"-webkit-box-orient:vertical;\">{$ listdata.description $}</div>\n          </div>\n          <div class=\"panel-customFooter\">\n            <div class=\"row\">\n              <div class=\"col-lg-5 col-md-5 col-sm-5 col-xs-12 no-padding\">\n                <span>Services active</span>\n                <p>-</p>\n              </div>\n              <div class=\"col-lg-7 col-md-7 col-sm-7 col-xs-12 no-padding\">\n                <span>Documents Processed</span>\n                <p>-</p>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n<!--</div>-->"

/***/ }),
/* 80 */
/***/ (function(module, exports) {

	(function() {
		'use strict';
	    angular.module('console.solutionServices', [])
			.service('solutionService', ["$state", "$q", "$http", "httpPayload", function($state,$q, $http, httpPayload) {
	
	              var _getTenants = function(sess_id) {
	
	                var req = {
	                      method: 'GET',
	                      url: 'api/activeTenant/',
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	              var _postTenants = function(type,sess_id) {
	
	                var req = {
	                      method: 'POST',
	                      url: 'api/activeTenant/',
	                      headers: httpPayload.getHeader(),
	                      data: type
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	              var _createSolution = function(data,sess_id) {
	
	                  var req = {
	                        method: 'POST',
	                        url: 'api/soln/',
	                        headers: httpPayload.getHeader(),
	                        data: data
	                  };
	                  var deferred = $q.defer();
	
	                  $http(req).success(function(data) {
	                    deferred.resolve({
	                      data: data
	                    });
	                  }).error(function(data) {
	                    deferred.reject({
	                      error: data
	                    });
	                  });
	
	                  return deferred.promise;
	                };
	
	                var _getSolutions = function(sess_id) {
	
	                  var req = {
	                        method: 'GET',
	                        url: 'api/soln/',
	                        headers: httpPayload.getHeader()
	                  };
	                  var deferred = $q.defer();
	
	                  $http(req).success(function(data) {
	                    deferred.resolve({
	                      data: data
	                    });
	                  }).error(function(data) {
	                    deferred.reject({
	                      error: data
	                    });
	                  });
	
	                  return deferred.promise;
	                };
	
	               var _delSolution = function(data,sessId) {
	
	                var req = {
	                      method: 'DELETE',
	                      url: 'api/soln/',
	                      data: data,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	              var _createUsers = function(data,sessId) {
	
	                var req = {
	                      method: 'POST',
	                      url: 'api/user/',
	                      data: data,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	              var _editUsers = function(data,sessId) {
	
	                var req = {
	                      method: 'POST',
	                      url: 'api/updateuser/',
	                      data: data,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	
	              var _getUsers = function(sess_id) {
	
	                var req = {
	                      method: 'GET',
	                      url: 'api/user/',
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	              var _deleteUser = function(data,sess_id) {
	
	                var req = {
	                      method: 'DELETE',
	                      url: 'api/user/',
	                      headers: httpPayload.getHeader(),
	                      data:data
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	
	
	              var solutionService = {
	                getTenants:_getTenants,
	                postTenants:_postTenants,
	                createSolution:_createSolution,
	                getSolutions:_getSolutions,
	                delSolution:_delSolution,
	                createUsers:_createUsers,
	                editUsers:_editUsers,
	                getUsers:_getUsers,
	                deleteUser:_deleteUser
	              };
	
	              return solutionService;
			}]);
	})();

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
		__webpack_require__(82);
		__webpack_require__(85);
		__webpack_require__(88);
	    __webpack_require__(91);
	
	
		module.exports = angular.module('console.layout', [
	        'console.layout.header',
	        'console.layout.footer',
	        'console.layout.leftmenu',
	        'console.layout.bodycontent'
		])
		.controller('layoutController', __webpack_require__(94))
			//.directive('aptLogin', require('./login.controller.js'));
			.config(['$stateProvider', function($stateProvider) {
				$stateProvider.state('app', {
					url: '/app',
					views: {
						'pageContent@': {
							template: __webpack_require__(95),
							controller: 'layoutController',
							controllerAs: 'lyc'
						}
					}
					/*data: {
						menuConfig: {
							'title': 'Product',
							'iconCls': 'cube'
						}
	
					}*/
				});
			}]);
	
	})();

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
		module.exports = angular.module('console.layout.header', ['ui.router'])
			.directive('header', __webpack_require__(83));
	
	})();

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
		module.exports = [function() {
			var headerController;
	
			headerController = function($scope, $state) {
				var vm = this;
	            $scope.logout =function(){
	
	                localStorage.clear();
	                window.location.href = "http://"+ location.host+"/logout";
	            };
	            $scope.createSolution =function(){
	                $state.go('app.createSolution');
	            }
	
			};
	
			headerController.$inject = ['$scope', '$state'];
	
			return {
				restrict: 'E',
				controller: headerController,
				controllerAs: 'fc',
				scope: {},
				bindToController: {
					menus: '='
				},
				template: __webpack_require__(84)
			};
	
		}];
	})();

/***/ }),
/* 84 */
/***/ (function(module, exports) {

	module.exports = "\n<nav class=\"navbar navbar-fixed-top navbar-custom\">\n  <div class=\"container-fluid\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\" aria-expanded=\"false\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">\n        <div class=\"header-image\"></div>\n      </a>\n    </div>\n\n    <div class=\"collapse navbar-collapse\">\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li>\n          <button class=\"btn btn-custom \" ng-click=\"createSolution()\" style=\"margin-top:10px;\"><img src=\"/static/uam/app/images/createsolution.png\" class=\"createImage\"/> Create Solution</button>\n        </li>\n        <li class=\"dropdown\">\n          <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n              <img src=\"/static/uam/app/images/avatar.png\" alt=\"Avatar\" class=\"rounded-image\">\n          </a>\n          <ul class=\"dropdown-menu\">\n            <li><a><img src=\"/static/uam/app/images/avatar.png\" alt=\"Avatar\" class=\"rounded-image\">Admin</a></li>\n            <li>\n              <a ng-click=\"logout()\">\n                <img src=\"/static/uam/app/images/logout.png\" class=\"logout-image\"/>\n                Logout\n              </a>\n            </li>\n          </ul>\n        </li>\n      </ul>\n    </div>\n  </div>\n</nav>"

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
		module.exports = angular.module('console.layout.footer', ['ui.router'])
			.directive('footer', __webpack_require__(86));
	
	})();

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
		module.exports = [function() {
			var footerController;
	
			footerController = function($scope, $state) {
				var vm = this;
	
			};
	
			footerController.$inject = ['$scope', '$state'];
	
			return {
				restrict: 'E',
				controller: footerController,
				controllerAs: 'fc',
				scope: {},
				bindToController: {
					menus: '='
				},
				template: __webpack_require__(87)
			};
	
		}];
	})();

/***/ }),
/* 87 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"footer text-center\">\n  <div class=\"container\">\n    <p class=\"text-muted\">\n      <span>&#x24B8;Exponential Machines - All rights reserved</span>\n    </p>\n  </div>\n</div>"

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
		module.exports = angular.module('console.layout.leftmenu', ['ui.router'])
			.directive('leftMenu', __webpack_require__(89));
	
	})();

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
		module.exports = [function() {
			var leftmenuController;
	
			leftmenuController = function($scope, $state, $rootScope, $location, solutionService, $window) {
	//			var vm = this;
	            $scope.goToDash = function(){
	               $state.go("app.solution",{},{reload:true});
	            };
	             $scope.logout =function(){
	
	                localStorage.clear();
	                window.location.href = "http://"+ location.host+"/logout";
	            };
	            var $myGroup = $('#myGroup');
	            $myGroup.on('show.bs.collapse','.collapse', function() {
	                $myGroup.find('.collapse.in').collapse('hide');
	            });
	            $scope.gotToUsers = function(){
	                $state.go("app.users");
	            }
	            $scope.gotToQueue = function(){
	                $state.go("app.queue");
	            }
	            $scope.gotToUserGroups = function(){
	                 $state.go("app.userGroup");
	            };
	            $scope.gotToUserRoles = function(){
	                 $state.go("app.userRole");
	            };
			};
	
	        leftmenuController.$inject = ['$scope', '$state','$rootScope' ,'$location' ,'solutionService' ,'$window'];
	
			return {
				restrict: 'E',
				controller: leftmenuController,
				controllerAs: 'fc',
				scope: {},
				bindToController: {
					menus: '='
				},
				template: __webpack_require__(90)
			};
	
		}];
	})();

/***/ }),
/* 90 */
/***/ (function(module, exports) {

	module.exports = "<nav>\n    <ul class=\"sidebar-nav\">\n        <li ng-class=\"{'bg-nav':$root.currentState==='solution'}\" ng-click=\"goToDash()\">\n                <img class=\"side-menuImage\" src=\"/static/uam/app/images/Solution_white.png\" ng-if=\"$root.currentState==='solution'\"/>\n                <img class=\"side-menuImage\" src=\"/static/uam/app/images/Solution_blue.png\" ng-if=\"$root.currentState!='solution'\"/>\n        </li>\n\n        <li ng-class=\"{'bg-nav':$root.currentState==='userRole'}\" ng-click=\"gotToUserRoles()\">\n\n              <img class=\"side-menuImage\" src=\"/static/uam/app/images/Role_white.png\" ng-if=\"$root.currentState==='userRole'\"/>\n            <img class=\"side-menuImage\" src=\"/static/uam/app/images/Role_blue.png\" ng-if=\"$root.currentState!='userRole'\"/>\n\n        </li>\n        <li ng-class=\"{'bg-nav':$root.currentState==='users'}\" ng-click=\"gotToUsers()\">\n\n              <img class=\"side-menuImage\" src=\"/static/uam/app/images/User_white.png\" ng-if=\"$root.currentState==='users'\"/>\n              <img class=\"side-menuImage\" src=\"/static/uam/app/images/User_blue.png\" ng-if=\"$root.currentState!='users'\"/>\n\n        </li>\n        <li ng-class=\"{'bg-nav':$root.currentState==='userGroup'}\" ng-click=\"gotToUserGroups()\">\n\n              <img class=\"side-menuImage\" src=\"/static/uam/app/images/usergroup_white.png\" ng-if=\"$root.currentState==='userGroup'\"/>\n            <img class=\"side-menuImage\" src=\"/static/uam/app/images/usergroup_blue.png\" ng-if=\"$root.currentState!='userGroup'\"/>\n\n        </li>\n        <li ng-class=\"{'bg-nav':$root.currentState==='queue'}\" ng-click=\"gotToQueue()\">\n\n              <img class=\"side-menuImage\" src=\"/static/uam/app/images/queue.png\"/>\n\n        </li>\n    </ul>\n</nav>\n\n"

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
		module.exports = angular.module('console.layout.bodycontent', ['ui.router'])
			.directive('bodyContent', __webpack_require__(92));
	
	})();

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
		module.exports = [function() {
			var bodyContentController;
	
			bodyContentController = function($scope, $state) {
				var vm = this;
	
			};
	
			bodyContentController.$inject = ['$scope', '$state'];
	
			return {
				restrict: 'E',
				controller: bodyContentController,
				controllerAs: 'fc',
				scope: {},
				bindToController: {
					menus: '='
				},
				template: __webpack_require__(93)
			};
	
		}];
	})();

/***/ }),
/* 93 */
/***/ (function(module, exports) {

	module.exports = "\n<div class=\"body-content\">\n    <div ui-view=\"bodyContentContainer\" class=\"main-content\">\n    </div>\n</div>\n"

/***/ }),
/* 94 */
/***/ (function(module, exports) {

	module.exports = ['$scope', '$state','$rootScope',function($scope,$state,$rootScope) {
		'use strict';
		var userData=localStorage.getItem('userInfo');
	    userData=JSON.parse(userData);
	    //$scope.solutionId=userData.user.solution_id;
	    $rootScope.activeSubmeu=[];
	    $rootScope.popMenuParentClass={};
	}];

/***/ }),
/* 95 */
/***/ (function(module, exports) {

	module.exports = "<div id=\"wrapper\" class=\"toggled-2\">\n      <header></header>\n      <left-menu id=\"left-menus\"></left-menu>\n      <div id=\"page-content-wrapper\">\n            <body-content></body-content>\n      </div>\n</div>"

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
	    //require('./services/module.js');
		//require('./dashboard/dashboard.module.js');
		//require('./entitygraph/entitygraph.module.js');
		//require('./solutionsetup/solutionsetup.module.js');
	
		module.exports = angular.module('console.users', [
	        //'console.dashboard.entitygraph'
		    //'console.dashboard.solutionsetup'
		    //'console.layout.bodycontent.dashboard.services'
		])
	        .controller('usersController', __webpack_require__(97))
	         .config(['$stateProvider', function($stateProvider) {
	            $stateProvider.state('app.users', {
	                url: '/users',
	                views: {
	                    'bodyContentContainer@app': {
	                        template: __webpack_require__(98),
	                        controller: 'usersController',
	                        controllerAs: 'dbc',
	                        cache :false,
	                        resolve: {
	                              logedIn:["$state", function($state){
	                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
	                                 if(!loginData){
	                                         $state.go('login')
	                                 }
	                              }],
	                        }
	                    }
	                }
	            });
	        }]);
	})();

/***/ }),
/* 97 */
/***/ (function(module, exports) {

	module.exports = ['$scope','$state','solutionService','userService','$rootScope','ngDialog',function($scope,$state,solutionService,userService,$rootScope,ngDialog) {
		'use strict';
	
		var vm = this;
		window.scrollTo(0,0);
		$rootScope.currentState = 'users';
		$scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
		vm.sess_id= $scope.loginData.sess_id;
		$scope.config = {};
		$scope.config.solution = [];
		var userInfo = JSON.parse(localStorage.getItem('userInfo'));
	
	
	    solutionService.getSolutions(vm.sess_id).then(function(result){
	          $scope.solutionsList=result.data.data;
	    });
	    $scope.usersList=[];
	    vm.getUsers = function(){
	         userService.getUsers(vm.sess_id).then(function(response){
	              if(response.data.status=="success"){
	                   $scope.usersList=response.data.result.data;
	               }
	               else{
	                   $scope.usersList=[];
	               }
	          });
	    }
	
	    vm.getUsers();
	
	    $scope.createUser = function(){
	        $state.go('app.createUser',{id:'new'});
	    };
	
	    $scope.editUser = function(user){
	        $state.go('app.createUser',{id: user.id});
	    };
	
	
	
	    $scope.deleteUser = function(obj){
	       ngDialog.open({ template: 'confirmBox',
	            controller: ['$scope','$state' ,function($scope,$state) {
	                $scope.activePopupText = 'Are you sure you want to delete ' +"'" +obj.userName+ "'" +' ' + 'name ?';
	                $scope.onConfirmActivation = function (){
	                    ngDialog.close();
	                    userService.deleteUser({"id":obj.id},vm.sess_id).then(function(result){
	                        if(result.data.status=="success"){
	                           $.UIkit.notify({
	                               message : result.data.msg,
	                               status  : 'success',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                           });
	
	                           vm.getUsers();
	
	
	                        }
	                        if(result.data.status=="failure"){
	                           $.UIkit.notify({
	                               message : result.data.msg,
	                               status  : 'danger',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                            });
	                        }
	                    },function(err){
	                       $.UIkit.notify({
	                               message : 'Internal Server Error',
	                               status  : 'warning',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                       });
	                    });
	                };
	            }]
	       });
	
	    };
	}];

/***/ }),
/* 98 */
/***/ (function(module, exports) {

	module.exports = "<script type=\"text/ng-template\" id=\"confirmBox\">\n  <div class=\"popup-header\">\n    <h3 class=\"text-primary\"> Confirm Action </h3>\n    <hr class=\"popup-hr\"/>\n    <p class=\"text-info\" style=\"padding:10px\"> {$ activePopupText $}  </p>\n    <br/>\n    <div class=\"row\">\n      <div class=\"col-lg-12 col-sm-12 col-xs-12 co-md-12\">\n        <button class=\"btn btn-primary right\" ng-click=\"onConfirmActivation()\"> Confirm </button>\n      </div>\n    </div>\n  </div>\n</script>\n\n\n\n\n<div class=\"row overlay\" id=\"createSolution\" style=\"overflow:auto\">\n    <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\n        <h4 class=\"push-left\">\n          <span data-ng-bind=\"labelForUpload\"></span>\n          <span class=\"pull-right closebtn\" ng-click=\"closeSolutionDiv()\">&times;</span>\n        </h4>\n        <hr class=\"customLine\">\n        <form class=\"form-horizontal \" ng-submit=\"create()\">\n    <div class=\"form-group col-lg-12 col-md-12 col-sm-12\">\n      <label class=\"col-sm-4 col-md-4 col-lg-4 control-label dashboard-row\" style=\"padding-top:10px;\">Username</label>\n      <div class=\"col-sm-8 col-lg-8 col-md-8\">\n       <input type=\"text\" class=\"form-control\" ng-disabled=\"user_edit\"  ng-model=\"config.username\" placeholder=\"Username\" ng-disabled=\"user_edit\" required=\"\">\n      </div>\n    </div>\n    <div class=\"form-group col-lg-12 col-md-12 col-sm-12\">\n      <label class=\"col-sm-4 col-md-4 col-lg-4 control-label dashboard-row\" style=\"padding-top:10px;\">Password</label>\n      <div class=\"col-sm-8 col-lg-8 col-md-8\">\n       <input type=\"password\" ng-disabled=\"user_edit\"  class=\"form-control ng-pristine ng-valid-email ng-valid ng-valid-required\" ng-model=\"config.password\" placeholder=\"password\" required=\"\">\n      </div>\n    </div>\n    <div class=\"form-group col-lg-12 col-md-12 col-sm-12\">\n      <label class=\"col-sm-4 col-md-4 col-lg-4 control-label dashboard-row\" style=\"padding-top:10px;\">Confirm Password</label>\n      <div class=\"col-sm-8 col-lg-8 col-md-8\">\n       <input type=\"password\" ng-disabled=\"user_edit\"  class=\"form-control ng-pristine ng-valid ng-valid-required\" ng-model=\"config.confirmPassword\" placeholder=\"confirm password\" required=\"\">\n      </div>\n    </div>\n    <div class=\"form-group col-lg-12 col-md-12 col-sm-12\">\n      <label class=\"col-sm-4 col-md-4 col-lg-4 control-label dashboard-row\" style=\"padding-top:10px;\">Solution</label>\n      <div class=\"col-sm-8 col-lg-8 col-md-8\">\n        <multiselect ng-model=\"config.solutions\" class=\"multiSelect\" options=\"solutionsList\"  show-search=\"true\" search-limit=\"100000\" id-prop=\"solution_id\" display-prop=\"solution_name\">\n        </multiselect>\n      </div>\n    </div>\n    <div class=\"form-group col-lg-12 col-md-12 col-sm-12\">\n      <label class=\"col-sm-4 col-md-4 col-lg-4 control-label dashboard-row\" style=\"padding-top:10px;\">Role</label>\n      <div class=\"col-sm-8 col-lg-8 col-md-8\">\n       <select class=\"form-control ng-pristine ng-valid ng-valid-required\" ng-model=\"config.role\" required ng-disabled=\"user_edit\" >\n         <option value=\"\">Select role</option>\n         <option value=\"se\">Solution Engineer</option>\n         <option value=\"bu\">Business User</option>\n         <option value=\"sv\">Supervisor User</option>\n       </select>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-lg-12 col-md-12 col-sm-12 text-right\">\n        <button type=\"submit\" class=\"btn btn-custom\">Save</button>\n        <button class=\"btn btn-cancel\" type=\"button\" ng-click=\"config={}\" ng-hide=\"user_edit\">Clear</button>\n      </div>\n    </div>\n  </form>\n    </div>\n</div>\n<br>\n<div classs=\"row\">\n    <div class=\"col-lg-6 col-xs-6 col-md-6 col-sm-6\">\n        <p class=\"solDashHeading\" style=\"font-size:14px;\">USERS</p>\n    </div>\n</div>\n<br>\n\n<br>\n<div class=\"row custom-dashboard\">\n    <div class=\"table-scroll\">\n        <div class=\"dashboard-inner\">\n            <div class=\"row row-justify\" style=\"margin-bottom:20px\">\n                <div class=\"col-lg-6 col-xs-6 col-md-6 col-sm-6 padding-15\">\n                    <div class=\"inner-addon right-addon\">\n                          <i class=\"glyphicon glyphicon-search\"></i>\n                          <!--<input type=\"text\" class=\"form-control\" placeholder=\"Search\" />-->\n                    </div>\n                </div>\n                <div class=\"col-lg-2 col-xs-6 col-md-2 col-sm-4 padding-15 text-right\">\n                    <button class=\"btn btn-customQueue\" ng-click=\"createUser();\">\n                        <img src=\"./static/uam/app/images/create.png\" style=\"width:15px;\"/>\n                      Create New User\n                    </button>\n                </div>\n            </div>\n            <table class=\"table table-responsive \">\n              <thead class=\"tableHeading\">\n                  <tr>\n                    <td><span>Username</span></td>\n                    <td><span>Solution</span></td>\n                    <td><span>Role</span></td>\n                    <td><span>User groups</span></td>\n                    <td><span>Action</span></td>\n                  </tr>\n              </thead>\n              <tbody>\n                <tr ng-repeat=\"user in usersList\">\n                  <td>{$ user.userName $}</td>\n                  <td>\n                    <div ng-repeat=\"list in user.solutions\">\n                            <span ng-show=\"$index<3 && !showMore\">{$ list.name $}</span>\n                            <span ng-show=\"user.solutions.length-1!=$index && $index<3 && !showMore\">,</span>\n                            <span ng-show=\"showMore\">{$ list.name $}</span>\n                            <span ng-show=\"user.solutions.length-1!=$index && showMore\">,</span>\n                    </div>\n                    <a ng-show=\"user.solutions.length>3 && !showMore\" ng-click=\"showMore=true\">show more</a>\n                    <a ng-show=\"user.solutions.length>3 && showMore\" ng-click=\"showMore = false\">show less</a>\n                  </td>\n                  <td>\n                      <div ng-repeat=\"list in user.userRoles\">\n                            <span ng-show=\"$index<3 && !showMore1\">{$ list.name $}</span>\n                            <span ng-show=\"user.userRoles.length-1!=$index && $index<3 && !showMore1\">,</span>\n                            <span ng-show=\"showMore1\">{$ list.name $}</span>\n                            <span ng-show=\"user.userRoles.length-1!=$index && showMore1\">,</span>\n                      </div>\n                      <a ng-show=\"user.userRoles.length>3 && !showMore1\" ng-click=\"showMore1=true\">show more</a>\n                      <a ng-show=\"user.userRoles.length>3 && showMore1\" ng-click=\"showMore1 = false\">show less</a>\n                  </td>\n                    <td>{$ user.role $}</td>\n                  <td>\n\n                    <span ng-click=\"editUser(user);\" style=\"cursor:pointer;margin-right:10px;\" ng-class=\"loginData._id==user.id ? 'disableClass' : ''\">\n                       <img src=\"./static/uam/app/images/edit.png\" class=\"actionWidth\"/>\n                    </span>\n                   <span ng-class=\"loginData._id==user.id ? 'disableClass' : ''\">\n                     <img src=\"./static/uam/app/images/delete.png\"  class=\"actionWidth\" ng-click=\"deleteUser(user)\" style=\"cursor:pointer;padding-right: 5px;\"/>\n                    </span>\n                  </td>\n                </tr>\n              </tbody>\n\n            </table>\n        </div>\n    <br>\n  </div>\n</div>"

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
	
		module.exports = angular.module('console.createUser', ['ui.router'])
		    .controller('createUserController', __webpack_require__(100))
	
			 .config(['$stateProvider', function($stateProvider) {
				$stateProvider.state('app.createUser', {
					url: '/createUser/:id',
					views: {
						'bodyContentContainer@app': {
							template: __webpack_require__(101),
							controller: 'createUserController',
							controllerAs: 'cu',
							cache:false,
						}
					}
				});
			}]);
	})();

/***/ }),
/* 100 */
/***/ (function(module, exports) {

	module.exports = ['$scope', '$state', '$stateParams', '$rootScope','ngDialog','userService','solutionService','$timeout',
	function($scope, $state, $stateParams, $rootScope,ngDialog,userService,solutionService,$timeout) {
	    'use strict';
	    $rootScope.currentState = 'create user';
	    var vm=this;
	    $scope.config = {};
	    $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
		vm.sess_id= $scope.loginData.sess_id;
		$scope.id = $stateParams.id;
	    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
	
	    solutionService.getSolutions(vm.sess_id).then(function(result){
	          $scope.solutionsList=result.data.data;
	          if($scope.id != "new"){
	              $scope.mapSolutions();
	          }
	          $timeout($scope.showSelectedSolutions, 600);
	    });
	
	    $scope.mapSolutions = function(){
	        if($scope.userDetails != undefined && $scope.solutionsList != undefined){
	            $scope.config.solutions = [];
	            angular.forEach($scope.userDetails[0].solutions, function(value,key){
	                var ar = $scope.solutionsList.filter(function(e){if(e.solution_name==value.name){return e}});
	                $scope.config.solutions.push(ar[0]);
	            });
	        }
	    };
	
	    vm.getUsers = function(){
	         userService.getUsers(vm.sess_id).then(function(response){
	              if(response.data.status=="success"){
	                   $scope.usersList=response.data.result.data;
	                   $scope.userDetails = $scope.usersList.filter(function(e){if(e.id==$scope.id){return e}});
	                   $scope.config.roles = $scope.userDetails[0].userRoles;
	                   $scope.config.userName = $scope.userDetails[0].userName;
	                   $scope.mapSolutions();
	               }
	               else{
	                   $scope.usersList=[];
	               }
	          });
	    }
	
	    if($scope.id != "new"){
	       vm.getUsers();
	    }
	
	    vm.getUserRoles = function(){
	         userService.getUserRoles(vm.sess_id).then(function(response){
	              if(response.data.status=="success"){
	                   $scope.userRoles=response.data.result.data;
	                   $timeout($scope.showSelectedRoles, 600);
	               }
	               else{
	                   $scope.userRoles=[];
	               }
	          });
	    }
	    vm.getUserRoles();
	
	    $scope.showSelectedRoles=function(){
	        angular.element("#multiSelectUserRoles button").triggerHandler("click");
	        angular.element("#multiSelectUserRoles button").triggerHandler("click");
	    };
	    $scope.showSelectedSolutions=function(){
	        angular.element("#multiSelectSolution button").triggerHandler("click");
	        angular.element("#multiSelectSolution button").triggerHandler("click");
	    };
	
	
	    $scope.create = function(){
	        if($scope.config.password == $scope.config.confirmPassword){
	            if($scope.id=='new'){
	                if($scope.config.solutions)
	                    var solArray = $scope.config.solutions.map(function(e){return {"name": e.solution_name,"id": e.solution_id}});
	                else
	                    var solArray =[];
	
	                if($scope.config.roles)
	                    var roleArray =$scope.config.roles.map(function(e){return e.name});
	                else
	                    var roleArray=[];
	                var obj = {
	                            "userName": $scope.config.userName,
	                            "solutions": solArray,
	                            "password": $scope.config.password,
	                            "roles": roleArray
	                           }
	                console.log(obj);
	                userService.createUsers(obj,vm.sess_id).then(function(result){
	                            if(result.data.result.status =='Success'){
	                                 $.UIkit.notify({
	                                    message : result.data.result.message,
	                                    status  : 'success',
	                                    timeout : 2000,
	                                    pos     : 'top-center'
	                                 });
	                                 $state.go('app.users');
	                            }
	                            else{
	                               $.UIkit.notify({
	                                   message :  result.data.result.message,
	                                   status  : 'danger',
	                                   timeout : 2000,
	                                   pos     : 'top-center'
	                                });
	                            }
	                });
	            }
	            else{
	               var solArray = $scope.config.solutions.map(function(e){return {"name": e.solution_name,"id": e.solution_id}});
	               var roleArray = $scope.config.roles.map(function(e){return e.name});
	               $scope.userDetails[0].userRoles = angular.copy($scope.config.roles);
	               $scope.userDetails[0].roles = angular.copy(roleArray);
	               $scope.userDetails[0].solutions = angular.copy(solArray);
	               $scope.userDetails[0].userName = angular.copy($scope.config.userName);
	                userService.createUsers($scope.userDetails[0],vm.sess_id).then(function(result){
	                            if(result.data.result.status =='Success'){
	                                 $.UIkit.notify({
	                                    message : result.data.result.message,
	                                    status  : 'success',
	                                    timeout : 2000,
	                                    pos     : 'top-center'
	                                 });
	                                 $state.go('app.users');
	                            }
	                            else{
	                               $.UIkit.notify({
	                                   message :  result.data.result.message,
	                                   status  : 'danger',
	                                   timeout : 2000,
	                                   pos     : 'top-center'
	                                });
	                            }
	                });
	            }
	        }
	        else{
	            $.UIkit.notify({
	               message : "Password and confirm password should be match",
	               status  : 'danger',
	               timeout : 2000,
	               pos     : 'top-center'
	            });
	        }
	    };
	
	
	
	
	
	}];

/***/ }),
/* 101 */
/***/ (function(module, exports) {

	module.exports = "<script type=\"text/ng-template\" id=\"confirmBox\">\n  <div class=\"popup-header\">\n    <h3 class=\"text-primary\"> Confirm Action </h3>\n    <hr class=\"popup-hr\"/>\n    <p class=\"text-info\" style=\"padding:10px\"> {$ activePopupText $}  </p>\n    <br/>\n    <div class=\"row\">\n      <div class=\"col-lg-12 col-sm-12 col-xs-12 co-md-12\">\n        <button class=\"btn btn-primary right\" ng-click=\"onConfirmActivation()\"> Confirm </button>\n      </div>\n    </div>\n  </div>\n</script>\n<div class=\"createUser\">\n    <div class=\"row\">\n      <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 user-desc\">\n        <label class=\"user-text\"><a ui-sref=\"app.users\">USERS</a></label><span> > </span><span class=\"user-text\">Create a new user</span>\n      </div>\n    </div>\n     <!-- <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 user-creation\">\n        <label>Create new user</label>\n      </div>-->\n      <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 creation-section\">\n        <form ng-submit=\"create()\">\n          <div class=\"row\">\n            <div class=\"col-lg-4 col-md-4 col-sm-6 col-xs-12 form-group\">\n              <label>User name</label>\n              <input type=\"text\" class=\"form-control\" placeholder=\"User name\" ng-model=\"config.userName\" required>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-lg-4 col-md-4 col-sm-6 col-xs-12 form-group\">\n              <label>Password</label>\n              <input type=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"config.password\" ng-disabled=\"id!='new'\" required>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-lg-4 col-md-4 col-sm-6 col-xs-12 form-group\">\n              <label>Confirm password</label>\n              <input type=\"password\" class=\"form-control\" placeholder=\"Confirm password\" ng-model=\"config.confirmPassword\" ng-disabled=\"id!='new'\" required>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-lg-4 col-md-4 col-sm-6 col-xs-12 form-group\">\n              <label>Solution</label>\n              <multiselect ng-model=\"config.solutions\" id=\"multiSelectSolution\" class=\"multiSelect\" options=\"solutionsList\"  show-search=\"true\" search-limit=\"100000\" id-prop=\"solution_id\" display-prop=\"solution_name\">\n              </multiselect>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-lg-4 col-md-4 col-sm-6 col-xs-12 form-group\">\n              <label>Role</label>\n              <multiselect ng-model=\"config.roles\" id=\"multiSelectUserRoles\" class=\"multiSelect\" options=\"userRoles\"  show-search=\"true\" search-limit=\"100000\" id-prop=\"id\" display-prop=\"name\">\n              </multiselect>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-lg-4 col-md-4 col-sm-6 col-xs-12 form-group btn-custom-group\">\n              <button class=\"btn btn-custom-create\" type=\"submit\">\n                <img src=\"./static/uam/app/images/save_white.png\" class=\"img-responsive img-save\"> Save\n              </button>\n               <button class=\"btn btn-custom-cancel\" ui-sref=\"app.users\">\n                Cancel\n              </button>\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n</div>"

/***/ }),
/* 102 */
/***/ (function(module, exports) {

	(function() {
		'use strict';
	    angular.module('console.userServices', [])
			.service('userService', ["$state", "$q", "$http", "httpPayload", function($state,$q, $http, httpPayload) {
	              var _createUsers = function(data,sessId) {
	
	                var req = {
	                      method: 'POST',
	                      url: 'api/users/',
	                      data: data,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	              var _editUsers = function(data,sessId) {
	
	                var req = {
	                      method: 'POST',
	                      url: 'api/users/',
	                      data: data,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	
	              var _getUsers = function(sess_id) {
	
	                var req = {
	                      method: 'GET',
	                      url: 'api/users/',
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	              var _getUserRoles = function(sess_id) {
	
	                var req = {
	                      method: 'GET',
	                      url: 'api/userroles/',
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	              var _deleteUser = function(data,sess_id) {
	
	                var req = {
	                      method: 'DELETE',
	                      url: 'api/users/'+data.id,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	
	
	              var userService = {
	                createUsers:_createUsers,
	                editUsers:_editUsers,
	                getUsers:_getUsers,
	                getUserRoles: _getUserRoles,
	                deleteUser:_deleteUser
	              };
	
	              return userService;
			}]);
	})();

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
	    //require('./services/module.js');
		//require('./dashboard/dashboard.module.js');
		//require('./entitygraph/entitygraph.module.js');
		//require('./solutionsetup/solutionsetup.module.js');
	
		module.exports = angular.module('console.userGroups', [
	        //'console.dashboard.entitygraph'
		    //'console.dashboard.solutionsetup'
		    //'console.layout.bodycontent.dashboard.services'
		])
	        .controller('userGroupController', __webpack_require__(104))
	         .config(['$stateProvider', function($stateProvider) {
	            $stateProvider.state('app.userGroup', {
	                url: '/userGroups',
	                views: {
	                    'bodyContentContainer@app': {
	                        template: __webpack_require__(105),
	                        controller: 'userGroupController',
	                        controllerAs: 'ugc',
	                        cache :false,
	                        resolve: {
	                              logedIn:["$state", function($state){
	                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
	                                 if(!loginData){
	                                         $state.go('login')
	                                 }
	                              }],
	                        }
	                    }
	                }
	            });
	        }]);
	})();

/***/ }),
/* 104 */
/***/ (function(module, exports) {

	module.exports = ['$scope','$state','userGroupServices','userService','solutionService','$rootScope','ngDialog','$timeout',
	function($scope,$state,userGroupServices,userService,solutionService,$rootScope,ngDialog,$timeout) {
		'use strict';
	
		var vm = this;
		window.scrollTo(0,0);
		$rootScope.currentState = 'userGroup';
		$scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
		vm.sess_id= $scope.loginData.sess_id;
		$scope.config = {};
		$scope.config.solution = [];
		var userInfo = JSON.parse(localStorage.getItem('userInfo'));
		$scope.isUserGroups=false;
	    $scope.tagInputScope = {};
		$scope.config = {};
	
		$scope.createNewUserGroup =function(){
	        $scope.isUserGroups=true;
	        $scope.UserGroupsList=[];
	        $scope.ExistingUserGroupsList=[];
		};
		vm.firstLoad=true;
	
		vm.newUserGroupObj = { 'name': 'Group 1', 'members':[], 'description':'','policies':{}};
	    $scope.userGroupsObj ={subGroups: []};
	
	    vm.users=[];
	    vm.usersObj=[];
	    vm.usersArrayObj={};
	    vm.getAllUsers = function(){
	         userService.getUsers(vm.sess_id).then(function(response){
	              if(response.data.status=="success"){
	                   vm.usersObj=response.data.result.data;
	                   angular.forEach(response.data.result.data, function(value,key){
	                        //vm.users.push({"userName":value.userName,"id":value.id});
	                            vm.users.push({"userName": value.userName,"id":value.id });
	
	                        vm.usersArrayObj[value.userName]=value.id;
	                   });
	               }
	               else{
	                   vm.users=[];
	               }
	          });
	    }
	    vm.getAllUsers();
	
	    $scope.loadUsers = function($query) {
	        if($query==""){
	            return vm.users;
	        }
	        else{
	             var filterArray=[];
	             vm.users.filter(function(user) {
	                 if(user.userName.toLowerCase().indexOf($query.toLowerCase()) != -1){
	                    filterArray.push(user);
	                 }
	            });
	            return filterArray;
	        }
	    };
	    $scope.onTagAdded = function($tag) {
	        /*vm.newUserGroupObj.members.push($tag);*/
	        console.log(vm.newUserGroupObj.members);
	    };
	    $scope.onTagRemoved =function($tag){
	        /*vm.newUserGroupObj.members.slice($tag,0);*/
	        console.log(vm.newUserGroupObj.members);
	    };
	
	
	    vm.getuserGroups = function(){
	         userGroupServices.getUserGroups(vm.sess_id).then(function(response){
	              if(response.data){
	                  if(response.data.status=="success"){
	                    if(response.data.result.data){
	                        if(response.data.result.data.length>0){
	                            $scope.isUserGroups=true;
	                        }
	                        $scope.UserGroupsList=response.data.result.data;
	                        $scope.ExistingUserGroupsList=angular.copy(response.data.result.data);
	                        $scope.userGroupsObj["subGroups"]=response.data.result.data;
	                        //vm.getCurrentGroupMembers($scope.UserGroupsList[0]);
	                        vm.newUserGroupObj=$scope.UserGroupsList[0];
	                        console.log($scope.UserGroupsList);
	                        if(vm.firstLoad==true){
	                            $timeout(function() {
	                                angular.element(".angular-ui-tree ol:first-child li:first-child div").triggerHandler('click');
	                            }, 500);
	                           vm.firstLoad==false;
	                        }
	                        /*angular.forEach($scope.usersList, function(value,key){
	                        vm.userGroupsList.push(value.name);
	                        });*/
	                    }
	                   }
	                   else{
	                        $.UIkit.notify({
	                           message : response.data.msg,
	                           status  : 'warning',
	                           timeout : 3000,
	                           pos     : 'top-center'
	                       });
	                   }
	               }
	          });
	    }
	
	    vm.getuserGroups();
	
	//    vm.getCurrentGroupMembers = function(usersObj){
	//        console.log(usersObj);
	//        var array=[];
	//        angular.forEach(usersObj.members, function(value,key){
	//            array.push(value.userName);
	//        });
	//        usersObj.members=array;
	//        vm.newUserGroupObj=usersObj;
	//    };
	
	    vm.saveUserGroup = function(){
	        console.log("saveUserGroup==>",vm.newUserGroupObj);
	
	        if(vm.newUserGroupObj.id){
	            if(vm.isUserGroupExist(vm.newUserGroupObj.name,vm.newUserGroupObj.id)){
	                $.UIkit.notify({
	                   message :  "(id) Group name '"+vm.newUserGroupObj.name+"' already exists.",
	                   status  : 'danger',
	                   timeout : 2000,
	                   pos     : 'top-center'
	                });
	                return 0;
	            }
	            var reqObj=angular.copy(vm.newUserGroupObj);
	            reqObj.members=[];
	            /*if(vm.newUserGroupObj.members){
	                 angular.forEach(vm.newUserGroupObj.members, function(value,key){
	                    reqObj.members.push({"id": vm.usersArrayObj[value], "userName": value });
	                 });
	            }*/
	
	            var usersArray =[];
	            if(vm.newUserGroupObj.members){
	                 angular.forEach(vm.newUserGroupObj.members, function(value,key){
	                    usersArray.push(vm.usersArrayObj[value]);
	                 });
	            }
	
	            //vm.setGroupMembers(vm.newUserGroupObj.id,usersArray);
	            userGroupServices.createUserGroup(reqObj,vm.sess_id).then(function(result){
	                if(result.data.result.status =='Success'){
	                     $.UIkit.notify({
	                        message : result.data.result.message,
	                        status  : 'success',
	                        timeout : 2000,
	                        pos     : 'top-center'
	                     });
	                    var groupId=result.data.result.data.id;
	                    vm.setGroupMembers(groupId,usersArray);
	                }
	                else{
	                   $.UIkit.notify({
	                       message :  result.data.result.message,
	                       status  : 'danger',
	                       timeout : 2000,
	                       pos     : 'top-center'
	                    });
	                }
	                //vm.getuserGroups();
	
	            });
	        }
	        else{
	            var reqObj={};
	            reqObj.members=[];
	            var usersArray =[];
	            if(vm.newUserGroupObj.members){
	                 angular.forEach(vm.newUserGroupObj.members, function(value,key){
	                    usersArray.push(vm.usersArrayObj[value]);
	                 });
	            }
	            reqObj.members=usersArray;
	            reqObj.name=vm.newUserGroupObj.name;
	            reqObj.description=vm.newUserGroupObj.description;
	            reqObj.policies=vm.newUserGroupObj.policies;
	
	            if(vm.newUserGroupObj.parentId==undefined){
	                if(vm.isUserGroupExist(vm.newUserGroupObj.name,"")){
	                    $.UIkit.notify({
	                       message :  "Group name '"+vm.newUserGroupObj.name+"' already exists.",
	                       status  : 'danger',
	                       timeout : 2000,
	                       pos     : 'top-center'
	                    });
	                    return 0;
	                }
	                userGroupServices.createUserGroup(reqObj,vm.sess_id).then(function(result){
	                    if(result.data.result.status =='Success'){
	                         $.UIkit.notify({
	                            message : result.data.result.message,
	                            status  : 'success',
	                            timeout : 2000,
	                            pos     : 'top-center'
	                         });
	                         var groupId=result.data.result.data.id;
	                         vm.setGroupMembers(groupId,usersArray);
	                    }
	                    else{
	                       $.UIkit.notify({
	                           message :  result.data.result.message,
	                           status  : 'danger',
	                           timeout : 2000,
	                           pos     : 'top-center'
	                        });
	                    }
	                });
	            }
	            else{
	                reqObj.parentId=vm.newUserGroupObj.parentId;
	                userGroupServices.createSubUserGroup(reqObj,vm.sess_id,vm.newUserGroupObj.parentId).then(function(result){
	                    if(result.data.result.status =='Success'){
	                         $.UIkit.notify({
	                            message : result.data.result.message,
	                            status  : 'success',
	                            timeout : 2000,
	                            pos     : 'top-center'
	                         });
	                         var groupId=result.data.result.data.id;
	                         vm.setGroupMembers(groupId,usersArray);
	                    }
	                    else{
	                       $.UIkit.notify({
	                           message :  result.data.result.message,
	                           status  : 'danger',
	                           timeout : 2000,
	                           pos     : 'top-center'
	                        });
	                    }
	                });
	            }
	        }
	     };
	
	     vm.isUserGroupExist=function(name,id){
	        var isExt = false;
	        angular.forEach($scope.ExistingUserGroupsList, function(val, key){
	            if(id==""){
	                if(val.name==name){
	                    isExt = true;
	                }
	            }else{
	                if(val.id!=id && val.name==name){
	                    isExt = true;
	                }
	            }
	        });
	        return isExt;
	     };
	
	    vm.setGroupMembers =function(groupId,usersArray){
	       if(usersArray==null){
	            usersArray=[];
	       }
	        var objReq={};
	        objReq.groupId=groupId;
	        objReq.userIds=usersArray;
	        userGroupServices.saveGroupMembers(objReq,vm.sess_id).then(function(result){
	            if(result.data.result.status =='Success'){
	                 $.UIkit.notify({
	                    message : "Updated users linked successfully",
	                    status  : 'success',
	                    timeout : 2000,
	                    pos     : 'top-center'
	                 });
	            }
	            else{
	               $.UIkit.notify({
	                   message :  result.data.result.message,
	                   status  : 'danger',
	                   timeout : 2000,
	                   pos     : 'top-center'
	                });
	            }
	            vm.getuserGroups();
	        });
	    }
	
	    $scope.deleteUserGroup = function(){
	        var reqObj={};
	        reqObj=vm.newUserGroupObj;
	        if(reqObj.id){
	             ngDialog.open({ template: 'confirmBox', controller: ['$scope','$state' ,function($scope,$state) {
	                    $scope.activePopupText = 'Are you sure you want to delete ' +"'" +reqObj.name+ "'" +' ' + 'group ?';
	                    $scope.onConfirmActivation = function (){
	                        ngDialog.close();
	                        userGroupServices.deleteUserGroup(reqObj,vm.sess_id).then(function(result){
	                            if(result.data){
	                                if(result.data.result.status =='Success'){
	                                     $.UIkit.notify({
	                                        message : result.data.result.message,
	                                        status  : 'success',
	                                        timeout : 2000,
	                                        pos     : 'top-center'
	                                     });
	                                    vm.getuserGroups();
	                                }
	                                else{
	                                   $.UIkit.notify({
	                                       message :  result.data.result.message,
	                                       status  : 'danger',
	                                       timeout : 2000,
	                                       pos     : 'top-center'
	                                    });
	                                }
	                            }
	                            else{
	                                   $.UIkit.notify({
	                                       message :  "Failed",
	                                       status  : 'danger',
	                                       timeout : 2000,
	                                       pos     : 'top-center'
	                                    });
	                                }
	                        },function(err){
	                           $.UIkit.notify({
	                                   message : 'Internal Server Error',
	                                   status  : 'warning',
	                                   timeout : 2000,
	                                   pos     : 'top-center'
	                           });
	                        });
	                    };
	                }]
	             });
	        }
	        else{
	           console.log(vm.newUserGroupObj);
	           console.log($scope.UserGroupsList);
	        }
	    };
	
	    $scope.addNewUser = function(){
	        document.getElementById("createUser").style.width = "40%";
	    };
	    $scope.closeNewUser = function(){
	        document.getElementById("createUser").style.width = "0%";
	    };
	    $scope.assignNewUser = function(){
	        angular.element('#txt_usersForGroups .host').scope().eventHandlers.input.focus();
	    };
	
	
	    vm.getSolutions =function(){
	        solutionService.getSolutions(vm.sess_id).then(function(result){
	          if(result.data.status=="success"){
	            $scope.solutionsList=result.data.data;
	          }
	          else{
	            $scope.solutionsList=[];
	          }
	        });
	    };
	    vm.getSolutions();
	
	    vm.getUserRoles = function(){
	         userService.getUserRoles(vm.sess_id).then(function(response){
	              if(response.data.status=="success"){
	                   $scope.userRoles=response.data.result.data;
	               }
	               else{
	                   $scope.userRoles=[];
	               }
	          });
	    }
	    vm.getUserRoles();
	
	
		$scope.saveNewUser = function(){
	        if($scope.config.password == $scope.config.confirmPassword){
	            var obj = {
	                "userName": $scope.config.userName,
	                "password": $scope.config.password
	            }
	            var sols=[];
	            angular.forEach($scope.config.solutions, function(value,key){
	                sols.push({"name": value.solution_name,"id": value.solution_id});
	            });
	             var roles=[];
	            angular.forEach($scope.config.roles, function(value,key){
	                roles.push(value.name);
	            });
	            obj.solutions=sols;
	            obj.roles=roles;
	
	            console.log(obj);
	            userService.createUsers(obj,vm.sess_id).then(function(result){
	                if(result.data.status =='success'){
	                     $.UIkit.notify({
	                        message : 'user created',
	                        status  : 'success',
	                        timeout : 2000,
	                        pos     : 'top-center'
	                     });
	                     vm.users.push($scope.config.userName);
	
	                     $scope.config={};
	                     //vm.getAllUsers();
	                     $scope.closeNewUser();
	                }
	                else{
	                   $.UIkit.notify({
	                       message : result.data.msg,
	                       status  : 'danger',
	                       timeout : 2000,
	                       pos     : 'top-center'
	                    });
	                }
	            });
	        }
	        else{
	            $.UIkit.notify({
	               message : "Password and confirm password should be match",
	               status  : 'danger',
	               timeout : 2000,
	               pos     : 'top-center'
	            });
	        }
	    };
	
	
	
	    $scope.addNewPolicy = function(){
	        document.getElementById("createPolicy").style.width = "60%";
	    };
	    $scope.closeNewPolicy = function(){
	        document.getElementById("createPolicy").style.width = "0%";
	    };
	    $scope.saveNewPolicy = function(){
	
	    };
	
	
	    vm.viewAndEditUserGroup = function(userGroup,node){
	       var tempDomain = userGroup.$modelValue;
	       $scope.cls = [];
	       $scope.cls[userGroup.$id] = "activeClass";
	       $scope.selectedNode = userGroup;
	       $scope.selectedUserGroup=tempDomain;
	       vm.newUserGroupObj=tempDomain;
	
	      /* var id= $("#total-groups").find("a.selected span").attr('id');
	       console.log(id);*/
	
	       angular.forEach($scope.userGroupsObj.subGroups, function(val,key){
	           if(val.id != undefined){
	               if($scope.selectedUserGroup.id==val.id){
	                   vm.newUserGroupObj=val;
	               }
	           }
	       });
	   };
	   $scope.addChildGroupTree = function(){
	        var generatedId=Math.random();
	       var userGroupNode = $scope.selectedNode.$modelValue;
	       if(userGroupNode){
	           if(userGroupNode.id){
	               if(userGroupNode.subGroups == null){
	                    userGroupNode.subGroups = [];
	                    userGroupNode.subGroups.push({ genId:generatedId, name: 'Sub Group 1', "parentId":userGroupNode.id, "members":[], "description":"", "policies":{} });
	                    vm.expandTree(generatedId);
	               }
	               else{
	                   var flag=true;
	                    angular.forEach(userGroupNode.subGroups, function(val,key){
	                       if(val.id)
	                        flag=true;
	                       else
	                       flag=false;
	                    });
	                    if(flag==true){
	                        var length =userGroupNode.subGroups.length;
	                        length++;
	                        userGroupNode.subGroups.push({ genId:generatedId, name: 'Sub Group '+length, "parentId":userGroupNode.id, "members":[], "description":"", "policies":{} });
	                        vm.expandTree(generatedId);
	                    }
	                    else{
	                        $.UIkit.notify({
	                           message : "Please save the group/subgroup",
	                           status  : 'danger',
	                           timeout : 2000,
	                           pos     : 'top-center'
	                        });
	                    }
	               }
	           }
	           else{
	                $.UIkit.notify({
	                   message : "Please save the subgroup",
	                   status  : 'danger',
	                   timeout : 2000,
	                   pos     : 'top-center'
	                });
	           }
	
	       }else{
	            $.UIkit.notify({
	               message : "Please select the group/subgroup",
	               status  : 'danger',
	               timeout : 2000,
	               pos     : 'top-center'
	            });
	       }
	    };
	
	    $scope.addMainGroupTree = function(){
	        var generatedId=Math.random();
	        if($scope.selectedNode){
	           if($scope.selectedNode.$parentNodeScope == null){
	               if($scope.UserGroupsList.length != 0){
	                   for(var i=0;i<$scope.UserGroupsList.length;i++){
	                       if($scope.UserGroupsList[i].id){
	                          flag=true;
	                       }
	                       else{
	                          flag=false;
	                          break;
	                       }
	                   };
	                   if(flag==true){
	                        var lenGroup = $scope.UserGroupsList.length+1;
	                        $scope.UserGroupsList.unshift({ genId:generatedId, name: 'Group '+lenGroup, "members":[], "description":"", "policies":{} });
	                        vm.selecteTheMainGroup(generatedId);
	                   }
	                   else{
	                        $.UIkit.notify({
	                           message : "Please save the group/subgroup",
	                           status  : 'danger',
	                           timeout : 2000,
	                           pos     : 'top-center'
	                        });
	                   }
	               }
	               else{
	                   var lenGroup = $scope.UserGroupsList.length+1;
	                   $scope.UserGroupsList.unshift({ genId:generatedId, name: 'Group '+lenGroup, "members":[], "description":"", "policies":{} });
	                   vm.selecteTheMainGroup(generatedId);
	               }
	           }
	           else{
	               var userGroupNode = $scope.selectedNode.$parentNodeScope.$modelValue;
	               if(userGroupNode.subGroups == null){
	                   userGroupNode.subGroups = [];
	                   userGroupNode.subGroups.push({ genId:generatedId, name: 'Group 1', "members":[], "description":"", "policies":{} });
	                   vm.selecteTheMainGroup(generatedId);
	               }else{
	                    var flag=true;
	                    angular.forEach(userGroupNode.subGroups, function(val,key){
	                       if(val.id)
	                        flag=true;
	                       else
	                       flag=false;
	                    });
	                    if(flag==true){
	                         var length =userGroupNode.subGroups.length;
	                        length++;
	                        userGroupNode.subGroups.push({ genId:generatedId, name: 'Group '+length, "members":[], "description":"", "policies":{} });
	                        vm.selecteTheMainGroup(generatedId);
	                    }
	                    else{
	                        $.UIkit.notify({
	                           message : "Please save the group/subgroup",
	                           status  : 'danger',
	                           timeout : 2000,
	                           pos     : 'top-center'
	                        });
	                    }
	               }
	           }
	       }
	       else{
	            var sampleObj={ genId:generatedId, 'name': 'Group 1', 'members':[], 'description':'','policies':{}};
	            $scope.UserGroupsList=[];
	            $scope.UserGroupsList.push(sampleObj);
	            $scope.userGroupsObj["subGroups"].push(sampleObj);
	            vm.newUserGroupObj = $scope.UserGroupsList[0];
	            vm.selecteTheMainGroup(generatedId);
	       }
	    };
	
	    vm.selecteTheMainGroup = function(generatedId){
	        $timeout(function() {
	           angular.element.find("[id='"+generatedId+"']")[0].click();
	        }, 100);
	    };
	    vm.expandTree = function(generatedId){
	        $timeout(function() {
	            var p = angular.element.find("[id='"+generatedId+"']");
	            angular.element(p).parent().parent()[0].classList.remove("hidden")
	            angular.element(p).parent().parent().parent()[0].setAttribute("collapsed","false");
	            angular.element(p).parent().parent().parent().find("span")[0].classList.remove("fa-plus-square-o");
	            angular.element(p).parent().parent().parent().find("span")[0].classList.add("fa-minus-square-o");
	            angular.element.find("[id='"+generatedId+"']")[0].click();
	
	        }, 100);
	    };
	
	}];

/***/ }),
/* 105 */
/***/ (function(module, exports) {

	module.exports = "<script type=\"text/ng-template\" id=\"confirmBox\">\n  <div class=\"popup-header\">\n    <h3 class=\"text-primary\"> Confirm Action </h3>\n    <hr class=\"popup-hr\"/>\n    <p class=\"text-info\" style=\"padding:10px\"> {$ activePopupText $}  </p>\n    <br/>\n    <div class=\"row\">\n      <div class=\"col-lg-12 col-sm-12 col-xs-12 co-md-12\">\n        <button class=\"btn btn-primary right\" ng-click=\"onConfirmActivation()\"> Confirm </button>\n      </div>\n    </div>\n  </div>\n</script>\n\n<script type=\"text/ng-template\" id=\"my-custom-template\">\n  <div class=\"right-panel\">\n    <span>{$ data.userName $}</span>\n  </div>\n</script>\n\n<br>\n<div classs=\"row\">\n    <div class=\"col-lg-6 col-xs-6 col-md-6 col-sm-6\">\n        <p class=\"solDashHeading\" style=\"font-size:14px;\">User Groups</p>\n    </div>\n</div>\n<br>\n\n<br>\n<div class=\"user-groups-container\">\n    <div classs=\"row\" ng-show=\"!isUserGroups\">\n        <div class=\"row emptygroup-container\">\n            <label class=\"text-nodata\">Seems like you didn't add any groups yet. Click here to add new group</label>\n            <div class=\"newbtndiv\">\n                <button class=\"btn btn-customQueue\" ng-click=\"createNewUserGroup();\" style=\"border:1px solid #97d7ff;\">\n                    <img src=\"./static/uam/app/images/create.png\" style=\"width:15px;\"> Create a New Usergroup\n                </button>\n            </div>\n        </div>\n    </div>\n    <div classs=\"row\" ng-show=\"isUserGroups\">\n        <div class=\"col-lg-5 col-xs-5 col-md-5 col-sm-5 groups-hierarchy-container\">\n\n                 <!--<div class=\"row links-div\">\n                    <div class=\"pull-right\">\n                        <div class=\"addgroup-link\" ng-click=\"deleteUserGroup();\">\n                            <img src=\"./static/uam/app/images/delete.png\" class=\"addg-icon\"/>Delete Group\n                        </div>\n                    </div>\n                     <div class=\"pull-right\" style=\"margin-right: 15px;\">\n                        <div class=\"addgroup-link\" ng-click=\"addChildGroup();\">\n                            <img src=\"./static/uam/app/images/create.png\" class=\"delg-icon\" />Add Child\n                        </div>\n                    </div>\n                     <div class=\"pull-right\" style=\"margin-right: 15px;\">\n                        <div class=\"addgroup-link\" ng-click=\"addMainGroup();\">\n                            <img src=\"./static/uam/app/images/create.png\" class=\"delg-icon\" />Add Main Group\n                        </div>\n                    </div>\n                </div>-->\n\n                <div class=\"row links-div\">\n                   <div class=\"pull-right\">\n                       <div class=\"addgroup-link\" ng-click=\"deleteUserGroup();\">\n                           <img src=\"./static/uam/app/images/delete.png\" class=\"addg-icon\"/>Delete Group\n                       </div>\n                   </div>\n                    <div class=\"pull-right\" style=\"margin-right: 15px;\">\n                       <div class=\"addgroup-link\" ng-click=\"addChildGroupTree();\">\n                           <img src=\"./static/uam/app/images/create.png\" class=\"delg-icon\" />Add Child\n                       </div>\n                   </div>\n                    <div class=\"pull-right\" style=\"margin-right: 15px;\">\n                       <div class=\"addgroup-link\" ng-click=\"addMainGroupTree();\">\n                           <img src=\"./static/uam/app/images/create.png\" class=\"delg-icon\" />Add Main Group\n                       </div>\n                   </div>\n               </div>\n\n               <!-- <div class=\"row\">\n\n                    <div class=\"span6\">\n                        <div style=\"\">\n                            &lt;!&ndash;<ul class=\"breadcrumb\">\n                                <li ng-repeat=\"b in breadcrums\" ng-class=\"{ active: $last }\">{$ b $}\n                                    <span class=\"divider\" ng-show=\"!$last\">/</span></li>\n                            </ul>&ndash;&gt;\n                            <div class=\"all-groups\">All Groups</div>\n                            <div id=\"total-groups\" tree-view=\"userGroupsObj\" tree-view-options=\"options\"></div>\n                        </div>\n                    </div>\n                </div>-->\n\n                <div class=\"row\">\n                   <div class=\"all-groups\">All Groups</div>\n                   <div class=\"col-sm-12 col-md-12 col-lg-12 col-xs-12\" id=\"uitree\" style=\"padding-right:0;padding-left:0\">\n                       <script type=\"text/ng-template\" id=\"nodes_renderer.html\">\n                           <div ui-tree-handle data-nodrag ng-class=\"cls[this.$id]\" id=\"{$ node.genId $}\" style=\"font-weight: 400;padding: 7px 5px 7px 18px;\" ng-click=\"ugc.viewAndEditUserGroup(this)\">\n                               <a data-nodrag ng-click=\"toggle(this)\">\n                                   <span ng-style=\"node.subGroups==null && {'visibility':'hidden'}\" ng-class=\"{'fa fa-plus-square-o': collapsed,'fa fa-minus-square-o': !collapsed}\" style=\"font-size: 13px;color: #4D6878;\"></span>\n                               </a>\n                               {$ node.name $}\n                           </div>\n                           <ol ui-tree-nodes=\"\" ng-model=\"node.subGroups\" ng-class=\"{hidden: collapsed}\">\n                               <li ng-repeat=\"node in node.subGroups\" ui-tree-node ng-include=\"'nodes_renderer.html'\" collapsed=\"true\">\n                               </li>\n                           </ol>\n                       </script>\n                       <div ui-tree class=\"angular-ui-tree\">\n                           <ol ui-tree-nodes=\"\" ng-model=\"UserGroupsList\" id=\"tree-root\">\n                               <li ng-repeat=\"node in UserGroupsList\" ui-tree-node ng-include=\"'nodes_renderer.html'\" collapsed=\"false\"></li>\n                           </ol>\n                       </div>\n                   </div>\n               </div>\n\n\n\n        </div>\n        <div class=\"col-lg-7 col-xs-7 col-md-7 col-sm-7 groups-expand-container\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 creation-section\">\n                <form ng-submit=\"ugc.saveUserGroup()\">\n                  <div class=\"row\">\n                    <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\">\n                      <label>Name</label>\n                      <input type=\"text\"class=\"bottomLineInput\" id=\"groupName\" data-ng-model=\"ugc.newUserGroupObj.name\" class=\"form-control\" placeholder=\"Group name\" required>\n                    </div>\n                  </div>\n\n                  <div class=\"row\">\n                    <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\">\n                      <label>Description</label>\n                        <textarea type=\"text\" class=\"bottomLineInput\" data-ng-model=\"ugc.newUserGroupObj.description\" class=\"form-control\" placeholder=\"Description\"></textarea>\n                    </div>\n                  </div>\n\n\n                  <div class=\"row\">\n                    <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\">\n                       <div class=\"panel-group\">\n                        <div class=\"panel panel-default\">\n                          <div class=\"panel-heading groupusers-div\">\n                            <h4 class=\"panel-title pull-left\">\n                              <a data-toggle=\"collapse\" href=\".users-collapse\">Users</a>\n                            </h4>\n                              <div class=\"pull-right\">\n                                 <div class=\"pull-right\" style=\"margin-right: 15px;\">\n                                    <div class=\"addgroup-link\" id=\"addgrouplist\" ng-click=\"assignNewUser()\">\n                                        <img src=\"./static/uam/app/images/create.png\" class=\"addg-icon\" />Assign new user\n                                    </div>\n                                </div>\n                              </div>\n                              <div class=\"clear\"></div>\n                          </div>\n                          <div class=\"panel-collapse collapse in users-collapse\">\n                            <div class=\"panel-body\">\n                               <!--<div mass-autocomplete class=\"mass-autocompleteAttributeDiv\">\n                                    <input ng-model=\"ugc.newUserGroupObj.users\" class=\"form-control custom-form\"\n                                           mass-autocomplete-item=\"autocomplete_options\" placeholder=\"Search by name\"\n                                           style=\"background: white;\" required>\n                                </div>-->\n\n                               <tags-input placeholder=\"Search by name\" ng-model=\"ugc.newUserGroupObj.members\" id=\"txt_usersForGroups\"\n                                            replace-spaces-with-dashes=\"false\"\n                                            use-strings=\"true\"\n                                            add-on-comma=\"false\"\n                                            on-tag-added=\"onTagAdded($tag)\"\n                                            display-property=\"userName\"\n                                            on-tag-removed=\"onTagRemoved($tag)\">\n                                    <!--<auto-complete source=\"ugc.users\" min-length=\"1\"></auto-complete>-->\n\n                                   <auto-complete source=\"loadUsers($query)\"\n                                                     min-length=\"0\"\n                                                     load-on-focus=\"true\"\n                                                     load-on-empty=\"true\"\n                                                     max-results-to-show=\"500\"\n                                                     template=\"my-custom-template\"></auto-complete>\n                                </tags-input>\n\n\n                            </div>\n\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n\n\n\n                   <div class=\"row\">\n                    <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\">\n                       <div class=\"panel-group\">\n                        <div class=\"panel panel-default\">\n                          <div class=\"panel-heading groupusers-div\">\n                            <h4 class=\"panel-title pull-left\">\n                              <a data-toggle=\"collapse\" href=\".policy-collapse\">Policies</a>\n                            </h4>\n                              <div class=\"pull-right\">\n                                 <div class=\"pull-right\" style=\"margin-right: 15px;\">\n                                    <div class=\"addgroup-link\" ng-click=\"addNewPolicy()\">\n                                        <img src=\"./static/uam/app/images/create.png\" class=\"addg-icon\" />Add new policy\n                                    </div>\n                                </div>\n                              </div>\n                              <div class=\"clear\"></div>\n                          </div>\n                          <div class=\"panel-collapse collapse in policy-collapse\">\n                            <div class=\"panel-body\">Panel Body</div>\n\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n\n\n                   <div class=\"row\">\n                      <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group btn-custom-group\">\n                          <button class=\"btn btn-custom-create\" type=\"submit\">\n                            <img src=\"./static/uam/app/images/save_white.png\" class=\"img-responsive img-save\"> Save\n                          </button>\n                           <!--<button class=\"btn btn-custom-cancel\" ui-sref=\"app.userGroup\">\n                            Cancel\n                          </button>-->\n                      </div>\n                  </div>\n\n\n                </form>\n            </div>\n        </div>\n     </div>\n    </div>\n</div>\n\n<div class=\"row overlay\" id=\"createUser\" style=\"overflow:auto;height: auto;\">\n    <div class=\"createUser\">\n      <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 user-creation\">\n        <label>Create new user</label>\n      </div>\n      <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 creation-section\" style=\"padding: 10px 30px;\">\n        <form ng-submit=\"saveNewUser()\">\n          <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:0\">\n              <label>User name</label>\n              <input type=\"text\" class=\"form-control\" placeholder=\"User name\" ng-model=\"config.userName\" required>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\"  style=\"padding:0\">\n              <label>Password</label>\n              <input type=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"config.password\"  required>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\"  style=\"padding:0\">\n              <label>Conform password</label>\n              <input type=\"password\" class=\"form-control\" placeholder=\"Conform password\" ng-model=\"config.confirmPassword\"  required>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\"  style=\"padding:0\">\n              <label>Solution</label>\n              <multiselect ng-model=\"config.solutions\" class=\"multiSelect\" options=\"solutionsList\"  show-search=\"true\" search-limit=\"100000\" id-prop=\"solution_id\" display-prop=\"solution_name\">\n              </multiselect>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\"  style=\"padding:0\">\n              <label>Role</label>\n              <multiselect ng-model=\"config.roles\" class=\"multiSelect\" options=\"userRoles\"  show-search=\"true\" search-limit=\"100000\" id-prop=\"id\" display-prop=\"name\">\n              </multiselect>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group btn-custom-group\">\n              <button class=\"btn btn-custom-create\" type=\"submit\">\n                <img src=\"./static/uam/app/images/save_white.png\" class=\"img-responsive img-save\"> Save\n              </button>\n               <label class=\"btn btn-custom-cancel\" ng-click=\"closeNewUser()\">Cancel</label>\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n</div>\n\n\n<div class=\"row overlay\" id=\"createPolicy\" style=\"overflow:auto;height: 100%;\">\n    <div class=\"createUser creation-section\">\n        <form ng-submit=\"saveNewPolicy()\" >\n           <div class=\"row\">\n              <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" style=\"padding: 6px 6px 6px 20px;\">\n                <label style=\"font-weight: normal;\">Resources</label>\n              </div>\n           </div>\n           <div class=\"row\">\n          <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 \" style=\"padding: 10px 20px;\">\n              <div class=\"row\">\n                <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding: 4px;border: 1px solid #b9e2f6;background-color: #fafdff;\">\n\n                  <div class=\"col-md-4 col-lg-4 col-sm-4 col-xs-4 form-group\" style=\"padding:4px;\">\n                    <div style=\"background-color: #fff; border: 1px solid #f1f1f1;margin: 0 2px;\">\n                        <div style=\"background-color:#e2f5fe;padding: 5px;\"><label style=\"font-weight: inherit;\">Solutions</label></div>\n                        <div class=\"row\">\n                         <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                             <input type=\"text\" class=\"form-control\" placeholder=\"Search by name\" >\n                         </div>\n                     </div>\n                        <div class=\"row\">\n                         <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                             <div>\n                                 <span  ng-click=\"selectAllSolutions()\"   style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Select All</span>\n                                 <span  ng-click=\"deselectAllSolutions()\" style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Deselect All</span>\n                             </div>\n                         </div>\n                     </div>\n                        <div class=\"row\">\n                         <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                             <div class=\"checkbox\">\n                              <label><input type=\"checkbox\" value=\"\">Solutions 1</label>\n                            </div>\n                             <div class=\"checkbox\">\n                              <label><input type=\"checkbox\" value=\"\">Solutions 2</label>\n                            </div>\n                             <div class=\"checkbox\">\n                              <label><input type=\"checkbox\" value=\"\">Solutions 3</label>\n                            </div>\n                         </div>\n                     </div>\n\n                    </div>\n                  </div>\n                   <div class=\"col-md-4 col-lg-4 col-sm-4 col-xs-4 form-group\" style=\"padding:4px;\">\n                       <div style=\"background-color: #fff; border: 1px solid #f1f1f1;margin: 0 2px;\">\n                            <div style=\"background-color:#e2f5fe;padding: 5px;\"><label style=\"font-weight: inherit;\">Workflows</label></div>\n                             <div class=\"row\">\n                         <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                             <input type=\"text\" class=\"form-control\" placeholder=\"Search by name\" >\n                         </div>\n                     </div>\n                            <div class=\"row\">\n                             <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                                 <div>\n                                     <span  ng-click=\"selectAllSolutions()\"   style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Select All</span>\n                                     <span  ng-click=\"deselectAllSolutions()\" style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Deselect All</span>\n                                 </div>\n                             </div>\n                         </div>\n                            <div class=\"row\">\n                             <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                                 <div class=\"checkbox\">\n                                  <label><input type=\"checkbox\" value=\"\">Solutions 1</label>\n                                </div>\n                                 <div class=\"checkbox\">\n                                  <label><input type=\"checkbox\" value=\"\">Solutions 2</label>\n                                </div>\n                                 <div class=\"checkbox\">\n                                  <label><input type=\"checkbox\" value=\"\">Solutions 3</label>\n                                </div>\n                             </div>\n                         </div>\n\n                       </div>\n                  </div>\n                   <div class=\"col-md-4 col-lg-4 col-sm-4 col-xs-4 form-group\" style=\"padding:4px;\">\n                       <div style=\"background-color: #fff; border: 1px solid #f1f1f1;margin: 0 2px;\">\n                            <div style=\"background-color:#e2f5fe;padding: 5px;\"><label style=\"font-weight: inherit;\">Queues</label></div>\n                             <div class=\"row\">\n                         <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                             <input type=\"text\" class=\"form-control\" placeholder=\"Search by name\" >\n                         </div>\n                     </div>\n                            <div class=\"row\">\n                             <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                                 <div>\n                                     <span  ng-click=\"selectAllSolutions()\"   style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Select All</span>\n                                     <span  ng-click=\"deselectAllSolutions()\" style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Deselect All</span>\n                                 </div>\n                             </div>\n                         </div>\n                            <div class=\"row\">\n                             <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                                 <div class=\"checkbox\">\n                                  <label><input type=\"checkbox\" value=\"\">Solutions 1</label>\n                                </div>\n                                 <div class=\"checkbox\">\n                                  <label><input type=\"checkbox\" value=\"\">Solutions 2</label>\n                                </div>\n                                 <div class=\"checkbox\">\n                                  <label><input type=\"checkbox\" value=\"\">Solutions 3</label>\n                                </div>\n                             </div>\n                         </div>\n                       </div>\n                  </div>\n\n                </div>\n              </div>\n          </div>\n           </div>\n        <div class=\"row\">\n          <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" style=\"padding: 6px 6px 0px 20px;\">\n            <label style=\"font-weight: normal;\">Permissions</label>\n              <div class=\"pull-right\">\n                 <span  ng-click=\"selectAllPermissions()\"   style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Select All</span>\n                 <span  ng-click=\"deselectAllPermissions()\" style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Deselect All</span>\n              </div>\n          </div>\n        </div>\n           <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 \" style=\"padding: 0px 20px;\">\n                <div class=\"row\">\n                    <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding: 4px;border: 1px solid #b9e2f6;background-color: #fafdff;\">\n                        <label class=\"checkbox-inline\"><input type=\"checkbox\" value=\"\">Create</label>\n                        <label class=\"checkbox-inline\"><input type=\"checkbox\" value=\"\">Read</label>\n                        <label class=\"checkbox-inline\"><input type=\"checkbox\" value=\"\">Update</label>\n                    </div>\n                </div>\n            </div>\n           </div>\n\n        <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group btn-custom-group\">\n                <button class=\"btn btn-custom-create\" type=\"submit\"><img src=\"./static/uam/app/images/save_white.png\" class=\"img-responsive img-save\"> Save </button>\n                <label class=\"btn btn-custom-cancel\" ng-click=\"closeNewPolicy()\">Cancel</label>\n            </div>\n        </div>\n        </form>\n    </div>\n</div>\n"

/***/ }),
/* 106 */
/***/ (function(module, exports) {

	(function() {
		'use strict';
	    angular.module('console.userGroupServices', [])
			.service('userGroupServices', ["$state", "$q", "$http", "httpPayload", function($state,$q, $http, httpPayload) {
	             var _getUserGroups = function(sess_id) {
	
	                var req = {
	                      method: 'GET',
	                      url: 'api/usergroups/',
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	
	              var _createUserGroup = function(data,sessId) {
	                if(data.parentId!=undefined)
	                    var url='api/usergroups/'+data.parentId+'/';
	                 else
	                    var url='api/usergroups/';
	
	                var req = {
	                      method: 'POST',
	                      url: url,
	                      data: data,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	              var _createSubUserGroup = function(data,sessId,parentId) {
	                 var req = {
	                      method: 'POST',
	                      url: 'api/nestedusergroups/'+parentId+"/",
	                      data: data,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	              var _editUserGroup = function(data,sessId) {
	
	                var req = {
	                      method: 'POST',
	                      url: 'api/updateuser/',
	                      data: data,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	
	
	
	              var _deleteUserGroup = function(data,sess_id) {
	
	                var req = {
	                      method: 'DELETE',
	                      url: 'api/usergroups/'+data.id,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	              var _saveGroupMembers = function(data,sessId) {
	                var req = {
	                      method: 'POST',
	                      url: 'api/linkusers/',
	                      data: data,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	
	
	              var userGroupService = {
	                createUserGroup:_createUserGroup,
	                createSubUserGroup:_createSubUserGroup,
	                editUserGroup:_editUserGroup,
	                getUserGroups:_getUserGroups,
	                deleteUserGroup:_deleteUserGroup,
	                saveGroupMembers:_saveGroupMembers,
	              };
	
	              return userGroupService;
			}]);
	})();

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
	
		//require('./dashboard/dashboard.module.js');
	
		module.exports = angular.module('console.createSolution', ['ui.router'])
		     .controller('createsolutionController', __webpack_require__(108))
			 .directive('resspechars', function() {
	            function link(scope, elem, attrs, ngModel) {
	                ngModel.$parsers.push(function(viewValue) {
	                  var reg = /^[^`~!@#$%\^&*()-+={}/_|[\]\\:';"<>?,./]*$/;
	                  // if view values matches regexp, update model value
	                  if (viewValue.match(reg)) {
	                    return viewValue;
	                  }
	                  // keep the model value as it is
	                  var transformedValue = ngModel.$modelValue;
	                  ngModel.$setViewValue(transformedValue);
	                  ngModel.$render();
	                  return transformedValue;
	                });
	            }
	
	            return {
	                restrict: 'A',
	                require: 'ngModel',
	                link: link
	            };
	         })
			 .config(['$stateProvider', function($stateProvider) {
				$stateProvider.state('app.createSolution', {
					url: '/createSolution',
					views: {
						'bodyContentContainer@app': {
							template: __webpack_require__(109),
							controller: 'createsolutionController',
							controllerAs: 'csl',
							cache:false,
						}
					}
				});
			}]);
	})();

/***/ }),
/* 108 */
/***/ (function(module, exports) {

	module.exports = ['$scope', '$state', '$rootScope', 'solutionService','ngDialog' ,function($scope, $state, $rootScope, solutionService,ngDialog) {
		'use strict';
		  $scope.solutionType = "";
	      $rootScope.currentState = 'createSolution';
	      $scope.classSolutionType={};
	      $scope.imgSolutionType={};
	      $scope.classSolutionType['1']="solutionTypeDiv";
	      $scope.classSolutionType['2']="solutionTypeDiv";
	      $scope.classSolutionType['3']="solutionTypeDiv";
	      $scope.imgSolutionType['1']=false;
	      $scope.imgSolutionType['2']=false;
	      $scope.imgSolutionType['3']=false;
	      var vm = this;
	      $scope.showDeleteIcon={};
	      $scope.solutionActiveClass = [];
	      $scope.solutionDes='';
	      $scope.createPipeline=false;
	      window.scrollTo(0,0);
	      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
	      vm.sess_id= $scope.loginData.sess_id;
	      $rootScope.inSolution = false;
	      $rootScope.$broadcast('breadcrumbObj',$state.current.breadcrumb);
	
	      solutionService.getSolutions(vm.sess_id).then(function(result){
	          $scope.solutionsList=result.data.result;
	          if(result.data.result == undefined){
	            $scope.createSolution = true;
	            $scope.solutionDash = false;
	            $scope.solutionName = "";
	          }
	          else if($scope.solutionsList.length >= 1){
	            $scope.solutionDash = true;
	            $scope.createSolution = false;
	            for(var i=0;i<$scope.solutionsList.length;i++){
	              if($scope.solutionsList[i].solution_id == $scope.loginData.user.solution_id){
	                $scope.solutionActiveClass[i] = "wellActiveSolution";
	              }
	              else{
	                $scope.solutionActiveClass[i] = "wellSolution";
	              }
	            }
	          }
	//          if($scope.solutionsList.length == 1){
	//            $state.go("app.dashboard");
	//          }
	      });
	
	      $scope.solutionSelection = function(obj){
	         var userData=localStorage.getItem('userInfo');
	         userData=JSON.parse(userData);
	         userData.user.solution_id = obj.solution_ref_id;
	         userData.user.solution_name = obj.solution_name;
	         solutionService.postTenants({"solution_ref_id":obj.solution_ref_id},vm.sess_id).then(function(result){
	            if(result.data.status=="success"){
	               $rootScope.solutionName=obj.solution_name;
	               $rootScope.inSolution = true;
	               $state.go("app.dashboard");
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
	      };
	
	      $scope.createSolutionFunction = function(){
	          $scope.solutionType = "automation";
	           var obj = {
	              "solution_name" : angular.copy($scope.solutionName),
	              "solution_type" : $scope.solutionType,
	              "description" : $scope.solutionDes,
	              "is_pipeline" : $scope.createPipeline
	           };
	           solutionService.createSolution(obj,vm.sess_id).then(function(result){
	                if(result.data.status=="success"){
	                     $.UIkit.notify({
	                        message : result.data.msg,
	                        status  : 'success',
	                        timeout : 2000,
	                        pos     : 'top-center'
	                     });
	
	                     $scope.solutionName = "";
	                     $scope.solutionDes = "";
	                     $scope.solutionDash = true;
	                     $scope.createSolution = false;
	                     $scope.createPipeline = false;
	                     $scope.setTenantAfterCreate(obj.solution_name);
	                     $state.go('app.solution');
	                }
	                if(result.data.status=="failure"){
	                   $.UIkit.notify({
	                       message : result.data.msg,
	                       status  : 'danger',
	                       timeout : 2000,
	                       pos     : 'top-center'
	                    });
	                }
	           }).catch(function(response) {
	                  console.log(response);
	                  $.UIkit.notify({
	                       message : 'Internal Server Error',
	                       status  : 'danger',
	                       timeout : 2000,
	                       pos     : 'top-center'
	                  });
	           })
	
	      };
	
	      $scope.setTenantAfterCreate = function(solName){
	         solutionService.getSolutions(vm.sess_id).then(function(result){
	            $scope.solutionsList=result.data.result;
	            $rootScope.inSolution = true;
	//            for(var i=0;i<$scope.solutionsList.length;i++){
	//              if($scope.solutionsList[i].solution_name == solName){
	//                 var userData=localStorage.getItem('userInfo');
	//                 userData=JSON.parse(userData);
	//                 userData.user.solution_id = $scope.solutionsList[i].solution_ref_id;
	//                 userData.user.solution_name = $scope.solutionsList[i].solution_name;
	//                 localStorage.setItem('loginData',JSON.stringify(userData));
	//                 var sol_ref_id=$scope.solutionsList[i].solution_ref_id;
	//                 /*solutionService.postTenants({"solution_ref_id":sol_ref_id},vm.sess_id).then(function(result){
	//                    if(result.data.status=="success"){
	//                       $rootScope.solutionName=$scope.solutionsList[i].solution_name;
	//                       $rootScope.inSolution = true;
	//                       $state.go("app.dashboard");
	//                    }
	//                    else{
	//                      $.UIkit.notify({
	//                           message : result.data.msg,//'Solution name has not been updated',
	//                           status  : 'danger',
	//                           timeout : 2000,
	//                           pos     : 'top-center'
	//                      });
	//                    }
	//                 });
	//                 break;*/
	//              }
	//            }
	         });
	      };
	
	      $scope.deleteSolution = function(list,$event){
	          $event.stopPropagation();
	          var data = {"solution_ref_id":list.solution_ref_id};
	          ngDialog.open({ template: 'confirmBox',
	            controller: ['$scope','$state' ,function($scope,$state) {
	                $scope.activePopupText = 'Are you sure you want to delete ' +"'" +list.solution_name+ "'" +' ' + 'solution ?';
	                $scope.onConfirmActivation = function (){
	                    ngDialog.close();
	                    solutionService.delSolution(data,vm.sess_id).then(function(result){
	                        if(result.data.status=="success"){
	                           $.UIkit.notify({
	                               message : result.data.msg,
	                               status  : 'success',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                            });
	                            $state.reload();
	                        }
	                        if(result.data.status=="failure"){
	                           $.UIkit.notify({
	                               message : result.data.msg,
	                               status  : 'danger',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                            });
	                        }
	                    }).catch(function(response) {
	                      console.log(response);
	                          $.UIkit.notify({
	                               message : result.data.msg,
	                               status  : 'danger',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                          });
	                    });
	                };
	            }]
	          });
	      };
	
	      //ng-style="solutionType=='insights' && {'border': '2px solid #25aae1' ,'box-shadow': '1px 1px 1px 1px #f9ecec'} || {}"
	      // ng-style="solutionType=='automation' && {'border': '2px solid #25aae1' ,'box-shadow': '1px 1px 1px 1px #f9ecec'} || {}"
	      //ng-style="solutionType=='engagement' && {'border': '2px solid #25aae1' ,'box-shadow': '1px 1px 1px 1px #f9ecec'} || {}"
	      $scope.solutionTypeChange = function(selection){
	        if(selection=='1'){
	          $scope.solutionType = "insights";
	          $scope.classSolutionType['2']="solutionTypeDiv";
	          $scope.classSolutionType['3']="solutionTypeDiv";
	          $scope.imgSolutionType['2']=false;
	          $scope.imgSolutionType['3']=false;
	        }
	        if(selection=='2'){
	          $scope.solutionType = "automation";
	          $scope.classSolutionType['1']="solutionTypeDiv";
	          $scope.classSolutionType['3']="solutionTypeDiv";
	          $scope.imgSolutionType['1']=false;
	          $scope.imgSolutionType['3']=false;
	        }
	        if(selection=='3'){
	          $scope.solutionType = "engagement";
	          $scope.classSolutionType['1']="solutionTypeDiv";
	          $scope.classSolutionType['2']="solutionTypeDiv";
	          $scope.imgSolutionType['1']=false;
	          $scope.imgSolutionType['2']=false;
	        }
	        $scope.classSolutionType[selection]="solutionTypeActiveDiv";
	        $scope.imgSolutionType[selection]=true;
	      };
	
	      $scope.navigateToCreate = function(){
	        $scope.solutionDash = false;
	        $scope.createSolution = true;
	        $scope.solutionName = "";
	      };
	
	      $scope.showDeleteSolution=function(index){
	        $scope.showDeleteIcon[index]=true;
	      };
	      $scope.hideDeleteSolution=function(index){
	        $scope.showDeleteIcon[index]=false;
	      };
	
	}];

/***/ }),
/* 109 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"row row-eq-height\">\n    <div class=\"col-lg-8 col-md-8 col-sm-8 col-xs-8\">\n      <div class=\"row\">\n          <div class=\"col-lg-12 col-sm-12 col-xs-12 col-md-12\">\n            <h3 class=\"heading\">CREATE SOLUTION</h3>\n          </div>\n      </div>\n      <br>\n      <form ng-submit=\"createSolutionFunction();\">\n          <div class=\"row\">\n            <div class=\"row\">\n              <div class=\"col-lg-8 col-sm-8 col-md-8 col-xs-12\">\n                  <label class=\"textHeading\">Solution Name</label>\n                <input class=\"form-control\" type=\"text\" ng-model=\"solutionName\" placeholder=\"Solution Name\"  resspechars required/>\n              </div>\n            </div>\n            <div class=\"row\">\n              <div class=\"col-lg-8 col-sm-8 col-md-8 col-xs-12\">\n                  <label class=\"textHeading\">Description</label>\n                  <textarea rows=\"20\" class=\"form-control\" cols=\"50\" ng-model=\"solutionDes\">Description (optional)</textarea>\n              </div>\n            </div>\n            <div class=\"row\">\n              <div class=\"col-lg-8 col-sm-8 col-md-8 col-xs-12\">\n                 <div class=\"checkbox\">\n                        <input type=\"checkbox\" ng-model=\"createPipeline\" style=\"margin-left:1px\">\n                      <label>Create solution with processing pipeline ?</label>\n                 </div>\n              </div>\n            </div>\n              <br>\n            <div class=\"row\">\n               <div class=\"col-lg-8 col-sm-8 col-md-8 col-xs-12\">\n                    <button class=\"btn btn-custom\" type=\"submit\">\n                        <i class=\"fa fa-floppy-o\"></i> Save & Continue\n                    </button>\n                    <button class=\"btn btn-cancel\" ui-sref=\"app.solution\">Cancel</button>\n               </div>\n            </div>\n          </div>\n      </form>\n    </div>\n    <div class=\"col-lg-4 col-md-4 col-sm-4 col-xs-4 sideContainer\">\n        <div class=\"row sidemenuText\">\n            <h4>Create your solution in minitues using simple & intuitive interface</h4>\n        </div>\n        <br>\n       <ul class=\"SolutionList\">\n           <li>Define your problem space by configuring Entities, Actions and Concepts</li>\n           <li>Configure Insights and Add Outcome to your solution</li>\n           <li>Train it</li>\n           <li>Add Rules & Manage Resources with your models</li>\n           <li>Give your feedback</li>\n           <li>View Predictions, and Insights to meet your outcome</li>\n       </ul>\n        <h4>How to Videos</h4>\n        <img src=\"/static/uam/app/images/getstartred.png\"/>\n    </div>\n</div>"

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
	
		module.exports = angular.module('console.queue', ['ui.router'])
		    .controller('queueController', __webpack_require__(111))
	
			 .config(['$stateProvider', function($stateProvider) {
				$stateProvider.state('app.queue', {
					url: '/queue',
					views: {
						'bodyContentContainer@app': {
							template: __webpack_require__(112),
							controller: 'queueController',
							controllerAs: 'qc',
							cache:false,
						}
					}
				});
			}]);
	})();

/***/ }),
/* 111 */
/***/ (function(module, exports) {

	module.exports = ['$scope', '$state', '$rootScope','ngDialog','queueService','solutionService', function($scope, $state, $rootScope,ngDialog,queueService,solutionService) {
		'use strict';
	      $rootScope.currentState = 'queue';
	      var vm=this;
	      vm.createQueueObj = {};
	      vm.createQueueObj.agents = [];
	      $scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
	      vm.sess_id= $scope.loginData.sess_id;
	      $(".image-style1").css('max-height', $(window).height()-80);
	
	      solutionService.getSolutions(vm.sess_id).then(function(result){
	          if(result.data.status == "success"){
	               $scope.solutionsList=result.data.data;
	          }
	      });
	
	      vm.getAllQueues = function(){
	           queueService.getQueues(vm.sess_id).then(function(result){
	               if(result.data.status == "success"){
	                   vm.queue = result.data.data.all_queues;
	                   vm.allSolutions = result.data.data.solutions;
	                   var convArray = [];
	                   angular.forEach(result.data.data.doc_state,function(value,key){
	                       var objec = {"display":key,"value":value};
	                       convArray.push(objec);
	                   });
	                   vm.docStates = convArray;
	                   vm.allAgentsObjects = result.data.data.agents;
	                   vm.allSupervisors = result.data.data.supervisors;
	                   vm.allSolutionBasedDocument = result.data.data.soln_template_data;
	               }
	               else{
	                   $.UIkit.notify({
	                       message : result.data.msg,
	                       status  : 'danger',
	                       timeout : 2000,
	                       pos     : 'top-center'
	                   });
	               }
	           });
	      };
	
	      vm.getAllQueues();
	
	      vm.createQueue = function(){
	        vm.labelForUpload="Create New Queue";
	        vm.createQueueObj = {};
	        vm.createQueueObj.agents = [];
	        vm.solutionTemplatesList = [];
	        vm.filteredSupervisor = [];
	        vm.allAgents = [];
	        vm.showForEdit = false;
	        document.getElementById("createQueue").style.width = "40%";
	      };
	
	      vm.cancelQueue = function(){
	        document.getElementById("createQueue").style.width = "0%";
	      };
	
	      vm.saveQueue = function(){
	         if(vm.createQueueObj.solution == undefined || vm.createQueueObj.solution == ""){
	             $.UIkit.notify({
	                   message : "Solution is mandatory",//'Solution name has not been updated',
	                   status  : 'danger',
	                   timeout : 2000,
	                   pos     : 'top-center'
	             });
	         }
	         else{
	             if(vm.createQueueObj.document_type == undefined || vm.createQueueObj.document_type.length == 0){
	                 $.UIkit.notify({
	                       message : "Document type is mandatory",//'Solution name has not been updated',
	                       status  : 'danger',
	                       timeout : 2000,
	                       pos     : 'top-center'
	                 });
	             }
	             else{
	                 var allSolutionIds = "";
	                 var arr = $scope.solutionsList.filter(function(e){if(e.solution_name==vm.createQueueObj.solution){return e}});
	                 allSolutionIds = arr[0].solution_id;
	                 vm.createQueueObj.solution_id = angular.copy(allSolutionIds);
	                 var doc_array = vm.createQueueObj.document_type.map(function(e){return e.template_id});
	                 vm.createQueueObj.document_type = angular.copy(doc_array);
	                 var pro_state = vm.createQueueObj.processing_state.map(function(e){return e.value});
	                 vm.createQueueObj.processing_state = angular.copy(pro_state);
	                 vm.createQueueObjCopy = angular.copy(vm.createQueueObj);
	                 if(vm.createQueueObjCopy.document_type.length==vm.solutionTemplatesList.length){
	                    vm.createQueueObjCopy.document_type = ['all'];
	                 }
	                 if(vm.createQueueObj.processing_state == undefined || vm.createQueueObj.processing_state.length == 0){
	                     $.UIkit.notify({
	                           message : "Processing state is mandatory",//'Solution name has not been updated',
	                           status  : 'danger',
	                           timeout : 2000,
	                           pos     : 'top-center'
	                     });
	                 }
	                 else{
	                     if(vm.createQueueObj.supervisor == undefined || vm.createQueueObj.supervisor.length == 0){
	                         $.UIkit.notify({
	                               message : "Supervisor is mandatory",//'Solution name has not been updated',
	                               status  : 'danger',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                         });
	                     }
	                     else{
	                         queueService.createQueue(vm.createQueueObjCopy,vm.sess_id).then(function(result){
	                            if(result.data.status=="success"){
	                                $.UIkit.notify({
	                                       message : result.data.msg,//'Solution name has not been updated',
	                                       status  : 'success',
	                                       timeout : 2000,
	                                       pos     : 'top-center'
	                                });
	                                vm.getAllQueues();
	                                vm.cancelQueue();
	                            }
	                            else{
	                              $.UIkit.notify({
	                                   message : result.data.msg,//'Solution name has not been updated',
	                                   status  : 'danger',
	                                   timeout : 2000,
	                                   pos     : 'top-center'
	                              });
	                            }
	                         },function(err){
	                            $.UIkit.notify({
	                                   message : "Internal server error",//'Solution name has not been updated',
	                                   status  : 'danger',
	                                   timeout : 2000,
	                                   pos     : 'top-center'
	                            });
	                         });
	                     }
	                 }
	             }
	         }
	      };
	
	      vm.solutionTemplates = function(){
	            vm.solutionTemplatesList = [];
	            vm.allAgents = [];
	            vm.filteredSupervisor = [];
	            vm.allAgents = vm.allAgents.concat(vm.allAgentsObjects[vm.createQueueObj.solution]);
	            vm.filteredSupervisor = vm.filteredSupervisor.concat(vm.allSupervisors[vm.createQueueObj.solution]);
	            for(var j=0;j<vm.allSolutionBasedDocument[vm.createQueueObj.solution].length;j++){
	                vm.allSolutionBasedDocument[vm.createQueueObj.solution][j].solution_name = vm.createQueueObj.solution;
	                vm.allSolutionBasedDocument[vm.createQueueObj.solution][j].displayNameInSelect = vm.allSolutionBasedDocument[vm.createQueueObj.solution][j].template_name;
	                vm.solutionTemplatesList.push(vm.allSolutionBasedDocument[vm.createQueueObj.solution][j]);
	            }
	            let unique_array = vm.allAgents.filter(function(elem, index, self) {
	                return index == self.indexOf(elem);
	            });
	            vm.allAgents = [];
	            angular.forEach(unique_array,function(value,key){
	                if(value!=undefined){
	                   vm.allAgents.push(value);
	                }
	            })
	
	            let unique_array1 = vm.filteredSupervisor.filter(function(elem, index, self) {
	                return index == self.indexOf(elem);
	            });
	            vm.filteredSupervisor = [];
	            angular.forEach(unique_array1,function(value,key){
	                if(value!=undefined){
	                   vm.filteredSupervisor.push(value);
	                }
	            })
	
	      };
	
	      vm.editQueue = function(val){
	          vm.createQueueObj = angular.copy(val);
	          vm.solutionTemplates();
	          var selectedTemplates = [];
	          if(vm.createQueueObj.document_type.length>0){
	              if(vm.createQueueObj.document_type[0] == 'all'){
	                  selectedTemplates = angular.copy(vm.solutionTemplatesList);
	              }else{
	                  for(var i = 0;i<vm.createQueueObj.document_type.length;i++){
	                      var arr = vm.solutionTemplatesList.filter(function(e){if(vm.createQueueObj.document_type[i] == e.template_id){return e}});
	                      selectedTemplates.push(arr[0]);
	                  }
	              }
	          }
	          vm.createQueueObj.document_type = angular.copy(selectedTemplates);
	          vm.labelForUpload="Edit Queue";
	          vm.showForEdit = true;
	          document.getElementById("createQueue").style.width = "40%";
	      };
	
	      vm.deleteQueue = function(val){
	          ngDialog.open({ template: 'confirmBox',
	            controller: ['$scope','$state' ,function($scope,$state) {
	                $scope.activePopupText = 'Are you sure you want to delete ' +"'" +val.queue_name+ "'" +' ' + 'queue ?';
	                $scope.onConfirmActivation = function (){
	                    ngDialog.close();
	                    queueService.delQueue({"queue_id":val.queue_id},vm.sess_id).then(function(result){
	                        if(result.data.status=="success"){
	                           $.UIkit.notify({
	                               message : result.data.msg,
	                               status  : 'success',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                            });
	                            vm.getAllQueues();
	                        }
	                        if(result.data.status=="failure"){
	                           $.UIkit.notify({
	                               message : result.data.msg,
	                               status  : 'danger',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                            });
	                        }
	                    });
	                };
	            }]
	          });
	      };
	
	      vm.selectionComplete = function(){
	          vm.solutionTemplates();
	      };
	
	      $scope.showData = function(){
	          $scope.showMore = true;
	      };
	      $scope.showLess = function(){
	         $scope.showMore = false;
	      }
	
	}];

/***/ }),
/* 112 */
/***/ (function(module, exports) {

	module.exports = "<script type=\"text/ng-template\" id=\"confirmBox\">\n  <div class=\"popup-header\">\n    <h3 class=\"text-primary\"> Confirm Action </h3>\n    <hr class=\"popup-hr\"/>\n    <p class=\"text-info\" style=\"padding:10px\"> {$ activePopupText $}  </p>\n    <br/>\n    <div class=\"row\">\n      <div class=\"col-lg-12 col-sm-12 col-xs-12 co-md-12\">\n        <button class=\"btn btn-primary right\" ng-click=\"onConfirmActivation()\"> Confirm </button>\n      </div>\n    </div>\n  </div>\n</script>\n<div class=\"row overlay\" id=\"createQueue\" style=\"overflow:auto\">\n    <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\n        <h4 class=\"push-left\">\n          <span ng-bind=\"qc.labelForUpload\"></span>\n          <span class=\"pull-right closebtn\" ng-click=\"qc.cancelQueue()\">&times;</span>\n        </h4>\n        <hr class=\"customLine\">\n        <form ng-submit=\"qc.saveQueue()\">\n            <div class=\"row cst-row\">\n                <div class=\"col-lg-10 col-sm-10 col-md-10 col-xs-10 no-padding\">\n                    <span>Queue</span>\n                    <input type=\"text\" class=\"form-control cst-textBox\" ng-model=\"qc.createQueueObj.id\" placeholder=\"Queue ID\" disabled/>\n                </div>\n            </div>\n            <div class=\"row cst-row\">\n                <div class=\"col-lg-10 col-sm-10 col-md-10 col-xs-10 no-padding\">\n                    <span>Queue Name</span>\n                    <input type=\"text\" class=\"form-control cst-textBox\"  ng-model=\"qc.createQueueObj.queue_name\" placeholder=\"Queue Name\" required/>\n                </div>\n            </div>\n            <div class=\"row cst-row\">\n                <div class=\"col-lg-10 col-sm-10 col-md-10 col-xs-10 no-padding\">\n                    <span>Solution Associated</span>\n                    <select class=\"form-control\" ng-model=\"qc.createQueueObj.solution\" ng-change=\"qc.selectionComplete()\" required>\n                        <option value=\"\">Select Solution</option>\n                        <option ng-repeat=\"opt in qc.allSolutions\" value=\"{$ opt $}\">{$ opt $}</option>\n                    </select>\n                </div>\n            </div>\n            <div ng-if=\"!qc.showForEdit\">\n                <div class=\"row cst-row\">\n                    <div class=\"col-lg-10 col-sm-10 col-md-10 col-xs-10 no-padding\">\n                        <span>State of Processing</span>\n                        <multiselect ng-model=\"qc.createQueueObj.processing_state\" class=\"multiSelect\" options=\"qc.docStates\" id-prop=\"value\" show-search=\"true\" search-limit=\"100000\" display-prop=\"display\">\n                        </multiselect>\n                    </div>\n                </div>\n                <div class=\"row cst-row\">\n                    <div class=\"col-lg-10 col-sm-10 col-md-10 col-xs-10 no-padding\">\n                        <span>Document Types</span>\n                        <multiselect ng-model=\"qc.createQueueObj.document_type\" class=\"multiSelect\" options=\"qc.solutionTemplatesList\" id-prop=\"displayNameInSelect\" show-search=\"true\" search-limit=\"100000\" show-select-all=\"true\" show-unselect-all=\"true\" display-prop=\"displayNameInSelect\">\n                        </multiselect>\n                    </div>\n                </div>\n                <div class=\"row cst-row\">\n                    <div class=\"col-lg-10 col-sm-10 col-md-10 col-xs-10 no-padding\">\n                        <span>Supervisor</span>\n                        <multiselect ng-model=\"qc.createQueueObj.supervisor\" class=\"multiSelect\" options=\"qc.filteredSupervisor\" show-search=\"true\" search-limit=\"100000\" show-select-all=\"true\" show-unselect-all=\"true\">\n                        </multiselect>\n                    </div>\n                </div>\n                <div class=\"row cst-row\">\n                    <div class=\"col-lg-10 col-sm-10 col-md-10 col-xs-10 no-padding\">\n                        <span>Agents</span>\n                        <multiselect ng-model=\"qc.createQueueObj.agents\" class=\"multiSelect\" options=\"qc.allAgents\" show-search=\"true\" search-limit=\"100000\" show-select-all=\"true\" show-unselect-all=\"true\">\n                        </multiselect>\n                    </div>\n                </div>\n            </div>\n            <div ng-if=\"qc.showForEdit\">\n                <div class=\"row cst-row\">\n                    <div class=\"col-lg-10 col-sm-10 col-md-10 col-xs-10 no-padding\">\n                        <span>State of Processing</span>\n                        <multiselect ng-model=\"qc.createQueueObj.processing_state\" class=\"multiSelect\" options=\"qc.docStates\" id-prop=\"value\" show-search=\"true\" search-limit=\"100000\" display-prop=\"display\">\n                        </multiselect>\n                    </div>\n                </div>\n                <div class=\"row cst-row\">\n                    <div class=\"col-lg-10 col-sm-10 col-md-10 col-xs-10 no-padding\">\n                        <span>Document Types</span>\n                        <multiselect ng-model=\"qc.createQueueObj.document_type\" class=\"multiSelect\" options=\"qc.solutionTemplatesList\" id-prop=\"displayNameInSelect\" show-search=\"true\" search-limit=\"100000\" show-select-all=\"true\" show-unselect-all=\"true\" display-prop=\"displayNameInSelect\">\n                        </multiselect>\n                    </div>\n                </div>\n                <div class=\"row cst-row\">\n                    <div class=\"col-lg-10 col-sm-10 col-md-10 col-xs-10 no-padding\">\n                        <span>Supervisor</span>\n                        <multiselect ng-model=\"qc.createQueueObj.supervisor\" class=\"multiSelect\" options=\"qc.filteredSupervisor\" show-search=\"true\" search-limit=\"100000\" show-select-all=\"true\" show-unselect-all=\"true\">\n                        </multiselect>\n                    </div>\n                </div>\n                <div class=\"row cst-row\">\n                    <div class=\"col-lg-10 col-sm-10 col-md-10 col-xs-10 no-padding\">\n                        <span>Agents</span>\n                        <multiselect ng-model=\"qc.createQueueObj.agents\" class=\"multiSelect\" options=\"qc.allAgents\" show-search=\"true\" search-limit=\"100000\" show-select-all=\"true\" show-unselect-all=\"true\">\n                        </multiselect>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row cst-row\">\n                <button class=\"btn btn-custom\" type=\"submit\">\n                   <i class=\"fa fa-floppy-o\"></i>\n                    Save\n                </button>\n                <button class=\"btn btn-cancel\" type=\"button\" ng-click=\"qc.cancelQueue()\">\n                    Cancel\n                </button>\n            </div>\n        </form>\n    </div>\n</div>\n\n<div class=\"queueContainer\">\n    <div class=\"row row-eq-height\" style=\"padding-top:15px;\">\n        <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-6\">\n            <p class=\"solDashHeading\" style=\"font-weight:500;font-size:22px;\">Queue Management</p>\n        </div>\n        <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-6 text-right\">\n            <button class=\"btn btn-customQueue\" ng-click=\"qc.createQueue();\">\n                <i class=\"fa fa-plus-circle\"></i>\n                Create New Queue\n            </button>\n        </div>\n    </div>\n    <br>\n    <div class=\"row\">\n        <div class=\"col-sm-12 col-md-12 col-lg-12 col-xs-12\">\n            <div class=\"table-responsive\">\n                <table class=\"table table-bordered table-hover table-queue\">\n                    <thead>\n                        <tr>\n                            <td>Queue ID</td>\n                            <td>Queue Name</td>\n                            <td>Case Supervisor</td>\n                            <td>Solutions</td>\n                            <td>Case Agents</td>\n                            <td colspan=\"2\" style=\"width:25%\">Created On</td>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr ng-repeat=\"data in qc.queue\">\n                            <td>{$ data.queue_id $}</td>\n                            <td>{$ data.queue_name $}</td>\n                            <td>\n                                <div ng-repeat=\"arr in data.supervisor\">\n                                    {$ arr $}<span ng-show=\"data.supervisor.length-1!=$index\">,</span>\n                                </div>\n                            </td>\n                            <td>\n                                {$ data.solution $}\n                            </td>\n                            <td>\n                                <div ng-repeat=\"list in data.agents\">\n                                    <span ng-show=\"$index<5 && !showMore\">{$ list $}</span>\n                                    <span ng-show=\"data.agents.length-1!=$index && $index<5 && !showMore\">,</span>\n                                    <span ng-show=\"showMore\">{$ list $}</span>\n                                    <span ng-show=\"data.agents.length-1!=$index && showMore\">,</span>\n                                </div>\n                                <a ng-show=\"data.agents.length>5 && !showMore\" ng-click=\"showData();showMore=true\">show more</a>\n                                <a ng-show=\"data.agents.length>5 && showMore\" ng-click=\"showMore = false\" style=\"color:white;\">show less</a>\n                            </td>\n                            <td colspan=\"2\" style=\"width:25%\">\n                                <span>{$ data.created_ts $}</span>\n                                <span class=\"hiddenButton\">\n                                    <span class=\"buttonStyle\">\n                                        <span style=\"padding:10px;\" ng-click=\"qc.editQueue(data)\">\n                                            <i class=\"fa fa-pencil\"></i>\n                                            Edit\n                                        </span>\n                                    </span>\n                                    <span style=\"padding-left:10px;cursor:pointer;color:white;\" ng-click=\"qc.deleteQueue(data)\">\n                                        <i class=\"fa fa-trash\"></i>\n                                    </span>\n                                </span>\n                            </td>\n                            <!--<td>-->\n                                <!--&lt;!&ndash;<span class=\"textHidden\">{$ data.CreatedOn $}</span>&ndash;&gt;-->\n\n\n                            <!--</td>-->\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </div>\n</div>"

/***/ }),
/* 113 */
/***/ (function(module, exports) {

	(function() {
		'use strict';
	    angular.module('console.queueServices', [])
			.service('queueService', ["$state", "$q", "$http", "httpPayload", function($state,$q, $http, httpPayload) {
	
	              var _getQueues = function(sess_id) {
	
	                var req = {
	                      method: 'GET',
	                      url: 'api/getqueues/',
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	              var _createQueue = function(obj,sess_id) {
	
	                var req = {
	                      method: 'POST',
	                      url: 'api/createqueue/',
	                      headers: httpPayload.getHeader(),
	                      data: obj
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	
	               var _delQueue = function(data,sessId) {
	
	                var req = {
	                      method: 'DELETE',
	                      url: 'api/deletequeue/'+data.queue_id+'/',
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	
	              var queueService = {
	                getQueues:_getQueues,
	                createQueue:_createQueue,
	                delQueue:_delQueue
	              };
	
	              return queueService;
			}]);
	})();

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
		'use strict';
	    //require('./services/module.js');
		//require('./dashboard/dashboard.module.js');
		//require('./entitygraph/entitygraph.module.js');
		//require('./solutionsetup/solutionsetup.module.js');
	
		module.exports = angular.module('console.userRoles', [
	        //'console.dashboard.entitygraph'
		    //'console.dashboard.solutionsetup'
		    //'console.layout.bodycontent.dashboard.services'
		])
	        .controller('userRoleController', __webpack_require__(115))
	         .config(['$stateProvider', function($stateProvider) {
	            $stateProvider.state('app.userRole', {
	                url: '/userRoles',
	                views: {
	                    'bodyContentContainer@app': {
	                        template: __webpack_require__(116),
	                        controller: 'userRoleController',
	                        controllerAs: 'urc',
	                        cache :false,
	                        resolve: {
	                              logedIn:["$state", function($state){
	                                 var loginData = JSON.parse(localStorage.getItem('userInfo'));
	                                 if(!loginData){
	                                         $state.go('login')
	                                 }
	                              }],
	                        }
	                    }
	                }
	            });
	        }]);
	})();

/***/ }),
/* 115 */
/***/ (function(module, exports) {

	module.exports = ['$scope','$state','userRoleServices','userService','solutionService','$rootScope','ngDialog','$timeout',
	function($scope,$state,userRoleServices,userService,solutionService,$rootScope,ngDialog,$timeout) {
		'use strict';
	
		var vm = this;
		window.scrollTo(0,0);
		$rootScope.currentState = 'userRole';
		$scope.loginData = JSON.parse(localStorage.getItem('userInfo'));
		vm.sess_id= $scope.loginData.sess_id;
		$scope.config = {};
		$scope.config.solution = [];
		var userInfo = JSON.parse(localStorage.getItem('userInfo'));
		$scope.isUserRoles=false;
	
		$scope.config = {};
	
		$scope.createNewUserRole =function(){
	        $scope.isUserRoles=true;
	        $scope.UserRolesList=[];
		};
	
		vm.firstLoad=true;
	
		vm.newUserRoleObj = { 'name': 'Role 1', 'users':[], 'description':'','policies':{}};
	    //$scope.userRolesObj ={subGroups: []};
	
	    vm.users=[];
	    vm.usersObj=[];
	    vm.usersArrayObj={};
	    vm.getAllUsers = function(){
	         userService.getUsers(vm.sess_id).then(function(response){
	              if(response.data.status=="success"){
	                   vm.usersObj=response.data.result.data;
	                   angular.forEach(response.data.result.data, function(value,key){
	                        //vm.users.push(value.userName);
	                        vm.users.push({"userName": value.userName,"id":value.id });
	                        vm.usersArrayObj[value.userName]=value.id;
	                   });
	               }
	               else{
	                   vm.users=[];
	               }
	               console.log(vm.users);
	          });
	    }
	    vm.getAllUsers();
	
	    $scope.loadUsers = function($query) {
	        if($query==""){
	            return vm.users;
	        }
	        else{
	             var filterArray=[];
	             vm.users.filter(function(user) {
	                 if(user.userName.toLowerCase().indexOf($query.toLowerCase()) != -1){
	                    filterArray.push(user);
	                 }
	            });
	            return filterArray;
	        }
	    };
	
	
	    vm.getuserRoles = function(){
	         userRoleServices.getUserRoles(vm.sess_id).then(function(response){
	              if(response.data){
	                  if(response.data.result.status=="Success"){
	                        if(response.data.result.data.length>0){
	                            $scope.isUserRoles=true;
	                        }
	                        $scope.UserRolesList=response.data.result.data;
	                        //$scope.userRoles=response.data.result.data;
	                        //$scope.userRolesObj["subGroups"]=response.data.result.data;
	                        vm.newUserRoleObj=$scope.UserRolesList[0];
	                        console.log($scope.UserRolesList);
	
	                        if(vm.firstLoad==true){
	                            $timeout(function() {
	                                angular.element(".angular-ui-tree ol:first-child li:first-child div").triggerHandler('click');
	                            }, 500);
	                           vm.firstLoad==false;
	                        }
	                   }
	                   else{
	                       $.UIkit.notify({
	                           message : response.data.msg,
	                           status  : 'warning',
	                           timeout : 3000,
	                           pos     : 'top-center'
	                       });
	                   }
	               }
	          });
	    }
	
	    vm.getuserRoles();
	
	
	
	    vm.saveUserRole = function(){
	        if(vm.newUserRoleObj.id){
	            var reqObj=angular.copy(vm.newUserRoleObj);
	            reqObj.users=[];
	            /*if(vm.newUserGroupObj.members){
	                 angular.forEach(vm.newUserGroupObj.members, function(value,key){
	                    reqObj.members.push({"id": vm.usersArrayObj[value], "userName": value });
	                 });
	            }*/
	
	            var usersArray =[];
	            if(vm.newUserRoleObj.users){
	                 angular.forEach(vm.newUserRoleObj.users, function(value,key){
	                    usersArray.push(vm.usersArrayObj[value]);
	                 });
	            }
	
	            //vm.setGroupMembers(vm.newUserGroupObj.id,usersArray);
	            userRoleServices.createUserRole(reqObj,vm.sess_id).then(function(result){
	                if(result.data.result.status =='Success'){
	                     $.UIkit.notify({
	                        message : result.data.result.message,
	                        status  : 'success',
	                        timeout : 2000,
	                        pos     : 'top-center'
	                     });
	                    var roleId=result.data.result.data.id;
	//                    vm.setRoleMembers(roleId,usersArray);
	                }
	                else{
	                   $.UIkit.notify({
	                       message :  result.data.result.message,
	                       status  : 'danger',
	                       timeout : 2000,
	                       pos     : 'top-center'
	                    });
	                }
	                //vm.getuserGroups();
	
	            });
	        }
	        else{
	            var reqObj={};
	            //reqObj.users=[];
	            var usersArray =[];
	            if(vm.newUserRoleObj.users){
	                 angular.forEach(vm.newUserRoleObj.users, function(value,key){
	                    usersArray.push(vm.usersArrayObj[value]);
	                 });
	            }
	            //reqObj.users=usersArray;
	            reqObj.name=vm.newUserRoleObj.name;
	            reqObj.description=vm.newUserRoleObj.description;
	            //reqObj.policies=vm.newUserRoleObj.policies;
	
	            if(vm.newUserRoleObj.parentId==undefined){
	                userRoleServices.createUserRole(reqObj,vm.sess_id).then(function(result){
	                    if(result.data.result.status =='Success'){
	                         $.UIkit.notify({
	                            message : result.data.result.message,
	                            status  : 'success',
	                            timeout : 2000,
	                            pos     : 'top-center'
	                         });
	                         var roleId=result.data.result.data.id;
	                         vm.setRoleMembers(roleId,usersArray);
	                    }
	                    else{
	                       $.UIkit.notify({
	                           message :  result.data.result.message,
	                           status  : 'danger',
	                           timeout : 2000,
	                           pos     : 'top-center'
	                        });
	                    }
	                });
	            }
	            else{
	                reqObj.parentId=vm.newUserGroupObj.parentId;
	                userRoleServices.createSubUserRole(reqObj,vm.sess_id,vm.newUserRoleObj.parentId).then(function(result){
	                    if(result.data.result.status =='Success'){
	                         $.UIkit.notify({
	                            message : result.data.result.message,
	                            status  : 'success',
	                            timeout : 2000,
	                            pos     : 'top-center'
	                         });
	                         var roleId=result.data.result.data.id;
	                         vm.setRoleMembers(roleId,usersArray);
	                    }
	                    else{
	                       $.UIkit.notify({
	                           message :  result.data.result.message,
	                           status  : 'danger',
	                           timeout : 2000,
	                           pos     : 'top-center'
	                        });
	                    }
	                });
	            }
	        }
	    };
	    vm.setRoleMembers =function(roleId,usersArray){
	       if(usersArray==null){
	            usersArray=[];
	       }
	        var objReq={};
	        objReq.roleId=roleId;
	        objReq.userIds=usersArray;
	        userRoleServices.saveRoleMembers(objReq,vm.sess_id).then(function(result){
	            if(result.data.result){
	                if(result.data.result.status =='Success'){
	                 $.UIkit.notify({
	                    message : result.data.result.message,
	                    status  : 'success',
	                    timeout : 2000,
	                    pos     : 'top-center'
	                 });
	                }
	                else{
	                   $.UIkit.notify({
	                       message :  result.data.result.message,
	                       status  : 'danger',
	                       timeout : 2000,
	                       pos     : 'top-center'
	                    });
	                }
	            }
	            else{
	                $.UIkit.notify({
	                   message :  result.data.msg,
	                   status  : 'danger',
	                   timeout : 2000,
	                   pos     : 'top-center'
	                });
	            }
	
	            //vm.getuserRoles();
	            vm.getRoleDataById(roleId, 'save');
	
	        });
	    }
	
	    $scope.addUser=function(tags, currentObj){
	        if(currentObj.id){
	            var userData=tags;
	            if(userData.id){
	                var reqObj={"roleId":currentObj.id,"userIds":[]};
	                reqObj.userIds.push(userData.id);
	                userRoleServices.addUserToRole(reqObj,vm.sess_id).then(function(result){
	                    if(result.data){
	                        if(result.data.result.status =='Success'){
	                             $.UIkit.notify({
	                                message : result.data.result.message,
	                                status  : 'success',
	                                timeout : 2000,
	                                pos     : 'top-center'
	                             });
	                             vm.getRoleDataById(currentObj.id, 'update');
	                        }
	                        else{
	                           $.UIkit.notify({
	                               message :  result.data.result.message,
	                               status  : 'danger',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                            });
	                        }
	                    }
	                    else{
	                           $.UIkit.notify({
	                               message :  "Failed",
	                               status  : 'danger',
	                               timeout : 2000,
	                               pos     : 'top-center'
	                            });
	                        }
	                },function(err){
	                   $.UIkit.notify({
	                           message : 'Internal Server Error',
	                           status  : 'warning',
	                           timeout : 2000,
	                           pos     : 'top-center'
	                   });
	                });
	            }else{
	                $.UIkit.notify({
	                   message : 'User Id not exists.',
	                   status  : 'warning',
	                   timeout : 2000,
	                   pos     : 'top-center'
	                });
	            }
	
	        }
	    };
	    $scope.removeUser = function(tags, currentObj){
	        if(currentObj.id){
	            var reqObj={"roleId":currentObj.id,"userId":""};
	            var userData=tags;
	            if(userData.id){
	                reqObj.userId=userData.id;
	            }
	            else{
	                reqObj.userId=vm.usersArrayObj[userData.userName];
	            }
	            userRoleServices.deleteUserFromRole(reqObj,vm.sess_id).then(function(result){
	                if(result.data){
	                    if(result.data.result.status =='Success'){
	                         $.UIkit.notify({
	                            message : result.data.result.message,
	                            status  : 'success',
	                            timeout : 2000,
	                            pos     : 'top-center'
	                         });
	                         vm.getRoleDataById(currentObj.id, 'update');
	                    }
	                    else{
	                       $.UIkit.notify({
	                           message :  result.data.result.message,
	                           status  : 'danger',
	                           timeout : 2000,
	                           pos     : 'top-center'
	                        });
	                    }
	                }
	                else{
	                       $.UIkit.notify({
	                           message :  "Failed",
	                           status  : 'danger',
	                           timeout : 2000,
	                           pos     : 'top-center'
	                        });
	                    }
	            },function(err){
	               $.UIkit.notify({
	                       message : 'Internal Server Error',
	                       status  : 'warning',
	                       timeout : 2000,
	                       pos     : 'top-center'
	               });
	            });
	
	        }
	    };
	
	    vm.getRoleDataById = function(roleId, type){
	        if(roleId){
	            userRoleServices.getUserRoleById(roleId,vm.sess_id).then(function(response){
	              if(response.data){
	                  if(response.data.result.status=="Success"){
	                        if(type=='save')
	                            vm.newUserRoleObj=response.data.result.data;
	                        else
	                            vm.newUserRoleObj.users=response.data.result.data.users;
	
	                        var curntRule=response.data.result.data;
	                        angular.forEach($scope.UserRolesList, function(value,key){
	                            if(curntRule.id==value.id){
	                                $scope.UserRolesList[key]=value;
	                                return 0;
	                            }
	                        });
	                   }
	                   else{
	                       $.UIkit.notify({
	                           message : response.data.msg,
	                           status  : 'warning',
	                           timeout : 3000,
	                           pos     : 'top-center'
	                       });
	                   }
	               }
	          });
	
	        }
	    };
	
	
	    $scope.deleteUserRole = function(){
	        var reqObj={};
	        reqObj=vm.newUserRoleObj;
	        if(reqObj.id){
	             ngDialog.open({ template: 'confirmBox', controller: ['$scope','$state' ,function($scope,$state) {
	                    $scope.activePopupText = 'Are you sure you want to delete ' +"'" +reqObj.name+ "'" +' ' + 'role ?';
	                    $scope.onConfirmActivation = function (){
	                        ngDialog.close();
	                        userRoleServices.deleteUserRole(reqObj,vm.sess_id).then(function(result){
	                            if(result.data){
	                                if(result.data.result.status =='Success'){
	                                     $.UIkit.notify({
	                                        message : result.data.result.message,
	                                        status  : 'success',
	                                        timeout : 2000,
	                                        pos     : 'top-center'
	                                     });
	                                    vm.getuserRoles();
	                                }
	                                else{
	                                   $.UIkit.notify({
	                                       message :  result.data.result.message,
	                                       status  : 'danger',
	                                       timeout : 2000,
	                                       pos     : 'top-center'
	                                    });
	                                }
	                            }
	                            else{
	                                   $.UIkit.notify({
	                                       message :  "Failed",
	                                       status  : 'danger',
	                                       timeout : 2000,
	                                       pos     : 'top-center'
	                                    });
	                                }
	                        },function(err){
	                           $.UIkit.notify({
	                                   message : 'Internal Server Error',
	                                   status  : 'warning',
	                                   timeout : 2000,
	                                   pos     : 'top-center'
	                           });
	                        });
	                    };
	                }]
	             });
	        }
	    };
	
	    $scope.createUserGroup = function(){
	        $state.go('app.createUserGroup',{id:'new'});
	    };
	    $scope.addNewUser = function(){
	        document.getElementById("createUser").style.width = "40%";
	    };
	    $scope.closeNewUser = function(){
	        document.getElementById("createUser").style.width = "0%";
	    };
	    $scope.assignNewUser = function(){
	        angular.element('#txt_usersForRoles .host').scope().eventHandlers.input.focus();
	    };
	
	
	    vm.getSolutions =function(){
	        solutionService.getSolutions(vm.sess_id).then(function(result){
	          if(result.data.status=="success"){
	            $scope.solutionsList=result.data.data;
	          }
	          else{
	            $scope.solutionsList=[];
	          }
	        });
	    };
	    //vm.getSolutions();
	
	
	    $scope.saveNewUser = function(){
	        if($scope.config.password == $scope.config.confirmPassword){
	            if($scope.config.solutions)
	                var solArray = $scope.config.solutions.map(function(e){return {"name": e.solution_name,"id": e.solution_id}});
	             else
	                var solArray =[];
	            if($scope.config.roles)
	                var roleArray =$scope.config.roles.map(function(e){return e.name});
	            else
	                var roleArray=[];
	            var obj = {
	                        "userName": $scope.config.userName,
	                        "solutions": solArray,
	                        "password": $scope.config.password,
	                        "roles": roleArray
	                       }
	            console.log(obj);
	
	            userService.createUsers(obj,vm.sess_id).then(function(result){
	                if(result.data.result.status =='Success'){
	                     $.UIkit.notify({
	                        message : result.data.result.message,
	                        status  : 'success',
	                        timeout : 2000,
	                        pos     : 'top-center'
	                     });
	                     vm.users.push($scope.config.userName);
	
	                     $scope.config={};
	                     //vm.getAllUsers();
	                     $scope.closeNewUser();
	                }
	                else{
	                   $.UIkit.notify({
	                       message : result.data.result.message,
	                       status  : 'danger',
	                       timeout : 2000,
	                       pos     : 'top-center'
	                    });
	                }
	            });
	        }
	        else{
	            $.UIkit.notify({
	               message : "Password and confirm password should be match",
	               status  : 'danger',
	               timeout : 2000,
	               pos     : 'top-center'
	            });
	        }
	    };
	
	
	
	    $scope.addNewPolicy = function(){
	        document.getElementById("createPolicy").style.width = "60%";
	    };
	    $scope.closeNewPolicy = function(){
	        document.getElementById("createPolicy").style.width = "0%";
	    };
	    $scope.saveNewPolicy = function(){
	
	    };
	
	
	    vm.viewAndEditUserRole = function(userRole,node){
	       var tempDomain = userRole.$modelValue;
	       $scope.cls = [];
	       $scope.cls[userRole.$id] = "activeClass";
	       $scope.selectedNode = userRole;
	       $scope.selectedUserRole=tempDomain;
	       vm.newUserRoleObj=tempDomain;
	
	      /* var id= $("#total-groups").find("a.selected span").attr('id');
	       console.log(id);*/
	
	       /*angular.forEach($scope.newUserRoleObj.subGroups, function(val,key){
	           if($scope.selectedUserRole.id==val.id){
	               vm.newUserRoleObj=val;
	           }
	       });*/
	   };
	
	
	    $scope.addMainRoleTree = function(){
	        var generatedId=Math.random();
	        if($scope.selectedNode){
	           if($scope.selectedNode.$parentNodeScope == null){
	               if($scope.UserRolesList.length != 0){
	                   for(var i=0;i<$scope.UserRolesList.length;i++){
	                       if($scope.UserRolesList[i].id){
	                          flag=true;
	                       }
	                       else{
	                          flag=false;
	                          break;
	                       }
	                   };
	                   if(flag==true){
	                        var lenGroup = $scope.UserRolesList.length+1;
	                        $scope.UserRolesList.unshift({ genId:generatedId, name: 'Role '+lenGroup, "members":[], "description":"", "policies":{} });
	                        vm.selecteTheMainRole(generatedId);
	                   }
	                   else{
	                        $.UIkit.notify({
	                           message : "Please save the Role",
	                           status  : 'danger',
	                           timeout : 2000,
	                           pos     : 'top-center'
	                        });
	                   }
	               }
	               else{
	                   var lenGroup = $scope.UserRolesList.length+1;
	                   $scope.UserRolesList.unshift({ genId:generatedId, name: 'Role '+lenGroup, "members":[], "description":"", "policies":{} });
	                   vm.selecteTheMainRole(generatedId);
	               }
	           }
	           else{
	               var userGroupNode = $scope.selectedNode.$parentNodeScope.$modelValue;
	               if(userGroupNode.subGroups == null){
	                   userGroupNode.subGroups = [];
	                   userGroupNode.subGroups.push({ genId:generatedId, name: 'Role 1', "members":[], "description":"", "policies":{} });
	                   vm.selecteTheMainRole(generatedId);
	               }else{
	                    var flag=true;
	                    angular.forEach(userGroupNode.subGroups, function(val,key){
	                       if(val.id)
	                        flag=true;
	                       else
	                       flag=false;
	                    });
	                    if(flag==true){
	                         var length =userGroupNode.subGroups.length;
	                        length++;
	                        userGroupNode.subGroups.push({ genId:generatedId, name: 'Role '+length, "members":[], "description":"", "policies":{} });
	                        vm.selecteTheMainRole(generatedId);
	                    }
	                    else{
	                        $.UIkit.notify({
	                           message : "Please save the Role",
	                           status  : 'danger',
	                           timeout : 2000,
	                           pos     : 'top-center'
	                        });
	                    }
	               }
	           }
	       }
	       else{
	            var sampleObj={ genId:generatedId, 'name': 'Role 1', 'members':[], 'description':'','policies':{}};
	            $scope.UserrolesList=[];
	            $scope.UserrolesList.push(sampleObj);
	            //$scope.userRolesObj["subGroups"].push(sampleObj);
	            vm.newUserRoleObj = $scope.userRolesObj[0];
	            vm.selecteTheMainRole(generatedId);
	       }
	    };
	
	    vm.selecteTheMainRole = function(generatedId){
	        $timeout(function() {
	           angular.element.find("[id='"+generatedId+"']")[0].click();
	        }, 100);
	    };
	    vm.expandTree = function(generatedId){
	        $timeout(function() {
	            var p = angular.element.find("[id='"+generatedId+"']");
	            angular.element(p).parent().parent()[0].classList.remove("hidden")
	            angular.element(p).parent().parent().parent()[0].setAttribute("collapsed","false");
	            angular.element(p).parent().parent().parent().find("span")[0].classList.remove("fa-plus-square-o");
	            angular.element(p).parent().parent().parent().find("span")[0].classList.add("fa-minus-square-o");
	            angular.element.find("[id='"+generatedId+"']")[0].click();
	
	        }, 100);
	    };
	
	
	
	
	
	}];

/***/ }),
/* 116 */
/***/ (function(module, exports) {

	module.exports = "<script type=\"text/ng-template\" id=\"confirmBox\">\n  <div class=\"popup-header\">\n    <h3 class=\"text-primary\"> Confirm Action </h3>\n    <hr class=\"popup-hr\"/>\n    <p class=\"text-info\" style=\"padding:10px\"> {$ activePopupText $}  </p>\n    <br/>\n    <div class=\"row\">\n      <div class=\"col-lg-12 col-sm-12 col-xs-12 co-md-12\">\n        <button class=\"btn btn-primary right\" ng-click=\"onConfirmActivation()\"> Confirm </button>\n      </div>\n    </div>\n  </div>\n</script>\n<script type=\"text/ng-template\" id=\"custom-template-users\">\n      <div class=\"right-panel\">\n        <span>{$ data.userName $}</span>\n      </div>\n    </script>\n\n<br>\n<div classs=\"row\">\n    <div class=\"col-lg-6 col-xs-6 col-md-6 col-sm-6\">\n        <p class=\"solDashHeading\" style=\"font-size:12px;\"><span style=\"text-decoration: underline;\">ROLES</span><span ng-show=\"isUserRoles\"> > Create New Role</span></p>\n    </div>\n</div>\n<br>\n\n<br>\n<div class=\"user-roles-container\">\n    <div classs=\"row\" ng-show=\"!isUserRoles\">\n        <div class=\"row emptygroup-container\">\n            <label class=\"text-nodata\">Seems like you didn't add any roles yet. Click here to add new role</label>\n            <div class=\"newbtndiv\">\n                <button class=\"btn btn-customQueue\" ng-click=\"createNewUserRole();\" style=\"border:1px solid #97d7ff;\">\n                    <img src=\"./static/uam/app/images/create.png\" style=\"width:15px;\"> Create a New UserRole\n                </button>\n            </div>\n        </div>\n    </div>\n    <div classs=\"row\" ng-show=\"isUserRoles\">\n        <div class=\"col-lg-5 col-xs-5 col-md-5 col-sm-5 groups-hierarchy-container\">\n\n                 <div class=\"row links-div\">\n                    <div class=\"pull-right\">\n                        <div class=\"addgroup-link\" ng-click=\"deleteUserRole();\">\n                            <img src=\"./static/uam/app/images/delete.png\" class=\"addg-icon\"/>Delete Role\n                        </div>\n                    </div>\n                    <!-- <div class=\"pull-right\" style=\"margin-right: 15px;\">\n                        <div class=\"addgroup-link\" ng-click=\"addChildRole();\">\n                            <img src=\"./static/uam/app/images/create.png\" class=\"delg-icon\" />Add Sub Role\n                        </div>\n                    </div>-->\n                     <div class=\"pull-right\" style=\"margin-right: 15px;\">\n                        <div class=\"addgroup-link\" ng-click=\"addMainRoleTree();\">\n                            <img src=\"./static/uam/app/images/create.png\" class=\"delg-icon\" />Add Main Role\n                        </div>\n                    </div>\n                </div>\n\n                <!--<div class=\"row\">\n\n                    <div class=\"span6\">\n                        <div style=\"\">\n                            &lt;!&ndash;<ul class=\"breadcrumb\">\n                                <li ng-repeat=\"b in breadcrums\" ng-class=\"{ active: $last }\">{$ b $}\n                                    <span class=\"divider\" ng-show=\"!$last\">/</span></li>\n                            </ul>&ndash;&gt;\n                            <div class=\"all-groups\">All Roles</div>\n                            <div id=\"total-groups\" roles-tree-view=\"userRolesObj\" roles-tree-view-options=\"rolesOptions\"></div>\n                        </div>\n                    </div>\n                </div>-->\n\n                <div class=\"row\">\n                   <div class=\"all-groups\">All Roles</div>\n                   <div class=\"col-sm-12 col-md-12 col-lg-12 col-xs-12\" id=\"uitree\" style=\"padding-right:0;padding-left:0\">\n                       <script type=\"text/ng-template\" id=\"nodes_renderer.html\">\n                           <div ui-tree-handle data-nodrag ng-class=\"cls[this.$id]\" id=\"{$ node.genId $}\" style=\"font-weight: 400;padding: 7px 5px 7px 18px;\" ng-click=\"urc.viewAndEditUserRole(this)\">\n                               <a data-nodrag ng-click=\"toggle(this)\">\n                                   <span ng-style=\"node.subGroups==null && {'visibility':'hidden'}\" ng-class=\"{'fa fa-plus-square-o': collapsed,'fa fa-minus-square-o': !collapsed}\" style=\"font-size: 13px;color: #4D6878;\"></span>\n                               </a>\n                               {$ node.name $}\n                           </div>\n                           <ol ui-tree-nodes=\"\" ng-model=\"node.subGroups\" ng-class=\"{hidden: collapsed}\">\n                               <li ng-repeat=\"node in node.subGroups\" ui-tree-node ng-include=\"'nodes_renderer.html'\" collapsed=\"true\">\n                               </li>\n                           </ol>\n                       </script>\n                       <div ui-tree class=\"angular-ui-tree\">\n                           <ol ui-tree-nodes=\"\" ng-model=\"UserRolesList\" id=\"tree-root\">\n                               <li ng-repeat=\"node in UserRolesList\" ui-tree-node ng-include=\"'nodes_renderer.html'\" collapsed=\"false\"></li>\n                           </ol>\n                       </div>\n                   </div>\n               </div>\n\n\n        </div>\n        <div class=\"col-lg-7 col-xs-7 col-md-7 col-sm-7 groups-expand-container\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 creation-section\">\n                <form ng-submit=\"urc.saveUserRole()\">\n                  <div class=\"row\">\n                    <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\">\n                      <label>Name</label>\n                      <input type=\"text\"class=\"bottomLineInput\" data-ng-model=\"urc.newUserRoleObj.name\" class=\"form-control\" placeholder=\"Role name\" required>\n                    </div>\n                  </div>\n\n                  <div class=\"row\">\n                    <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\">\n                      <label>Description</label>\n                        <textarea type=\"text\" class=\"bottomLineInput\" data-ng-model=\"urc.newUserRoleObj.description\" class=\"form-control\" placeholder=\"Description\"></textarea>\n                    </div>\n                  </div>\n\n\n                  <div class=\"row\">\n                    <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\">\n                       <div class=\"panel-group\">\n                        <div class=\"panel panel-default\">\n                          <div class=\"panel-heading groupusers-div\">\n                            <h4 class=\"panel-title pull-left\">\n                              <a data-toggle=\"collapse\" href=\".users-collapse\">Users</a>\n                            </h4>\n                              <div class=\"pull-right\">\n                                 <div class=\"pull-right\" style=\"margin-right: 15px;\">\n                                    <div class=\"addgroup-link\" ng-click=\"assignNewUser()\">\n                                        <img src=\"./static/uam/app/images/create.png\" class=\"addg-icon\" />Assign new user\n                                    </div>\n                                </div>\n                              </div>\n                              <div class=\"clear\"></div>\n                          </div>\n                          <div class=\"panel-collapse collapse in users-collapse\">\n                            <div class=\"panel-body\">\n                               <!--<div mass-autocomplete class=\"mass-autocompleteAttributeDiv\">\n                                    <input ng-model=\"urc.newUserRoleObj.users\" class=\"form-control custom-form\"\n                                           mass-autocomplete-item=\"autocomplete_options\" placeholder=\"Search by name\"\n                                           style=\"background: white;\" required>\n                                </div>-->\n\n\n                                <tags-input placeholder=\"Search by name\" ng-model=\"urc.newUserRoleObj.users\" id=\"txt_usersForRoles\"\n                                            replace-spaces-with-dashes=\"false\"\n                                            use-strings=\"true\"\n                                            add-on-comma=\"false\"\n                                            on-tag-added=\"addUser($tag, urc.newUserRoleObj)\"\n                                            on-tag-removed=\"removeUser($tag, urc.newUserRoleObj)\"\n                                            display-property=\"userName\">\n\n                                   <auto-complete source=\"loadUsers($query)\"\n                                                     min-length=\"0\"\n                                                     load-on-focus=\"true\"\n                                                     load-on-empty=\"true\"\n                                                     max-results-to-show=\"500\"\n                                                     template=\"custom-template-users\"></auto-complete>\n                                </tags-input>\n\n                             <!--<multiselect ng-model=\"urc.newUserRoleObj.group_users\" class=\"multiSelect\" options=\"urc.users\"\n                                          show-search=\"true\" search-limit=\"100000\" id-prop=\"solution_id\" display-prop=\"Users\">\n                            </multiselect>-->\n\n\n                            </div>\n\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n\n\n\n                   <div class=\"row\">\n                    <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\">\n                       <div class=\"panel-group\">\n                        <div class=\"panel panel-default\">\n                          <div class=\"panel-heading groupusers-div\">\n                            <h4 class=\"panel-title pull-left\">\n                              <a data-toggle=\"collapse\" href=\".policy-collapse\">Policies</a>\n                            </h4>\n                              <div class=\"pull-right\">\n                                 <div class=\"pull-right\" style=\"margin-right: 15px;\">\n                                    <div class=\"addgroup-link\" ng-click=\"addNewPolicy()\">\n                                        <img src=\"./static/uam/app/images/create.png\" class=\"addg-icon\" />Add new policy\n                                    </div>\n                                </div>\n                              </div>\n                              <div class=\"clear\"></div>\n                          </div>\n                          <div class=\"panel-collapse collapse in policy-collapse\">\n                            <div class=\"panel-body\">Panel Body</div>\n\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n\n\n\n\n\n\n\n\n\n                   <div class=\"row\">\n                      <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group btn-custom-group\">\n                          <button class=\"btn btn-custom-create\" type=\"submit\">\n                            <img src=\"./static/uam/app/images/save_white.png\" class=\"img-responsive img-save\"> Save\n                          </button>\n                           <!--<button class=\"btn btn-custom-cancel\" ui-sref=\"app.userRoles\">\n                            Cancel\n                          </button>-->\n                      </div>\n                  </div>\n\n\n                </form>\n            </div>\n        </div>\n     </div>\n    </div>\n</div>\n\n<div class=\"row overlay\" id=\"createUser\" style=\"overflow:auto;height: auto;\">\n    <div class=\"createUser\">\n      <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 user-creation\">\n        <label>Create new user</label>\n      </div>\n      <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 creation-section\" style=\"padding: 10px 30px;\">\n        <form ng-submit=\"saveNewUser()\">\n          <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:0\">\n              <label>User name</label>\n              <input type=\"text\" class=\"form-control\" placeholder=\"User name\" ng-model=\"config.userName\" required>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\"  style=\"padding:0\">\n              <label>Password</label>\n              <input type=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"config.password\"  required>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\"  style=\"padding:0\">\n              <label>Conform password</label>\n              <input type=\"password\" class=\"form-control\" placeholder=\"Conform password\" ng-model=\"config.confirmPassword\"  required>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\"  style=\"padding:0\">\n              <label>Solution</label>\n              <multiselect ng-model=\"config.solutions\" class=\"multiSelect\" options=\"solutionsList\"  show-search=\"true\" search-limit=\"100000\" id-prop=\"solution_id\" display-prop=\"solution_name\">\n              </multiselect>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\"  style=\"padding:0\">\n              <label>Role</label>\n              <multiselect ng-model=\"config.roles\" class=\"multiSelect\" options=\"userRoles\"  show-search=\"true\" search-limit=\"100000\" id-prop=\"id\" display-prop=\"name\">\n              </multiselect>\n            </div>\n          </div>\n          <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group btn-custom-group\">\n              <button class=\"btn btn-custom-create\" type=\"submit\">\n                <img src=\"./static/uam/app/images/save_white.png\" class=\"img-responsive img-save\"> Save\n              </button>\n               <label class=\"btn btn-custom-cancel\" ng-click=\"closeNewUser()\">Cancel</label>\n            </div>\n          </div>\n        </form>\n      </div>\n    </div>\n</div>\n\n\n<div class=\"row overlay\" id=\"createPolicy\" style=\"overflow:auto;height: 100%;\">\n    <div class=\"createUser creation-section\">\n        <form ng-submit=\"saveNewPolicy()\" >\n           <div class=\"row\">\n              <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" style=\"padding: 6px 6px 6px 20px;\">\n                <label style=\"font-weight: normal;\">Resources</label>\n              </div>\n           </div>\n           <div class=\"row\">\n          <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 \" style=\"padding: 10px 20px;\">\n              <div class=\"row\">\n                <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding: 4px;border: 1px solid #b9e2f6;background-color: #fafdff;\">\n\n                  <div class=\"col-md-4 col-lg-4 col-sm-4 col-xs-4 form-group\" style=\"padding:4px;\">\n                    <div style=\"background-color: #fff; border: 1px solid #f1f1f1;margin: 0 2px;\">\n                        <div style=\"background-color:#e2f5fe;padding: 5px;\"><label style=\"font-weight: inherit;\">Solutions</label></div>\n                        <div class=\"row\">\n                         <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                             <input type=\"text\" class=\"form-control\" placeholder=\"Search by name\" >\n                         </div>\n                     </div>\n                        <div class=\"row\">\n                         <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                             <div>\n                                 <span  ng-click=\"selectAllSolutions()\"   style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Select All</span>\n                                 <span  ng-click=\"deselectAllSolutions()\" style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Deselect All</span>\n                             </div>\n                         </div>\n                     </div>\n                        <div class=\"row\">\n                         <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                             <div class=\"checkbox\">\n                              <label><input type=\"checkbox\" value=\"\">Solutions 1</label>\n                            </div>\n                             <div class=\"checkbox\">\n                              <label><input type=\"checkbox\" value=\"\">Solutions 2</label>\n                            </div>\n                             <div class=\"checkbox\">\n                              <label><input type=\"checkbox\" value=\"\">Solutions 3</label>\n                            </div>\n                         </div>\n                     </div>\n\n                    </div>\n                  </div>\n                   <div class=\"col-md-4 col-lg-4 col-sm-4 col-xs-4 form-group\" style=\"padding:4px;\">\n                       <div style=\"background-color: #fff; border: 1px solid #f1f1f1;margin: 0 2px;\">\n                            <div style=\"background-color:#e2f5fe;padding: 5px;\"><label style=\"font-weight: inherit;\">Workflows</label></div>\n                             <div class=\"row\">\n                         <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                             <input type=\"text\" class=\"form-control\" placeholder=\"Search by name\" >\n                         </div>\n                     </div>\n                            <div class=\"row\">\n                             <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                                 <div>\n                                     <span  ng-click=\"selectAllSolutions()\"   style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Select All</span>\n                                     <span  ng-click=\"deselectAllSolutions()\" style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Deselect All</span>\n                                 </div>\n                             </div>\n                         </div>\n                            <div class=\"row\">\n                             <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                                 <div class=\"checkbox\">\n                                  <label><input type=\"checkbox\" value=\"\">Solutions 1</label>\n                                </div>\n                                 <div class=\"checkbox\">\n                                  <label><input type=\"checkbox\" value=\"\">Solutions 2</label>\n                                </div>\n                                 <div class=\"checkbox\">\n                                  <label><input type=\"checkbox\" value=\"\">Solutions 3</label>\n                                </div>\n                             </div>\n                         </div>\n\n                       </div>\n                  </div>\n                   <div class=\"col-md-4 col-lg-4 col-sm-4 col-xs-4 form-group\" style=\"padding:4px;\">\n                       <div style=\"background-color: #fff; border: 1px solid #f1f1f1;margin: 0 2px;\">\n                            <div style=\"background-color:#e2f5fe;padding: 5px;\"><label style=\"font-weight: inherit;\">Queues</label></div>\n                             <div class=\"row\">\n                         <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                             <input type=\"text\" class=\"form-control\" placeholder=\"Search by name\" >\n                         </div>\n                     </div>\n                            <div class=\"row\">\n                             <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                                 <div>\n                                     <span  ng-click=\"selectAllSolutions()\"   style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Select All</span>\n                                     <span  ng-click=\"deselectAllSolutions()\" style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Deselect All</span>\n                                 </div>\n                             </div>\n                         </div>\n                            <div class=\"row\">\n                             <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding:4px;margin-bottom: 0;\">\n                                 <div class=\"checkbox\">\n                                  <label><input type=\"checkbox\" value=\"\">Solutions 1</label>\n                                </div>\n                                 <div class=\"checkbox\">\n                                  <label><input type=\"checkbox\" value=\"\">Solutions 2</label>\n                                </div>\n                                 <div class=\"checkbox\">\n                                  <label><input type=\"checkbox\" value=\"\">Solutions 3</label>\n                                </div>\n                             </div>\n                         </div>\n                       </div>\n                  </div>\n\n                </div>\n              </div>\n          </div>\n           </div>\n        <div class=\"row\">\n          <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" style=\"padding: 6px 6px 0px 20px;\">\n            <label style=\"font-weight: normal;\">Permissions</label>\n              <div class=\"pull-right\">\n                 <span  ng-click=\"selectAllPermissions()\"   style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Select All</span>\n                 <span  ng-click=\"deselectAllPermissions()\" style=\"color: #3d7bc3;font-size: 12px; margin-right: 15px;cursor: pointer;\">Deselect All</span>\n              </div>\n          </div>\n        </div>\n           <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 \" style=\"padding: 0px 20px;\">\n                <div class=\"row\">\n                    <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group\" style=\"padding: 4px;border: 1px solid #b9e2f6;background-color: #fafdff;\">\n                        <label class=\"checkbox-inline\"><input type=\"checkbox\" value=\"\">Create</label>\n                        <label class=\"checkbox-inline\"><input type=\"checkbox\" value=\"\">Read</label>\n                        <label class=\"checkbox-inline\"><input type=\"checkbox\" value=\"\">Update</label>\n                    </div>\n                </div>\n            </div>\n           </div>\n\n        <div class=\"row\">\n            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group btn-custom-group\">\n                <button class=\"btn btn-custom-create\" type=\"submit\"><img src=\"./static/uam/app/images/save_white.png\" class=\"img-responsive img-save\"> Save </button>\n                <label class=\"btn btn-custom-cancel\" ng-click=\"closeNewPolicy()\">Cancel</label>\n            </div>\n        </div>\n        </form>\n    </div>\n</div>\n"

/***/ }),
/* 117 */
/***/ (function(module, exports) {

	(function() {
		'use strict';
	    angular.module('console.userRoleServices', [])
			.service('userRoleServices', ["$state", "$q", "$http", "httpPayload", function($state,$q, $http, httpPayload) {
	             var _getUserRoles = function(sess_id) {
	
	                var req = {
	                      method: 'GET',
	                      url: 'api/userroles/',
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	
	              var _createUserRole = function(data,sessId) {
	                if(data.parentId!=undefined)
	                    var url='api/userroles/'+data.id;
	                 else
	                    var url='api/userroles/';
	
	                var req = {
	                      method: 'POST',
	                      url: url,
	                      data: data,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	              var _createSubUserRole = function(data,sessId,parentId) {
	                 var req = {
	                      method: 'POST',
	                      url: 'api/nesteduserroles/'+parentId+"/",
	                      data: data,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	              var _editUserRole = function(data,sessId) {
	
	                var req = {
	                      method: 'POST',
	                      url: 'api/updateuser/',
	                      data: data,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	
	
	
	              var _deleteUserRole = function(data,sess_id) {
	
	                var req = {
	                      method: 'DELETE',
	                      url: 'api/userroles/'+data.id,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	
	               var _saveRoleMembers = function(data,sessId) {
	                 var req = {
	                      method: 'POST',
	                      url: 'api/linkuserstorole/',
	                      data: data,
	                      headers: httpPayload.getHeader()
	                };
	
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	
	              var _addUserToRole = function(data,sessId) {
	                 var req = {
	                      method: 'POST',
	                      url: 'api/linkuserstorole/',
	                      data: data,
	                      headers: httpPayload.getHeader()
	                };
	
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	              var _deleteUserFromRole = function(data,sessId) {
	                 var req = {
	                      method: 'DELETE',
	                      url: 'api/userroles/'+data.roleId+'/users/'+data.userId,
	                      headers: httpPayload.getHeader()
	                };
	
	                var deferred = $q.defer();
	
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	              var _getUserRoleById = function(roleId ,sess_id) {
	
	                var req = {
	                      method: 'GET',
	                      url: 'api/userroles/'+roleId,
	                      headers: httpPayload.getHeader()
	                };
	                var deferred = $q.defer();
	                $http(req).success(function(data) {
	                  deferred.resolve({
	                    data: data
	                  });
	                }).error(function(data) {
	                  deferred.reject({
	                    error: data
	                  });
	                });
	
	                return deferred.promise;
	              };
	
	              var userRoleService = {
	                createUserRole:_createUserRole,
	                createSubUserRole:_createSubUserRole,
	                editUserRole:_editUserRole,
	                getUserRoles:_getUserRoles,
	                deleteUserRole:_deleteUserRole,
	                saveRoleMembers:_saveRoleMembers,
	                addUserToRole:_addUserToRole,
	                deleteUserFromRole:_deleteUserFromRole,
	                getUserRoleById:_getUserRoleById
	              };
	
	              return userRoleService;
			}]);
	})();

/***/ }),
/* 118 */
/***/ (function(module, exports) {

	(function () {
	    'use strict';
	    angular.module('console.httpPayload', [])
	        .service('httpPayload', ["$state", "$q", "$http", "jwtHelper", function ($state, $q, $http,jwtHelper) {
	            var sess_info = JSON.parse(localStorage.getItem('userInfo'));
	            var accessToken = "";
	            if(sess_info && sess_info.accesstoken)
	                accessToken = sess_info.accesstoken;
	            function validateToken(){
	                if(accessToken==""){
	                    localStorage.clear();
	                    window.location.href = "http://"+ location.host+"/logout";
	                }
	                var token_date = jwtHelper.getTokenExpirationDate(accessToken);
	                var current_date = new Date();
	                if(token_date > current_date){
	                   return true;
	                }else{
	                    localStorage.clear();
	                    window.location.href = "http://"+ location.host+"/logout";
	                }
	            }
	
	            validateToken();
	
	            var headerGet = {
	                  method: 'GET',
	                  url: '',
	                  headers: {'Authorization': accessToken}
	            };
	
	            var headerPost = {
	                  method: 'POST',
	                  url: '',
	                  headers: {'Authorization': accessToken},
	                  data:""
	            };
	
	            var headerDelete = {
	                  method: 'DELETE',
	                  url: '',
	                  headers: {'Authorization': accessToken},
	                  data:""
	            };
	
	            var _fetchGetHeader = function(url){
	                headerGet.url = url;
	                return headerGet;
	            }
	
	            var _fetchPostHeader = function(url,obj){
	                headerPost.url = url;
	                headerPost.data = obj;
	                return headerPost;
	            }
	
	            var _fetchDeleteHeader = function(){
	                return headerDelete;
	            }
	
	            var _getHeader = function(){
	                   if(validateToken())
	                     return {'Authorization': accessToken};
	                   else{
	                     localStorage.clear();
	                     window.location.href = "http://"+ location.host+"/logout";
	                   }
	
	
	
	            }
	
	            var httpPayload = {
	                fetchGetHeader: _fetchGetHeader,
	                fetchPostHeader: _fetchPostHeader,
	                fetchDeleteHeader: _fetchDeleteHeader,
	                getHeader:_getHeader
	            };
	
	            return httpPayload;
	        }]);
	})();

/***/ }),
/* 119 */
/***/ (function(module, exports) {

	(function() {
		'use strict';
		module.exports = ['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	
			//$urlRouterProvider.otherwise('/app/product/list');
			$urlRouterProvider.otherwise('/login');
			$urlRouterProvider.otherwise(function($injector, $location){
	           var state = $injector.get('$state');
	           var loginData = JSON.parse(localStorage.getItem('userInfo'));
	           if(loginData == null || loginData == undefined){
	                   state.go('login');
	           }
	           else{
	             if(loginData.role == 'sa'){
	                state.go('app.solution');
	             }
	             else{
	              window.location.href = "http://"+ location.host+"/";
	             }
	           }
	
	        });
	
			$stateProvider.state('/', {
				url: '/',
				abstract: true
			});
		}];
	})();

/***/ })
]);
//# sourceMappingURL=app.js.map