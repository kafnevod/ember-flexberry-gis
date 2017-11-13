import Ember from 'ember';
import layout from '../../templates/components/gradients/gradient-edit';

export default Ember.Component.extend({
  _captionFontColor1: null,

  _captionFontColor2: null,

  layout,

  actions: {

    /**
      Handler for font colorpicker's 'change' action.

      @method actions.onCaptionFontColorChange
    */
    onCaptionFontColorChange1(e) {
      this.set('_captionFontColor1', e.newValue);
    },

    onCaptionFontColorChange2(e) {
      this.set('_captionFontColor2', e.newValue);
    },

    onClickCanvas() {
      let ctx = this.$('.myCanvas')[0].getContext("2d");

      let grd = ctx.createLinearGradient(0, 0, 170, 0);
      grd.addColorStop(0, this.get('_captionFontColor1'));
      grd.addColorStop(1, this.get('_captionFontColor2'));

      ctx.fillStyle = grd;
      ctx.fillRect(20, 20, 150, 100);
    }
  }
});
