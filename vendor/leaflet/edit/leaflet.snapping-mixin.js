let SnapMixin = {
  enableSnap: function (snapLayers, options) {
    this._snapEnabled = true;
    this.snapHandler._snapLayers = snapLayers || [];
    this.snapHandler.snapDistance = options.snapDistance || 20;
    this.on('editable:vertex:dragstart', this.snapHandler._startSnapping, this.snapHandler);
  },

  disableSnap: function () {
    this._snapEnabled = false;
    this.snapHandler._snapLayers = [];
    this.off('editable:vertex:dragstart', this.snapHandler._startSnapping, this.snapHandler);
  },

  snapEnabled: function() {
    return this._snapEnabled;
  },
};

let SnapDrawMixin = {
  enableDrawSnap: function (snapLayers, options) {
    this._drawSnapEnabled = true;
    this.snapHandler._snapLayers = snapLayers || [];
    this.snapHandler.snapDistance = options.snapDistance || 20;
    this.snapHandler.snapMarker = L.marker(this.getCenter(), {
      icon: this.editTools.createVertexIcon({ className: 'leaflet-div-icon leaflet-drawing-icon' }),
      opacity: 1,
      zIndexOffset: 1000
    });
    this.on('editable:drawing:move', this.snapHandler._handleSnapping, this.snapHandler);
    this.on('editable:drawing:end', this.snapHandler._cleanupSnapping, this.snapHandler);
    this.on('editable:drawing:click', this.snapHandler._drawClick, this.snapHandler);
  },

  disableDrawSnap: function () {
    this._drawSnapEnabled = false;
    this.snapHandler._snapLayers = [];
    this.off('editable:drawing:move', this.snapHandler._handleSnapping, this.snapHandler);
    this.off('editable:drawing:end', this.snapHandler._cleanupSnapping, this.snapHandler);
    this.off('editable:drawing:click', this.snapHandler._drawClick, this.snapHandler);
  },

  drawSnapEnabled: function() {
    return this._drawSnapEnabled;
  },
};

L.SnapHandler = L.Handler.extend({
  initialize: function (obj) {
    if (obj instanceof L.Map) {
      this._map = obj;
    } else {
      this._layer = obj;
    }

  },

  /**
    Initializes snapping for edited vertex.

    @method _startSnapping
    @param {Object} e Event object.
    @private
  */
  _startSnapping(e) {
    if (e.layer instanceof L.Rectangle || e.layer instanceof L.Circle) {
      return;
    }

    e.layer.on('editable:vertex:drag', this._handleSnapping, this);
    e.layer.on('editable:vertex:dragend', this._cleanupSnapping, this);
  },

  /**
    Cleaning after snapping.

    @method _cleanupSnapping
    @private
  */
  _cleanupSnapping(e) {
    let snapMarker = this.snapMarker;
    if (snapMarker) {
      snapMarker.remove();
    } else {
      e.layer.off('editable:vertex:drag', this._handleSnapping, this);
      e.layer.off('editable:vertex:dragend', this._cleanupSnapping, this);
    }
  },

  /**
    Handles snapping.

    @method _handleSnapping
    @param {Object} e Event object.
    @private
  */
  _handleSnapping(e) {
    let snapList = this._snapLayers;

    if (!(snapList instanceof Array) || snapList.length === 0) {
      return;
    }

    let isDraw = e.vertex === undefined;
    let snapMarker = e.vertex || this.snapMarker;

    let closestLayer = this._findClosestLayer(e.latlng, snapList);

    let isMarker = closestLayer.layer instanceof L.Marker || closestLayer.layer instanceof L.CircleMarker;
    let currentSnap = (isMarker ? closestLayer.latlng : this._checkSnapToVertex(closestLayer)) || {};
    let previousSnap = this._snapLatLng || {};
    let snapDistance = this.snapDistance;

    if (closestLayer.distance < snapDistance) {
      // snap the marker
      snapMarker.setLatLng(currentSnap);

      if (previousSnap.lat !== currentSnap.lat || previousSnap.lng !== currentSnap.lng) {
        this._snapLatLng = currentSnap;
        if (isDraw) {
          snapMarker.addTo(this._map || this._layer._map);
        }
      }
    } else if (previousSnap) {
      this._snapLatLng = undefined;
      if (isDraw) {
        snapMarker.remove();
      }
    }
  },

  /**
    Check if vertex is in snap distance.

    @method _checkSnapToVertex
    @param {Object} closestLayer Snap layer.
    @private
  */
  _checkSnapToVertex(closestLayer) {
    let leafletMap = this._map || this._layer._map;
    let segmentPointA = closestLayer.segment[0];
    let segmentPointB = closestLayer.segment[1];

    let snapPoint = closestLayer.latlng;
    let distanceA = this._getPixelDistance(leafletMap, segmentPointA, snapPoint);
    let distanceB = this._getPixelDistance(leafletMap, segmentPointB, snapPoint);

    let closestVertex = distanceA < distanceB ? segmentPointA : segmentPointB;
    let shortestDistance = distanceA < distanceB ? distanceA : distanceB;

    let priorityDistance = this.snapDistance;

    // The latlng we need to snap to.
    let snapResult = shortestDistance < priorityDistance ? closestVertex : snapPoint;

    return Object.assign({}, snapResult);
  },

  /**
    Finds closest layer to the specified point.

    @method _findClosestLayer
    @param {Object} latlng Point's coordinates
    @param {Array} layers Array of layers for snapping.
    @private
  */
  _findClosestLayer(latlng, layers) {
    let closestLayer = {};

    layers.forEach((layer, index) => {
      let layerDistance = this._calculateDistance(latlng, layer);

      if (Ember.isNone(closestLayer.distance) || layerDistance.distance < closestLayer.distance) {
        closestLayer = layerDistance;
        closestLayer.layer = layer;
      }
    });

    return closestLayer;
  },

  /**
    Calculates distance between layer and point.

    @method _calculateDistance
    @param {Object} latlng Point's coordinates
    @param {Object} layer Leaflet layer.
    @private
  */
  _calculateDistance(latlng, layer) {
    let map = this._map || this._layer._map;
    let isMarker = layer instanceof L.Marker || layer instanceof L.CircleMarker;
    let isPolygon = layer instanceof L.Polygon;

    // The coords of the layer.
    let latlngs = isMarker ? layer.getLatLng() : layer.getLatLngs();

    if (isMarker) {
      return {
        latlng: Object.assign({}, latlngs),
        distance: this._getPixelDistance(map, latlngs, latlng),
      };
    }

    let closestSegment;
    let shortestDistance;

    let loopThroughCoords = (coords) => {
      coords.forEach((coord, index) => {
        if (coord instanceof Array) {
          loopThroughCoords(coord);
          return;
        }

        let segmentPointA = coord;
        let nextIndex = index + 1 === coords.length ? (isPolygon ? 0 : undefined) : index + 1;
        let segmentPointB = coords[nextIndex];

        if (segmentPointB) {
          let distance = this._getPixelDistanceToSegment(map, latlng, segmentPointA, segmentPointB);

          if (shortestDistance === undefined || distance < shortestDistance) {
            shortestDistance = distance;
            closestSegment = [segmentPointA, segmentPointB];
          }
        }
      });
    };

    loopThroughCoords(latlngs);

    let closestSegmentPoint = this._getClosestPointOnSegment(map, latlng, closestSegment[0], closestSegment[1]);

    return {
      latlng: Object.assign({}, closestSegmentPoint),
      segment: closestSegment,
      distance: shortestDistance,
    };
  },

  /**
    Finds point on segment closest to the specified point.

    @method _getClosestPointOnSegment
    @param {Object} map Leaflet map.
    @param {Object} latlng Point's coordinates.
    @param {Object} firstlatlng Coordinates of first segment's point.
    @param {Object} secondlatlng Coordinates of second segment's point.
    @private
  */
  _getClosestPointOnSegment(map, latlng, firstlatlng, secondlatlng) {
    let maxzoom = map.getMaxZoom();
    if (maxzoom === Infinity) {
      maxzoom = map.getZoom();
    }

    let point = map.project(latlng, maxzoom);
    let segmentPointA = map.project(firstlatlng, maxzoom);
    let segmentPointB = map.project(secondlatlng, maxzoom);
    let closest = L.LineUtil.closestPointOnSegment(point, segmentPointA, segmentPointB);
    return map.unproject(closest, maxzoom);
  },

  /**
    Calculates distance in pixels between point and segment.

    @method _getPixelDistanceToSegment
    @param {Object} map Leaflet map.
    @param {Object} latlng Point's coordinates.
    @param {Object} firstlatlng Coordinates of first segment's point.
    @param {Object} secondlatlng Coordinates of second segment's point.
    @private
  */
  _getPixelDistanceToSegment(map, latlng, firstlatlng, secondlatlng) {
    let point = map.latLngToLayerPoint(latlng);
    let segmentPointA = map.latLngToLayerPoint(firstlatlng);
    let segmentPointB = map.latLngToLayerPoint(secondlatlng);
    return L.LineUtil.pointToSegmentDistance(point, segmentPointA, segmentPointB);
  },

  /**
    Calculates distance in pixels between two points.

    @method _getPixelDistance
    @param {Object} map Leaflet map.
    @param {Object} firstlatlng Coordinates of first segment's point.
    @param {Object} secondlatlng Coordinates of second segment's point.
    @private
  */
  _getPixelDistance(map, firstlatlng, secondlatlng) {
    return map.latLngToLayerPoint(firstlatlng).distanceTo(map.latLngToLayerPoint(secondlatlng));
  },

  /**
    Handles clicks when drawing new geometry.

    @method _drawClick
    @param {Object} e Event object.
    @private
  */
  _drawClick(e) {
    let snapMarker = this.snapMarker;
    let isSnap = snapMarker._map !== undefined;
    if (isSnap) {
      let latlng = snapMarker.getLatLng();
      e.latlng.lat = latlng.lat;
      e.latlng.lng = latlng.lng;
    }
  }
});

if (L.Path) {
  L.Path.include(SnapMixin);
  L.Path.addInitHook(function () {
    this.snapHandler = new L.SnapHandler(this);
  });
}

if (L.Map) {
  L.Map.include(SnapDrawMixin);
  L.Map.addInitHook(function () {
    this.snapHandler = new L.SnapHandler(this);
  });
}
