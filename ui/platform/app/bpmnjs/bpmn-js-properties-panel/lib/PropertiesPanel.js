'use strict';

var domify = require('min-dom/lib/domify'),
    domQuery = require('min-dom/lib/query'),
    domRemove = require('min-dom/lib/remove'),
    domClasses = require('min-dom/lib/classes'),
    domClosest = require('min-dom/lib/closest'),
    domAttr = require('min-dom/lib/attr'),
    domDelegate = require('min-dom/lib/delegate'),
    domMatches = require('min-dom/lib/matches');

var forEach = require('lodash/collection/forEach'),
    filter = require('lodash/collection/filter'),
    get = require('lodash/object/get'),
    keys = require('lodash/object/keys'),
    isEmpty = require('lodash/lang/isEmpty'),
    isArray = require('lodash/lang/isArray'),
    xor = require('lodash/array/xor'),
    debounce = require('lodash/function/debounce');

var updateSelection = require('selection-update');

var scrollTabs = require('scroll-tabs');

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

var HIDE_CLASS = 'bpp-hidden';
var DEBOUNCE_DELAY = 300;


function isToggle(node) {
  return node.type === 'checkbox' || node.type === 'radio';
}

function isSelect(node) {
  return node.type === 'select-one';
}

function isContentEditable(node) {
  return domAttr(node, 'contenteditable');
}

function getPropertyPlaceholders(node) {
  var selector = 'input[name], textarea[name], [data-value], [contenteditable]';
  var placeholders = domQuery.all(selector, node);
  if ((!placeholders || !placeholders.length) && domMatches(node, selector)) {
    placeholders = [ node ];
  }
  return placeholders;
}

/**
 * Return all active form controls.
 * This excludes the invisible controls unless all is true
 *
 * @param {Element} node
 * @param {Boolean} [all=false]
 */
function getFormControls(node, all) {
  var controls = domQuery.all('input[name], textarea[name], select[name], [contenteditable]', node);

  if (!controls || !controls.length) {
    controls = domMatches(node, 'option') ? [ node ] : controls;
  }

  if (!all) {
    controls = filter(controls, function(node) {
      return !domClosest(node, '.' + HIDE_CLASS);
    });
  }

  return controls;
}

function getFormControlValuesInScope(entryNode) {
  var values = {};

  var controlNodes = getFormControls(entryNode);

  forEach(controlNodes, function(controlNode) {
    var value = controlNode.value;

    var name = domAttr(controlNode, 'name') || domAttr(controlNode, 'data-name');

    // take toggle state into account for radio / checkboxes
    if (isToggle(controlNode)) {
      if (controlNode.checked) {
        if (!domAttr(controlNode, 'value')) {
          value = true;
        } else {
          value = controlNode.value;
        }
      } else {
        value = null;
      }
    } else
    if (isContentEditable(controlNode)) {
      value = controlNode.innerText;
    }

    if (value !== null) {
      // return the actual value
      // handle serialization in entry provider
      // (ie. if empty string should be serialized or not)
      values[name] = value;
    }
  });

  return values;

}

/**
 * Extract input values from entry node
 *
 * @param  {DOMElement} entryNode
 * @returns {Object}
 */
function getFormControlValues(entryNode) {

  var values;

  var listContainer = domQuery('[data-list-entry-container]', entryNode);
  if (listContainer) {
    values = [];
    var listNodes = listContainer.children || [];
    forEach(listNodes, function(listNode) {
      values.push(getFormControlValuesInScope(listNode));
    });
  } else {
    values = getFormControlValuesInScope(entryNode);
  }

  return values;
}

/**
 * Return true if the given form extracted value equals
 * to an old cached version.
 *
 * @param {Object} value
 * @param {Object} oldValue
 * @return {Boolean}
 */
function valueEqual(value, oldValue) {

  if (value && !oldValue) {
    return false;
  }

  var allKeys = keys(value).concat(keys(oldValue));

  return allKeys.every(function(key) {
    return value[key] === oldValue[key];
  });
}

/**
 * Return true if the given form extracted value(s)
 * equal an old cached version.
 *
 * @param {Array<Object>|Object} values
 * @param {Array<Object>|Object} oldValues
 * @return {Boolean}
 */
function valuesEqual(values, oldValues) {

  if (isArray(values)) {

    if (values.length !== oldValues.length) {
      return false;
    }

    return values.every(function(v, idx) {
      return valueEqual(v, oldValues[idx]);
    });
  }

  return valueEqual(values, oldValues);
}

/**
 * Return a mapping of { id: entry } for all entries in the given groups in the given tabs.
 *
 * @param {Object} tabs
 * @return {Object}
 */
function extractEntries(tabs) {
  return indexBy(flattenDeep(map(flattenDeep(map(tabs, 'groups')), 'entries')), 'id');
}

/**
 * Return a mapping of { id: group } for all groups in the given tabs.
 *
 * @param {Object} tabs
 * @return {Object}
 */
function extractGroups(tabs) {
  return indexBy(flattenDeep(map(tabs, 'groups')), 'id');
}

/**
 * A properties panel implementation.
 *
 * To use it provide a `propertiesProvider` component that knows
 * about which properties to display.
 *
 * Properties edit state / visibility can be intercepted
 * via a custom {@link PropertiesActivator}.
 *
 * @class
 * @constructor
 *
 * @param {Object} config
 * @param {EventBus} eventBus
 * @param {Modeling} modeling
 * @param {PropertiesProvider} propertiesProvider
 * @param {Canvas} canvas
 * @param {CommandStack} commandStack
 */
function PropertiesPanel(config, eventBus, modeling, propertiesProvider, commandStack, canvas) {

  this._eventBus = eventBus;
  this._modeling = modeling;
  this._commandStack = commandStack;
  this._canvas = canvas;
  this._propertiesProvider = propertiesProvider;

  this._init(config);
}

PropertiesPanel.$inject = [
  'config.propertiesPanel',
  'eventBus',
  'modeling',
  'propertiesProvider',
  'commandStack',
  'canvas'
];

module.exports = PropertiesPanel;


PropertiesPanel.prototype._init = function(config) {

  var eventBus = this._eventBus;

  var self = this;

  /**
   * Select the root element once it is added to the canvas
   */
  eventBus.on('root.added', function(e) {
    self.update(e.element);
  });

  eventBus.on('selection.changed', function(e) {
    var newElement = e.newSelection[0];

    self.update(newElement);
  });

  // add / update tab-bar scrolling
  eventBus.on([
    'propertiesPanel.changed',
    'propertiesPanel.resized'
  ], function(event) {

    var tabBarNode = domQuery('.bpp-properties-tab-bar', self._container);

    if (!tabBarNode) {
      return;
    }

    var scroller = scrollTabs.get(tabBarNode);

    if (!scroller) {

      // we did not initialize yet, do that
      // now and make sure we select the active
      // tab on scroll update
      scroller = scrollTabs(tabBarNode, {
        selectors: {
          tabsContainer: '.bpp-properties-tabs-links',
          tab: '.bpp-properties-tabs-links li',
          ignore: '.bpp-hidden',
          active: '.bpp-active'
        }
      });


      scroller.on('scroll', function(newActiveNode, oldActiveNode, direction) {

        var linkNode = domQuery('[data-tab-target]', newActiveNode);

        var tabId = domAttr(linkNode, 'data-tab-target');

        self.activateTab(tabId);
      });
    }

    // react on tab changes and or tabContainer resize
    // and make sure the active tab is shown completely
    scroller.update();
  });

  eventBus.on('elements.changed', function(e) {

    var current = self._current;
    var element = current && current.element;

    if (element) {
      if (e.elements.indexOf(element) !== -1) {
        self.update(element);
      }
    }
  });

  eventBus.on('elementTemplates.changed', function() {
    var current = self._current;
    var element = current && current.element;

    if (element) {
      self.update(element);
    }
  });

  eventBus.on('diagram.destroy', function() {
    self.detach();
  });

  this._container = domify('<div class="bpp-properties-panel"></div>');

  this._bindListeners(this._container);

  if (config && config.parent) {
    this.attachTo(config.parent);
  }
};


PropertiesPanel.prototype.attachTo = function(parentNode) {

  if (!parentNode) {
    throw new Error('parentNode required');
  }

  // ensure we detach from the
  // previous, old parent
  this.detach();

  // unwrap jQuery if provided
  if (parentNode.get && parentNode.constructor.prototype.jquery) {
    parentNode = parentNode.get(0);
  }

  if (typeof parentNode === 'string') {
    parentNode = domQuery(parentNode);
  }

  var container = this._container;

  parentNode.appendChild(container);

  this._emit('attach');
};

PropertiesPanel.prototype.detach = function() {

  var container = this._container,
      parentNode = container.parentNode;

  if (!parentNode) {
    return;
  }

  this._emit('detach');

  parentNode.removeChild(container);
};


/**
 * Select the given tab within the properties panel.
 *
 * @param {Object|String} tab
 */
PropertiesPanel.prototype.activateTab = function(tab) {

  var tabId = typeof tab === 'string' ? tab : tab.id;

  var current = this._current;

  var panelNode = current.panel;

  if(tab=="thresholds" && current.element.type== "bpmn:ServiceTask"){
    var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
    scope.$apply(function () {
          var  currentPropertyTab = scope.currentPropertyTab(tab, current.element.id);
    });
    angular.element(".bpmn-threshold").show();
  }
  else{
    angular.element(".bpmn-threshold").hide();
  }

  var allTabNodes = domQuery.all('.bpp-properties-tab', panelNode),
      allTabLinkNodes = domQuery.all('.bpp-properties-tab-link', panelNode);

  forEach(allTabNodes, function(tabNode) {

    var currentTabId = domAttr(tabNode, 'data-tab');

    domClasses(tabNode).toggle('bpp-active', tabId === currentTabId);
  });

  forEach(allTabLinkNodes, function(tabLinkNode) {

    var tabLink = domQuery('[data-tab-target]', tabLinkNode),
        currentTabId = domAttr(tabLink, 'data-tab-target');

    domClasses(tabLinkNode).toggle('bpp-active', tabId === currentTabId);
  });
};

/**
 * Update the DOM representation of the properties panel
 */
PropertiesPanel.prototype.update = function(element) {
  var current = this._current;

  // no actual selection change
  var needsCreate = true;

  if (typeof element === 'undefined') {

    // use RootElement of BPMN diagram to generate properties panel if no element is selected
    element = this._canvas.getRootElement();
  }

  var newTabs = this._propertiesProvider.getTabs(element);

  if (current && current.element === element) {
    // see if we can reuse the existing panel

    needsCreate = this._entriesChanged(current, newTabs);
  }

  if (needsCreate) {

    if (current) {

      // get active tab from the existing panel before remove it
      var activeTabNode = domQuery('.bpp-properties-tab.bpp-active', current.panel);

      var activeTabId;
      if (activeTabNode) {
        activeTabId = domAttr(activeTabNode, 'data-tab');
      }

      // remove old panel
      domRemove(current.panel);
    }

    this._current = this._create(element, newTabs);

    // activate the saved active tab from the remove panel or the first tab
    (activeTabId) ? this.activateTab(activeTabId) : this.activateTab(this._current.tabs[0]);

  }

  if (this._current) {
    // make sure correct tab contents are visible
    this._updateActivation(this._current);

  }

  this._emit('changed');
};


/**
 * Returns true if one of two groups has different entries than the other.
 *
 * @param  {Object} current
 * @param  {Object} newTabs
 * @return {Booelan}
 */
PropertiesPanel.prototype._entriesChanged = function(current, newTabs) {

  var oldEntryIds = keys(current.entries),
      newEntryIds = keys(extractEntries(newTabs));

  return !isEmpty(xor(oldEntryIds, newEntryIds));
};

PropertiesPanel.prototype._emit = function(event) {
  this._eventBus.fire('propertiesPanel.' + event, { panel: this, current: this._current });
};

PropertiesPanel.prototype._bindListeners = function(container) {

  var self = this;

  // handles a change for a given event
  var handleChange = function handleChange(event) {

    // see if we handle a change inside a [data-entry] element.
    // if not, drop out
    var node = domClosest(event.delegateTarget, '[data-entry]'),
        entryId, entry;

    // change from outside a [data-entry] element, simply ignore
    if (!node) {
      return;
    }

    entryId = domAttr(node, 'data-entry');
    entry = self.getEntry(entryId);

    var values = getFormControlValues(node);

    if (event.type === 'change') {

      // - if the "data-on-change" attribute is present and a value is changed,
      //   then the associated action is performed.
      // - if the associated action returns "true" then an update to the business
      //   object is done
      // - if it does not return "true", then only the DOM content is updated
      var onChangeAction = event.delegateTarget.getAttribute('data-on-change');

      if (onChangeAction) {
        var isEntryDirty = self.executeAction(entry, node, onChangeAction, event);

        if (!isEntryDirty) {
          return self.update(self._current.element);
        }
      }
    }
    self.applyChanges(entry, values, node);
    self.updateState(entry, node);
  };

  // debounce update only elements that are target of key events,
  // i.e. INPUT and TEXTAREA. SELECTs will trigger an immediate update anyway.
  domDelegate.bind(container, 'input, textarea, [contenteditable]', 'input', debounce(handleChange, DEBOUNCE_DELAY));
  domDelegate.bind(container, 'input, textarea, select, [contenteditable]', 'change', handleChange);

  domDelegate.bind(container, '[data-action]', 'click', function onClick(event) {

    // triggers on all inputs
    var inputNode = event.delegateTarget;
    var entryNode = domClosest(inputNode, '[data-entry]');

    var actionId = domAttr(inputNode, 'data-action'),
        entryId = domAttr(entryNode, 'data-entry');

    var entry = self.getEntry(entryId);

    var isEntryDirty = self.executeAction(entry, entryNode, actionId, event);

    if (isEntryDirty) {
      var values = getFormControlValues(entryNode);

      self.applyChanges(entry, values, entryNode);
    }

    self.updateState(entry, entryNode);
  });

  function handleInput(event, element) {
    // triggers on all inputs
    var inputNode = event.delegateTarget;

    var entryNode = domClosest(inputNode, '[data-entry]');

    // only work on data entries
    if (!entryNode) {
      return;
    }

    var eventHandlerId = domAttr(inputNode, 'data-blur'),
        entryId = domAttr(entryNode, 'data-entry');

    var entry = self.getEntry(entryId);

    var isEntryDirty = self.executeAction(entry, entryNode, eventHandlerId, event);

    if (isEntryDirty) {
      var values = getFormControlValues(entryNode);

      self.applyChanges(entry, values, entryNode);
    }

    self.updateState(entry, entryNode);
  }

  domDelegate.bind(container, '[data-blur]', 'blur', handleInput, true);

  // make tab links interactive
  domDelegate.bind(container, '.bpp-properties-tabs-links [data-tab-target]', 'click', function(event) {
    event.preventDefault();

    var delegateTarget = event.delegateTarget;

    var tabId = domAttr(delegateTarget, 'data-tab-target');

    // activate tab on link click
    self.activateTab(tabId);
  });

};

PropertiesPanel.prototype.updateState = function(entry, entryNode) {
  this.updateShow(entry, entryNode);
  this.updateDisable(entry, entryNode);
};

/**
 * Update the visibility of the entry node in the DOM
 */
PropertiesPanel.prototype.updateShow = function(entry, node) {

  var current = this._current;

  if (!current) {
    return;
  }

  var showNodes = domQuery.all('[data-show]', node) || [];

  forEach(showNodes, function(showNode) {

    var expr = domAttr(showNode, 'data-show');
    var fn = get(entry, expr);
    if (fn) {
      var scope = domClosest(showNode, '[data-scope]') || node;
      var shouldShow = fn(current.element, node, showNode, scope) || false;
      if (shouldShow) {
        domClasses(showNode).remove(HIDE_CLASS);
      } else {
        domClasses(showNode).add(HIDE_CLASS);
      }
    }
  });
};

/**
 * Evaluates a given function. If it returns true, then the
 * node is marked as "disabled".
 */
PropertiesPanel.prototype.updateDisable = function(entry, node) {
  var current = this._current;

  if (!current) {
    return;
  }

  var nodes = domQuery.all('[data-disable]', node) || [];

  forEach(nodes, function(currentNode) {
    var expr = domAttr(currentNode, 'data-disable');
    var fn = get(entry, expr);
    if (fn) {
      var scope = domClosest(currentNode, '[data-scope]') || node;
      var shouldDisable = fn(current.element, node, currentNode, scope) || false;
      domAttr(currentNode, 'disabled', shouldDisable ? '' : null);
    }
  });
};

PropertiesPanel.prototype.executeAction = function(entry, entryNode, actionId, event) {
  var current = this._current;

  if (!current) {
    return;
  }

  var fn = get(entry, actionId);
  if (fn) {
    var scopeNode = domClosest(event.target, '[data-scope]') || entryNode;
    return fn.apply(entry, [ current.element, entryNode, event, scopeNode ]);
  }
};

/**
 * Apply changes to the business object by executing a command
 */
PropertiesPanel.prototype.applyChanges = function(entry, values, containerElement) {

  var element = this._current.element;

  // ensure we only update the model if we got dirty changes
  if (valuesEqual(values, entry.oldValues)) {
    return;
  }

  var command = entry.set(element, values, containerElement);

  var commandToExecute;

  if (isArray(command)) {
    if (command.length) {
      commandToExecute = {
        cmd: 'properties-panel.multi-command-executor',
        context: flattenDeep(command)
      };
    }
  } else {
    commandToExecute = command;
  }

  if (commandToExecute) {
    this._commandStack.execute(commandToExecute.cmd, commandToExecute.context || { element : element });
  } else {
    this.update(element);
  }
};


/**
 * apply validation errors in the DOM and show or remove an error message near the entry node.
 */
PropertiesPanel.prototype.applyValidationErrors = function(validationErrors, entryNode) {

  var valid = true;

  var controlNodes = getFormControls(entryNode, true);

  forEach(controlNodes, function(controlNode) {

    var name = domAttr(controlNode, 'name') || domAttr(controlNode, 'data-name');

    var error = validationErrors && validationErrors[name];

    var errorMessageNode = domQuery('.bpp-error-message', controlNode.parentNode);

    if (error) {
      valid = false;

      if (!errorMessageNode) {
        errorMessageNode = domify('<div></div>');

        domClasses(errorMessageNode).add('bpp-error-message');

        // insert errorMessageNode after controlNode
        controlNode.parentNode.insertBefore(errorMessageNode, controlNode.nextSibling);
      }

      errorMessageNode.innerHTML = error;

      domClasses(controlNode).add('invalid');
    } else {
      domClasses(controlNode).remove('invalid');

      if (errorMessageNode) {
        controlNode.parentNode.removeChild(errorMessageNode);
      }
    }
  });

  return valid;
};


/**
 * Check if the entry contains valid input
 */
PropertiesPanel.prototype.validate = function(entry, values, entryNode) {
  var self = this;

  var current = this._current;

  var valid = true;

  entryNode = entryNode || domQuery('[data-entry="' + entry.id + '"]', current.panel);

  if (values instanceof Array) {
    var listContainer = domQuery('[data-list-entry-container]', entryNode),
        listEntryNodes = listContainer.children || [];

    // create new elements
    for (var i = 0; i < values.length; i++) {
      var listValue = values[i];

      if (entry.validateListItem) {

        var validationErrors = entry.validateListItem(current.element, listValue, entryNode, i),
            listEntryNode = listEntryNodes[i];

        valid = self.applyValidationErrors(validationErrors, listEntryNode) && valid;
      }
    }
  } else {
    if (entry.validate) {
      this.validationErrors = entry.validate(current.element, values, entryNode);

      valid = self.applyValidationErrors(this.validationErrors, entryNode) && valid;
    }
  }

  return valid;
};

PropertiesPanel.prototype.getEntry = function(id) {
  return this._current && this._current.entries[id];
};

var flattenDeep = require('lodash/array/flattenDeep'),
    indexBy = require('lodash/collection/indexBy'),
    map = require('lodash/collection/map');

PropertiesPanel.prototype._create = function(element, tabs) {

  if (!element) {
    return null;
  }

  var containerNode = this._container;

  var panelNode = this._createPanel(element, tabs);

  containerNode.appendChild(panelNode);

  var entries = extractEntries(tabs);
  var groups = extractGroups(tabs);

  return {
    tabs: tabs,
    groups: groups,
    entries: entries,
    element: element,
    panel: panelNode
  };
};

/**
 * Update variable parts of the entry node on element changes.
 *
 * @param {djs.model.Base} element
 * @param {EntryDescriptor} entry
 * @param {Object} values
 * @param {HTMLElement} entryNode
 * @param {Number} idx
 */
PropertiesPanel.prototype._bindTemplate = function(element, entry, values, entryNode, idx) {

  var eventBus = this._eventBus;

  function isPropertyEditable(entry, propertyName) {
    return eventBus.fire('propertiesPanel.isPropertyEditable', {
      entry: entry,
      propertyName: propertyName,
      element: element
    });
  }

  var inputNodes = getPropertyPlaceholders(entryNode);

  forEach(inputNodes, function(node) {
    var name,
        newValue,
        editable;

    // we deal with an input element
    if ('value' in node || isContentEditable(node) === 'true') {
      name = domAttr(node, 'name') || domAttr(node, 'data-name');
      newValue = values[name];

      editable = isPropertyEditable(entry, name);
      if (editable && entry.editable) {
        editable = entry.editable(element, entryNode, node, name, newValue, idx);
      }

      domAttr(node, 'readonly', editable ? null : '');
      domAttr(node, 'disabled', editable ? null : '');

      // take full control over setting the value
      // and possibly updating the input in entry#setControlValue
      if (entry.setControlValue) {
        entry.setControlValue(element, entryNode, node, name, newValue, idx);
      } else if (isToggle(node)) {
        setToggleValue(node, newValue);
      } else if (isSelect(node)) {
        setSelectValue(node, newValue);
      } else {
        setInputValue(node, newValue);
      }
    }

    // we deal with some non-editable html element
    else {
      name = domAttr(node, 'data-value');
      newValue = values[name];
      if (entry.setControlValue) {
        entry.setControlValue(element, entryNode, node, name, newValue, idx);
      } else {
        setTextValue(node, newValue);
      }
    }
  });
};

// TODO(nikku): WTF freaking name? Change / clarify.
PropertiesPanel.prototype._updateActivation = function(current) {
  var self = this;

  var eventBus = this._eventBus;

  var element = current.element;

  function isEntryVisible(entry) {
    return eventBus.fire('propertiesPanel.isEntryVisible', {
      entry: entry,
      element: element
    });
  }

  function isGroupVisible(group, element, groupNode) {
    if (typeof group.enabled === 'function') {
      return group.enabled(element, groupNode);
    } else {
      return true;
    }
  }

  function isTabVisible(tab, element) {
    if (typeof tab.enabled === 'function') {
      return tab.enabled(element);
    } else {
      return true;
    }
  }

  function toggleVisible(node, visible) {
    domClasses(node).toggle(HIDE_CLASS, !visible);
  }

  // check whether the active tab is visible
  // if not: set the first tab as active tab
  function checkActiveTabVisibility(node, visible) {
    var isActive = domClasses(node).has('bpp-active');
    if (!visible && isActive) {
      self.activateTab(current.tabs[0]);
    }
  }

  function updateLabel(element, selector, text) {
    var labelNode = domQuery(selector, element);

    if (!labelNode) {
      return;
    }

    labelNode.textContent = text;
  }

  var panelNode = current.panel;

  forEach(current.tabs, function(tab) {

    var tabNode = domQuery('[data-tab=' + tab.id + ']', panelNode);
    var tabLinkNode = domQuery('[data-tab-target=' + tab.id + ']', panelNode).parentNode;

    var tabVisible = false;

    forEach(tab.groups, function(group) {

      var groupVisible = false;

      var groupNode = domQuery('[data-group=' + group.id + ']', tabNode);

      forEach(group.entries, function(entry) {

        var entryNode = domQuery('[data-entry="' + entry.id + '"]', groupNode);

        var entryVisible = isEntryVisible(entry);

        groupVisible = groupVisible || entryVisible;

        toggleVisible(entryNode, entryVisible);

        var values = 'get' in entry ? entry.get(element, entryNode) : {};

        if (values instanceof Array) {
          var listEntryContainer = domQuery('[data-list-entry-container]', entryNode);
          var existingElements = listEntryContainer.children || [];

          for (var i = 0; i < values.length; i++) {
            var listValue = values[i];
            var listItemNode = existingElements[i];
            if (!listItemNode) {
              listItemNode = domify(entry.createListEntryTemplate(listValue, i, listEntryContainer));
              listEntryContainer.appendChild(listItemNode);
            }
            domAttr(listItemNode, 'data-index', i);

            self._bindTemplate(element, entry, listValue, listItemNode, i);
          }

          var entriesToRemove = existingElements.length - values.length;

          for (var j = 0; j < entriesToRemove; j++) {
            // remove orphaned element
            listEntryContainer.removeChild(listEntryContainer.lastChild);
          }

        } else {
          self._bindTemplate(element, entry, values, entryNode);
        }

        // update conditionally visible elements
        self.updateState(entry, entryNode);
        self.validate(entry, values, entryNode);

        // remember initial state for later dirty checking
        entry.oldValues = getFormControlValues(entryNode);
      });

      if (typeof group.label === 'function') {
        updateLabel(groupNode, '.group-label', group.label(element, groupNode));
      }

      groupVisible = groupVisible && isGroupVisible(group, element, groupNode);

      tabVisible = tabVisible || groupVisible;

      toggleVisible(groupNode, groupVisible);
    });

    tabVisible = tabVisible && isTabVisible(tab, element);

    toggleVisible(tabNode, tabVisible);
    toggleVisible(tabLinkNode, tabVisible);

    checkActiveTabVisibility(tabNode, tabVisible);
  });

  // inject elements id into header
  updateLabel(panelNode, '[data-label-id]', getBusinessObject(element).id || '');
};

PropertiesPanel.prototype._createPanel = function(element, tabs) {
  var self = this;
  var servicesForServiceTask=[];
  var serviceUrisForGeneric=[];
  var serviceUrisForManualReview=[];
  var serviceTopics=[];
  var selectedServiceItem = "";
  var sltdConditionExpression='';
  var sltdSequenceFlowValue="";
  var serviceTaskMapedName="";

  var enteredConditionExpression="";
    /******************************************************************************************custom code*****************/
  if(element.type=="bpmn:ServiceTask"){
    element.businessObject.type="external";

    if(element.businessObject.name==undefined)
        element.businessObject.name="";

    if(element.businessObject.topic==undefined)
        element.businessObject.topic="";

    var uriValue=element.businessObject.uriId!=undefined?element.businessObject.uriId:"";

    if(element.businessObject.extensionElements!=undefined){
        if(element.businessObject.extensionElements.values[0].inputParameters[1]!=undefined)
            var manualReviewValue=element.businessObject.extensionElements.values[0].inputParameters[1].value!=undefined?element.businessObject.extensionElements.values[0].inputParameters[1].value:"";
    }else{
        var manualReviewValue="";
    }


    if(element.businessObject.extensionElements !=undefined && element.businessObject.extensionElements.values[0].inputParameters!=undefined && element.businessObject.extensionElements.values[0].inputParameters.length>1){

        forEach(element.businessObject.extensionElements.values[0].inputParameters, function(value, index) {
            if(value.name=="endpoint_uri"){
                uriValue =value.value;
            }
            if(value.name=="review_id"){
                manualReviewValue =value.value;
            }
        });
    }

    var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
    scope.$apply(function () {
        if(element.businessObject.type=="external"){
            servicesForServiceTask = scope.getServicesForServiceTask(element.businessObject.topic);
            serviceUrisForGeneric = scope.getServiceUrisForGeneric(uriValue);
            serviceUrisForManualReview=scope.getServiceUrisForManualReview(element.id, manualReviewValue);
            selectedServiceItem = scope.getSelectedServiceItem(element.businessObject.topic);
        }else{
            servicesForServiceTask = scope.getServicesForServiceTask(element.businessObject.topic);
            serviceUrisForGeneric = scope.getServiceUrisForGeneric(uriValue);
            serviceUrisForManualReview=scope.getServiceUrisForManualReview(element.id,manualReviewValue);
            selectedServiceItem = scope.getSelectedServiceItem(element.businessObject.topic);
        }
        //serviceTopics = scope.getServiceTopicsForServiceTask(element.businessObject.topic);

    });

  }
  else if(element.type=="bpmn:ScriptTask"){

    var showScriptTaskConditionType={"txtbox":"display:none","txtareabox":"display:black;"};
    var scriptTaskOptions="";
    var scriptTaskFormats="";
    var scriptTask_enteredConditionScript="";
    var scriptTask_enteredConditionExpression="";

    if(element.businessObject.resultVariable==undefined)
        element.businessObject.resultVariable= "";

    if(element.businessObject.scriptFormat!=undefined){
        var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
        scope.$apply(function () {
            scriptTaskFormats=scope.getScriptTaskFormats(element.businessObject.scriptFormat, element.id);
         });
    }
    else{
        element.businessObject.scriptFormat="javascript";

        if(element.businessObject.script==undefined)
            element.businessObject.script="";

        var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
        scope.$apply(function () {
            scriptTaskFormats=scope.getScriptTaskFormats(element.businessObject.scriptFormat, element.id);
        });
    };

    if(element.businessObject.hasOwnProperty('resource')){
        var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
        scope.$apply(function () {
            scriptTaskOptions=scope.getScriptTaskOptions('ExternalResource', element.id);
            showScriptTaskConditionType={"txtbox":"display:black","txtareabox":"display:none;"};
             scriptTask_enteredConditionExpression=element.businessObject.resource;
        });
    }else{

        if(element.businessObject.script==undefined)
            element.businessObject.script="";

        var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
        scope.$apply(function () {
            scriptTaskOptions=scope.getScriptTaskOptions('InlineScript', element.id);
            showScriptTaskConditionType={"txtbox":"display:none","txtareabox":"display:black;"};
            scriptTask_enteredConditionScript=element.businessObject.script;
        });
    };

  };

  /* code change for uinque task name starts here */

  /*if(element.type=="bpmn:ScriptTask" || element.type=="bpmn:ServiceTask" || element.type=="bpmn:UserTask" || element.type=="bpmn:SequenceFlow"){
     var mappingId="";
    var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
        scope.$apply(function () {
        mappingId = scope.setTaskIdForMapping(element.id,element.businessObject.name);
    });

    console.log("mappingId==>>>", mappingId);
  }*/

  /* code change for uinque task name ends here */

  if(element.type=="bpmn:SequenceFlow" && element.businessObject.sourceRef.$type=="bpmn:ExclusiveGateway"){
    if(element.businessObject.conditionExpression!=undefined){
        enteredConditionExpression=element.businessObject.conditionExpression.body;
    }
    else{
        var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
        scope.$apply(function () {
            enteredConditionExpression=scope.sequenceFlowGetValue(element.id);
        });
    }
  };


  if(element.type=="bpmn:EndEvent"){
    var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
    scope.$apply(function () {
        scope.setCamundaClassForEndTask(element.id);
    });
  }

  var panelNode = domify('<div class="bpp-properties"></div>'),
      headerNode = domify('<div class="bpp-properties-header hide">' +
        '<div class="label" data-label-id></div>' +
        '<div class="search">' +
          '<input type="search" placeholder="Search for property" />' +
          '<button><span>Search</span></button>' +
        '</div>' +
      '</div>'),
      tabBarNode = domify('<div class="bpp-properties-tab-bar"></div>'),
      tabLinksNode = domify('<ul class="bpp-properties-tabs-links"></ul>'),
      tabContainerNode = domify('<div class="bpp-properties-tabs-container"></div>');

  panelNode.appendChild(headerNode);

  forEach(tabs, function(tab, tabIndex) {

    if (!tab.id) {
      throw new Error('tab must have an id');
    }

    var tabNode = domify('<div class="bpp-properties-tab" data-tab="' + tab.id + '"></div>'),
        tabLinkNode = domify('<li class="bpp-properties-tab-link">' +
          '<a href data-tab-target="' + tab.id + '">' + tab.label + '</a>' +
        '</li>');

    var groups = tab.groups;

    forEach(groups, function(group) {

      if (!group.id) {
        throw new Error('group must have an id');
      }
      /*****************************Customised the code starts here******************************************************/
        // TODO: Hiding all label groups except name label group

       var display="display:none";
       if(selectedServiceItem=="User Review"){
            display="display:black";
        }


      if(group.id=="general"){

        if(element.type=="bpmn:ServiceTask"){

            var groupNode = domify('<div class="bpp-properties-group" data-group="' + group.id + '">' +
              '<span class="group-toggle"></span>' +
              /*'<span class="group-label">' + group.label + '</span>' +*/

                '<div class="servicetask-div"><label class="servicetask-lable" for="camunda-services">Services</label>'+
                '<select class="servicetask-services" id="services-'+element.id+'">'+
                '<option value="">Select</option>' + servicesForServiceTask + '</select></div>'+

                 '<div class="servicetask-div" id="manualtaskuris-'+element.id+'" style="'+display+'">'+
                 '<label class="servicetask-lable" for="camunda-manualtaskuris">Type</label>'+
                 '<select class="servicetask-manualreview" id="manualreview-'+element.id+'">'+
                 '<option value="">Select</option>' + serviceUrisForManualReview + '</select></div>'+

                 /*'<div class="servicetask-div" id="servicetaskuris-'+element.id+'" style="'+display+'">'+
                 '<label class="servicetask-lable" for="camunda-servicesUris">Process Group</label>'+
                 '<select class="servicetask-uris" id="uris-'+element.id+'">'+
                 '<option value="">Select</option>' + serviceUrisForGeneric + '</select></div>'+*/

                 /*'<div class="servicetask-div"><label class="servicetask-lable" for="camunda-services">Topics</label>'+
                 '<select class="servicetask-topic" id="topic-'+element.id+'">'+
                 '<option value="">Select</option>' + serviceTopics + '</select></div>'+*/

                '</div>');

                 //setInterval(function(){ $("[data-entry=name]").hide(); }, 1000);

        }else if(element.type=="bpmn:SequenceFlow" && element.businessObject.sourceRef.$type=="bpmn:ExclusiveGateway"){//&& element.businessObject.conditionExpression!=undefined
           var groupNode = domify('<div class="bpp-properties-group" data-group="' + group.id + '">' +
                '<span class="group-toggle"></span>' +
               /* '<span class="group-label">' + group.label + '</span>' +*/
                '<div class="servicetask-div"><label class="servicetask-lable" for="camunda-services">Condition Expression</label>'+
               /* '<select class="clsSequenceFlow" id="sequenceFlow-'+element.id+'">'+
                '<option value="">Select</option>' + sltdConditionExpression + '</select>'+*/

                '<input type="text"  class="txtClsSequenceFlow" value="'+enteredConditionExpression+'" id="txtSeqFlow-'+element.id+'" /></div>'+
            '</div>');
        }
        else if(element.type=="bpmn:ScriptTask"){

              var groupNode = domify('<div class="bpp-properties-group" data-group="' + group.id + '">' +
                '<span class="group-toggle"></span>' +
               /* '<span class="group-label">' + group.label + '</span>' +*/
               '<div class="scriptTask-div"><label class="scriptTask-lable" for="camunda-services">Script Format</label>'+

                '<select class="clsScriptTaskFormats" id="script-format-'+element.id+'">' + scriptTaskFormats + '</select>'+

                '<div class="scriptTask-div sf-space"><label class="scriptTask-lable" for="camunda-services">Condition Type</label>'+

                '<select class="clsScriptTask" id="scriptTask-'+element.id+'">' + scriptTaskOptions + '</select>'+

                '<div id="txtClsScriptTask-div-'+element.id+'" class="sf-space" style="'+showScriptTaskConditionType.txtbox+'"><label class="servicetask-lable" for="camunda-services">Resource </label> <input type="text"  class="txtClsScriptTask" value="'+scriptTask_enteredConditionExpression+'" id="txtScriptTask-'+element.id+'" /></div>'+
                '<div id="txtareaClsScriptTask-div-'+element.id+'" class="sf-space" style="'+showScriptTaskConditionType.txtareabox+'"><label class="servicetask-lable" for="camunda-services">Script </label> <textarea rows="4" cols="50" class="txtareaClsScriptTask" id="txtareaScriptTask-'+element.id+'" >'+scriptTask_enteredConditionScript+'</textarea></div>'+

                '<div class="scriptTask-div sf-space"><label class="servicetask-lable" for="camunda-services">Result Variable </label> <input type="text" class="txtClsScriptTaskResultVar" value="'+element.businessObject.resultVariable+'" id="txtScriptTask-resultVar-'+element.id+'" /></div></div>'+
            '</div>');

        }
        else if(element.type=="bpmn:Process"){
            var groupNode = domify('<div class="bpp-properties-group" data-group="' + group.id + '">' +
              '<span class="group-toggle"></span>' +
              '<div class="group-label" style="margin-bottom: 3px;">Id</div>' +
              '<div class="wf-id-div"><span>' + element.id + '</span></div>' +
            '</div>');
        }
        else{
            var groupNode = domify('<div class="bpp-properties-group" data-group="' + group.id + '">' +
              '<span class="group-toggle"></span>' +
              /*'<span class="group-label">' + group.label + '</span>' +*/
            '</div>');
        }

      }
      else if(group.id=="thresholds"){
        var groupNode = domify('<div class="bpp-properties-group hide" data-group="' + group.id + '">' +
          '<span class="group-toggle"></span>' +
          /*'<span class="group-label">' + group.label + '</span>' +*/
        '</div>');
        if(element.type=="bpmn:ServiceTask"){

        }
      }
      else{
        var groupNode = domify('<div class="bpp-properties-group hide" data-group="' + group.id + '">' +
          '<span class="group-toggle"></span>' +
          /*'<span class="group-label">' + group.label + '</span>' +*/
        '</div>');
      }

       /*****************************Customised the code ends here*********************************************************/

      // TODO(nre): use event delegation to handle that...
      groupNode.querySelector('.group-toggle').addEventListener('click', function(evt) {
        domClasses(groupNode).toggle('group-closed');
        evt.preventDefault();
        evt.stopPropagation();
      });

      groupNode.addEventListener('keyup', function(evt) {
          if(element.type=="bpmn:SequenceFlow" && evt.target.nodeName=="INPUT" && evt.srcElement.className=="txtClsSequenceFlow"){
             if(element.businessObject.conditionExpression==undefined){
               // element.businessObject["conditionExpression"]={"$type":"bpmn:FormalExpression","body":""};
               // element.businessObject.conditionExpression.body=evt.srcElement.value;
               if(evt.srcElement.className=="txtClsSequenceFlow"){
                    var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
                    scope.$apply(function () {
                        scope.sequenceFlowSetValue(evt, evt.srcElement.id, evt.srcElement.value, evt.srcElement.className,element.id);
                    });
               }


             }
             else{
                element.businessObject.conditionExpression.body=evt.srcElement.value;
             }
          };
          if(element.type=="bpmn:SequenceFlow" && evt.target.nodeName=="TEXTAREA" && evt.srcElement.className=="txtareaClsSequenceFlow"){
             if(element.businessObject.conditionExpression==undefined){
               if(evt.srcElement.className=="txtareaClsSequenceFlow"){
                    var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
                    scope.$apply(function () {
                        scope.sequenceFlowSetTextareaValue(evt, evt.srcElement.id, evt.srcElement.value, evt.srcElement.className,element.id);
                    });
               }

             }
             else{
                element.businessObject.conditionExpression.body=evt.srcElement.value;
             }
          };

          /*
          //////////// ScriptTask custom code starts here ///////////////////////////
          */

          if(element.type=="bpmn:ScriptTask" && evt.target.nodeName=="INPUT" && evt.srcElement.className=="txtClsScriptTask"){
                element.businessObject.resource= evt.srcElement.value;
             /*if(element.businessObject.conditionExpression==undefined){
               if(evt.srcElement.className=="txtClsScriptTask"){
                    var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
                    scope.$apply(function () {
                        scope.ScriptTaskSetTxtboxValue(evt, evt.srcElement.id, evt.srcElement.value, evt.srcElement.className,element.id);
                    });
               }

             }
             else{
                element.businessObject.conditionExpression.body=evt.srcElement.value;
             }*/
          };
          if(element.type=="bpmn:ScriptTask" && evt.target.nodeName=="INPUT" && evt.srcElement.className=="txtClsScriptTaskResultVar"){
                element.businessObject.resultVariable= evt.srcElement.value;
          };

          if(element.type=="bpmn:ScriptTask" && evt.target.nodeName=="TEXTAREA" && evt.srcElement.className=="txtareaClsScriptTask"){
                element.businessObject.script= evt.srcElement.value;
             /*if(element.businessObject.conditionExpression==undefined){
               if(evt.srcElement.className=="txtareaClsScriptTask"){
                    var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
                    scope.$apply(function () {
                        scope.ScriptTaskSetTextareaValue(evt, evt.srcElement.id, evt.srcElement.value, evt.srcElement.className,element.id);
                    });
               }

             }
             else{
                element.businessObject.conditionExpression.body=evt.srcElement.value;
             }*/
          };

          if((
                element.type=="bpmn:ServiceTask" ||
                element.type=="bpmn:Task" ||
                element.type=="bpmn:SendTask" ||
                element.type=="bpmn:ScriptTask" ||
                element.type=="bpmn:ReceiveTask" ||
                element.type=="bpmn:BusinessRuleTask" ||
                element.type=="bpmn:SubProcess" ||
                element.type=="bpmn:ManualTask" ||
                element.type=="bpmn:CallActivity" ||
                element.type=="bpmn:UserTask"
                ) && evt.target.nodeName=="DIV" && evt.srcElement.id=="camunda-name"){
                //alert(angular.element(document.getElementById("camunda-name")));
                console.log(evt.srcElement.innerText);
                var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
                    scope.$apply(function () {
                        serviceTaskMapedName = scope.setTaskIdMapping(element.id,evt.srcElement.innerText);
                        if(evt.srcElement.innerText!=serviceTaskMapedName){
                            element.businessObject.name="";
                            $("#camunda-name").html(serviceTaskMapedName);
                            element.businessObject.name=serviceTaskMapedName;
                            $('[data-element-id='+element.id+'] text tspan').html(serviceTaskMapedName);
                            $('[data-element-id='+element.id+'] text tspan').attr("x", 0);
                        }
                    });
          };

      });

      groupNode.addEventListener('change', function(evt) {
            if(element.type=="bpmn:SequenceFlow" && evt.target.nodeName=="SELECT" && evt.srcElement.className=="clsSequenceFlow"){
                if(evt.srcElement.value=="Script"){
                    showConditionType={"txtbox":"display:none","txtareabox":"display:black;"};

                    angular.element(document.getElementById("txtClsSequenceFlow-div-"+element.id)).hide();
                    angular.element(document.getElementById("txtareaClsSequenceFlow-div-"+element.id)).show();
                }else if(evt.srcElement.value=="Expression"){
                    showConditionType={"txtbox":"display:black","txtareabox":"display:none;"};
                    angular.element(document.getElementById("txtClsSequenceFlow-div-"+element.id)).show();
                   angular.element(document.getElementById("txtareaClsSequenceFlow-div-"+element.id)).hide();
                }else{
                    showConditionType={"txtbox":"display:none","txtareabox":"display:none;"};
                    angular.element(document.getElementById("txtClsSequenceFlow-div-"+element.id)).hide();
                    angular.element(document.getElementById("txtareaClsSequenceFlow-div-"+element.id)).hide();
                }

                if(element.businessObject.conditionExpression==undefined){
                    var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
                    scope.$apply(function () {
                        scope.sequenceFlowConditionType(evt, evt.srcElement.id, evt.srcElement.value, evt.srcElement.className,element.id);
                    });
                 }
                 else{
                    element.businessObject.conditionExpression.language=evt.srcElement.value;
                 }

            }
            else if(element.type=="bpmn:ScriptTask" && evt.target.nodeName=="SELECT" && evt.srcElement.className=="clsScriptTask"){

                if(evt.srcElement.value=="InlineScript"){
                    showScriptTaskConditionType={"txtbox":"display:none","txtareabox":"display:black;"};

                    angular.element(document.getElementById("txtClsScriptTask-div-"+element.id)).hide();
                    angular.element(document.getElementById("txtareaClsScriptTask-div-"+element.id)).show();

                    angular.element(document.getElementById("txtScriptTask-"+element.id)).val("");
                    delete element.businessObject.resource;

                }else if(evt.srcElement.value=="ExternalResource"){
                    showScriptTaskConditionType={"txtbox":"display:black","txtareabox":"display:none;"};
                    angular.element(document.getElementById("txtClsScriptTask-div-"+element.id)).show();
                    angular.element(document.getElementById("txtareaClsScriptTask-div-"+element.id)).hide();

                    angular.element(document.getElementById("txtareaScriptTask-"+element.id)).val("");
                    element.businessObject.resource="";
                    delete element.businessObject.script;
                };

            }else if(element.type=="bpmn:ScriptTask" && evt.target.nodeName=="SELECT" && evt.srcElement.className=="clsScriptTaskFormats"){
                element.businessObject.scriptFormat=evt.srcElement.value;
            };

      });

      groupNode.addEventListener('click', function(evt) {

        /*if(element.type=="bpmn:SequenceFlow" && evt.target.nodeName=="INPUT"){

            if(evt.srcElement.className=="txtClsSequenceFlow"){
                var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();

                scope.$apply(function () {
                    scope.callSequenceFlow(evt, evt.srcElement.id, evt.srcElement.value, evt.srcElement.className,element.id);
                });
            }
        };*/

        if(element.type=="bpmn:ServiceTask" && evt.target.nodeName=="SELECT"){
       /* if(evt.srcElement.className=="servicetask-topic"){
            element.businessObject.topic=evt.srcElement.value;
        }
        else*/ if(evt.srcElement.className=="servicetask-services"){

                element.businessObject.topic=evt.srcElement.value;

                if(element.businessObject.name==""){
                    var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
                    scope.$apply(function () {
                        serviceTaskMapedName = scope.setTaskIdMapping(element.id,$("#services-"+element.id+" option:selected").text());
                        element.businessObject.name="";
                        element.businessObject.name=serviceTaskMapedName;
                        $("#camunda-name").html(serviceTaskMapedName);
                        $('[data-element-id='+element.id+'] text tspan').html(serviceTaskMapedName);
                        $('[data-element-id='+element.id+'] text tspan').attr("x", 0);
                    });

                    //element.businessObject.name=$("#services-"+element.id+" option:selected").text();
                    //$(".bpp-field-wrapper #camunda-name").html($("#services-"+element.id+" option:selected").text());
                    //$('[data-element-id='+element.id+'] text tspan').html($("#services-"+element.id+" option:selected").text());
                }

                /*if(element.businessObject.topic=='ingest'){
                    var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
                    scope.$apply(function () {
                        var getServiceUrisAndAll = scope.getServiceUrisAndAllObjForIngest('ingest');

                        if(getServiceUrisAndAll!="" && getServiceUrisAndAll!=undefined){

                            element.businessObject.uriId='ingest';

                        }
                    });
                };
                */
                /*if(evt.srcElement.value!="external"){
                     delete element.businessObject.type;
                     delete element.businessObject.topic;
                     element.businessObject.class=evt.srcElement.value;
                }
                else{
                    delete element.businessObject.class;
                    element.businessObject.type=evt.srcElement.value;
                    if(element.businessObject.name!=undefined)
                        element.businessObject.topic=element.businessObject.name;
                    else
                        element.businessObject.topic="";
                }*/

                //collapsed:false
                //alert($("#services-"+element.id+" option:selected").text());
                if($("#services-"+element.id+" option:selected").text()=="Generic Service"){
                    //$('#servicetaskuris-'+element.id).val("");
                    $("#servicetaskuris-"+element.id+" option[value='']").prop('selected', true);
                    $("#servicetaskuris-"+element.id+" option[value='']").attr("selected", true);
                    $('#servicetaskuris-'+element.id).show();
                }
                else if($("#services-"+element.id+" option:selected").text()=="User Review"){
                    $("#manualtaskuris-"+element.id+" option[value='']").prop('selected', true);
                    $("#manualtaskuris-"+element.id+" option[value='']").attr("selected", true);
                    $('#manualtaskuris-'+element.id).show();
                }
                else if($("#services-"+element.id+" option:selected").text()=="Select"){
                    $('#servicetaskuris-'+element.id).hide();
                    $('#servicetaskuris-'+element.id).val("");
                    $('#manualtaskuris-'+element.id).hide();
                    $('#manualtaskuris-'+element.id).val("");
                    delete element.businessObject.uriId;
                    delete element.businessObject.extensionElements;
                }
                else {
                    delete element.businessObject.uriId;
                    $('#servicetaskuris-'+element.id).hide();
                    $('#servicetaskuris-'+element.id).val("");
                    $('#manualtaskuris-'+element.id).hide();
                    $('#manualtaskuris-'+element.id).val("");
                }
            }
            else if(evt.srcElement.className=="servicetask-uris"){

                if($("#uris-"+element.id+" option:selected").val()!=""){

                    var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
                    scope.$apply(function () {
                        var getServiceUrisAndAll = scope.getServiceUrisAndAllObj($("#uris-"+element.id+" option:selected").val());


                        if(getServiceUrisAndAll!="" && getServiceUrisAndAll!=undefined){

                            element.businessObject.uriId=$("#uris-"+element.id+" option:selected").val();

                        }
                    });

                }
                else{
                    delete element.businessObject.extensionElements;
                }

            }
            else if(evt.srcElement.className=="servicetask-manualreview"){

                //if($("#manualreview-"+element.id+" option:selected").val()!=""){

                if(element.businessObject.extensionElements!=undefined){
                    if(element.businessObject.extensionElements.values[0].inputParameters[1]!=undefined && element.businessObject.extensionElements.values[0].inputParameters[1].value!=undefined){
                        element.businessObject.extensionElements.values[0].inputParameters[1].value=$("#manualreview-"+element.id+" option:selected").val();
                    }
                }
                element.businessObject.name=$("#manualreview-"+element.id+" option:selected").text();

                var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
                scope.$apply(function () {
                    scope.setManualReviewValue($("#manualreview-"+element.id+" option:selected").val(), element.id);
                });

                /*}
                else{
                    delete element.businessObject.extensionElements;
                }*/

            }

            //if(evt.srcElement.className!="servicetask-topic"){
                var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
                scope.$apply(function () {
                    scope.callFromServiceTask(evt, evt.srcElement.id, evt.srcElement.value, evt.srcElement.className, $("#services-"+element.id+" option:selected").text(),element.id);
                });
            //}
        }
        /*else if(element.type=="bpmn:Process"){
            var scope = angular.element(document.getElementById("custom-bpmnjs")).scope();
            scope.$apply(function () {
                scope.callFromProcessTask(evt,element.id);
            });
        }*/


        if (!evt.defaultPrevented && domClasses(groupNode).has('group-closed')) {
          domClasses(groupNode).remove('group-closed');
        }
      });

      forEach(group.entries, function(entry) {

        if (!entry.id) {
          throw new Error('entry must have an id');
        }

        var html = entry.html;

        if (typeof html === 'string') {
          html = domify(html);
        }

        // unwrap jquery
        if (html.get && html.constructor.prototype.jquery) {
          html = html.get(0);
        }


        /*****************************Custom code starts here*****************************************/
        // TODO: Hiding all elements except name field

        if(entry.id=="name"){
                if(element.type=="bpmn:Process"){
                    var entryNode = domify('<div class="bpp-properties-entry" id="process_' + element.id + '" data-entry="' + entry.id + '"></div>');
                }else{
                    var entryNode = domify('<div class="bpp-properties-entry" data-entry="' + entry.id + '"></div>');
                }

        }else{

            var entryNode = domify('<div class="bpp-properties-entry hide" data-entry="' + entry.id + '"></div>');

        }
        /***********************************Custom code ends here*************************************/

        forEach(entry.cssClasses || [], function(cssClass) {
          domClasses(entryNode).add(cssClass);
        });

        entryNode.appendChild(html);

        groupNode.appendChild(entryNode);

        // update conditionally visible elements
        self.updateState(entry, entryNode);
      });

      tabNode.appendChild(groupNode);
    });

    tabLinksNode.appendChild(tabLinkNode);
    tabContainerNode.appendChild(tabNode);
  });

  tabBarNode.appendChild(tabLinksNode);

  panelNode.appendChild(tabBarNode);
  panelNode.appendChild(tabContainerNode);

  return panelNode;
};



function setInputValue(node, value) {

  var contentEditable = isContentEditable(node);

  var oldValue = contentEditable ? node.innerText : node.value;

  var selection;

  // prevents input fields from having the value 'undefined'
  if (value === undefined) {
    value = '';
  }

  if (oldValue === value) {
    return;
  }

  // update selection on undo/redo
  if (document.activeElement === node) {
    selection = updateSelection(getSelection(node), oldValue, value);
  }

  if (contentEditable) {
    node.innerText = value;
  } else {
    node.value = value;
  }

  if (selection) {
    setSelection(node, selection);
  }
}

function setSelectValue(node, value) {
  if (value !== undefined) {
    node.value = value;
  }
}

function setToggleValue(node, value) {
  var nodeValue = node.value;

  node.checked = (value === nodeValue) || (!domAttr(node, 'value') && value);
}

function setTextValue(node, value) {
  node.textContent = value;
}

function getSelection(node) {

  return isContentEditable(node) ? getContentEditableSelection(node) : {
    start: node.selectionStart,
    end: node.selectionEnd
  };
}

function getContentEditableSelection(node) {

  var selection = window.getSelection();

  var focusNode = selection.focusNode,
      focusOffset = selection.focusOffset,
      anchorOffset = selection.anchorOffset;

  if (!focusNode) {
    throw new Error('not selected');
  }

  // verify we have selection on the current element
  if (!node.contains(focusNode)) {
    throw new Error('not selected');
  }

  return {
    start: Math.min(focusOffset, anchorOffset),
    end: Math.max(focusOffset, anchorOffset)
  };
}

function setSelection(node, selection) {

  if (isContentEditable(node)) {
    setContentEditableSelection(node, selection);
  } else {
    node.selectionStart = selection.start;
    node.selectionEnd = selection.end;
  }
}

function setContentEditableSelection(node, selection) {

  var focusNode,
      domRange,
      domSelection;

  focusNode = node.firstChild || node,
  domRange = document.createRange();
  domRange.setStart(focusNode, selection.start);
  domRange.setEnd(focusNode, selection.end);

  domSelection = window.getSelection();
  domSelection.removeAllRanges();
  domSelection.addRange(domRange);
}

