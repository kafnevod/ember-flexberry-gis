import Ember from 'ember';
import layout from '../templates/components/flexberry-add-marker';

export default Ember.Component.extend({
  /**
  Reference to component's template.
  */
  layout,

  /**
    Component's wrapping <div> CSS-classes names.
    Any other CSS-class names can be added through component's 'class' property.
    @property classNames
    @type String[]
    @default ['flexberry-add-marker']
    */
  classNames: ['flexberry-add-marker'],

  /**
    Icon source size limit.
    @property maxSize
    @type number
    @default 200
  */
  maxSize: 200,

  /**
    URL to icon image.
    @property imageURL
    @type string
    @default undefined
  */
  imageURL: undefined,

  /**
    Image to show.
    @property imageToShow
    @type string
    @default undefined
  */
  imageToShow: undefined,

  /**
    Image width.
    @property imageWidth
    @type number
    @default undefined
  */
  imageWidth: undefined,

  /**
    Image height.
    @property imageHeight
    @type number
    @default undefined
  */
  imageHeight: undefined,

  /**
    Image URL's input's class.
    @property imageInputClass
    @type string
    @default undefined
  */
  imageInputClass: undefined,

  /**
    Selected cell of image's table.
    @property imageActiveCell
    @type object
    @default undefined
  */
  imageActiveCell: undefined,

  /**
    Apply image button class.
    @property applyImageClass
    @type string
    @default 'fluid'
  */
  applyImageClass: 'fluid',

  /**
    URL to icon shadow.
    @property shadowURL
    @type string
    @default undefined
  */
  shadowURL: undefined,

  /**
    Shadow to show.
    @property shadowToShow
    @type string
    @default undefined
  */
  shadowToShow: undefined,

  /**
    Shadow width.
    @property shadowWidth
    @type number
    @default undefined
  */
  shadowWidth: undefined,

  /**
    Shadow height.
    @property shadowHeight
    @type number
    @default undefined
  */
  shadowHeight: undefined,

  /**
    Shadow URL's input's class.
    @property shadowInputClass
    @type string
    @default undefined
  */
  shadowInputClass: undefined,

  /**
    Selected cell of shadow's table.
    @property shadowActiveCell
    @type object
    @default undefined
  */
  shadowActiveCell: undefined,

  /**
    Apply shadow button class.
    @property applyImageClass
    @type string
    @default 'fluid'
  */
  applyShadowClass: 'fluid',

  /**
    Array represents pixel net of Image.
    @property imageTableCells
    @type object
    @default undefined
  */
  imageTableCells: undefined,

  /**
    Array represents pixel net of Shadow.
    @property shadowTableCells
    @type object
    @default undefined
  */
  shadowTableCells: undefined,

  /**
    "Pixel" of table dimensions.
    @property cellSize
    @type number
    @default undefined
  */
  cellSize: 10,

  /**
    Image ancor.
    @property imageAncor
    @type object
    @default undefined
  */
  imageAncor: undefined,

  /**
    Shadow ancor.
    @property shadowAncor
    @type object
    @default undefined
  */
  shadowAncor: undefined,

  init() {
    this._super(...arguments);
  },

  /**
    Observes changes in url to shadow image.
    @method shadowURLDidChange
  */
  shadowURLDidChange:  Ember.on('init', Ember.observer('shadowURL', function() {
    this.set('shadowInputClass', undefined);
    this.set('shadowToShow', undefined);
    this.set('shadowTableCells', undefined);
    this.set('shadowActiveCell', undefined);
  })),

  /**
    Observes changes in url to icon image.
    @method imageURLDidChange
  */
  imageURLDidChange:  Ember.on('init', Ember.observer('imageURL', function() {
    this.set('imageInputClass', undefined);
    this.set('imageToShow', undefined);
    this.set('imageTableCells', undefined);
    this.set('imageActiveCell', undefined);
  })),

  actions: {
    /**
     This action is called when change apply image button is pressed.
     @method actions.applyImageClick
   */
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
            row.push({ 'x': j, 'y': i });
          }

          cells.push(row);
        }

        this.set('imageTableCells', cells);
      };

    },

    /**
     This action is called when change apply shadow button is pressed.
     @method actions.applyShadowClick
   */
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
            row.push({ 'x': j, 'y': i });
          }

          cells.push(row);
        }

        this.set('shadowTableCells', cells);
      };
    },

    /**
     This action is called when image table's cell is clicked
     @method actions.imageTableClick
   */
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

    /**
     This action is called when shadow table's cell is clicked
     @method actions.shadowTableClick
   */
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

    /**
     This action is called when preview button is clicked
     @method actions.previewClick
   */
    previewClick() {
      let imageAncor = this.get('imageAncor');
      let shadowAncor = this.get('shadowAncor');
      let resultCanvas = document.getElementById('resultCanvas');
      let resultCtx = resultCanvas.getContext('2d');
      resultCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

      let shadow = new Image();
      let img = new Image();
      img.src = this.get('imageURL');
      shadow.src = this.get('shadowURL');
      img.onload =  () => {
        resultCtx.drawImage(
          shadow,
          imageAncor.x - shadowAncor.x,
          imageAncor.y - shadowAncor.y
        );
        resultCtx.drawImage(
          img,
          0,
          0
        );
      };
    },

    /**
     This action is called when OK button is clicked
     @method actions.okClick
   */
    okClick() {
      let shadowAncor = [this.get('shadowAncor').x, this.get('shadowAncor').y];
      let imageAncor = [this.get('imageAncor').x, this.get('imageAncor').y];
      this.sendAction('imageAncorsSelected', {
        iconUrl: this.get('imageURL'),
        shadowUrl: this.get('shadowURL'),
        iconAncor: imageAncor,
        shadowAncor: shadowAncor
      });
    }
  }
});
