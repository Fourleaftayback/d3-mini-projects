module.exports = function (app) {
  app.route('/').get((req, res) => {
    res.render('index', { path: '/' });
  });
  app.route('/scatter-plot').get((req, res) => {
    res.render('scatter-plot', { path: '/scatter-plot' });
  });

  app.route('/heat-map').get((req, res) => {
    res.render('heat-map', { path: '/heat-map' });
  });

  app.route('/map-chart').get((req, res) => {
    res.render('map-chart', { path: '/map-chart' });
  });

  app.route('/tree-map').get((req, res) => {
    res.render('tree-map', { path: '/tree-map' });
  });
};
