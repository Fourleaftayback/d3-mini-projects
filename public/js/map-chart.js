const chart = document.querySelector('.map-chart-chart');

const containerWidth = 1100;
const containerHeight = 650;

const margin = { top: 100, right: 50, bottom: 50, left: 50 };
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
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const updateMapGraph = (mapData, graphData) => {
  console.log(mapData);
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
