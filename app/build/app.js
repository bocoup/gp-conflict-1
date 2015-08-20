window.Util = {

  /**
  * Gets window size based on available properties on window or document
  * @returns dims Object with height and width properties if found. Else, null
  */
  getWindowSize : function() {
    var dims = { height: 0, width: 0 };

    if (typeof window.innerWidth !== "undefined") {
      dims.height = window.innerHeight;
      dims.width = window.innerWidth;
    } else if (typeof document.documentElement !== "undefined" &&
        typeof document.documentElement.clientWidth !== "undefined")  {
      dims.height = document.documentElement.clientHeight;
      dims.width = document.documentElement.clientWidth;
    }

    if (dims.height > 0 || dims.width > 0) {
      return dims;
    }

    return null;
  },

  /**
  * returns a 0 for a given value if it is NaN, otherwise
  * returns the number.
  * @param n number
  * @returns number
  */
  zeroIfNan: function(n) {
    return isNaN(n) ? 0 : +n;
  }
};

/**
* d3, move node to front
*/
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
  this.parentNode.appendChild(this);
  });
};
window.Data = {

  getCountryStats: function() {

    var statsdata = {};

    var def = Promise.defer();

    // load stats data
    d3.json('data/stats.json', function(error, stats) {

      if (error) {
        def.reject(error);
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

      def.resolve({
        data: statsdata,
        data_max: max,
        data_min: min
      });
    });

    return def.promise;
  },

  getMapFeatures: function() {
    var countrydata;

    var def = Promise.defer();

    // load map shape file
    d3.json('data/world_map_topojson.json', function(error, topology) {

      if (error) {
        def.reject(error);
      }
      // cache geodata
      countrydata = topojson.feature(topology, topology.objects.countries)
        .features;

      def.resolve(countrydata);
    });

    return def.promise;
  }
};

var margin = 100;
var year = '2014';
var specialColors = {
  'highlight' : '#499EBA',
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
  var dims = Util.getWindowSize();

  var width = Math.min(dims.width - margin - margin, 900),
      height = width * 0.65;

  // full world zoom:
  // projection
  //   .translate([dims.width / 2.25, height / 1.75])
  //   .scale(width * 0.2);

  // middle zoom
  projection
    .translate([dims.width / 2.25, height / 1.1])
    .scale(width * 0.4);

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
      } else if (typeof args.countryStats[d.properties.name] !== 'undefined') {
        return colors(args.countryStats[d.properties.name][year]);
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

  // ----- render lines -------
  var linesGroup = svg.append("g")
    .classed("groups", true);

  var lines = linesGroup.selectAll("line")
    .data(args.countryStats, function(d) { return d.properties.name; });

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
        if ((typeof args.countryStats[d.properties.name] !== 'undefined') &&
           (args.countryStats[d.properties.name][year] > 10000)) {
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
          if ((typeof args.countryStats[d.properties.name] !== 'undefined') &&
             (args.countryStats[d.properties.name][year] > 10000)) {
            return 2;
          } else {
            return 0;
          }
        },
        "stroke": function(d) {
          if (typeof args.countryStats[d.properties.name] !== 'undefined') {
            return colors(args.countryStats[d.properties.name][year]);
            //return '#222';
            //return '#499EBA';
          }
        }
      });

  // move syria to the front
  // syria.remove();
  // svg.append("g").node()
  //   .appendChild(syria.node());

}