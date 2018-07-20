var DragMixin = {
  enableDrag: function (layers) {
    this._dragEnabled = true;
    this.on('mousedown', this.dragHandler._dragOnMouseDown, this.dragHandler);
    this.dragHandler._saveDragState = true;
    this.dragHandler.groupDrag = [];
    if (layers) {
      this.addDragGroup(layers);
    }
  },

  disableDrag: function () {
    this._dragEnabled = false;
    this.off('mousedown', this.dragHandler._dragOnMouseDown, this.dragHandler);
    this.clearDragGroup();
  },

  dragEnabled: function() {
    return this._dragEnabled;
  },

  toggleDrag: function () {
    if (this._dragEnabled) {
      this.disableDrag();
    } else {
      this.enableDrag();
    }
  },

  addDragGroup: function(layers) {
    if (this.dragHandler) {
      var groupLayers = layers instanceof Array ? layers.slice() : [layers];

      var index = groupLayers.indexOf(this);
      if (index > -1) {
        groupLayers.splice(index, 1);
      }

      this.dragHandler.groupDrag = groupLayers;
    }
  },

  clearDragGroup: function() {
    if (this.dragHandler) {
      this.dragHandler.groupDrag = [];
    }
  }
};

L.DragHandler = L.Handler.extend({
  initialize: function (layer) {
    this._layer = layer;
  },

  /**
    Handles mouse down event when dragging.

    @param {Object} e Event object.
  */
  _dragOnMouseDown(e) {
    // cancel if mouse button is NOT the left button
    if (e.originalEvent.button > 0) {
      return;
    }

    var saveDragState = this._saveDragState;
    if (saveDragState) {
      this._tempCoords = e.latlng;
      this._saveDragState = false;

      this._editedLayers = [];
      this.groupDrag.forEach((groupLayer) => {
        if (groupLayer.editEnabled()) {
          groupLayer.disableEdit();
          this._editedLayers.push(groupLayer);
        }
      });

      if (this._layer.editEnabled()) {
        this._layer.disableEdit();
        this._editedLayers.push(this._layer);
      }

      if (this._layer.bringToFront) {
        this._layer.bringToFront();
      }

      this._layer.on('mouseup', this._dragOnMouseUp, this);
      this._layer._map.on('mousemove', this._dragOnMouseMove, this);
      this._layer._map.dragging.disable();
    }
  },

  /**
    Handles mouse move event when dragging.

    @param {Object} e Event object.
  */
  _dragOnMouseMove(e) {
    if (!this._nowDragging) {
      this._nowDragging = true;
    }

    this._onLayerDrag(e);
  },

  /**
    Handles mouse up event when dragging.

    @param {Object} e Event object.
  */
  _dragOnMouseUp() {
    this._layer._map.dragging.enable();
    this._saveDragState = true;

    // clear up mousemove event
    this._layer._map.off('mousemove', this._dragOnMouseMove, this);

    // clear up mouseup event
    this._layer.off('mouseup', this._dragOnMouseUp, this);

    this._editedLayers.forEach((layer) => {
      layer.enableEdit();
    });

    this._editedLayers = [];

    this.groupDrag.forEach((groupLayer) => {
      groupLayer.fire('drag:dragend');
    });

    this._layer.fire('drag:dragend');

    this._nowDragging = false;
  },

  /**
    Handles layer dragging with mouse.

    @param {Object} e Event object.
  */
  _onLayerDrag(e) {
    // latLng of mouse event
    var { latlng } = e;

    // delta coords (how far was dragged)
    var deltaLatLng = {
      lat: latlng.lat - this._tempCoords.lat,
      lng: latlng.lng - this._tempCoords.lng
    };

    // move the coordinates by the delta
    var moveCoords = coords => {
      if (Ember.isArray(coords)) {
        return coords.map((currentLatLng) => {
          return moveCoords(currentLatLng);
        });
      }

      var res = {
        lat: coords.lat + deltaLatLng.lat,
        lng: coords.lng + deltaLatLng.lng
      };

      return res;
    };

    // create the new coordinates array
    var newCoords;

    var moveLayer = (layer) => {
      if (layer instanceof L.Marker) {
        newCoords = moveCoords(layer._latlng);
      } else {
        newCoords = moveCoords(layer._latlngs);
      }

      // set new coordinates and redraw
      if (layer.setLatLngs) {
        layer.setLatLngs(newCoords).redraw();
      } else {
        layer.setLatLng(newCoords);
      }
    };

    this.groupDrag.forEach((groupLayer) => {
      moveLayer(groupLayer);
    });

    moveLayer(this._layer);

    // save current latlng for next delta calculation
    this._tempCoords = latlng;
  },
});

if (L.Path) {
  L.Path.include(DragMixin);
  L.Path.addInitHook(function () {
    this.dragHandler = new L.DragHandler(this);
  });
}

if (L.Marker) {
  L.Marker.include(DragMixin);
  L.Marker.addInitHook(function () {
    this.dragHandler = new L.DragHandler(this);
  });
}
