var margin = 100;
var year = '2014';
var specialColors = {
  'highlight' : 'MidnightBlue',
  'hidden' : '#fff',
  'lineDark' : '#555',
  'lineLight' : '#999'
};

var svg = d3.select("#map")
  .append("svg");
var projection = d3.geo.fahey();
var path = d3.geo.path()
  .projection(projection);


Promise.join(Data.getCountryStats(), Data.getMapFeatures(),
  function(countryStats, mapFeatures) {
    var args = {
      mapFeatures: mapFeatures,
      countryStats: countryStats.data,
      data_min: countryStats.data_min,
      data_max: countryStats.data_max
    };

    draw(args);

    window.addEventListener("resize", function() {
      svg.remove();
      svg = d3.select("#map").append("svg");
      draw(args);
    });
  });

/**
* Main draw routine. Expected args:
*   mapFeatures - map data
*   countryStats - country data
*   data_min - min value of refugees, likely 0?
*   data_max - max value of refugees, per year.
*/
function draw(args) {

  // get dimensions
  var dims = { width: 1000, height: 600 };

  var width = Math.min(dims.width - margin - margin, 900),
      height = width * 0.65;

  // full world zoom:
  projection
    .translate([dims.width / 2.25, height / 1.4])
    .scale(width * 0.25);

  // middle
  // projection
  //   .translate([dims.width / 4.7, dims.height / 0.6])
  //   .scale(dims.width * 1.2);

  svg.attr("width", dims.width)
     .attr("height", dims.height);

  svg.append("rect")
    .classed("sea", true)
    .attr({
      x : 0, y : 0, width: dims.width, height: dims.width
    })
    .style("fill", "#ccc");

  var colors = d3.scale.linear()
    .domain([args.data_min, args.data_max])
    .range(['#fff', 'red']);

  // ---- render map of countries ----
  var countriesGroup = svg.append("g")
    .classed("countries", true);

  var countries = countriesGroup.selectAll("path")
    .data(args.mapFeatures, function(d) { return d.properties.name; });

  // add new elements on enter
  countries.enter().append("path")
    .attr("name", function(d) {
      return d.properties.name;
    })
    .style("fill", function(d) {
      // do we have data for this country?
      if (d.properties.name === 'Syria') {
        return specialColors.highlight;
      // } else if (typeof args.countryStats[d.properties.name] !== 'undefined') {
      //   return colors(args.countryStats[d.properties.name][year]);
      } else {
        return specialColors.hidden;
      }
    })
    .style('stroke', function(d) {
      // if (d.properties.name === 'Syria') {
      //   return specialColors.highlight;
      // } else if (typeof args.countryStats[d.properties.name] !== 'undefined') {
      //   return colors(args.countryStats[d.properties.name][year]);
      // } else {
      //   return specialColors.hidden;
      // }

      return specialColors.lineLight;
    })
    .style('stroke-width', function(d) {
      return '1px';
    });

  d3.selectAll("path[raise=true]").moveToFront();
  var syria = d3.select('path[name="Syria"]').moveToFront();
  var syriaCenter = path.centroid(syria.datum());
  d3.select('path[name="Antarctica"]').remove();

  // set the path and attr
  countries.attr("d", path);

  //=== add circle to each ===
  var circleScale = d3.scale.sqrt()
    .domain([args.data_min, args.data_max])
    .range([3, 40]);

  var circleOpacityScale = d3.scale.sqrt()
    .domain([args.data_min, args.data_max])
    .range([0.2, 0.6]);

  var circlesg = svg.append("g")
    .classed("circles", true);

  var circlesbinding = circlesg.selectAll('g')
    .data(args.mapFeatures, function(d) { return d.properties.name; });

  circlesbinding.enter()
    .append('g')
    .each(function(d) {

      var g = d3.select(this);

      // -- append cirlce
      var r = 3, opacity = 0.2;

      // find centroid
      var centroid = path.centroid(d);

      // set radius
      if (typeof args.countryStats[d.properties.name] !== 'undefined') {
        r = circleScale(args.countryStats[d.properties.name][year]);
        opacity = circleOpacityScale(args.countryStats[d.properties.name][year]);
      }

      g.append('circle').attr({
        'cx' : centroid[0],
        'cy' : centroid[1],
        'r'  : r,
        'opacity': opacity
      });

      // -- append center lbl
      g.append('text').attr({
        'x' : centroid[0],
        'y' : centroid[1] + 2,
        'text-anchor' : 'middle',
        'font-size' : 8,
        'font-family': 'sans-serif',
        'fill' : 'DarkSlateGray',
        'opacity': 0.5
      }).text('x');


    });

  // move syria to the front
  // syria.remove();
  // svg.append("g").node()
  //   .appendChild(syria.node());

}