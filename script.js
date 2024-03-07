
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
        .attr("fill", "steelblue")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(new Date(d.Seconds * 1000)))
        .attr("r", 5)
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => (new Date(d.Seconds * 1000)))

    // append svg chart to root
    document.getElementById("root").append(svg.node());
}