/**
  @module ember-flexberry-gis
*/

/**
  Class describing group layer metadata.

  @class GroupLayer
*/
export default {
  /**
    Icon class related to layer type.

    @property iconClass
    @type String
    @default 'folder icon'
  */
  iconClass: 'folder icon',

  /**
    Permitted operations related to layer type.

    @property operations
    @type String[]
    @default ['add', 'edit', 'remove']
  */
  operations: ['add', 'edit', 'remove'],

  /**
    Creates new settings object (with settings related to layer-type).

    @method createSettings
    @returns {Object} New settings object (with settings related to layer-type).
  */
  createSettings() {
    return {};
  },

  /**
    Creates new search settings object (with search settings related to layer-type).

    @method createSearchSettings
    @returns {Object} New search settings object (with search settings related to layer-type).
  */
  createSearchSettings() {
    return {};
  }
};