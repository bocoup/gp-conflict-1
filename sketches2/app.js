var width = 960,
    height = 800;

var path = d3.geo.path()
    .projection(null);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("region.json", function(error, region) {
  if (error) throw error;
  var map = svg.append("g")
    .attr("transform", "translate(15,4) scale(0.97)");

  var data = topojson.feature(region, region.objects.countries).features;
  var countries = map.selectAll("path")
      .data(data);

  var labels = map.selectAll("text")
    .data(data);

  countries.enter().append("path")
    .attr("class", "land")
    .attr("d", path);

  var exclude = ["Israel", "Palestine", "Jordan"];

  labels.enter().append("text")
    .attr("class", "countryname")
    .text(function(d) {
      if (exclude.indexOf(d.properties.name) === -1) {
        return d.properties.name;
      } else {
        return "";
      }
    })
    .attr({
      x : function(d) { return path.centroid(d)[0]; },
      y : function(d) { return path.centroid(d)[1]; }
    });

  countries.on('mouseover', function(d) {
    d3.select(this).classed('selected', true);
  });

  countries.on('mouseout', function(d) {
    d3.select(this).classed('selected', false);
  });

});

d3.select(self.frameElement).style("height", height + "px");