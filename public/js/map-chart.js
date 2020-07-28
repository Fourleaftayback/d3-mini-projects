window.addEventListener('load', async () => {
  const graphData = await getChartData(
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
  );

  // map data https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json

  console.log(graphData);

  // updateGraph(graphData);
});
