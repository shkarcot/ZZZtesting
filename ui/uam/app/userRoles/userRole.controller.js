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