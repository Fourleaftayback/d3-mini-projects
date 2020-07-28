module.exports = function (app) {
  app.route('/').get((req, res) => {
    res.render('index');
  });
  app.route('/scatter-plot').get((req, res) => {
    res.render('scatter-plot');
  });

  app.route('/heat-map').get((req, res) => {
    res.render('heat-map');
  });

  app.route('/map-chart').get((req, res) => {
    res.render('map-chart');
  });
};
