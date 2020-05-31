const chart = document.querySelector('.chart');

const getChartData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', 1125)
  .attr('height', 750);

const margin = { top: 40, right: 40, bottom: 100, left: 100 };
const graphWidth = 1125 - margin.left - margin.right;
const graphHeight = 750 - margin.top - margin.bottom;

const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xAxisGroup = graph
  .append('g')
  .attr('transform', `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append('g');

const yScale = d3.scaleLinear().range([graphHeight, 0]);

const xScale = d3
  .scaleBand()
  .range([0, graphWidth])
  .paddingInner(0.2)
  .paddingOuter(0.2);

const xAxis = d3.axisBottom(xScale).tickFormat((d) => d.replace(/-(.*)$/, ''));

const yAxis = d3
  .axisLeft(yScale)
  .ticks(10)
  .tickFormat((d) => `$ ${d} `);

// xAxisGroup
//   .selectAll('text')
//   .attr('transform', 'rotate(-40)')
//   .attr('text-anchor', 'end')
//   .attr('fill', 'orange');

const transition5s = d3.transition().duration(500);

// title text
svg
  .append('text')
  .attr('x', 1125 / 2)
  .attr('y', 50)
  .attr('id', 'title')
  .attr('text-anchor', 'middle')
  .style('font-size', '2rem')
  .attr('text-decoration', 'underline')
  .text('United States GDP');

const updateGraph = (data) => {
  yScale.domain([0, d3.max(data, (d) => d.value)]);
  xScale.domain(data.map((item) => item.year));

  const rects = graph.selectAll('rect').data(data);

  rects.exit().remove();

  rects
    .attr('width', xScale.bandwidth)
    .attr('fill', 'orange')
    .attr('x', (d) => xScale(d.year));

  rects
    .enter()
    .append('rect')
    .attr('width', xScale.bandwidth)
    .attr('height', 0)
    .attr('fill', 'orange')
    .attr('x', (d) => xScale(d.year))
    .attr('y', graphHeight)
    .merge(rects)
    .transition(transition5s)
    .attr('y', (d) => yScale(d.value))
    .attr('height', (d) => graphHeight - yScale(d.value));

  //call axis
  xAxisGroup.call(
    xAxis.tickValues(xScale.domain().filter((d, i) => !(i % 10)))
  );
  yAxisGroup.call(yAxis);
};

window.addEventListener('load', async () => {
  const graphData = await getChartData('/api/gdp-data');
  const convertedValue = graphData.map((item) => ({
    year: item[0],
    value: item[1],
  }));

  updateGraph(convertedValue);
});
