var images = ['images/Region.png']
images.forEach(function(i) {
  Util.preloadImage(i);
});

var path;
var mapRaster = Promise.method(function(el, img) {

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

  return Promise.resolve(map);
});

function makeRegions(map) {
  return Data.getGeo().then(function(region) {

    var data = topojson.feature(region, region.objects.region).features;
    var countries = map.selectAll("path.land")
        .data(data);

    countries.enter().append("path")
      .attr("name", function(d) { return d.properties.name; })
      .attr("class", "land")
      .attr("d", path);

    return map;
  });
}

var makeLabels = function(map) {

  return Data.getGeo().then(function(region) {
    var data = topojson.feature(region, region.objects.region).features;
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

    return map;
  });
};

var makeHoverable = Promise.method(function(map) {
  map.selectAll('.land').on('mouseover', function(d) {
    d3.select(this).classed('selected', true);
  }).on('mouseout', function(d) {
    d3.select(this).classed('selected', false);
  });
  return Promise.resolve(map);
});

function makeCamps(map) {

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

  var onMouseover = function(d) { d3.select(this).classed('selected', true).moveToFront(); }
  var onMouseout = function(d) { d3.select(this).classed('selected', false); }

  Data.getCamps().then(function(camps) {

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
    var sym = d3.svg.symbol()
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
      .on('mouseout', onMouseout)

    idpMarkers.transition()
      .style('opacity', 1);

    d3.select('#map').transition().delay(1000).style({
      transform: "scale(2) translate(-50px, 50px)"
    });

  });
}



mapRaster('#map', images[0])
  .then(makeRegions)
  .then(makeLabels)
  .then(makeHoverable)
  .then(makeCamps);

// showCamps('#map');


