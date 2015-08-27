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
this["JST"] = this["JST"] || {};

this["JST"]["panel1"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>Syrian Refugee Crisis</h3>\n\n<p>\nBetween 2011 and 2014, 5,181,510 people have been displaced from their homes in Syria.\n</p>';

}
return __p
};

this["JST"]["panel2"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>Response</h3>\n\n<p>\n  Many countries are responding by taking in refugees. This is\n  especially true about those countries that share a border with\n  Syria, such as Turkey and Lebanon\n</p>\n\n<div id="yearslider">\n\n</div>';

}
return __p
};

this["JST"]["panel3"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>Economic burden</h3>\n\n<p>\n  The economic burden placed on the host countries is hard\n  to quantify, but it is evident in countries like Lebanon. Lebanon has taken\n  as many refugees as a <b>1/3</b> of Lebanon\'s existing population.\n  You can see the impact of that on their GDP since 2011.\n</p>\n\n<div id="gdpimpact">\n</div>';

}
return __p
};

this["JST"]["panel4"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>Economic burden</h3>\n<p>\n  By comparison, the majority of the world has been slow to respond.\n  The four countries surrounding Syria: Turkey, Lebanon, Iraq and Egypt have\n  taken <b>95%</b> of the refugees since 2011.\n</p>\n<p>\n    Countries like Germany have taken on average 1.75 people for every 1000 citizens.\n    The United States has allowed 4.5 people for every 10,0000.\n    There is no noticible impact on the GDP of those countries.\n</p>\n\n<div id="gdpimpact">\n</div>';

}
return __p
};

this["JST"]["refugee_vs_population_burden"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3> ' +
((__t = ( d.id )) == null ? '' : __t) +
' </h3>\n<p>\n  The amount of refugees taken in by ' +
((__t = ( d.id )) == null ? '' : __t) +
' in 2014 constituted\n  <b>' +
((__t = ( d3.format('.2f')(d.data['Rate'] * 100) )) == null ? '' : __t) +
'%</b> of the overall country\n  population.\n</p>';

}
return __p
};

this["JST"]["total_refugees"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3> ' +
((__t = ( d.id )) == null ? '' : __t) +
' </h3>\n<p>\n  In 2014, ' +
((__t = ( d.id )) == null ? '' : __t) +
' took in <b>' +
((__t = ( d3.format('0,')(d.data['Refugees_2014']) )) == null ? '' : __t) +
'\n  </b> refugees.\n</p>';

}
return __p
};
(function() {

  // Zoom and centers for predefined regions.
  var centers = {
    "Syria": [[34.74161249883172, 37.452392578125], 7],
    "SyriaRegion" : [[36.19109202182454, 33.585205078125], 6],
    "World" : [[41.77131167976407, 18.544921875], 4],
    "Europe": [[48.31242790407178, 4.06494140625], 5],
    "US": [[54.521081495443596, -126.2548828125], 4]
  };

  var M = window.MapWrapper = function() {

    var self = this;

    // public auth token
    L.mapbox.accessToken = 'pk.eyJ1IjoiaXIwcyIsImEiOiJzRW9ObDVJIn0.Yjg0YkF_gr1teCBLJVyeoQ';

    // initialize base map container
    d3.select('#map')
      .style({
        width: $(window).width(),
        height: 600
      });

    this.map = L.mapbox.map('map', 'ir0s.n8mo8g3c'); // load map

    this.map.setView.apply(this.map, centers.World); // initial center
    this.map._initPathRoot(); // init svg

    // set up callout
    this.callout = $('.callout').click(function(event) {
      event.stopPropagation();
    }).mouseover(function(){
      self.map.dragging.disable();
      self.map.doubleClickZoom.disable();
    }).mouseout(function() {
      self.map.dragging.enable();
      self.map.doubleClickZoom.enable();
    });

    return this;
  };

  M.prototype.zoomTo = function(center) {
    this.map.setView.apply(this.map, centers[center], { animate: true });
  };

  M.prototype.closePopups = function() {
    this.map.closePopup();
  };

  M.prototype.popup = function(datum, template) {
    var popup = L.popup()
          .setLatLng(datum.LatLng)
          .setContent(JST[template]({ d : datum }));

    this.map.openPopup(popup, datum.LatLng);
    return popup;
  };

}());
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
      var min = Infinity;
      var ratemax = 0;
      var ratemin = Infinity;
      // transform stats into a hashmap.
      stats.forEach(function(country) {
        var s = statsdata[country.Destination] = {
          'Refugees_2011' : Util.zeroIfNan(country['2011_ref']),
          'Refugees_2012' : Util.zeroIfNan(country['2012_ref']),
          'Refugees_2013' : Util.zeroIfNan(country['2013_ref']),
          'Refugees_2014' : Util.zeroIfNan(country['2014_ref']),
          'Population': Util.zeroIfNan(country['2014_pop']),
          'Population_2011': Util.zeroIfNan(country['2011_pop']),
          'Population_2012': Util.zeroIfNan(country['2012_pop']),
          'Population_2013': Util.zeroIfNan(country['2013_pop']),
          'Population_2014': Util.zeroIfNan(country['2014_pop']),
          'Total': Util.zeroIfNan(country['total']),
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

      def.resolve({
        data: statsdata,
        data_max: max,
        data_min: min,
        rate_max: ratemax,
        rate_min: ratemin
      });
    });

    return def.promise;
  },

  getCountryCentroidFeatures: function() {
    var countrydata;

    var def = Promise.defer();

    // load map shape file
    d3.json('data/countries_centroids.geojson', function(error, centroids) {

      if (error) {
        def.reject(error);
      }

      def.resolve(centroids);
    });

    return def.promise;
  }
};
window.Config = {

  // rendering circle info
  circles: {
    range: [5,50],
    colors: {
      'Total' : 'teal',
      'Rate' : '#5C2691'
    }
  },

  modes: {
    "default": 'Total',
    total: 'Total',
    rate: 'Rate'
  },

  // default data year
  year: 'Refugees_2014',

};
(function() {
  var panels = [
    {
      template : "panel1",
      center: "Syria",
      nextCaption : "Who's responding? &raquo;",
      enter: Promise.method(function() {

      }),
      exit: Promise.method(function() {

      }),
    },
    {
      template : "panel2",
      center: "SyriaRegion",
      nextCaption: "Who is most affected? &raquo;",
      enter: Promise.method(function() {

      }),

      exit: Promise.method(function() {

      }),
    },
    {
      template : "panel3",
      center: "Europe",
      nextCaption: "Global impact &raquo;",
      enter: Promise.method(function() {

      }),

      exit: Promise.method(function() {

      }),
    },
    {
      template : "panel4",
      center: "US",
      nextCaption: "Start over &raquo;",
      enter: Promise.method(function() {

      }),

      exit: Promise.method(function() {

      }),
    },
  ];

  var P = window.PanelManager = function(mapWrapper, data) {
    var self = this;

    this.data = data;
    this.mapWrapper = mapWrapper;
    this.map = this.mapWrapper.map;

    this.callout = $('.callout');
    this.content = this.callout.find('.content');
    this.control = this.callout.find('.controls a');

    this.currentPanel = 0;

    this.control.click(function() {
      if (++self.currentPanel >= panels.length) {
        self.currentPanel = 0;
      }

      self.goTo(self.currentPanel);
    });
  };

  P.prototype.goTo = function(idx) {
    var self = this;

    if (idx >= panels.length) {
      throw new Error("panel " + idx + " doesn't exist." );
    }

    // stop current panel
    var exitPanel = panels[this.currentPanel].exit();

    // enter new panel
    exitPanel.then(function() {

      var panel = panels[idx];

      // pan map
      this.mapWrapper.zoomTo(panel.center);

      // update callout content
      self.content.html(JST[panel.template]());

      // update callout control text
      self.control.html(panel.nextCaption);

      return panel.enter();
    });


  };


}());
// start data fetching.
var getData = Data.getCountryStats(),
    getMap = Data.getCountryCentroidFeatures(),
    map, mapWrapper, panels;

// size mode, total default
var circleMode = Config.modes.default;
var circleTotalScale, circleRateScale;

$(function() {

  mapWrapper = new MapWrapper();
  map = mapWrapper.map;

  // // Disable drag and zoom handlers.
  // map.dragging.disable();
  // map.touchZoom.disable();
  // map.doubleClickZoom.disable();
  // map.scrollWheelZoom.disable();

  // // Disable tap handler, if present.
  // if (map.tap) {map.tap.disable();}

  // Pick up the SVG from the map object
  var svg = d3.select("#map .leaflet-map-pane").select("svg");
  var legend = d3.select('#map .legend');

  Promise.join(getData, getMap,
    function(countryStats, countryCenters) {
      var data = {
        countries: countryCenters,
        countryStats: countryStats.data,
        data_min: countryStats.data_min,
        data_max: countryStats.data_max,
        rate_min: countryStats.rate_min,
        rate_max: countryStats.rate_max
      };

      draw(data);
  });

  function drawLegend(args) {

  }

  function drawCircles(args) {

    var circlesg = svg.append("g")
      .classed("circles", true);

    var binding = circlesg.selectAll('circle')
      .data(args.countries.features, function(d) {
        return d.id; });

    binding.enter()
      .append('circle')
      .attr({
        'r' : function(d) { return d.r; },
        'country' : function(d) { return d.id; }
      }).style({
        'fill' : 'teal',
        'opacity': '0.5'
      });

    binding.on('mouseover', function(d) {
      var popup;
      if (circleMode === Config.modes.total) {
        popup = mapWrapper.popup(d, 'total_refugees');
      } else {
        popup = mapWrapper.popup(d, 'refugee_vs_population_burden');
      }
    });

    binding.on('mouseout', function(d) {
      mapWrapper.closePopups();
    });

    // add per capita switch
    $('.callout a').click(function(event) {
      var scale, text, attr;

      // if going to total, switch back.
      if (circleMode !== Config.modes.total) {
        circleMode = Config.modes.total;
        scale = circleTotalScale;
        text = 'Per Capita &raquo;';
        attr = Config.year;
      } else {

        // switch to rate
        scale = circleRateScale;
        text = 'Total &raquo;';
        attr = 'Rate';
        circleMode = Config.modes.rate;
      }

      // change button text
      $(this).html(text);

      // animate circle size
      binding.transition().ease('bounce')
        .attr('r', function(d) {
          var r = d3.select(this).attr('r');
          if (typeof args.countryStats[d.properties.name] !== 'undefined') {
            r = scale(args.countryStats[d.properties.name][attr]);
          }
          return r;
        }).style({
          'fill' : Config.circles.colors[circleMode]
        });
    });

    function update() {
      console.log("update");
      binding.attr(
        "transform", function(d) {
          return "translate("+
            map.latLngToLayerPoint(d.LatLng).x +","+
            map.latLngToLayerPoint(d.LatLng).y +")";
        }
      );
    }
    map.on("viewreset", update);
    update();

    return binding;
  }

  function draw(args) {

    // Total refugee scale
    circleTotalScale = d3.scale.sqrt()
      .domain([args.data_min, args.data_max])
      .range(Config.circles.range);

    // Per capita scale
    circleRateScale = d3.scale.sqrt()
      .domain([args.rate_min, args.rate_max])
      .range(Config.circles.range);

    // join layer to contain centroids and data
    args.countries.features.forEach(function(d) {
      var r = 5;

      if (typeof args.countryStats[d.properties.name] !== 'undefined') {
        r = circleTotalScale(args.countryStats[d.properties.name][Config.year]);
        d['LatLng'] = new L.LatLng(d.geometry.coordinates[1],
            d.geometry.coordinates[0]);
        d['r'] = r;
        d['id'] = d.properties.name;
        d['data'] = args.countryStats[d.properties.name];
      }
    });

    args.countries.features = args.countries.features.filter(function(d) {
      return (typeof d.id !== 'undefined');
    });

    panels = new PanelManager(mapWrapper, args.countryStats);
    panels.goTo(0);

    var binding = drawCircles(args);
  }

});