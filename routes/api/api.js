const gdpData = require('../../graphData/gdpData');

module.exports = function (app) {
  app.route('/api/gdp-data').get((req, res) => {
    res.status(200).json(gdpData.data);
  });
};
