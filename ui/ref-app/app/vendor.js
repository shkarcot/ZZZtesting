module.exports = function () {
  'use strict';

    require('./styles.scss');

  global.$ = global.jQuery = require('jquery');
  require('angular');
  require('angular-ui-router');
  require('ng-lodash') ;
  require('bootstrap');
  require('angular-utils-pagination');
  require('ng-dialog');
  require('angularjs-slider');
  require('ng-file-upload');
  require('angular-loading-bar');
  require('ng-dialog');
  require('uikit');
  require('uikit/dist/js/uikit.min.js');
  require('uikit/dist/js/components/notify.min.js');
  require('jsonformatter');
  require('jsonformatter/dist/json-formatter.js');
  require('angular-ui-tree');
  require('angular-jwt');

  //require('angular-tree-control');
};

