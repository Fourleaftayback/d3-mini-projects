const chart = document.querySelector('.tree-map-chart');

const containerWidth = 1100;
const containerHeight = 650;

const margin = { top: 100, right: 50, bottom: 25, left: 50 };
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
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const colors = d3
  .scaleOrdinal()
  .range([
    '#5E4FA2',
    '#3288BD',
    '#66C2A5',
    '#ABDDA4',
    '#E6F598',
    '#FDAE61',
    '#F46D43',
    '#D53E4F',
    '#9E0142',
  ]);

const legendGroup = svg
  .append('g')
  .attr('class', 'legend')
  .style('font-size', '0.9rem');

const legend = d3
  .legendColor()
  .shapeWidth(40)
  .orient('vertical')
  .scale(colors)
  .shapePadding(2);

//TODO: set up title and draw based on data

const updateGraph = (data) => {
  const categories = data.children.map((item) => item.name);

  colors.domain(d3.extent(categories));

  const root = d3.hierarchy(data).sum((d) => d.value);
  d3.treemap().size([graphWidth, graphHeight]).padding(2)(root);

  graph
    .selectAll('rect')
    .data(root.leaves())
    .enter()
    .append('rect')
    .attr('class', 'rect-block')
    .attr('x', (d) => d.x0)
    .attr('y', (d) => d.y0)
    .attr('width', (d) => d.x1 - d.x0)
    .attr('height', (d) => d.y1 - d.y0)
    .style('stroke', 'black')
    .style('fill', (d) => colors(d.data.category));

  graph
    .selectAll('text')
    .data(root.leaves())
    .enter()
    .append('text')
    .attr('class', 'rect-text')
    .attr('x', (d) => d.x0 + 5)
    .attr('y', (d) => d.y0 + 20)
    .text((d) => {
      // console.log(d.data.name);
      // TODO: break text up here
      return d.data.name;
    })
    .attr('font-size', '8px')
    .attr('fill', 'white');

  // legendGroup.call(legend);  //TODO: chunk legend and call
  // legendGroup
  //   .selectAll('text')
  //   .attr('class', 'legend-text')
  //   .text((d, i, arr) => {
  //     if (arr.length !== i + 1) {
  //       return d.replace(/^.+to /, '');
  //     }
  //   })
  //   .attr('transform', `translate( 40, 33)`);
};

window.addEventListener('load', async () => {
  const kickStarterData = await getChartData(
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'
  );
  const movieData = await getChartData(
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
  );
  const gameSalesData = await getChartData(
    ' https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
  );

  updateGraph(movieData);
});
