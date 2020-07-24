const chart = document.querySelector('.heat-map-chart');
const description = document.querySelector('#description');

const containerWidth = 1100;
const containerHeight = 650;

const margin = { top: 100, right: 25, bottom: 75, left: 100 };
const graphWidth = containerWidth - margin.left - margin.right;
const graphHeight = containerHeight - margin.top - margin.bottom;
const barHeight = graphHeight / 12;

const monthsArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const svg = d3
  .select('.heat-map-chart')
  .append('svg')
  .attr('width', containerWidth)
  .attr('height', containerHeight);

const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const yScale = d3.scaleBand().range([0, graphHeight]).domain(months);
const xScale = d3.scaleTime().range([0, graphWidth]);

const yAxis = d3.axisLeft(yScale);

const xAxis = d3
  .axisBottom(xScale)
  .tickFormat(d3.timeFormat('%Y'))
  .ticks(d3.timeYear.every(10));

const yAxisGroup = graph.append('g').attr('id', 'y-axis');

const xAxisGroup = graph
  .append('g')
  .attr('id', 'x-axis')
  .attr('transform', `translate(0, ${graphHeight})`);

const colors = d3
  .scaleQuantize()
  .range([
    '#5E4FA2',
    '#3288BD',
    '#66C2A5',
    '#ABDDA4',
    '#E6F598',
    '#FFFFBF',
    '#FEE08B',
    '#FDAE61',
    '#F46D43',
    '#D53E4F',
    '#9E0142',
  ]);

const updateGraph = (data) => {
  const { baseTemperature, monthlyVariance } = data;

  console.log(monthlyVariance);

  xScale.domain([
    d3.min(monthlyVariance, (d) => new Date(d.year, 0)),
    d3.max(monthlyVariance, (d) => new Date(d.year, 0)),
  ]);

  colors.domain([
    d3.min(monthlyVariance, (d) => d.variance),
    d3.max(monthlyVariance, (d) => d.variance),
  ]);

  // map through each data set to go across
  //change colors by the variance
  // the height should be 12 and each step you just start up or down

  const rects = graph.selectAll('rect').data(monthlyVariance);

  rects
    .enter()
    .append('rect')
    .attr('width', graphWidth / 263)
    .attr('height', graphHeight / 12)
    .attr('fill', (d) => colors(d.variance)) // logic on color based on variance
    .attr('x', (d) => xScale(new Date(d.year, 0)))
    .attr('y', (d) => {
      if (d.month === 1) return 0;
      return (d.month - 1) * barHeight;
    });

  yAxisGroup.call(yAxis).style('font-size', '0.8rem');
  xAxisGroup.call(xAxis).style('font-size', '0.8rem');

  xAxisGroup
    .selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end');
};

window.addEventListener('load', async () => {
  const graphData = await getChartData(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
  );

  const yearsArr = graphData.monthlyVariance.map((item) => item.year);
  const { minYear, maxYear } = {
    minYear: Math.min(...yearsArr),
    maxYear: Math.max(...yearsArr),
  };

  description.innerHTML = `${minYear} - ${maxYear}: base temperature ${graphData.baseTemperature}&#8451;`;

  updateGraph(graphData);
});
