var margin = 60,
    width = parseInt(d3.select("#graph").style("width")) - margin*2,
    height = parseInt(d3.select("#graph").style("height")) - margin*2;

var xScale = d3.time.scale()
    .range([0, width])
    .nice(d3.time.year);

var yScale = d3.scale.linear()
    .range([height, 0])
    .nice();

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return xScale(d.year); })
    .y(function(d) { return yScale(d.capture); });

var dateFormat = d3.time.format("%Y");

var graph = d3.select("#graph")
    .attr("width", width + margin*2)
    .attr("height", height + margin*2)
  .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");

d3.csv("data/data_long.csv", function(error, data) {
  data.forEach(function(d) {
     d.year = d3.time.format("%Y").parse(d.year);
     d.capture = +d.capture;
    // console.log(data);
  });

  xScale.domain(d3.extent(data, function(d){
            return d.year;
            })
        );
  yScale.domain([0, d3.max(data, function(d) {
            return +d.capture;
          })
        ]);

  graph.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  graph.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Capture");

  graph.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  function resize() {
    var width = parseInt(d3.select("#graph").style("width")) - margin*2,
    height = parseInt(d3.select("#graph").style("height")) - margin*2;

    xScale.range([0, width]).nice(d3.time.year);
    yScale.range([height, 0]).nice();

    yAxis.ticks(Math.max(height/50, 2));
    xAxis.ticks(Math.max(width/50, 2));

    graph.select('.x.axis')
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    graph.select('.y.axis')
      .call(yAxis);

    graph.selectAll('.line')
      .attr("d", line);
  }

  d3.select(window).on('resize', resize); 

  resize();
});