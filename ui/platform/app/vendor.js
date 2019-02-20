module.exports = function () {
  'use strict';

  require('./styles.scss');

  global.$ = global.jQuery = require('jquery');
  require('angular');
  require('angular-ui-router');
  require('ng-lodash') ;
  require('bootstrap');

  require('angular-bootstrap');
  require('angular-utils-pagination');
  require('ng-file-upload');
  require('ng-dialog');
  require('uikit');
  require('uikit/dist/js/uikit.min.js');
  require('uikit/dist/js/components/notify.min.js');
  require('angular-loading-bar');
  require('angularjs-slider');
  require('angular-bootstrap-multiselect');
  //require('ui-bootstrap');
  //require('angular-sanitize');
  //require('angular-filter');
  //require('ui-bootstrap/index.js');
  //require('ui-bootstrap/app/components/ui-accordian.js');
  //require('ui-bootstrap/ember-cli-build.js');
  require('angular-ui-bootstrap');
  require('ng-tags-input');
  require('angular-resizable');
  require('angular-bootstrap-toggle-switch');


  require('jquery-match-height');
  require('angular-ui-tree');
  //['ui.bootstrap','ngSanitize','angular.filter']
  require('jsonformatter');
  require('jsonformatter/dist/json-formatter.js');

  require('lodash');
  require('angular-jwt');


//require('./custom-modeler');


/*
require('min-dom');
require('jquery-ui-dist/jquery-ui.js');
require('bpmn-js/lib/Viewer');
require('bpmn-js/lib/Modeler');
require('bpmn-js');
*/

    require('json-loader');
    require('bpmn-js');
    require('camunda-bpmn-moddle');
    require('bpmn-js-properties-panel');
    require('diagram-js');
    require('bpmn-moddle');


  //require('angular-tree-control');
};


