var path = window.path || null;

var makeCities = function(args) {

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
          .text(function(d) { return d.properties.NAME.toLowerCase(); })
          .attr({
            x : coords[0] + size * 2.5,
            y : coords[1] + size
          });
      });

    citiesMarkers
      .transition()
      .delay(function(d, i) {
        return i * 50;
      }).style('opacity', 1);

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

    capitalMarker
      .transition()
      .style('opacity', 1);

  });
};

Map.makeRaster('#map',
    imageRegionPairs.syria.image,
    imageRegionPairs.syria.geoProp,
    imageRegionPairs.syria.geoGet)
  .then(Map.makeRegions)
  .then(Map.makeLabels)
  .then(makeCities);