const chart = document.querySelector('.chart');

const containerHeight = 650;
const containerWidth = 1100;

const svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', containerWidth)
  .attr('height', containerHeight);

const margin = { top: 40, right: 40, bottom: 100, left: 100 };
const graphWidth = containerWidth - margin.left - margin.right;
const graphHeight = containerHeight - margin.top - margin.bottom;

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
  .attr('x', containerWidth / 2)
  .attr('y', 100)
  .attr('id', 'title')
  .attr('text-anchor', 'middle')
  .style('font-size', '2rem')
  .style('color', 'rgba(46, 46, 46, 1)')
  .style('font-weight', '600')
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
    .attr('fill', '#7a5195')
    .attr('x', (d) => xScale(d.year))
    .on('mouseover', (d, i) => {
      toolTip
        .attr('data-date', d.year)
        .style('opacity', '1.0')
        .style('top', ` ${graphHeight + margin.top}px`)
        .html(
          `Year: ${d.year.replace(/-(.*)$/, '')} ${convertDateToQuarters(
            d.year
          )} </br>  GDP: $${sanitizeNumber(d.value)} Billion`
        );

      const outerMargin = (window.innerWidth - containerWidth) / 2;
      if (i < data.length * 0.75) {
        return toolTip.style('left', `${outerMargin + xScale(d.year) + 95}px`);
      }
      return toolTip.style('left', `${outerMargin + xScale(d.year) - 55}px`);
    })
    .on('mouseout', () => toolTip.style('opacity', '0'));

  rects
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('data-date', (d) => d.year)
    .attr('data-gdp', (d) => d.value)
    .attr('width', xScale.bandwidth)
    .attr('height', 0)
    .attr('fill', '#7a5195')
    .attr('x', (d) => xScale(d.year))
    .attr('y', graphHeight)
    .on('mouseover', (d, i) => {
      toolTip
        .attr('data-date', d.year)
        .style('opacity', '1.0')
        .style('top', ` ${graphHeight + margin.top}px`)
        .html(
          `Year: ${d.year.replace(/-(.*)$/, '')} ${convertDateToQuarters(
            d.year
          )} </br>  GDP: $${sanitizeNumber(d.value)} Billion`
        );

      const outerMargin = (window.innerWidth - containerWidth) / 2;
      if (i < data.length * 0.75) {
        return toolTip.style('left', `${outerMargin + xScale(d.year) + 95}px`);
      }
      return toolTip.style('left', `${outerMargin + xScale(d.year) - 55}px`);
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
