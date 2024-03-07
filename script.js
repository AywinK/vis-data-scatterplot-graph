
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
        .domain([d3.min(data, data => data.Year - 1), d3.max(data, data => data.Year + 1)])
        .range([margin, width - margin]);

    // y scale
    const yScale = d3.scaleTime()
        .domain([d3.max(data, data => new Date(data.Seconds * 1000)), d3.min(data, data => new Date(data.Seconds * 1000))])
        .range([height - margin, margin]);

    // create svg chart
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    // add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin})`)
        .attr("id", "x-axis")
        .call(d3.axisBottom(xScale));

    // add y-axis
    svg.append("g")
        .attr("transform", `translate(${margin}, 0)`)
        .attr("id", "y-axis")
        .call(d3.axisLeft(yScale));

    // add x-axis with ticks
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin})`)
        .attr("id", "x-axis")
        .call(d3.axisBottom(xScale).ticks(2));

    // add y-axis with ticks
    svg.append("g")
        .attr("transform", `translate(${margin},0)`)
        .attr("id", "y-axis")
        .call(d3.axisLeft(yScale).ticks(12).tickFormat(d3.timeFormat("%M:%S")));

    // add circle for each data point
    svg.append("g")
        .attr("fill", "steelblue")
        .selectAll()
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