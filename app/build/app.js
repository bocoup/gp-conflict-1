(function() {


    window.Util = {
    /**
    * Preloads images
    */
    preloadImage: function(url) {
      var img = new Image();
      img.src = url;
    },

    /**
    * returns a 0 for a given value if it is NaN, otherwise
    * returns the number.
    * @param n number
    * @returns number
    */
    zeroIfNan: function(n) {
      return isNaN(n) ? 0 : +n;
    },

    tipsyIt : function(fn) {
      return function(d) {
        $(this).tipsy({
          html: true,
          gravity: 'e',
          title: function() { return fn(d); }
        });
      };
    }
  };

  var callbacks = [];

  /**
  * Adds a callback to be executed as part of a group
  * @param callback Function
  * @param context object to execute the callback in teh context of
  * @param args Array with potential arguments to pass to the callback
  */
  Util.addOnInViewCallback = function(callback, context, args) {
    callbacks.push([callback, context, args]);
  };

  /**
  * Calls all avaiable callbacks
  */
  Util.callInViewCallbacks = function() {
    callbacks.forEach(function(tripple) {
      tripple[0].call(tripple[1], tripple[2]);
    });
  };

  /**
  * d3, move node to front
  */
  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
    this.parentNode.appendChild(this);
    });
  };
}());
var path = window.path || null;

/**
* Raster Map Maker
*/
window.Map = {

  // Makes image raster map
  // puts it into an element
  // follows up with adding an SVG to the mix and
  // an overall container group for all the things that will
  // live in it.
  makeRaster : Promise.method(function(el, img, regionProp, getGeoFunc) {

    // var width = 960,
    //   height = 800;

    // append raster
    // d3.select(el).append('img')
    //   .attr('src', img);


    // add svg
    var svg = d3.select(el).append("svg")
      // .attr("width", width)
      // .attr("height", height)
      // .attr("viewBox", "0 0 " +width+ " "+height+"")
      .style('background-image', 'url('+img + ')')
      .attr("preserveAspectRatio", "xMidYMid");

    // add group container
    var map = svg.append("g");

    path = d3.geo.path()
       .projection(null);

    return Promise.resolve([map, regionProp, getGeoFunc]);
  }),

  // adds a geojson layer that will
  // render invisible regions on top of map. Useful for lining things up
  // during development.
  makeRegions: function(args) {
    var map = args[0];
    var regionProp = args[1];
    var getGeoFunc = args[2];

    return Data[getGeoFunc]().then(function(geoData) {

      var data = topojson.feature(geoData, geoData.objects[regionProp]).features;
      var countries = map.selectAll("path.land")
          .data(data);

      countries.enter().append("path")
        .attr("name", function(d) { return d.properties.name; })
        .attr("class", "land")
        .attr("d", path);

      return Promise.resolve([map, regionProp, getGeoFunc]);
    });
  },

  // adds labels. Uses the same regions as before.
  makeLabels: function(args) {
    var map = args[0];
    var regionProp = args[1];
    var getGeoFunc = args[2];

    return Data[getGeoFunc]().then(function(geoData) {
      var data = topojson.feature(geoData, geoData.objects[regionProp]).features;
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
          y : function(d) { return path.centroid(d)[1] + (d.properties.NAME === 'Jordan' ? 20 : 0); }
        });

      return Promise.resolve([map, regionProp, getGeoFunc]);
    });
  },

  makeCities: function(args) {

    var map = args[0],
      regionProp = args[1],
      getGeoFunc = args[2];

    var citiesg = map.append("g").classed("cities", true);
    return Data[getGeoFunc]().then(function(geoData) {

      var citiesData = topojson.feature(geoData, geoData.objects.cities).features;
      var citiesMarkers = citiesg.selectAll('g.city')
        .data(citiesData);

      var size = 3;
      citiesMarkers.enter()
        .append('g')
        .style('opacity', 0)
        .attr({ "class": "city marker" })
        .attr({ name : function(d) { return d.properties.NAME; }})
        .each(function(d) {

          var coords = path.centroid(d);

          // city marker
          d3.select(this)
            .append('circle')
            .attr({
              cx : coords[0],
              cy : coords[1],
              r: size
            });

          // city label
          d3.select(this)
            .append('text')
            .text(function(d) {
              if (d.properties.NAME === 'Dar\'a') {
                return "daraa";
              }
              return d.properties.NAME.toLowerCase();
            })
            .attr({
              x : coords[0] + size * 2.5,
              y : coords[1] + size
            });
        });

      Util.addOnInViewCallback(function() {
        citiesMarkers
          .transition()
          .delay(function(d, i) {
            return i * 50;
          }).style('opacity', 1);
      }, this);

      var capitalData = topojson.feature(geoData, geoData.objects.capital).features;
      var capitalMarker = citiesg.selectAll('g.capital')
        .data(capitalData);
      var sym = d3.svg.symbol().type('cross');

      capitalMarker.enter()
        .append('g')
        .attr("class", "capital")
        .each(function(d) {

          var coords = path.centroid(d);

          // city marker
          d3.select(this)
            .append('path')
            .attr({
              "class": "city marker",
              "transform" : "translate("+coords[0]+","+coords[1]+") scale(0.9)",
              "d" : "M 0.000 4.000 L 5.878 8.090 L 3.804 1.236 L 9.511 -3.090 L 2.351 -3.236 L 0.000 -10.000 L -2.351 -3.236 L -9.511 -3.090 L -3.804 1.236 L -5.878 8.090 L 0.000 4.000"
            });

          // city label
          d3.select(this)
            .append('text')
            .text(function(d) { return d.properties.NAME; })
            .attr({
              x : coords[0] + size * 4,
              y : coords[1] + 6
            });
        });

      Util.addOnInViewCallback(function() {
        capitalMarker
          .transition()
          .style('opacity', 1);
      }, this);

      return Promise.resolve(args);

    });
  },

  makeToggle: function(args) {
    var on = true;
    $('span.icon-info2').on('click', function(ev) {
      if (on) {
        $('#map').css('display', 'none');
        $('.minimap').css('display', 'none'); //syria.html
        $('.legend, .other').css('display', 'none'); // settling.html
        $('.contentbody').css('display', 'inherit');
      } else {
        $('#map').css('display', 'inherit');
        $('.minimap').css('display', 'inherit'); //syria.html
        $('.legend, .other').css('display', 'inherit'); // settling.html
        $('.contentbody').css('display', 'none');
      }
      on = !on;
    });

    return Promise.resolve(args);
  }
};
(function() {

  function general(url, callback) {
    return function() {
      var def = Promise.defer();
        d3.json(url, function(error, data) {
          if (error) { def.reject(error); }
          if (typeof callback !== 'undefined') { data = callback(data); }
          def.resolve(data);
        });
      return def.promise;
    };
  }

  window.Data = {

    getCountryStats: general('data/stats.json', function(stats) {

      var statsdata = {};

        var max = 0;
        var min = Infinity;
        var ratemax = 0;
        var ratemin = Infinity;
        // transform stats into a hashmap.
        stats.forEach(function(country) {
          var s = statsdata[country.Destination] = {
            'Refugees_2011' : Util.zeroIfNan(country['ref_2011']),
            'Refugees_2012' : Util.zeroIfNan(country['ref_2012']),
            'Refugees_2013' : Util.zeroIfNan(country['ref_2013']),
            'Refugees_2014' : Util.zeroIfNan(country['ref_2014']),
            'Population': Util.zeroIfNan(country['pop_2014']),
            'Population_2011': Util.zeroIfNan(country['pop_2011']),
            'Population_2012': Util.zeroIfNan(country['pop_2012']),
            'Population_2013': Util.zeroIfNan(country['pop_2013']),
            'Population_2014': Util.zeroIfNan(country['pop_2014']),
            'Rate': Util.zeroIfNan(country['rate_avg']),
          };

          // update max & min & ratemax & ratemin
          max = Math.max(s['Refugees_2011'], s['Refugees_2012'],
            s['Refugees_2013'], s['Refugees_2014'], max);
          min = Math.min(s['Refugees_2011'], s['Refugees_2012'],
            s['Refugees_2013'], s['Refugees_2014'], min);
          ratemax = Math.max(s['Rate'], ratemax);
          ratemin = Math.min(s['Rate'], ratemin);

        });

        return {
          data: statsdata,
          data_max: max,
          data_min: min,
          rate_max: ratemax,
          rate_min: ratemin
        };
    }),

    getRegionGeo: general('data/region.json'),
    getSyriaGeo: general('data/syria.json')
  };
}());
// Preload images
window.imageRegionPairs = {
  region: {
    image : 'images/Region.png',
    geoGet: 'getRegionGeo',
    geoProp: 'region'
  },

  syria: {
    image: 'images/Syria.png',
    geoGet: 'getSyriaGeo',
    geoProp: 'syria'
  },

  settling: {
    image : 'images/Region.png',
    geoGet: 'getRegionGeo',
    geoProp: 'region'
  },

  turkey: {
    image : 'images/Turkey.png',
    geoGet: 'getTurkeyGeo',
    geoProp: 'turkey'
  },

  lebanon: {
    image : 'images/Lebanon.png',
    geoGet: 'getLebanonGeo',
    geoProp: 'lebanon'
  },

  germany: {
    image : 'images/Germany.png',
    geoGet: 'getGermanyGeo',
    geoProp: 'germany'
  },

  worldRef: {
    image: 'images/WorldReference.png'
  }
};

Util.preloadImage(imageRegionPairs.region.image);
Util.preloadImage(imageRegionPairs.syria.image);
Util.preloadImage(imageRegionPairs.worldRef.image);
// Util.preloadImage(imageRegionPairs.turkey.image);
// Util.preloadImage(imageRegionPairs.lebanon.image);