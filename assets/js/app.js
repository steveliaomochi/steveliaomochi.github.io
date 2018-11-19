
//Set up chart basics
var svgWidth = 960;
var svgHeight = 500;
var margin = {top: 20, right: 40, bottom: 60, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create a svg wrapper and svg group to hold the chart
var svg = d3
    .select('.chart')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var chart = svg.append('g');

//create tooltips
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

//load csv file
d3.csv("../data/data.csv").then(function(healthData, err) {
    if(err) throw err;

    healthData.forEach(function(data) {
        data.poverty =+ data.poverty;
        data.smokes =+ data.smokes;
    });

// Create scale functions
    var yLinearScale = d3.scaleLinear().range([height, 0]);
    var xLinearScale = d3.scaleLinear().range([0, width]);

// Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// Scale the domain
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(healthData, function(data) {
            return +data.poverty * 0.95;
        });

        xMax = d3.max(healthData, function(data) {
            return +data.poverty * 1.05;
        });

        yMin = d3.min(healthData, function(data) {
            return +data.smokes * 0.98;
        });

        yMax = d3.max(healthData, function(data) {
            return +data.smokes *1.02;
        });

        xLinearScale.domain([xMin, xMax]);
        yLinearScale.domain([yMin, yMax]);

        var toolTip = d3
                .tip()
                .style("display", "block")
                .style("color", "green")
                .attr("class", "tooltip")
                .offset([80, -60])
                .html(function(data) {
                    var stateName = data.state;
                    var pov = +data.poverty;
                    var smokes = +data.smokes;
                    return (
                        stateName + '<br> Poverty: ' + pov + '% <br> Smoking Rate: ' + smokes +'%'
                    )
                });

            // Create tooltip
            chart.call(toolTip);

            var circleGroup = chart.selectAll("circle")
                .data(healthData)
                .enter()
                .append("circle")
                .attr("cx", function(data, index) {
                    return xLinearScale(data.poverty)
                })
                .attr("cy", function(data, index) {
                    return yLinearScale(data.smokes)
                })
                .attr("r", "15")
                .attr("fill", "lightblue")
                // display tooltip on click
                .on("mouseenter", function(data) {
                    toolTip.show(data);
                })
                // hide tooltip on mouseout
                .on("mouseout", function(data, index) {
                    toolTip.hide(data);
                });

            // Appending a label to each data point
            chart.append("text")
                .style("text-anchor", "middle")
                .style("font-size", "12px")
                .selectAll("tspan")
                .data(healthData)
                .enter()
                .append("tspan")
                    .attr("x", function(data) {
                        return xLinearScale(data.poverty - 0);
                    })
                    .attr("y", function(data) {
                        return yLinearScale(data.smokes - 0.2);
                    })
                    .text(function(data) {
                        return data.abbr
                    });

            // Append an SVG group for the xaxis, then display x-axis
            chart
                .append("g")
                .attr('transform', `translate(0, ${height})`)
                .call(bottomAxis);

            // Append a group for y-axis, then display it
            chart.append("g").call(leftAxis);

            // Append y-axis label
            chart
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0-margin.left + 40)
                .attr("x", 0 - height/2)
                .attr("dy","1em")
                .attr("class", "axis-text")
                .text("Smokeing Rate (%)")

            // Append x-axis labels
            chart
                .append("text")
                .attr(
                    "transform",
                    "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
                )
                .attr("class", "axis-text")
                .text("In Poverty (%)");
            });
