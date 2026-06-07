require('dotenv').config();

const express = require('express');
const path = require('path');
const { registry: componentRegistry } = require('./lib/core/Component');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor/lineicons', express.static(path.join(__dirname, 'node_modules', 'lineicons', 'dist')));
app.use('/components', express.static(path.join(__dirname, 'components')));
app.use(componentRegistry.middleware());

app.use('/', require('./routes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/error', {
    title: 'Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

app.listen(PORT, () => {
  console.log(`Sen JS running at http://localhost:${PORT}`);
});
