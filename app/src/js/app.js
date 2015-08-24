var popupTemplate = _.template("<h3> <%= d.id %> </h3> \
  <p> \
    In 2014, <%= d.id %> took in <b><%= d3.format('0,')(d.data['2014']) %></b> refugees. \
  </p>");

L.mapbox.accessToken = 'pk.eyJ1IjoiaXIwcyIsImEiOiJzRW9ObDVJIn0.Yjg0YkF_gr1teCBLJVyeoQ';

// initialize Base Map
d3.select('#map')
  .style({
    width: '80%',
    height: 600
  });

// create map, center on Syria
var map = L.mapbox.map('map', 'ir0s.n8mo8g3c')
    .setView([35.693, 33.08], 6);

// Disable drag and zoom handlers.
// map.dragging.disable();
// map.touchZoom.disable();
// map.doubleClickZoom.disable();
// map.scrollWheelZoom.disable();

// // Disable tap handler, if present.
// if (map.tap) {map.tap.disable();}


Promise.join(Data.getCountryStats(),
    Data.getCountryCentroidFeatures(),
    Data.getMapFeatures(),

  function(countryStats, countryCenters, features) {
    var data = {
      countries: countryCenters,
      features: features,
      countryStats: countryStats.data,
      data_min: countryStats.data_min,
      data_max: countryStats.data_max
    };

    draw(data);
});

var year = '2014';
function draw(args) {

  // Initialize the SVG layer
  map._initPathRoot();

  // We simply pick up the SVG from the map object
  var svg = d3.select("#map").select("svg");

  var circleScale = d3.scale.sqrt()
    .domain([args.data_min, args.data_max])
    .range([8, 50]);

  // assemble layer
  args.countries.features.forEach(function(d) {
    var r = 8;

    if (typeof args.countryStats[d.properties.name] !== 'undefined') {
      r = circleScale(args.countryStats[d.properties.name][year]);
    }

    d['LatLng'] = new L.LatLng(d.geometry.coordinates[1],
                  d.geometry.coordinates[0]);
    d['r'] = r;
    d['id'] = d.properties.name;
    d['data'] = args.countryStats[d.properties.name];

  });

  // draw circles
  var circlesg = svg.append("g").classed("circles", true);
  var binding = circlesg.selectAll('circle')
    .data(args.countries.features, function(d) { return d.id; });

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

    var popup = L.popup()
      .setLatLng(d.LatLng)
      .setContent(popupTemplate({ d : d }));
      // .openOn(map);

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
}



// queue()
//   .defer(d3.json, "test.geojson")
//   .await(ready);
// function ready(error, data) {
//   L.geoJson(data).addTo(map);
// }