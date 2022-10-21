function index(req, res) {
  res.render('entries/index');
}

function newEntry(req, res) {
  res.render('entries/new');
}

module.exports = {
  index: index,
  new: newEntry,
}