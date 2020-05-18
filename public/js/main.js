const chart = document.querySelector('.chart');

const getChartData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

window.addEventListener('load', async () => {
  const graphData = await getChartData('/api/gdp-data');
  // TODO: do stuff with D3 here
});
