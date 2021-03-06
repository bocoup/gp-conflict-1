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
  var scaleFactor = 0.6;
  var campsg = map.append("g").attr("class", "camps");
  var idpg = map.append("g").attr("class", "idps");
  var crossingsg = map.append("g").attr("class", "crossings");

  var onMouseover = function(d) {
    d3.select(this).classed('selected', true).moveToFront();
  };
  var onMouseout = function(d) {
    d3.select(this).classed('selected', false);
  };

  return Data.getRegionGeo().then(function(camps) {

    // ==== crossings
    var crossingsData = topojson.feature(camps, camps.objects.crossings).features;
    var crossingMarkersBinding = crossingsg.selectAll('g.crossing')
      .data(crossingsData);

    var size = 3;
    var crossingsGroups =crossingMarkersBinding.enter()
      .append('g')
      .each(function(d) {
        var coords = path.centroid(d);
        d3.select(this).attr({
          "transform": "translate("+coords[0]+","+coords[1]+")"
        });
      });


    var crossingsMarkerPaths = crossingsGroups
      .append('rect')
      .each(function(d) {
        var coords = path.centroid(d);
        d3.select(this).attr({
          "class": "crossing marker",
          "transform": "scale("+scaleFactor+")",
          x : -size, width: size*2,
          y : -size, height: size*2
        });
      });

    // ==== camps
    var campsData = topojson.feature(camps, camps.objects.camps).features;
    var sym = d3.svg.symbol()
      .type('triangle-up');

    var campMarkersBinding = campsg.selectAll('g.camp')
      .data(campsData);

    var campsGroups = campMarkersBinding.enter()
      .append('g')
      .attr("class", "camp marker")
      .each(function(d) {
          var coords = path.centroid(d);
          d3.select(this).attr({
            "transform": "translate("+coords[0]+","+coords[1]+")"
          });
        });

    var campMarkerPaths = campsGroups.append('path')
        .attr('d', sym)
        .style('opacity', 0)
        .attr("transform", "scale("+scaleFactor+")")
        .each(Util.tipsyIt(function(d) {
          return 'Refugee Camp: <span class="campname"><br/>' + d.properties.NAME + "</span>";
        }))
        .on('mouseover', onMouseover)
        .on('mouseout', onMouseout);

    Util.addOnInViewCallback(function() {
      campMarkerPaths.transition()
        .delay(function(d, i) { return i * 50; })
        .style('opacity', 1);
    }, this);

    // ==== idp sites
    var idpData = topojson.feature(camps, camps.objects.idp).features;
    sym = d3.svg.symbol()
      .type('triangle-down');

    var idpMarkersBinding = idpg.selectAll('g.idp')
      .data(idpData);

    var idpsGroups = idpMarkersBinding.enter()
      .append('g')
      .each(function(d) {
        var coords = path.centroid(d);
        d3.select(this).attr({
          "class": "idp marker",
          "transform": "translate("+coords[0]+","+coords[1]+")"
        });
      });

    var idpMarkerPaths = idpsGroups.append('path')
      .attr('d', sym)
      .style('opacity', 0)
      .attr("transform", "scale("+scaleFactor+")")
      .each(Util.tipsyIt(function(d) {
        return 'Displacement Camp: <span class="campname"><br/>' + d.properties.NAME + "</span>";
      }))
      .on('mouseover', onMouseover)
      .on('mouseout', onMouseout);

    Util.addOnInViewCallback(function() {
      idpMarkerPaths.transition()
        .delay(function(d, i) { return i * 50; })
        .style('opacity', 1);
    }, this);


    Util.addOnInViewCallback(function() {
      if (Modernizr.testProp('transform')) {
        d3.select('#map').transition()
          .duration(2000).delay(1000).style({
          transform: "scale(2) translate(0px, 60px)"
        });
      } else {
        d3.select('#map').transition()
          .duration(2000).delay(1000)
          .styleTween("-webkit-transform", function() {
            return d3.interpolateString(
              "scale(1) translate(0px,0px)",
              "scale(2) translate(0px, 60px)"
            );
          });
      }
    }, this);

    return Promise.resolve(args);
  });
}

var fixSizing = Promise.method(function(args) {
  d3.select('g.capital path').attr("d",
    "M 0.000 1.000 L 1.763 2.427 L 0.951 0.309 L 2.853 -0.927 L 0.588 -0.809 L 0.000 -3.000 L -0.588 -0.809 L -2.853 -0.927 L -0.951 0.309 L -1.763 2.427 L 0.000 1.000"
  );

  var t = d3.select('g.capital text');
  var x = t.attr('x');
  var y = t.attr('y');

  t.attr({ x : x - 4, y : y - 4 });
  return Promise.resolve(args);
});

var bindInView = function(args) {
  $('body').on('inview', function(e) {
    Util.callInViewCallbacks();
  });
};

Map.makeRaster('#map',
    imageRegionPairs.region.image,
    imageRegionPairs.region.geoProp,
    imageRegionPairs.region.geoGet)
  .then(Map.makeToggle)
  .then(Map.makeRegions)
  .then(Map.makeLabels)
  .then(Map.makeCities)
  .then(fixSizing)
  .then(makeCamps)
  .then(bindInView);