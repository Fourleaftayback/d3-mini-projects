const chart = document.querySelector('.tree-map-chart');

const containerWidth = 1100;
const containerHeight = 650;

const margin = { top: 100, right: 50, bottom: 75, left: 100 };
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

const updateGraph = (data) => {
  console.log(data);

  //   var root = d3.hierarchy(data).sum(function(d){ return d.value}) // Here the size of each leave is given in the 'value' field in input data

  //   // Then d3.treemap computes the position of each element of the hierarchy
  //   d3.treemap()
  //     .size([width, height])
  //     .padding(2)
  //     (root)

  //   // use this information to add rectangles:
  //   svg
  //     .selectAll("rect")
  //     .data(root.leaves())
  //     .enter()
  //     .append("rect")
  //       .attr('x', function (d) { return d.x0; })
  //       .attr('y', function (d) { return d.y0; })
  //       .attr('width', function (d) { return d.x1 - d.x0; })
  //       .attr('height', function (d) { return d.y1 - d.y0; })
  //       .style("stroke", "black")
  //       .style("fill", "slateblue")

  //   // and to add the text labels
  //   svg
  //     .selectAll("text")
  //     .data(root.leaves())
  //     .enter()
  //     .append("text")
  //       .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
  //       .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
  //       .text(function(d){ return d.data.name })
  //       .attr("font-size", "15px")
  //       .attr("fill", "white")
  // })
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

  updateGraph(kickStarterData);
});
