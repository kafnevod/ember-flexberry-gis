import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  objectField: DS.attr('string'),
  layerField: DS.attr('string'),
  expression: DS.attr('string'),
  queryKey: DS.attr('string'),
  linkField: DS.attr('boolean'),
  layerLink: DS.belongsTo('new-platform-flexberry-g-i-s-layer-link', { inverse: 'linkParameter', async: false }),
  getValidations: function () {
    let parentValidations = this._super();
    let thisValidations = {
      layerLink: { presence: true }
    };
    return Ember.$.extend(true, {}, parentValidations, thisValidations);
  },
  init: function () {
    this.set('validations', this.getValidations());
    this._super.apply(this, arguments);
  }
});
export let defineProjections = function (model) {
  model.defineProjection('LinkParameter', 'new-platform-flexberry-g-i-s-link-parameter', {
    objectField: Projection.attr('', { hidden: true }),
    layerField: Projection.attr('', { hidden: true }),
    expression: Projection.attr('', { hidden: true }),
    queryKey: Projection.attr('', { hidden: true }),
    linkField: Projection.attr('', { hidden: true })
  });
};
