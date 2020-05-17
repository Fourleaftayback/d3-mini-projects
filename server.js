const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const path = require('path');

const pageView = require('./routes/main/pages');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const port = process.env.PORT;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views/pages'));
app.locals.basedir = '/views';

const middleWares = [
  compression(),
  express.static(path.join(__dirname, 'public')),
  bodyParser.json(),
  bodyParser.urlencoded({
    extended: true,
  }),
];

app.use(middleWares);

pageView(app);

app.listen(port, () => console.log(`server connected on ${port}`));
