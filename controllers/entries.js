const defaults = require('../config/defaults');

function index(req, res) {
  res.render('entries/index', {
    title: defaults.appName,
  })
}

module.exports = {
  index: index,
}