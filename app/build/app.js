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
var margin = 100;
var year = '2014';
var countrydata, statsdata = {};

var svg = d3.select("#map")
  .append("svg");
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

  var colors = d3.scale.linear()
    .domain([args.data_min, args.data_max])
    .range(['#eaeaea', 'red']);

  var countries = svg.selectAll("path")
    .data(countrydata);

  // add new elements on enter
  countries.enter().append("path")
    .attr("name", function(d) {
      return d.properties.name;
    })
    .style("fill", function(d) {
      // do we have data for this country?
      if (d.properties.name === 'Syria') {
        return '#499EBA';
      } else if (typeof statsdata[d.properties.name] !== 'undefined') {
        return colors(statsdata[d.properties.name][year]);
      } else {
        if (d.properties.name === 'Antarctica') {
          return '#fff';
        } else {
          return '#eaeaea';
        }
      }
    })
    .style('stroke', function(d) {
      if (d.properties.name === 'Syria') {
        return '#499EBA';
      } else {
        return '#fff';
      }
    })
    .style('stroke-width', function(d) {
      if (d.properties.name === 'Syria') {
        return '1px';
      } else {
        return '0px';
      }
    });

  d3.select('path[name="Syria"]').moveToFront();

  // set the path and attr
  countries.attr("d", path);
}


