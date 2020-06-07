const chart = document.querySelector('.scatter-plot-chart');

const containerWidth = 1100;
const containerHeight = 650;

const margin = { top: 40, right: 40, bottom: 100, left: 100 };
const graphWidth = containerWidth - margin.left - margin.right;
const graphHeight = containerHeight - margin.top - margin.bottom;

const svg = d3
  .select('.scatter-plot-chart')
  .append('svg')
  .attr('width', containerWidth)
  .attr('height', containerHeight);

const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const yScale = d3.scaleLinear().range([0, graphHeight]);

const xScale = d3
  .scaleBand()
  .range([0, graphWidth])
  .paddingInner(0.2)
  .paddingOuter(0.2);

const xAxis = d3.axisBottom(xScale);

const yAxis = d3.axisLeft(yScale).ticks(10);

const xAxisGroup = graph
  .append('g')
  .attr('id', 'x-axis')
  .attr('transform', `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append('g').attr('id', 'y-axis');

const updateGraph = (data) => {
  xScale.domain(data.map((item) => item.Year));
  yScale.domain([
    d3.min(data, (d) => d.Seconds),
    d3.max(data, (d) => d.Seconds),
  ]);

  const circles = graph.selectAll('circle').data(data);

  circles.exit().remove();

  circles
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(d.Year))
    .attr('cy', (d) => yScale(d.Seconds))
    .attr('r', (d) => 5);

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

window.addEventListener('load', async () => {
  const graphData = await getChartData('/api/scatter-plot-data');

  updateGraph(graphData);
});
