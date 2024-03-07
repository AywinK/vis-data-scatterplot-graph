
// state
let data;

// get data on window load
window.addEventListener("load", async (e) => {
    const res = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json");
    const resData = await res.json();
    if (resData) data = resData;
    renderChart();
});

// chart
function renderChart() {
    // chart dimensions and margins
    const width = 800;
    const height = 500;
    const margin = 50;

    // x scale
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year)).nice()
        .range([margin, width - margin]);

    // y scale
    const yScale = d3.scaleTime()
        .domain(d3.extent(data, d => (new Date(d.Seconds * 1000)))).nice()
        .range([margin, height - margin]);

    // create svg chart
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    // add x-axis with ticks
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin})`)
        .attr("id", "x-axis")
        .call(d3.axisBottom(xScale).tickFormat(d3.format("")));

    // add y-axis with ticks
    svg.append("g")
        .attr("transform", `translate(${margin},0)`)
        .attr("id", "y-axis")
        .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")));

    // add circle for each data point
    svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(new Date(d.Seconds * 1000)))
        .attr("r", 5)
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => (new Date(d.Seconds * 1000)))
        .style("fill", d => d?.Doping !== "" ? "red" : "steelblue")

    // add legend to chart
    const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${width - 2 * margin}, ${2 * margin})`);

    const legendItems = legend.selectAll("g")
        .data(["Doping", "No Doping"])
        .join("g")
        .attr("transform", (d, i) => `translate(0, ${i * margin})`);

    legendItems.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => d === "Doping" ? "red" : "steelblue");

    legendItems.append("text")
        .attr("x", 15)
        .attr("y", 10)
        .attr("dy", "0em")
        .text(d => d);

    // add tooltips to dots
    svg.selectAll(".dot")
        .on("mouseenter", handleMouseEnter)
        .on("mouseout", handleMouseOut);

    // append svg chart to root
    document.getElementById("root").append(svg.node());
}

const handleMouseEnter = (e, d) => {
    const x = e.pageX;
    const y = e.pageY;
    console.log(x, y)

    const divEl = document.createElement("div");
    divEl.setAttribute("id", "tooltip");
    divEl.setAttribute("data-year", d.Year);
    divEl.style.top = (y + 10) + "px";
    divEl.style.left = (x + 10) + "px";
    const tooltipHtml = `
    Name: ${d.Name} <br />
    Nationality: ${d.Nationality} <br />
    Year: ${d.Year} <br />
    Time: ${d.Time} <br />
    ${d.Doping !== "" ? d.Doping : ""}
    `
    divEl.innerHTML = tooltipHtml
    document.getElementById("root").appendChild(divEl);
}

const handleMouseOut = () => {
    document.getElementById("tooltip").remove();
}