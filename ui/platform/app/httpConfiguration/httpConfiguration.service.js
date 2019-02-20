(function () {
    'use strict';
    angular.module('console.httpPayload', [])
        .service('httpPayload', function ($state, $q, $http,jwtHelper) {
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
        });
})();