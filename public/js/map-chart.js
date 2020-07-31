const chart = document.querySelector('.map-chart-chart');

const containerWidth = 1100;
const containerHeight = 700;

const margin = { top: 70, right: 50, bottom: 50, left: 50 };
const graphWidth = containerWidth - margin.left - margin.right;
const graphHeight = containerHeight - margin.top - margin.bottom;

const svg = d3
  .select('.map-chart-chart')
  .append('svg')
  .attr('width', containerWidth)
  .attr('height', containerHeight);

const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left * 1.9}, ${margin.top})`);

const path = d3.geoPath();

const updateMapGraph = (mapData, graphData) => {
  graph
    .attr('class', 'counties')
    .selectAll('path')
    .data(topojson.feature(mapData, mapData.objects.counties).features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('fill', function (d) {
      // var result = education.filter(function (obj) {
      //   return obj.fips == d.id;
      // });
      // if (result[0]) {
      //   return color(result[0].bachelorsOrHigher);
      // }
      // //could not find a matching fips id in the data
      // return color(0);
      'black';
    })
    .attr('d', path);
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
