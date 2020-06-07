const gdpData = require('../../graphData/gdpData');
const scatterPlotData = require('../../graphData/scatterPlotData');

module.exports = function (app) {
  app.route('/api/gdp-data').get((req, res) => {
    res.status(200).json(gdpData.data);
  });

  app.route('/api/scatter-plot-data').get((req, res) => {
    res.status(200).json(scatterPlotData);
  });
};
