var path = window.path || null;

var makeWaffles = Promise.method(function(args) {
  var map = args[0];
  var regionProp = args[1];
  var getGeoFunc = args[2];

  // sizes
  var countries = ["Turkey", "Iraq", "Lebanon", "Egypt"];
  var rectDim = 10;
  var padding = 4;
  var divider = 50000; // per 100,000 refugees
  var dataProp = 'Refugees_2014';

  return Promise.join(Data.getCountryStats(), Data[getGeoFunc]()).then(function() {

    var data = arguments[0][0].data;
    var geoData = arguments[0][1];
    geoData = topojson.feature(geoData, geoData.objects[regionProp]).features;

    var rectsPerSide = 0;

    countries.forEach(function(c) {
      // find rectsPerSide divided by the divider value
      rectsPerSide = Math.max(data[c][dataProp] / divider, rectsPerSide);
    });

    rectsPerSide = Math.ceil(Math.sqrt(rectsPerSide)); // round up the square root.

    var maxWidth = (rectsPerSide * rectDim) + (padding * (rectsPerSide - 1));

    var waffleg = map.append("g")
      .classed("waffles", true);

    var wafflesGroupBinding = waffleg.selectAll('g.waffle')
      .data(geoData);

    var wafflesGroups = wafflesGroupBinding.enter()
      .append('g')
      .classed('waffle', true)
      .each(function(d) {
        var coords = path.centroid(d);
        var countryName = d.properties.NAME;

        // only render waffle charts for countries in our filter list
        if (countries.indexOf(countryName) > -1) {

          var howManyRects = Math.floor(data[countryName][dataProp] / divider);
          var remainder = (data[countryName][dataProp] % divider) / divider; // percentage

          var waffleContainer = d3.select(this)
            .attr({
              "transform" : "translate("+(coords[0] -
                ((Math.min(rectsPerSide, howManyRects) * (rectDim + padding)) / 2) -
                padding)+","+(coords[1] + 10)+")",
            });

          var col = 0;
          var row = 0;
          var rect;
          for(var i = 0; i <= howManyRects; i++) {
            if (i < howManyRects) {

              rect = waffleContainer.append('rect')
                .attr({
                  x : col * rectDim + col * padding,
                  y : row * rectDim + row * padding,
                  width: rectDim, height: rectDim
                });

            } else {
              // half rect, for remainder
              rect = waffleContainer.append('rect')
                .attr({
                  x : col * rectDim + col * padding,
                  y : row * rectDim + row * padding,
                  width: rectDim, height: (rectDim * remainder)
                });
            } // eo -if

            // full rects
            if (++col > rectsPerSide) {
              col = 0;
              row++;
            }
          } // eo -for

          waffleContainer.selectAll('rect').style('opacity', 0)
              .transition()
              .duration(100)
              .delay(function(d,i) { return i * 100; })
              .style('opacity',1);
        }

      });

    return Promise.resolve(args);
  });
});

Map.makeRaster('#map',
    imageRegionPairs.region.image,
    imageRegionPairs.region.geoProp,
    imageRegionPairs.region.geoGet)

  .then(Map.makeRegions)
  .then(Map.makeLabels)
  .then(makeWaffles);
