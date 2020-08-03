const chart = document.querySelector('.map-chart-chart');

const containerWidth = 1100;
const containerHeight = 700;

const margin = { top: 70, right: 50, bottom: 50, left: 50 };
const graphWidth = containerWidth - margin.left - margin.right;
const graphHeight = containerHeight - margin.top - margin.bottom;

const svg = d3
  .select(chart)
  .append('svg')
  .attr('width', containerWidth)
  .attr('height', containerHeight);

const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left * 1.9}, ${margin.top})`);

svg
  .append('text')
  .attr('x', containerWidth / 2)
  .attr('y', `${margin.top * 1.1}`)
  .attr('id', 'Description')
  .attr('text-anchor', 'middle')
  .style('font-size', '1rem')
  .attr('fill', 'rgba(98, 81, 197, 1)')
  .style('font-weight', 500)
  .text("Percentage of adults with a bachelor's degree or higher");

const path = d3.geoPath();

const colors = d3.scaleSequential().interpolator(d3.interpolateCool);

const legendGroup = svg
  .append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${graphWidth * 0.72}, ${margin.top * 1.65})`)
  .style('font-size', '0.7rem');

const legend = d3
  .legendColor()
  .shapeWidth(40)
  .shapeHeight(10)
  .orient('horizontal')
  .scale(colors)
  .shapePadding(0);

const mapChartToolTip = d3
  .select('.map-chart-chart')
  .append('div')
  .attr('class', 'map-chart-tooltip')
  .attr('id', 'map-chart-tooltip')
  .style('opacity', 0);

const updateMapGraph = (mapData, graphData) => {
  colors.domain([
    d3.min(graphData, (d) => d.bachelorsOrHigher),
    d3.max(graphData, (d) => d.bachelorsOrHigher),
  ]);

  legendGroup.call(legend);
  legendGroup
    .selectAll('text')
    .attr('class', 'legend-text')
    .text((d, i, arr) => {
      if (arr.length !== i + 1) {
        return `${Math.round(d)}%`;
      }
    })
    .attr('transform', `translate(42, 25)`);

  graph
    .attr('class', 'counties')
    .selectAll('path')
    .data(topojson.feature(mapData, mapData.objects.counties).features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('fill', (d) => {
      const countyData = graphData.filter((item) => item.fips === d.id);
      return colors(countyData[0].bachelorsOrHigher || 'gray');
    })
    .attr('d', path)
    .on('mouseover', (d, i, arr) => {
      const countyData = graphData.filter((item) => item.fips === d.id);
      const data = countyData[0];
      mapChartToolTip.transition().duration(150);
      mapChartToolTip
        .style('opacity', '0.9')
        .style('top', `${d3.event.pageY - 25}px`)
        .style('left', `${d3.event.pageX + 25}px`)
        .style('color', 'white')
        .style('backGround-color', () => colors(data.bachelorsOrHigher)).html(`
        <p>${data.area_name}, ${data.state}</p>
        <p>College+: ${data.bachelorsOrHigher}%</p>
      `);
    })
    .on('mouseout', () =>
      mapChartToolTip.transition().duration(50).style('opacity', '0.0')
    );
};

window.addEventListener('load', async () => {
  const graphData = await getChartData(
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
  );

  const mapGraph = await getChartData(
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
  );

  updateMapGraph(mapGraph, graphData);
});
