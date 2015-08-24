// change this to:
// "World Map"
// "Refugees"
// "Rate"
// "Population"
// "Area"
var arrangement = "Refugees";

// get data
var getStats = Data.getCountryStats();
var getMap = Data.getMapFeatures();

// get window dimensions... note this isn't built for resizing yet.
var dims = Util.getWindowSize();

var svg = d3.select('#map-2')
  .append('svg')
  .attr('width', dims.width)
  .attr('height', dims.height);

var bg = svg
  .append('g')
  .attr('class', 'bg');

// projections
var scale = 100;
var projectionStr = "mercator";
var projection = d3.geo[projectionStr]()
  .scale(scale);

var path = d3.geo.path()
  .projection(projection);

d3.select('rect.bg-rect')
  .attr('fill', '#fff')
  .attr('stroke', '#222')
  .attr('stroke-weight', 2)
  .attr('width', dims.width)
  .attr('height', dims.height);

Promise.join(getStats, getMap,
  function(countryData, mapData) {

    var colors = d3.scale.linear()
      .domain([countryData.data_min, countryData.data_max])
      .range(['#fff', 'red']);

    function valOrZero(d, prop) {
      if (typeof countryData.data[d.properties.name] !== "undefined") {
        return -countryData.data[d.properties.name][prop];
      }
    }

    // resort the data by:
    //
    // - Refugees total (default)
    // - Rate (percentage of refugees relative to population)
    // - Population
    // - Area
    var data = _.sortBy(mapData, function(d) {
      switch(arrangement) {
        case "Refugees":
          return valOrZero(d, 'Total');
        case "Rate":
          return valOrZero(d, 'Rate');
        case "Population":
          return valOrZero(d, 'Population');
        case "Area":
          return -d3.geo.area(d);
        default:
          break;
      }
    });

    var currX = 20;
    var currY = 20;

    var tallest = 0;
    var maxHeight = 0;

    var transform = d3.svg.transform()
      .translate(function(d, i) {
        if(arrangement === "World Map"){
          maxHeight = dims.height;
          return [-130, 75];
        }

      var centroid = path.centroid(d);

      var bb = path.bounds(d);
      var width = bb[1][0] - bb[0][0];
      var height = bb[1][1] - bb[0][1];

      if(height > tallest) {
        tallest = height;
      }

      if(currX >= dims.width - 150  || d.properties.name === "Russia") {
        currX = 20;
        currY += tallest + 40;

        tallest = 0;
      }

      var nx = width + currX + 20;
      var ny = height + currY;

      currX = nx;

      if(ny > maxHeight) {
        maxHeight = ny;
      }

      return [nx - centroid[0], ny - centroid[1]];
    });

    var bind = bg.selectAll('path')
      .data(data, function(d){
        return d.properties.name;
      });

    // on enter, make new path regions:
    bind.enter()
      .append("path")
      .attr("name", function(d) {
        return d.properties.name;
      })
      .attr("fill", function(d) {
        if (typeof countryData.data[d.properties.name] !== "undefined") {
          return colors(countryData.data[d.properties.name]['Total']);
        } else {
          return '#eaeaea';
        }
      })
      .attr("stroke", "#555")
      .attr("stroke-width", "0.5px");
    // TODO add coloring


    // on update
    bind
      .transition()
      .duration(500)
      .attr('opacity', 1)
      .attr("d", function(d) {
        return path(d);
      })
      .attr("transform", function(d, i) {
        return transform(d, i);
      });


    // on exit:
    bind.exit()
      .transition()
      .duration(200)
      .attr('opacity', 0);

    maxHeight = maxHeight + 150;

    svg
      .transition()
      .duration(200)
      .attr('height', maxHeight);

    d3.select('rect.bg-rect')
      .transition()
      .duration(200)
      .attr('height', maxHeight);

    d3.select('path[name="Antarctica"]').remove();
  }
);

