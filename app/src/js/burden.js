var gridDim, scale;

var getVals = function(d) {
  return [d.value.Refugees_2011, d.value.Refugees_2012, d.value.Refugees_2013,
    d.value.Refugees_2014];
};

var makeBar = function(d) {

  var yOffset = 30;
  var barHeight = 10;

  var rate = d.value.Rate;
  var leftBarWidth = gridDim * (1 - rate);
  var rightBarWidth = gridDim * rate;
  console.log(d.key, rate);

  var g = d3.select(this);
  g.append('rect')
    .attr({
      "class": "left",
      x : 0, y: yOffset,
      width: leftBarWidth, height: barHeight
    });

  g.append('rect')
    .attr({
      "class": "right",
      x : leftBarWidth, y: yOffset,
      width: rightBarWidth, height: barHeight
    });
};

var makeBarCharts = function(d) {
  var yOffset = 30;
  var graphHeight = gridDim - yOffset;
  scale.range([0, graphHeight]);

  var data = getVals(d);
  var g = d3.select(this);

  var col = 0, padding = 10, w = 10;
  var max = scale.domain()[1];

  data.forEach(function(dd) {
    g.append('rect')
      .attr({
        x : col * w + (col * padding),
        y : graphHeight - scale(dd),
        width: w,
        height: scale(dd)
      });
    col++;
  });
};

var makeGraphs = Promise.method(function(args) {
  var width = 600, height = 600 - 40, padding=20;
  var numOfGraphs = 16;
  var sideMax = Math.sqrt(numOfGraphs);

  var svg = d3.select('.graph')
    .append('svg')
    .attr({ width: width, height: height });

  var charts = svg.append("g");
  gridDim = (Math.min(width, height) - ((sideMax - 1) * padding)) / (sideMax  +1);

  Data.getCountryStats().then(function(stats) {
    var data = d3.entries(stats.data);
    data = data.splice(0, numOfGraphs);

    // find max num
    var maxRefNum = 0, minRefNum = 0;
    data.forEach(function(d) {
      maxRefNum = Math.max(maxRefNum, d.value.Refugees_2011,
        d.value.Refugees_2012, d.value.Refugees_2013, d.value.Refugees_2014);
    });

    scale = d3.scale.linear()
      .domain([0, maxRefNum]);

    var groupsBinding = charts.selectAll('g')
      .data(data, function(d) { return d.key; });

    var col = 0, row = 0;
    var groups = groupsBinding.enter()
      .append('g')
      .classed('chart', true)
      .attr('transform', function(d, i) {
        var x = col * gridDim + (col * (padding+ 15)) ,
            y = row * gridDim + (row * padding);

        if (++col >= sideMax) {
          col = 0;
          row++;
        }
        return 'translate('+x+','+y+')';
      });

    groups.append('text')
      .classed('countryname', true)
      .text(function(d) { return d.key; })
      .attr({ x : 0, y : 16});


    // make bars
    groups.each(function(d) {
      // makeBar.call(this, d);
      makeBarCharts.call(this, d);
    });
  });
});



makeGraphs();