module.exports = function () {
  'use strict';

  require('./styles.scss');

  global.$ = global.jQuery = require('jquery');
  require('angular');
  require('angular-ui-router');
  require('ng-lodash') ;
  require('bootstrap');
  require('ng-file-upload');
  require('ng-dialog');
  require('uikit');
  require('angular-resizable');
  require('angular-loading-bar');
  require('angular-bootstrap-multiselect');
  require('uikit/dist/js/uikit.min.js');
  require('uikit/dist/js/components/notify.min.js');
  require('ng-tags-input');
  require('angular-ui-tree');
  require('angular-jwt');


  //require('angular-tree-control');
};

