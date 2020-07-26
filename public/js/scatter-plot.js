const chart = document.querySelector('.scatter-plot-chart');

const containerWidth = 1100;
const containerHeight = 650;

const margin = { top: 100, right: 50, bottom: 75, left: 100 };
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

const xScale = d3.scaleTime().range([0, graphWidth]);

const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y'));

const yAxis = d3
  .axisLeft(yScale)
  .ticks(10)
  .tickFormat((d) => {
    const minutes = Math.floor(d / 60);
    const seconds = d % 60;
    const sanitizedSec =
      seconds.toString().length === 2 ? seconds : `0${seconds}`;

    return `${minutes}:${sanitizedSec}`;
  });

const xAxisGroup = graph
  .append('g')
  .attr('id', 'x-axis')
  .attr('transform', `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append('g').attr('id', 'y-axis');

svg
  .append('text')
  .attr('x', containerWidth / 2)
  .attr('y', 40)
  .attr('id', 'title')
  .attr('text-anchor', 'middle')
  .style('font-size', '1.5rem')
  .style('color', 'rgba(46, 46, 46, 1)')
  .style('font-weight', '600')
  .text('Doping in Professional Bicycle Racing');
svg
  .append('text')
  .attr('x', containerWidth / 2)
  .attr('y', 65)
  .attr('id', 'title')
  .attr('text-anchor', 'middle')
  .style('font-size', '1.20rem')
  .style('color', 'rgba(46, 46, 46, 1)')
  .text("35 of the fastest times at Alpe d'Huez");

svg
  .append('text')
  .attr('transform', 'rotate(-90)')
  .attr('x', -containerHeight / 2)
  .attr('y', margin.left / 2)
  .style('text-anchor', 'start')
  .style('color', 'rgba(46, 46, 46, 1)')
  .text('Time in minutes');

svg
  .append('circle')
  .attr('cx', graphWidth * 0.92)
  .attr('cy', graphHeight - graphHeight * 0.75)
  .attr('r', 8.5)
  .style('fill', '#003f5c');
svg
  .append('circle')
  .attr('cx', graphWidth * 0.92)
  .attr('cy', graphHeight - graphHeight * 0.75 + 25)
  .attr('r', 8.5)
  .style('fill', '#bc5090');
svg
  .append('text')
  .attr('x', graphWidth * 0.94)
  .attr('y', graphHeight - graphHeight * 0.747)
  .text('No doping allegations')
  .style('font-size', '.9rem')
  .attr('alignment-baseline', 'middle');
svg
  .append('text')
  .attr('x', graphWidth * 0.94)
  .attr('y', graphHeight - graphHeight * 0.747 + 25)
  .text('Rider with doping allegations')
  .style('font-size', '0.9rem')
  .attr('alignment-baseline', 'middle');

const toolTip = d3
  .select('.scatter-plot-chart')
  .append('div')
  .attr('class', 'scatter-plot-tooltip')
  .attr('id', 'scatter-plot-tooltip')
  .style('opacity', 0);

const updateGraph = (data) => {
  xScale.domain([
    d3.min(data, (d) => new Date(d.Year - 1, 0)),
    d3.max(data, (d) => new Date(d.Year + 1, 0)),
  ]);
  yScale.domain([
    d3.min(data, (d) => d.Seconds),
    d3.max(data, (d) => d.Seconds),
  ]);

  const circles = graph.selectAll('circle').data(data);

  circles.exit().remove();

  circles
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(new Date(d.Year, 0)))
    .attr('cy', (d) => yScale(d.Seconds))
    .attr('r', (d) => 4)
    .attr('fill', (d) => {
      if (d.Doping === '') return '#003f5c';
      return '#bc5090';
    })
    .on('mouseover', (d, i, arr) => {
      d3.select(arr[i]).transition().duration(150).attr('r', 6.5);

      const leftToolTip =
        xScale(new Date(d.Year, 0)) < 650
          ? xScale(new Date(d.Year, 0)) + 525
          : xScale(new Date(d.Year, 0)) + 325;

      toolTip
        .style('opacity', '0.9')
        .style('top', `${margin.top + 65 + yScale(d.Seconds)}px`)
        .style('left', `${leftToolTip}px`).html(`
          <p>${d.Name} : ${d.Nationality}</p>
          <p>Year: ${d.Year} , Time: ${d.Time}</p>
          <p>${d.Doping}</p>
        `);
      if (d.Doping) {
        return toolTip.style('backGround-color', `#bc5090`);
      }
      return toolTip.style('backGround-color', `#003f5c`);
    })
    .on('mouseout', (d, i, arr) => {
      d3.select(arr[i]).transition().duration(150).attr('r', 4);
      toolTip.style('opacity', '0');
    });

  xAxisGroup.call(xAxis).style('font-size', '0.8rem');
  yAxisGroup.call(yAxis).style('font-size', '0.8rem');
};

window.addEventListener('load', async () => {
  const graphData = await getChartData('/api/scatter-plot-data');

  updateGraph(graphData);
});
