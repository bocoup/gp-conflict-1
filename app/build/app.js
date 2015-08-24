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
          '2014' : Util.zeroIfNan(country['2014']),
          'Population': Util.zeroIfNan(country['2014_pop']),
          'Population_2011': Util.zeroIfNan(country['2011_pop']),
          'Population_2012': Util.zeroIfNan(country['2012_pop']),
          'Population_2013': Util.zeroIfNan(country['2013_pop']),
          'Population_2014': Util.zeroIfNan(country['2014_pop']),
          'Total': Util.zeroIfNan(country['T']),
          'Rate': Util.zeroIfNan(country['rate_avg']),
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
// get data
var getStats = Data.getCountryStats();

// get window dimensions... note this isn't built for resizing yet.
var dims = Util.getWindowSize();

var SlopeGraph = function(el, data, dims, left, right, label) {

  this.dims = dims;

  // use first 10 countries
  this.data = d3.entries(data).slice(0,7);

  // fields/functions to use for sides.
  this.left = left;
  this.right = right;
  this.label = label;

  // margins for labels
  this.labelMargins = 100;
  this.verticalMargins = 20;

  // base for slope graph
  this.svg = d3.select(el)
    .append('svg')
    .attr('width', dims.width)
    .attr('height', dims.height)
    .append('g')
    .attr('transform', 'translate(0, '+this.verticalMargins+')');
};

SlopeGraph.prototype.render = function() {
  var self = this;

  // the y extent should be the min across left and right
  // going to the max across left and right.
  var leftExtent = d3.extent(this.data, this.left);
  var rightExtent = d3.extent(this.data, this.right);
  var overallExtent = [
    Math.min(leftExtent[0], rightExtent[0]),
    Math.max(leftExtent[1], rightExtent[1])
  ];

  // define y scale
  var yScale = d3.scale.linear()
    .domain(overallExtent)
    .range([this.dims.height - (2 * this.verticalMargins), 0]);

  // === draw y axes
  var axes = this.svg.append("g")
    .classed("axes", true);

  var axesPos = { x1 : 0, y1 : 0, x2: 0, y2 : this.dims.height - 2 * this.verticalMargins};

  // left -> right
  axes.append("line")
    .attr(axesPos)
    .attr("transform", "translate(" + this.labelMargins + ",0)");
  axes.append("line")
    .attr(axesPos)
    .attr("transform", "translate(" + (this.dims.width - this.labelMargins) + ",0)");

  // === draw labels
  // each label: g (2 text, one left, one right.)
  var labelsContainer = this.svg.append("g")
    .classed("labels", true);

  var labels = labelsContainer.selectAll("g")
    .data(this.data, function(d) { return d.key; });

  var lg = labels.enter()
    .append("g");

    function getY(attr) {
      return function(d) {
        if (typeof self[attr] === "function") {
          return yScale(self[attr](d));
        } else {
          return yScale(d.value[self[attr]]);
        }
      };
    }

    lg.append("text")
      .classed("left", true)
      .attr({
        x : 0,
        y: getY('left')
      })
      .text(function(d) { return d.key; });

    lg.append("text")
      .classed("right", true)
      .attr({
        x : 0,
        y: getY('right')
      })
      .attr("transform", "translate("+(this.dims.width - this.labelMargins)+",0)")
      .text(function(d) { return d.key; });

  // === draw lines
  var lines = this.svg.append("g")
    .classed("lines", true)
    .selectAll('line')
    .data(this.data, function(d) { return d.key; });

  lines.enter()
    .append("line")
    .attr({
      x1 : 0,
      x2 : this.dims.width - (2 * this.labelMargins),
      y1 : getY('left'),
      y2 : getY('right'),
      transform : "translate(" + this.labelMargins + ",0)"
    });
};

getStats.then(function(stats) {
  var dims = {
    width: 500, height: 600
  };
  var s = new SlopeGraph('#map-3 .slope1', stats.data, dims, function(d) {
    return d.value['2012'];
  }, function(d) {
    return d.value['2014'];
  }, 'Destination');
  s.render();


  var s2 = new SlopeGraph('#map-3 .slope2', stats.data, dims, function(d) {
    console.log(d.key, d.value['2012'] / d.value['Population_2012']);
    return d.value['2012'] / d.value['Population_2012'];
  }, function(d) {
    return d.value['2014'] / d.value['Population_2014'];
  }, 'Destination');
  s2.render();


});