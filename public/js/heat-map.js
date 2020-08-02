const chart = document.querySelector('.heat-map-chart');
const description = document.querySelector('#description');

const containerWidth = 1100;
const containerHeight = 650;

const margin = { top: 100, right: 50, bottom: 75, left: 100 };
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

const yAxisGroup = graph
  .append('g')
  .attr('id', 'y-axis')
  .attr('transform', `translate(-1, 0)`);

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

const legendGroup = svg
  .append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${margin.left},${margin.top * 0.35})`)
  .style('font-size', '0.9rem');

const legend = d3
  .legendColor()
  .shapeWidth(40)
  .orient('horizontal')
  .scale(colors)
  .shapePadding(0);

const heatMapToolTip = d3
  .select('.heat-map-chart')
  .append('div')
  .attr('class', 'heat-map-tooltip')
  .attr('id', 'heat-map-tooltip')
  .style('opacity', 0);

const updateGraph = (data) => {
  const { baseTemperature, monthlyVariance } = data;

  xScale.domain([
    d3.min(monthlyVariance, (d) => new Date(d.year, 0)),
    d3.max(monthlyVariance, (d) => new Date(d.year, 0)),
  ]);

  colors.domain([
    d3.min(monthlyVariance, (d) => baseTemperature + d.variance),
    d3.max(monthlyVariance, (d) => baseTemperature + d.variance),
  ]);

  legendGroup.call(legend);
  legendGroup
    .selectAll('text')
    .attr('class', 'legend-text')
    .text((d, i, arr) => {
      if (arr.length !== i + 1) {
        return d.replace(/^.+to /, '');
      }
    })
    .attr('transform', `translate( 40, 33)`);

  const rects = graph.selectAll('rect').data(monthlyVariance);

  rects
    .enter()
    .append('rect')
    .attr('width', graphWidth / 263)
    .attr('height', graphHeight / 12)
    .attr('fill', (d) => colors(baseTemperature + d.variance))
    .attr('x', (d) => xScale(new Date(d.year, 0)))
    .attr('y', (d) => {
      if (d.month === 1) return 0;
      return (d.month - 1) * barHeight;
    })
    .on('mouseover', (d, i, arr) => {
      const outerMargin = (window.innerWidth - containerWidth) / 2;

      const toolTipX =
        d.year <= 1884
          ? xScale(new Date(d.year, 0)) + outerMargin + 108
          : xScale(new Date(d.year, 0)) + outerMargin - 65;

      heatMapToolTip
        .style('opacity', '0.9')
        .style('top', `${d.month * barHeight + 215}px`)
        .style('left', `${toolTipX}px`).html(`
        <p>${getMonthString(d.month - 1)},  ${d.year}</p>
        <p>Temperature: ${(baseTemperature + d.variance).toFixed(2)} &#8451;</p>
        <p>${d.variance.toFixed(2)} &#8451;</p>
      `);

      heatMapToolTip.style('backGround-color', () =>
        colors(baseTemperature + d.variance)
      );
    })
    .on('mouseout', (d, i, arr) => {
      heatMapToolTip.style('opacity', '0');
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
