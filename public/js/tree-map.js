const chart = document.querySelector('.tree-map-chart');
const buttons = document.querySelectorAll('.graph-picker-button');
const allData = [];

const containerWidth = 1100;
const containerHeight = 650;

const margin = { top: 75, right: 50, bottom: 25, left: 50 };
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

const description = svg
  .append('text')
  .attr('x', containerWidth / 4)
  .attr('y', 45)
  .attr('id', 'title')
  .attr('text-anchor', 'middle')
  .style('font-size', '1.20rem')
  .attr('fill', '#5E4FA2');

const updateGraph = (data) => {
  description.text(`${data.name} by categories`);
  const categories = data.children.map((item) => item.name);

  colors.domain(d3.extent(categories));

  // remove
  graph.selectAll('rect').remove();
  graph.selectAll('text').remove();

  const root = d3.hierarchy(data).sum((d) => d.value);
  d3.treemap().size([graphWidth, graphHeight]).padding(2)(root);

  const rects = graph.selectAll('rect').data(root.leaves());

  const texts = graph.selectAll('text').data(root.leaves());

  // update
  // rects
  //   .attr('x', (d) => d.x0)
  //   .attr('y', (d) => d.y0)
  //   .attr('width', (d) => d.x1 - d.x0)
  //   .attr('height', (d) => d.y1 - d.y0)
  //   .style('stroke', 'black')
  //   .style('fill', (d) => colors(d.data.category));

  rects
    .enter()
    .append('rect')
    .attr('class', 'rect-block')
    .attr('x', (d) => d.x0)
    .attr('y', (d) => d.y0)
    .attr('width', (d) => d.x1 - d.x0)
    .attr('height', (d) => d.y1 - d.y0)
    .style('stroke', 'black')
    .style('fill', (d) => colors(d.data.category));

  texts
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

const handleButtonClick = (e) => {
  buttons.forEach((item) => {
    item.classList.remove('active');
  });
  let element = e.target;
  element.classList.add('active');
  let data;
  const graphType = e.target.textContent.replace(/\s.+$/, '');

  if (graphType === 'Movie') {
    data = allData.filter((item) => item.name === 'Movies');
  }
  if (graphType === 'Game') {
    data = allData.filter(
      (item) => item.name == 'Video Game Sales Data Top 100'
    );
  }
  if (graphType === 'Kick') {
    data = allData.filter((item) => item.name === 'Kickstarter');
  }
  updateGraph(data[0]);
};

buttons.forEach((item) => {
  item.addEventListener('click', (e) => handleButtonClick(e));
});

window.addEventListener('load', async () => {
  const kickStarterData = await getChartData(
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'
  );

  allData.push(kickStarterData);

  const movieData = await getChartData(
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
  );
  allData.push(movieData);
  const gameSalesData = await getChartData(
    ' https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
  );

  allData.push(gameSalesData);

  updateGraph(kickStarterData);
});
