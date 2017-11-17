import Ember from 'ember';
import layout from '../templates/components/flexberry-add-marker';

export default Ember.Component.extend({
  layout,

  classNames: ['flexberry-add-marker'],

  imageURL: undefined,

  imageToShow: undefined,

  imageWidth: undefined,

  imageHeight: undefined,

  imageInputClass: undefined,

  imageTableCellStep: undefined,

  applyImageReadonly: false,

  shadowURL: undefined,

  shadowToShow: undefined,

  shadowWidth: undefined,

  shadowHeight: undefined,

  shadowInputClass: undefined,

  shadowTableStep: undefined,

  applyShadowReadonly: false,

  maxSize: 200,

  init() {
    this._super(...arguments);
  },

  shadowURLDidChange:  Ember.on('init', Ember.observer('shadowURL', function() {
    this.set('shadowInputClass', undefined);
  })),

  imageURLDidChange:  Ember.on('init', Ember.observer('imageURL', function() {
    this.set('imageInputClass', undefined);
  })),
  _redrawResult() {

  },

  actions: {
    applyImageClick() {
      let maxSize = this.get('maxSize');
      let img = new Image();
      img.src = this.get('imageURL');
      img.onload = () => {
        if (img.width > maxSize || img.height > maxSize || img.width <= 0 || img.height <= 0) {
          this.set('imageInputClass', 'input error');
          return;
        }

        let oldWidth = img.width;
        if (img.width > img.height) {
          img.height = maxSize * img.height / img.width;
          img.width = maxSize;
        } else {
          img.width = maxSize * img.width / img.height;
          img.height = maxSize;
        }

        this.set('imageToShow', img);
        this.set('imageHeight', img.height);
        this.set('imageWidth', img.width);
        this.set('imageTableCellStep', Math.round(img.width / oldWidth));
      };
    },

    applyShadowClick() {
      let maxSize = this.get('maxSize');
      let img = new Image();
      img.src = this.get('shadowURL');
      img.onload = () => {
        if (img.width > maxSize || img.height > maxSize || img.width <= 0 || img.height <= 0) {
          this.set('shadowInputClass', 'input error');
          return;
        }

        let oldWidth = img.width;
        if (img.width > img.height) {
          img.height = maxSize * img.height / img.width;
          img.width = maxSize;
        } else {
          img.width = maxSize * img.width / img.height;
          img.height = maxSize;
        }

        this.set('shadowToShow', img);
        this.set('shadowHeight', img.height);
        this.set('shadowWidth', img.width);
        this.set('shadowTableCellStep', Math.round(img.width / oldWidth));
      };
    }
  }
});
