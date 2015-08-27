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