const Entry = require('../models/entry');

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
    entry.deleteOne({}).then(function () {
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

function index(req, res) {
  console.log(`hitting index`);
  console.log(req.user);
  Entry.find({}, (err, allEntries) => {
    if (err) console.error(err);
    for (let i = 0; i < allEntries.length; i++) {
      if (allEntries[i].headword) {
        console.log(`${allEntries[i].id}'s headword is ${allEntries[i].headword}`);
      } else {
        console.log(`${allEntries[i].id} has no headword`);
        allEntries[i].deleteOne({}).then(function () {
          console.log('data deleted');
        }).catch(function(error) {
          console.log(error);
        });
      }
    }
    res.render('entries/index', {
      entries: allEntries,
      user: req.user,
    });
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