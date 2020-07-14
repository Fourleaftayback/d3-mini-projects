const chart = document.querySelector('.heat-map-chart');
const description = document.querySelector('#description');

const containerWidth = 1100;
const containerHeight = 650;

const margin = { top: 100, right: 25, bottom: 50, left: 150 };
const graphWidth = containerWidth - margin.left - margin.right;
const graphHeight = containerHeight - margin.top - margin.bottom;

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

//set up scales

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
});
