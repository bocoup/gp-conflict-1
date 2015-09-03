var path = window.path || null;

/**
* Raster Map Maker
*/
window.Map = {

  // Makes image raster map
  // puts it into an element
  // follows up with adding an SVG to the mix and
  // an overall container group for all the things that will
  // live in it.
  makeRaster : Promise.method(function(el, img, regionProp, getGeoFunc) {

    var width = 960,
      height = 800;

    // append raster
    d3.select(el).append('img')
      .attr('src', img);

    // add svg
    var svg = d3.select(el).append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", "0 0 " +width+ " "+height+"")
      .attr("preserveAspectRatio", "xMidYMid");

    // add group container
    var map = svg.append("g");

    path = d3.geo.path()
       .projection(null);

    return Promise.resolve([map, regionProp, getGeoFunc]);
  }),

  // adds a geojson layer that will
  // render invisible regions on top of map. Useful for lining things up
  // during development.
  makeRegions: function(args) {
    var map = args[0];
    var regionProp = args[1];
    var getGeoFunc = args[2];

    return Data[getGeoFunc]().then(function(geoData) {

      var data = topojson.feature(geoData, geoData.objects[regionProp]).features;
      var countries = map.selectAll("path.land")
          .data(data);

      countries.enter().append("path")
        .attr("name", function(d) { return d.properties.name; })
        .attr("class", "land")
        .attr("d", path);

      return Promise.resolve([map, regionProp, getGeoFunc]);
    });
  },

  // adds labels. Uses the same regions as before.
  makeLabels: function(args) {
    var map = args[0];
    var regionProp = args[1];
    var getGeoFunc = args[2];

    return Data[getGeoFunc]().then(function(geoData) {
      var data = topojson.feature(geoData, geoData.objects[regionProp]).features;
      var labels = map.selectAll("text.countryname")
          .data(data);

      var exclude = ["Israel", "Palestine"];
      labels.enter().append("text")
        .attr("class", "countryname")
        .text(function(d) {
          if (exclude.indexOf(d.properties.NAME) === -1) {
            return d.properties.NAME;
          } else {
            return "";
          }
        })
        .attr({
          x : function(d) { return path.centroid(d)[0]; },
          y : function(d) { return path.centroid(d)[1]; }
        });

      return Promise.resolve([map, regionProp, getGeoFunc]);
    });
  }
};