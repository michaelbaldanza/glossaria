const Entry = require('../models/entry');

function create(req, res) {
  const entry = new Entry(req.body);
  entry.save(function(err) {
    if (err) return res.render('entries/new');
    console.log(entry);
    res.redirect('/entries/new');
  })
}

function index(req, res) {
  console.log(`hitting index`);
  const entries = Entry.find({}, (err, allEntries) => {
    if (err) console.error(err);
    res.render('entries/index', {entries: allEntries});
  });
}

function newEntry(req, res) {
  res.render('entries/new');
}

function show(req, res) {
  Entry.findById(req.params.id, (err, entry) => {
    if (err) console.error(err);
    res.render('entries/show', {entry: entry});
  });
}

module.exports = {
  create: create,
  index: index,
  new: newEntry,
  show: show,
}