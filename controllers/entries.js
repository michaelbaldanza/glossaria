const Entry = require('../models/entry');
const api = require('../config/api');

function create(req, res) {
  const entry = new Entry(req.body);
  entry.save(function(err) {
    if (err) return res.render('entries/new');
    if (req.user) {
      entry.createdBy = req.user;
    }
    console.log(entry);
    res.redirect(`/entries/${entry.id}`);
  })
}

function deleteEntry(req, res) {
  console.log(`hitting entriesCtrl.delete`);
  Entry.findById(req.params.id, (err, entry) => {
    if (err) console.error(err);
    entry.deleteOne({}).then(function() {
      console.log('data deleted');
      res.redirect('/entries');
    }).catch(function(error) {
      console.log(error);
    });
  });
}

function edit(req, res) {
  Entry.findById(req.params.id, (err, entry) => {
    if (err) console.error(err);
    res.render('entries/new', {
      entry: entry,
      user: req.user,
    });
  });
}

async function index(req, res) {
  // query api
  let url = api.queryDictAPI('true');
  console.log(url);
  let sortedEntries;
  console.log(req.query);
  if (req.query.sort === 'alphabetical') {
    console.log(`hitting alphabetical`);
    sortedEntries = await Entry.find().collation({locale: 'en', strength: 1})
    .sort({headword:1}).then((allEntries) => {
      return allEntries;
    });
  } else if (req.query.sort === 'oldest') {
    sortedEntries = await Entry.find({}).sort({updatedAt: 'asc'}).then(allEntries => {
      console.log(allEntries[0]);
      return allEntries;
    });
  } else if (req.query.sort === 'most_recent' || 
    req.query.sort === undefined) {
    sortedEntries = await Entry.find({}).sort({updatedAt: 'desc'}).then((allEntries) => {
      console.log(`I'm trying to sort bv most recent`);
      return allEntries;
    });
  }
  res.render('entries/index', {
    entries: sortedEntries,
    user: req.user,
  });
}

function newEntry(req, res) {
  console.log('logging req.user');
  console.log(req.user);
  res.render('entries/new', {
    entry: undefined,
    user: req.user,
  });
}

function show(req, res) {
  console.log(`hitting show`);
  console.log(req.originalUrl);
  Entry.findById(req.params.id, (err, entry) => {
    if (err) console.error(err);
    res.render('entries/show', {
      entry: entry,
      user: req.user,
    });
  });
}

function update(req, res) {
  console.log(`hititng update`);
  Entry.findById(req.params.id, (err, entry) => {
    if (err) console.error(err);
    entry.headword = req.body.headword;
    entry.bodyText = req.body.bodyText;
    entry.save();
    res.redirect(`/entries/${req.params.id}`);
  });
}

module.exports = {
  create: create,
  delete: deleteEntry,
  edit: edit,
  index: index,
  new: newEntry,
  show: show,
  update: update,
};