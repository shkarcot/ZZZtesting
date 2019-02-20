(function() {

	'use strict';

	require('./vendor')();
	require('./login/login.module.js');
	require('./login/services/loginService.js');
    require('./solution/solution.module.js');
	require('./solution/solution.service.js');
	require('./layout/layout.module.js');
	require('./users/user.module.js');
	require('./users/createUser/createUser.module.js');
	require('./users/user.service.js');
	require('./userGroups/userGroup.module.js');
	require('./userGroups/userGroup.service.js');
	require('./createSolution/create.module.js');
    require('./queue/queue.module.js');
    require('./queue/queue.service.js');

    require('./userRoles/userRole.module.js');
	require('./userRoles/userRole.service.js');
	require('./httpConfiguration/httpConfiguration.service.js');



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

		.run(function($http,jwtHelper) {
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

		})
		.config(require('./app.config.js'))
		.config(function($interpolateProvider){
           $interpolateProvider.startSymbol('{$');
           $interpolateProvider.endSymbol('$}');
        });

})();