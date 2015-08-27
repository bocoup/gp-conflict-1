const fs = require('fs');
const _ = require('underscore');

var geo = require('./ne_110m_admin_0_countries/ne_110m_admin_0_countries.json');
var stats = require('../../app/src/data/stats.json');


// build country map
var countries = {};

geo.features.forEach(function(d) {
  countries[d.properties.name] = d;
});

stats.forEach(function(s) {
  if (typeof countries[s.Destination] === 'undefined') {
    console.log(s.Destination);
  } else {
    countries[s.Destination]['properties'] = _.extend(countries[s.Destination]['properties'], s);
  }
});

var carr = Object.keys(countries).map(function(k){return countries[k]});


geo.features = carr;

fs.writeFile('./country_with_data_geojson.json', JSON.stringify(geo));