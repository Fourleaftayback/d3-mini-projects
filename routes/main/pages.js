module.exports = function (app) {
  app.route('/').get((req, res) => {
    res.render('index');
  });
  app.route('/scatter-plot').get((req, res) => {
    res.render('scatter-plot');
  });
};
