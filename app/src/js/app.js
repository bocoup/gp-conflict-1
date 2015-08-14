var margin = 100;
var countrydata, statsdata = {};

var svg = d3.select("#map")
  .append("svg");
var projection = d3.geo.fahey();
var path = d3.geo.path()
  .projection(projection);


// load map shape file
d3.json('data/world_map_topojson.json', function(error, topology) {

  if (error) {
    throw error;
  }
  // cache geodata
  countrydata = topojson.feature(topology, topology.objects.countries)
    .features;
});

// load stats data
d3.json('data/stats.json', function(error, stats) {

  if (error) {
    throw error;
  }

  // transform stats into a hashmap.
  stats.forEach(function(country) {
    statsdata[country.Destination] = {
      '2011' : stats['2011'],
      '2012' : stats['2012'],
      '2013' : stats['2013'],
      '2014' : stats['2014']
    };
  });
});

function draw() {

  // get dimensions
  var dims = Util.getWindowSize();

  var width = Math.min(dims.width - margin - margin, 900),
      height = width * 0.65;

  projection
    .translate([dims.width / 2.25, height / 1.75])
    .scale(width * 0.2);

  svg.attr("width", dims.width)
     .attr("height", dims.height);

  var countries = svg.selectAll("path")
    .data(countrydata);

  // add new elements on enter
  countries.enter().append("path")
    .attr("name", function(d) {
      return d.properties.name;
    });

  // set the path and attr
  countries.attr("d", path);
}

draw();

window.addEventListener("resize", function() {
  draw();
});