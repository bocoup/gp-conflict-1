(function() {

  // Zoom and centers for predefined regions.
  var centers = {
    "Syria": [[34.74161249883172, 37.452392578125], 7],
    "SyriaRegion" : [[36.19109202182454, 33.585205078125], 6],
    "World" : [[41.77131167976407, 18.544921875], 4],
    "Europe": [[48.31242790407178, 4.06494140625], 5],
    "US": [[54.521081495443596, -126.2548828125], 4]
  };

  var M = window.MapWrapper = function() {

    var self = this;

    // public auth token
    L.mapbox.accessToken = 'pk.eyJ1IjoiaXIwcyIsImEiOiJzRW9ObDVJIn0.Yjg0YkF_gr1teCBLJVyeoQ';

    // initialize base map container
    d3.select('#map')
      .style({
        width: $(window).width(),
        height: 600
      });

    this.map = L.mapbox.map('map', 'ir0s.n8mo8g3c'); // load map

    this.map.setView.apply(this.map, centers.World); // initial center
    this.map._initPathRoot(); // init svg

    // set up callout
    this.callout = $('.callout').click(function(event) {
      event.stopPropagation();
    }).mouseover(function(){
      self.map.dragging.disable();
      self.map.doubleClickZoom.disable();
    }).mouseout(function() {
      self.map.dragging.enable();
      self.map.doubleClickZoom.enable();
    });

    return this;
  };

  M.prototype.zoomTo = function(center) {
    this.map.setView.apply(this.map, centers[center], { animate: true });
  };

  M.prototype.closePopups = function() {
    this.map.closePopup();
  };

  M.prototype.popup = function(datum, template) {
    var popup = L.popup()
          .setLatLng(datum.LatLng)
          .setContent(JST[template]({ d : datum }));

    this.map.openPopup(popup, datum.LatLng);
    return popup;
  };

}());