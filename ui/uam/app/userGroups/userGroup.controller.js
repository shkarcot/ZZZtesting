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