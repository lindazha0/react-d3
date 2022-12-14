import d3 from 'd3';
import { __esModule } from 'react-d3-library';

var node = document.getElementsByClassName("Income-view");

const margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 445 - margin.left - margin.right,
    height = 445 - margin.top - margin.bottom;

const svg = d3.select(node).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read the data and compute summary statistics for each specie
d3.csv("monthlyStudentExpenses.csv", function (data) {
    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    var sumstat = d3
        .nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) {
            return d.Gender;
        })
        .rollup(function (d) {
            q1 = d3.quantile(
                d
                    .map(function (g) {
                        return g.Monthly_expenses_$;
                    })
                    .sort(d3.ascending),
                0.25
            );
            median = d3.quantile(
                d
                    .map(function (g) {
                        return g.Monthly_expenses_$;
                    })
                    .sort(d3.ascending),
                0.5
            );
            q3 = d3.quantile(
                d
                    .map(function (g) {
                        return g.Monthly_expenses_$;
                    })
                    .sort(d3.ascending),
                0.75
            );
            interQuantileRange = q3 - q1;
            min = q1 - 1.5 * interQuantileRange;
            max = q3 + 1.5 * interQuantileRange;
            return {
                q1: q1,
                median: median,
                q3: q3,
                interQuantileRange: interQuantileRange,
                min: min,
                max: max,
            };
        })
        .entries(data);

    // Show the Y scale
    var y = d3
        .scaleBand()
        .range([height, 0])
        .domain(["Female", "Male"])
        .padding(0.4);
    svg.append("g").call(d3.axisLeft(y).tickSize(0)).select(".domain").remove();

    // Show the X scale
    var x = d3.scaleLinear().domain([4, 8]).range([0, width]);
    svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5))
        .select(".domain")
        .remove();

    // Color scale
    var myColor = d3
        .scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([4, 8]);

    // Add X axis label:
    svg
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top + 30)
        .text("Average Monthly Expense");

    // Show the main vertical line
    svg
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function (d) {
            return x(d.value.min);
        })
        .attr("x2", function (d) {
            return x(d.value.max);
        })
        .attr("y1", function (d) {
            return y(d.key) + y.bandwidth() / 2;
        })
        .attr("y2", function (d) {
            return y(d.key) + y.bandwidth() / 2;
        })
        .attr("stroke", "black")
        .style("width", 40);

    // rectangle for the main box
    svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x(d.value.q1);
        }) // console.log(x(d.value.q1)) ;
        .attr("width", function (d) {
            return x(d.value.q3) - x(d.value.q1);
        }) //console.log(x(d.value.q3)-x(d.value.q1))
        .attr("y", function (d) {
            return y(d.key);
        })
        .attr("height", y.bandwidth())
        .attr("stroke", "black")
        .style("fill", "#69b3a2")
        .style("opacity", 0.3);

    // Show the median
    svg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("y1", function (d) {
            return y(d.key);
        })
        .attr("y2", function (d) {
            return y(d.key) + y.bandwidth() / 2;
        })
        .attr("x1", function (d) {
            return x(d.value.median);
        })
        .attr("x2", function (d) {
            return x(d.value.median);
        })
        .attr("stroke", "black")
        .style("width", 80);

    // create a tooltip
    var tooltip = d3
        .select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("font-size", "16px");
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
            .html("<span style='color:grey'>Monthly Average Expense: </span>" + d.Monthly_expenses_$) // + d.Prior_disorder + "<br>" + "HR: " +  d.HR)
            .style("left", d3.mouse(this)[0] + 30 + "px")
            .style("top", d3.mouse(this)[1] + 30 + "px");
    };
    var mousemove = function (d) {
        tooltip
            .style("left", d3.mouse(this)[0] + 30 + "px")
            .style("top", d3.mouse(this)[1] + 30 + "px");
    };
    var mouseleave = function (d) {
        tooltip.transition().duration(200).style("opacity", 0);
    };

    // Add individual points with jitter
    var jitterWidth = 50;
    svg
        .selectAll("indPoints")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return x(d.Monthly_expenses_$);
        })
        .attr("cy", function (d) {
            return (
                y(d.Gender) +
                y.bandwidth() / 2 -
                jitterWidth / 2 +
                Math.random() * jitterWidth
            );
        })
        .attr("r", 4)
        .style("fill", function (d) {
            return myColor(+d.Monthly_expenses_$);
        })
        .attr("stroke", "black")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
});

module.exports = node;
