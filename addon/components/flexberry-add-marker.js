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

  applyImageReadonly: false,

  shadowURL: undefined,

  shadowToShow: undefined,

  shadowWidth: undefined,

  shadowHeight: undefined,

  shadowInputClass: undefined,

  applyShadowReadonly: false,

  imageTableCells: undefined,

  shadowTableCells: undefined,

  cellSize: 10,

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

        img.width = img.width * this.get('cellSize');
        img.height = img.height * this.get('cellSize');

        this.set('imageToShow', img);
        this.set('imageHeight', img.height);
        this.set('imageWidth', img.width);

        let cells = [];
        for (let i = 0; i <= img.height / this.get('cellSize'); i += 1) {
          let row = [];
          for (let j = 0; j <= img.width / this.get('cellSize'); j += 1) {
            row.push('1');
          }

          cells.push(row);
        }

        this.set('imageTableCells', cells);
      };

    },

    test(e) {
      console.log(e);
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

        img.width = img.width * this.get('cellSize');
        img.height = img.height * this.get('cellSize');

        this.set('shadowToShow', img);
        this.set('shadowHeight', img.height);
        this.set('shadowWidth', img.width);

        let cells = [];
        for (let i = 0; i <= img.height / this.get('cellSize'); i += 1) {
          let row = [];
          for (let j = 0; j <= img.width / this.get('cellSize'); j += 1) {
            row.push('1');
          }

          cells.push(row);
        }

        this.set('shadowTableCells', cells);
      };
    }
  }
});
