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

  imageActiveCell: undefined,

  applyImageReadonly: false,

  shadowURL: undefined,

  shadowToShow: undefined,

  shadowWidth: undefined,

  shadowHeight: undefined,

  shadowInputClass: undefined,

  shadowActiveCell: undefined,

  applyShadowReadonly: false,

  imageTableCells: undefined,

  shadowTableCells: undefined,

  cellSize: 10,

  imageAncor: undefined,

  shadowAncor: undefined,

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
        for (let i = 0; i <= img.width / this.get('cellSize'); i += 1) {
          let row = [];
          for (let j = 0; j <= img.height / this.get('cellSize'); j += 1) {
            row.push([i, j]);
          }

          cells.push(row);
        }

        this.set('imageTableCells', cells);
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

        img.width = img.width * this.get('cellSize');
        img.height = img.height * this.get('cellSize');

        this.set('shadowToShow', img);
        this.set('shadowHeight', img.height);
        this.set('shadowWidth', img.width);

        let cells = [];
        for (let i = 0; i <= img.width / this.get('cellSize'); i += 1) {
          let row = [];
          for (let j = 0; j <= img.height / this.get('cellSize'); j += 1) {
            row.push([i, j]);
          }

          cells.push(row);
        }

        this.set('shadowTableCells', cells);
      };
    },

    imageTableClick(cell, e) {
      let activeCell = this.get('imageActiveCell');
      if (e.target.tagName !== 'TD') {
        return;
      }

      if (!Ember.isNone(activeCell)) {
        activeCell.classList.remove('active');
      }

      e.target.classList.add('active');
      this.set('imageActiveCell', e.target);
      this.set('imageAncor', cell);
    },

    shadowTableClick(cell, e) {
      let activeCell = this.get('shadowActiveCell');
      if (e.target.tagName !== 'TD') {
        return;
      }

      if (!Ember.isNone(activeCell)) {
        activeCell.classList.remove('active');
      }

      e.target.classList.add('active');
      this.set('shadowActiveCell', e.target);
      this.set('shadowAncor', cell);
    },

    previewClick() {
      let imageAncor = this.get('imageAncor');
      let shadowAncor = this.get('shadowAncor');
      let resultCanvas = document.getElementById('resultCanvas');
      let resultCtx = resultCanvas.getContext('2d');
      resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

      let shadow = new Image();
      let img = new Image();
      shadow.src = this.get('shadowURL');
      img.src = this.get('imageURL');
      shadow.onload =  () => {
        resultCtx.drawImage(
          shadow,
          imageAncor[0] - shadowAncor[0] + 1,
          imageAncor[1] - shadowAncor[1] + 1
        );
        resultCtx.drawImage(
          img,
          0,
          0
        );
      };
    }
  }
});
