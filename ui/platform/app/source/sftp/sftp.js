'use strict';

/**
 * @ngdoc function
 * @name platformConsoleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the platformConsoleApp
 */
angular.module('console.source')
  .config(function($provide) {
      $provide.decorator('$state', function($delegate, $stateParams) {
          $delegate.forceReload = function() {
              return $delegate.go($delegate.current, $stateParams, {
                  reload: true,
                  inherit: false,
                  notify: true
              });
          };
          return $delegate;
      });
  })
  .controller('sftpController', function ($scope,$state,$rootScope,$location) {
      var vm = this;
      vm.loginData = JSON.parse(localStorage.getItem('userInfo'));
      $scope.ingestSftp = function(){

        document.getElementById("ingestsftp").style.width = "40%";
        var sidebarOverlay  = document.getElementsByClassName('sidebar-overlay')[0];
        sidebarOverlay.style.left = '0';

      }

      $scope.cancelSftp = function(){
        document.getElementById("ingestsftp").style.width = "0%";
        var sidebarOverlay  = document.getElementsByClassName('sidebar-overlay')[0];
        sidebarOverlay.style.left = '-100%';
      };
      $scope.openRundetails = function () {
          document.getElementById("runDetails").style.width = "50%"
      }
       $scope.closeRundetails = function () {
          document.getElementById("runDetails").style.width = "0%"
      }

  });
