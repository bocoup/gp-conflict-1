var margin = 100;
var year = '2014';
var countrydata, statsdata = {};
var specialColors = {
  'highlight' : '#59634F',
  'hidden' : '#fff',
  'lineDark' : '#555',
  'lineLight' : '#999'
};

var years = ['2011', '2012', '2013', '2014'];

d3.selectAll('.sketch').style("display", "none");

var allSvgs = d3.select("#map-3").style("display", null)
  .selectAll("svg")
  .data(years);

var projection = d3.geo.fahey();
var path = d3.geo.path()
  .projection(projection);

// tiny data load tracker, kicking off rendering when all data
// is ready.
var ready = (function() {
  var howmany = 0;
  var args = {};

  return function(opts) {

    if (typeof opts !== 'undefined') {
      // copy args, this only does flat args...
      for (var attrname in opts) { args[attrname] = opts[attrname]; }
    }

    if (++howmany === 2) {
      draw(args);

      window.addEventListener("resize", function() {
        allSvgs.remove();
        allSvgs = d3.select("#map").selectAll("svg").data(years);
        draw(args);
      });
    }
  };
}());

// load map shape file
d3.json('data/world_map_topojson.json', function(error, topology) {

  if (error) {
    throw error;
  }
  // cache geodata
  countrydata = topojson.feature(topology, topology.objects.countries)
    .features;

  ready();
});

// load stats data
d3.json('data/stats.json', function(error, stats) {

  if (error) {
    throw error;
  }

  var max = 0;
  var min = 0;
  // transform stats into a hashmap.
  stats.forEach(function(country) {
    var s = statsdata[country.Destination] = {
      '2011' : Util.zeroIfNan(country['2011']),
      '2012' : Util.zeroIfNan(country['2012']),
      '2013' : Util.zeroIfNan(country['2013']),
      '2014' : Util.zeroIfNan(country['2014'])
    };

    s['Total'] = s['2011'] + s['2012'] + s['2013'] + s['2014'];

    // update max
    max = Math.max(s['2011'], s['2012'], s['2013'], s['2014'], max);
    // max = Math.max(s[year], max);
  });

  ready({
    data_max: max,
    data_min: min
  });
});

/**
* Main draw routine. Expected args:
*   data_min - min value of refugees, likely 0?
*   data_max - max value of refugees, per year.
*/
function draw(args) {

  allSvgs.enter()
    .append("svg")
    .classed("map", true)
    .each(function(d) {

      var svg = d3.select(this),
        year = d;

      // get dimensions
      var dims = this.getBoundingClientRect();

      svg.append("rect")
        .classed("sea", true)
        .attr({
          x : 0, y : 0, width: dims.width, height: dims.width
        })
        .style("fill", "#ccc");

      var width = Math.min(dims.width - margin - margin, 900),
          height = width * 0.65;

      // // full world zoom:
      // // projection
      // //   .translate([dims.width / 2.25, height / 1.75])
      // //   .scale(width * 0.2);

      // middle zoom
      // projection
      //   .translate([dims.width / 4.5, dims.height / 0.2])
      //   .scale(width * 2.7);

      projection
        .translate([dims.width / 2 + 100, dims.height / 2 + 150])
        .scale(dims.width * 1.5);

      svg.attr("width", dims.width)
         .attr("height", dims.width);

      var colors = d3.scale.linear()
        .domain([args.data_min, args.data_max])
        .range(['#fff', 'red']);

      // ---- render map of countries ----
      var countriesGroup = svg.append("g")
        .classed("countries", true);

      var countries = countriesGroup.selectAll("path")
        .data(countrydata, function(d) { return d.properties.name; });

      // add new elements on enter
      countries.enter().append("path")
        .attr("name", function(d) {
          return d.properties.name;
        })
        .attr("raise", function(d) {
          if ((typeof statsdata[d.properties.name] !== 'undefined') &&
            ((statsdata[d.properties.name][year] > 10000))) {
            return true;
          } else {
            return false;
          }
        })
        .style("fill", function(d) {
          // do we have data for this country?
          if (d.properties.name === 'Syria') {
            return specialColors.highlight;
          } else if (typeof statsdata[d.properties.name] !== 'undefined') {
            return colors(statsdata[d.properties.name][year]);
          } else {
            return specialColors.hidden;
          }
        })
        .style('stroke', function(d) {
          if (d.properties.name === 'Syria') {
            return specialColors.highlight;
          } else if
            ((typeof statsdata[d.properties.name] !== 'undefined') &&
            ((statsdata[d.properties.name][year] > 10000))) {
            return specialColors.lineLight;
          } else {
            return specialColors.hidden;
          }

          //return specialColors.lineLight;
        })
        .style('stroke-width', function(d) {
          return '1px';
        });

      d3.selectAll("path[raise=true]").moveToFront();
      var syria = d3.select('path[name="Syria"]').moveToFront();
      var syriaCenter = path.centroid(syria.datum());
      d3.select('path[name="Antarctica"]').remove();

      var center = d3.geo.centroid(syria.datum());
      projection.center(center);

      // set the path and attr
      countries.attr("d", path);

      // ----- render lines -------
      var linesGroup = svg.append("g")
        .classed("groups", true);

      var lines = linesGroup.selectAll("line")
        .data(countrydata, function(d) { return d.properties.name; });

      var lineg = lines.enter()
        .append("g");


      var pos = {
        "x1" : syriaCenter[0],
        "y1" : syriaCenter[1],
        "x2" : function(d) {
          return path.centroid(d)[0];
        },
        "y2" : function(d) {
          return path.centroid(d)[1];
        }
      };

      // background black outline line
      lineg.append("line")
        .attr(pos)
        .style({
          'stroke-width':  function(d) {
            if ((typeof statsdata[d.properties.name] !== 'undefined') &&
               (statsdata[d.properties.name][year] > 10000)) {
              return 4;
            } else {
              return 0;
            }
          },
          'stroke': specialColors.lineDark
        });

      // color line
      lineg.append("line")
          .attr(pos)
          .style({
            "stroke-width": function(d) {
              // only show top 5%
              if ((typeof statsdata[d.properties.name] !== 'undefined') &&
                 (statsdata[d.properties.name][year] > 10000)) {
                return 2;
              } else {
                return 0;
              }
            },
            "stroke": function(d) {
              if (typeof statsdata[d.properties.name] !== 'undefined') {
                return colors(statsdata[d.properties.name][year]);
                //return '#222';
                //return '#499EBA';
              }
            }
          });

      // move syria to the front
      // syria.remove();
      // svg.append("g").node()
      //   .appendChild(syria.node());
    });


}


