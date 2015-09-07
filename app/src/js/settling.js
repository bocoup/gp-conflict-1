var path = window.path || null;

var rectDim = 10;
var divider = 50000; // per 100,000 refugees
var padding = 4;
var countries = ["Turkey", "Iraq", "Lebanon", "Egypt", "Jordan"];
var dataProp = 'Refugees_2014';
var rectsPerSide = 0;

var makeWaffle = function(waffleContainer, howManyRects, remainder) {
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
};

var makeWaffles = Promise.method(function(args) {
  var map = args[0];
  var regionProp = args[1];
  var getGeoFunc = args[2];

  return Promise.join(Data.getCountryStats(), Data[getGeoFunc]()).then(function() {

    var data = arguments[0][0].data;
    var geoData = arguments[0][1];
    geoData = topojson.feature(geoData, geoData.objects[regionProp]).features;

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
              "num": data[countryName][dataProp],
              "transform" : "translate("+(coords[0] -
                ((Math.min(rectsPerSide, howManyRects) * (rectDim + padding)) / 2) -
                padding)+","+(coords[1] + (countryName === 'Jordan' ? 30 : 10))+")",
            });

          makeWaffle(waffleContainer, howManyRects, remainder);
        }

      });

    waffleg.selectAll('rect').each(
      Util.tipsyIt(function(d) {
       return "<span class='val'>"+d3.format('0,')(data[d.properties.NAME][dataProp]) + "</span> refugees";
      })
    );

    return Promise.resolve(args);
  });
});

var makeRestOfWorld = Promise.method(function(args) {
  var map = args[0];

  return Data.getCountryStats().then(function(stats) {
    var data = stats.data;
    var keys = d3.keys(data);
    var sum = 0;
    var sumOtherCountries = 0;

    keys.forEach(function(country) {
      sum += data[country][dataProp];
      if (countries.indexOf(country) === -1) {
         sumOtherCountries += data[country][dataProp];
      }
    });

    d3.select('.other').style('display', 'inherit');

    d3.select('.other text').text('Rest of the World ('+d3.format('0%')(sumOtherCountries/sum)+')');

    var howManyRects = Math.floor(sumOtherCountries / divider);
    var remainder = (sumOtherCountries % divider) / divider; // percentage
    var waffleContainer = d3.select('.other g');

    makeWaffle(waffleContainer, howManyRects, remainder);

    waffleContainer.selectAll('rect').each(
      Util.tipsyIt(function(d) {
       return "<span class='val'>"+d3.format('0,')(sumOtherCountries) + "</span> refugees";
      })
    );
  });

});

var makeLegend = Promise.method(function(args) {
  var legend = d3.select('.legend').append("g")
    .attr("transform", "translate(20, 20)");

  legend.append('rect')
    .attr({
      x: 0, y : 0, width: rectDim, height: rectDim
    });

  legend.append('text')
    .attr({
      x : rectDim + padding * 2, y : 10
    })
    .text(d3.format("0,")(divider) + " refugees");

  return Promise.resolve(args);
});

Map.makeRaster('#map',
    imageRegionPairs.region.image,
    imageRegionPairs.region.geoProp,
    imageRegionPairs.region.geoGet)

  .then(Map.makeRegions)
  .then(Map.makeLabels)
  .then(makeWaffles)
  .then(makeRestOfWorld)
  .then(makeLegend);
