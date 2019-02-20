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