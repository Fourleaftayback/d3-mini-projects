const chart = document.querySelector('.tree-map-chart');
const buttons = document.querySelectorAll('.graph-picker-button');
const allData = [];

const containerWidth = 1500;
const containerHeight = 850;

const margin = { top: 75, right: 50, bottom: 25, left: 200 };
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
    '#680EF2',
    '#2D0EF2',
    '#0E76F2',
    '#0EF2F2',
    '#0EF291',
    '#0EF223',
    '#8AF20E',
    '#DAF20E',
    '#F2DD0E',
    '#F2A90E',
    '#F2760E',
    '#F2230E',
    '#F20EA3',
    '#DD0EF2',
  ]);

const legendGroup = svg
  .append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${25}, ${margin.top + 10})`)
  .style('font-size', '0.8rem');

const legend = d3
  .legendColor()
  .shapeWidth(30)
  .orient('vertical')
  .scale(colors)
  .shapePadding(2);

//TODO: set up title and draw based on data

const description = svg
  .append('text')
  .attr('x', containerWidth / 2)
  .attr('y', 45)
  .attr('id', 'title')
  .attr('text-anchor', 'middle')
  .style('font-size', '1.20rem')
  .attr('fill', '#5E4FA2');

const treeChartToolTip = d3
  .select('.tree-map-chart')
  .append('div')
  .attr('class', 'tree-map-chart-tooltip')
  .attr('id', 'tree-map-chart-tooltip')
  .style('opacity', 0);

const wordWrap = (text, width) => {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      x = text.attr('x'),
      y = text.attr('y'),
      dy = 0, //parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', dy + 'em');
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .text(word);
      }
    }
  });
};

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

  rects
    .enter()
    .append('rect')
    .attr('class', 'rect-block')
    .attr('x', (d) => d.x0)
    .attr('y', (d) => d.y0)
    .attr('width', (d) => d.x1 - d.x0)
    .attr('height', (d) => d.y1 - d.y0)
    .style('stroke', 'black')
    .style('fill', (d) => colors(d.data.category))
    .on('mouseover', (d, i, arr) => {
      treeChartToolTip.transition().duration(150);
      treeChartToolTip
        .style('opacity', '0.9')
        .style('top', `${d3.event.pageY - 25}px`)
        .style('left', `${d3.event.pageX + 15}px`)
        .style('color', 'black')
        .style('backGround-color', () => colors(d.data.category)).html(`
        <p>${d.data.name}</p>
        <p>Category: ${d.data.category}</p>
        <p>Value: ${d.data.value}</p>
      `);
    })
    .on('mousemove', (d, i, arr) =>
      treeChartToolTip
        .style('opacity', '0.9')
        .style('top', `${d3.event.pageY - 25}px`)
        .style('left', `${d3.event.pageX + 15}px`)
    )
    .on('mouseout', () =>
      treeChartToolTip.transition().duration(50).style('opacity', '0.0')
    );

  texts
    .enter()
    .append('text')
    .attr('class', 'rect-text')
    .attr('x', (d) => d.x0 + 5)
    .attr('y', (d) => {
      if (/^Wii/.test(d.data.name)) {
        return d.y0 + 15;
      }
      return d.y0 + 5;
    })
    .text((d) => {
      if (d.data.name.length > 22) {
        return d.data.name.slice(0, 21);
      }
      return d.data.name;
    })
    .call(wordWrap, 25)
    .attr('text-anchor', 'start')
    .attr('font-size', '9.5px')
    .attr('fill', 'black');

  legendGroup.call(legend);
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
  let gameSalesData = await getChartData(
    ' https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
  );

  gameSalesData.children.shift();

  allData.push(gameSalesData);

  updateGraph(kickStarterData);
});
