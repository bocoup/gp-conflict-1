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