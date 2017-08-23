import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  // Maps routes (list, edit, create).
  this.route('maps');
  this.route('map', { path: 'maps/:id' });
  this.route('map.new', { path: 'maps/new' });

  this.route('new-platform-flexberry-g-i-s-layer-metadata-l', { path: 'metadata' });
  this.route('new-platform-flexberry-g-i-s-layer-metadata-e', { path: 'edit-metadata/:id' });
  this.route('new-platform-flexberry-g-i-s-layer-metadata-e.new', { path: 'edit-metadata/new' });

  this.route('new-platform-flexberry-g-i-s-csw-connection-l', { path: 'csw-connections' });
  this.route('new-platform-flexberry-g-i-s-csw-connection-e', { path: 'csw-connections/:id' });
  this.route('new-platform-flexberry-g-i-s-csw-connection-e.new', { path: 'csw-connections/new' });

  // Components examples routes (sorted by component's names).
  this.route('components-examples/flexberry-button/settings-example');
  this.route('components-examples/flexberry-ddau-checkbox/settings-example');
  this.route('components-examples/flexberry-maplayers/settings-example');
  this.route('components-examples/flexberry-tree/settings-example');
});

export default Router;
