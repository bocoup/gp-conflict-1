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
      var min = Infinity;
      var ratemax = 0;
      var ratemin = Infinity;
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

        // update max & min & ratemax & ratemin
        max = Math.max(s['2011'], s['2012'], s['2013'], s['2014'], max);
        min = Math.min(s['2011'], s['2012'], s['2013'], s['2014'], min);
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
// start data fetching.
var getData = Data.getCountryStats(),
    getMap = Data.getCountryCentroidFeatures();

var popupTotalTemplate = _.template("<h3> <%= d.id %> </h3> \
    <p> \
      In 2014, <%= d.id %> took in <b><%= d3.format('0,')(d.data['2014']) %> \
      </b> refugees. \
    </p>");

var popupRateTemplate = _.template("<h3> <%= d.id %> </h3> \
    <p> \
      The amount of refugees taken in by <%= d.id %> in 2014 constituted \
      <b><%= d3.format('.2f')(d.data['Rate'] * 100) %>%</b> of the overall country \
      population. \
    </p>");

L.mapbox.accessToken = 'pk.eyJ1IjoiaXIwcyIsImEiOiJzRW9ObDVJIn0.Yjg0YkF_gr1teCBLJVyeoQ';

// size mode: alternative "Rate"
var circleMode = "Total";
var circleRange = [5,50]; //radius size
var colors = {
  'Total' : 'teal',
  'Rate' : '#5C2691'
};
var circleTotalScale, circleRateScale;
var year = '2014';

$(function() {

  $('.callout').click(function(event) {
    event.stopPropagation();
  });

  d3.selectAll('.sketch').style('display', 'none');


  // initialize Base Map
  d3.select('#map-7')
    .style({
      display: null,
      width: $(window).width(),
      height: 600
    });

  // create map, center on Syria
  var map = L.mapbox.map('map-7', 'ir0s.n8mo8g3c')
      .setView([41.77131167976407, 18.544921875], 4);

  // Initialize the SVG layer
  map._initPathRoot();

  // // Disable drag and zoom handlers.
  // map.dragging.disable();
  // map.touchZoom.disable();
  // map.doubleClickZoom.disable();
  // map.scrollWheelZoom.disable();

  // // Disable tap handler, if present.
  // if (map.tap) {map.tap.disable();}

  // Pick up the SVG from the map object
  var svg = d3.select("#map-7 .leaflet-map-pane").select("svg");
  var legend = d3.select('#map-7 .legend');

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
      if (circleMode === 'Total') {
        popup = L.popup()
          .setLatLng(d.LatLng)
          .setContent(popupTotalTemplate({ d : d }));
      } else {
        popup = L.popup()
          .setLatLng(d.LatLng)
          .setContent(popupRateTemplate({ d : d }));
      }

      map.openPopup(popup, d.LatLng);
    });

    binding.on('mouseout', function(d) {
      map.closePopup();
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
      .range(circleRange);

    // Per capita scale
    circleRateScale = d3.scale.sqrt()
      .domain([args.rate_min, args.rate_max])
      .range(circleRange);

    // join layer to contain centroids and data
    args.countries.features.forEach(function(d) {
      var r = 5;

      if (typeof args.countryStats[d.properties.name] !== 'undefined') {
        r = circleTotalScale(args.countryStats[d.properties.name][year]);
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

    var binding = drawCircles(args);

    // add per capita switch
    $('.callout a').click(function(event) {
      var scale, text, attr;

      // if going to total, switch back.
      if (circleMode !== 'Total') {
        circleMode = 'Total';
        scale = circleTotalScale;
        text = 'Per Capita &raquo;';
        attr = year;
      } else {

        // switch to rate
        scale = circleRateScale;
        text = 'Total &raquo;';
        attr = 'Rate';
        circleMode = 'Rate';
      }

      // change button text
      $(this).html(text);

      // animate circle size
      binding.transition()
        .attr('r', function(d) {
          var r = d3.select(this).attr('r');
          if (typeof args.countryStats[d.properties.name] !== 'undefined') {
            r = scale(args.countryStats[d.properties.name][attr]);
          }
          return r;
        }).style({
          'fill' : colors[circleMode]
        });
    });
  }

});



  // queue()
  //   .defer(d3.json, "test.geojson")
  //   .await(ready);
  // function ready(error, data) {
  //   L.geoJson(data).addTo(map);
  // }