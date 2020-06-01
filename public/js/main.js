const chart = document.querySelector('.chart');

const convertDateToQuarters = (value) => {
  const val = value.split('-');
  const month = val[1].replace(/^0/, '');
  if (Number(month) < 4) return 'Q1';
  if (Number(month) < 7) return 'Q2';
  if (Number(month) < 10) return 'Q3';
  return 'Q4';
};

const sanitizeNumber = (value) => {
  const num = Math.floor(value).toString();
  return num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
};

sanitizeNumber(2323.55);

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
  .attr('width', 1100)
  .attr('height', 750);

const margin = { top: 40, right: 40, bottom: 100, left: 100 };
const graphWidth = 1100 - margin.left - margin.right;
const graphHeight = 750 - margin.top - margin.bottom;

const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xAxisGroup = graph
  .append('g')
  .attr('id', 'x-axis')
  .attr('transform', `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append('g').attr('id', 'y-axis');

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
  .tickFormat((d) => `${d} `);

const transition5s = d3.transition().duration(1000);

svg
  .append('text')
  .attr('x', 1125 / 2)
  .attr('y', 100)
  .attr('id', 'title')
  .attr('text-anchor', 'middle')
  .style('font-size', '2rem')
  .attr('text-decoration', 'underline')
  .text('United States GDP');

const toolTip = d3
  .select('.chart')
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0);

const updateGraph = (data) => {
  yScale.domain([0, d3.max(data, (d) => d.value)]);
  xScale.domain(data.map((item) => item.year));

  const rects = graph.selectAll('rect').data(data);

  rects.exit().remove();

  rects
    .attr('width', xScale.bandwidth)
    .attr('class', 'bar')
    .attr('data-date', (d) => d.year)
    .attr('data-gdp', (d) => d.value)
    .attr('fill', 'orange')
    .attr('x', (d) => xScale(d.year));

  rects
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('data-date', (d) => d.year)
    .attr('data-gdp', (d) => d.value)
    .attr('width', xScale.bandwidth)
    .attr('height', 0)
    .attr('fill', 'orange')
    .attr('x', (d) => xScale(d.year))
    .attr('y', graphHeight)
    .on('mouseover', (d, i) => {
      toolTip
        .attr('data-date', d.year)
        .style('opacity', '0.9')
        .style('top', ` ${graphHeight}px`)
        .html(
          `Year: ${d.year.replace(/-(.*)$/, '')} ${convertDateToQuarters(
            d.year
          )} </br>  GDP: $${sanitizeNumber(d.value)} Billion`
        );
      if (i < data.length * 0.75) {
        return toolTip.style('left', `${xScale(d.year) + 150}px`);
      }
      return toolTip.style('left', `${xScale(d.year)}px`);
    })
    .on('mouseout', () => toolTip.style('opacity', '0'))
    .merge(rects)
    .transition(transition5s)
    .attr('y', (d) => yScale(d.value))
    .attr('height', (d) => graphHeight - yScale(d.value));

  xAxisGroup.call(
    xAxis.tickValues(xScale.domain().filter((d, i) => !(i % 10)))
  );
  yAxisGroup.call(yAxis);
};

window.addEventListener('load', async () => {
  const graphData = await getChartData('/api/gdp-data');
  const convertedValues = graphData.map((item) => ({
    year: item[0],
    value: item[1],
  }));

  updateGraph(convertedValues);
});
