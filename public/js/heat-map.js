window.addEventListener('load', async () => {
  const graphData = await getChartData(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
  );
  console.log(graphData);
  // updateGraph(graphData);
});
