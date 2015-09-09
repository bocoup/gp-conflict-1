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
    getSyriaGeo: general('data/syria.json'),
    getTurkeyGeo: general('data/turkey.json'),
    getLebanonGeo: general('data/lebanon.json'),
    getGermanyGeo: general('data/germany.json')
  };
}());