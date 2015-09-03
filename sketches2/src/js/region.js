var path = window.path || null;

var makeHoverable = Promise.method(function(args) {
  var map = args[0];

  map.selectAll('.land').on('mouseover', function(d) {
    d3.select(this).classed('selected', true);
  }).on('mouseout', function(d) {
    d3.select(this).classed('selected', false);
  });
  return Promise.resolve(args);
});

function makeCamps(args) {
  var map = args[0];

  var campsg = map.append("g");
  var idpg = map.append("g");

  var tipsyIt = function(fn) {
    return function(d) {
      $(this).tipsy({
        html: true,
        gravity: 'e',
        title: function() { return fn(d); }
      });
    };
  };

  var onMouseover = function(d) {
    d3.select(this).classed('selected', true).moveToFront();
  };
  var onMouseout = function(d) {
    d3.select(this).classed('selected', false);
  };

  return Data.getRegionGeo().then(function(camps) {

    // crossings
    var crossingsData = topojson.feature(camps, camps.objects.crossings).features;
    var crossingMarkers = campsg.selectAll('rect.crossing')
      .data(crossingsData);

    var size = 3;
    crossingMarkers.enter()
      .append('rect')
      .each(function(d) {
        var coords = path.centroid(d);
        d3.select(this).attr({
          "class": "crossing marker",
          x : coords[0] -size, width: size*2,
          y : coords[1] - size, height: size*2
        });
      });

    // camps
    var campsData = topojson.feature(camps, camps.objects.camps).features;
    var sym = d3.svg.symbol()
      .type('triangle-up');

    var campMarkers = campsg.selectAll('path.camp')
      .data(campsData);

    campMarkers.enter()
      .append('path')
      .attr('d', sym)
      .style('opacity', 0)
      .each(function(d) {
        var coords = path.centroid(d);
        d3.select(this).attr({
          "class": "camp marker",
          "transform": "translate("+coords[0]+","+coords[1]+")"
        });
      })
      .each(tipsyIt(function(d) {
        return 'Refugee Camp: <span class="campname"><br/>' + d.properties.NAME + "</span>";
      }))
      .on('mouseover', onMouseover)
      .on('mouseout', onMouseout);

    campMarkers.transition()
      .style('opacity', 1);

    // idp sites

    var idpData = topojson.feature(camps, camps.objects.idp).features;
    sym = d3.svg.symbol()
      .type('triangle-down');

    var idpMarkers = idpg.selectAll('path.idp')
      .data(idpData);

    idpMarkers.enter()
      .append('path')
      .attr('d', sym)
      .style('opacity', 0)
      .each(function(d) {
        var coords = path.centroid(d);
        d3.select(this).attr({
          "class": "idp marker",
          "transform": "translate("+coords[0]+","+coords[1]+")"
        });
      })
      .each(tipsyIt(function(d) {
        return 'Displacement Camp: <span class="campname"><br/>' + d.properties.NAME + "</span>";
      }))
      .on('mouseover', onMouseover)
      .on('mouseout', onMouseout);

    idpMarkers.transition()
      .style('opacity', 1);

    d3.select('#map').transition().delay(1000).style({
      transform: "scale(2) translate(-50px, 50px)"
    });

    return Promise.resolve(args);
  });
}

Map.makeRaster('#map',
    imageRegionPairs.region.image,
    imageRegionPairs.region.geoProp,
    imageRegionPairs.region.geoGet)

  .then(Map.makeRegions)
  .then(Map.makeLabels)
  .then(makeCamps);