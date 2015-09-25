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

    // var width = 960,
    //   height = 800;

    // append raster
    // d3.select(el).append('img')
    //   .attr('src', img);


    // add svg
    var svg = d3.select(el).append("svg")
      // .attr("width", width)
      // .attr("height", height)
      // .attr("viewBox", "0 0 " +width+ " "+height+"")
      .style('background-image', 'url('+img + ')')
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
          y : function(d) { return path.centroid(d)[1] + (d.properties.NAME === 'Jordan' ? 20 : 0); }
        });

      return Promise.resolve([map, regionProp, getGeoFunc]);
    });
  },

  makeCities: function(args) {

    var map = args[0],
      regionProp = args[1],
      getGeoFunc = args[2];

    var citiesg = map.append("g").classed("cities", true);
    return Data[getGeoFunc]().then(function(geoData) {

      var citiesData = topojson.feature(geoData, geoData.objects.cities).features;
      var citiesMarkers = citiesg.selectAll('g.city')
        .data(citiesData);

      var size = 3;
      citiesMarkers.enter()
        .append('g')
        .style('opacity', 0)
        .attr({ "class": "city marker" })
        .attr({ name : function(d) { return d.properties.NAME; }})
        .each(function(d) {

          var coords = path.centroid(d);

          // city marker
          d3.select(this)
            .append('circle')
            .attr({
              cx : coords[0],
              cy : coords[1],
              r: size
            });

          // city label
          d3.select(this)
            .append('text')
            .text(function(d) {
              if (d.properties.NAME === 'Dar\'a') {
                return "daraa";
              }
              return d.properties.NAME.toLowerCase();
            })
            .attr({
              x : coords[0] + size * 2.5,
              y : coords[1] + size
            });
        });

      Util.addOnInViewCallback(function() {
        citiesMarkers
          .transition()
          .delay(function(d, i) {
            return i * 50;
          }).style('opacity', 1);
      }, this);

      var capitalData = topojson.feature(geoData, geoData.objects.capital).features;
      var capitalMarker = citiesg.selectAll('g.capital')
        .data(capitalData);
      var sym = d3.svg.symbol().type('cross');

      capitalMarker.enter()
        .append('g')
        .attr("class", "capital")
        .each(function(d) {

          var coords = path.centroid(d);

          // city marker
          d3.select(this)
            .append('path')
            .attr({
              "class": "city marker",
              "transform" : "translate("+coords[0]+","+coords[1]+") scale(0.9)",
              "d" : "M 0.000 4.000 L 5.878 8.090 L 3.804 1.236 L 9.511 -3.090 L 2.351 -3.236 L 0.000 -10.000 L -2.351 -3.236 L -9.511 -3.090 L -3.804 1.236 L -5.878 8.090 L 0.000 4.000"
            });

          // city label
          d3.select(this)
            .append('text')
            .text(function(d) { return d.properties.NAME; })
            .attr({
              x : coords[0] + size * 4,
              y : coords[1] + 6
            });
        });

      Util.addOnInViewCallback(function() {
        capitalMarker
          .transition()
          .style('opacity', 1);
      }, this);

      return Promise.resolve(args);

    });
  },

  makeToggle: function(args) {
    var on = true;
    $('span.icon-info2').on('click', function(ev) {
      $('#container')
        .toggleClass('js-show-text', on)
        .toggleClass('js-hide-text', !on);
      on = !on;
    });

    return Promise.resolve(args);
  }
};