const Entry = require('../models/entry');
const List = require('../models/list');

function create(req, res) {
  console.log(req.body);
  const list = new List(req.body);
  console.log(list);
  list.save(function(err) {
    if (err) return res.render('lists/new');
    if (req.user) {
      list.createdBy = req.user;
    }
    res.redirect(`/lists/${list.id}`);
  })
}

function deleteList(req, res) {
  List.findById(req.params.id, (err, list) => {
    if (err) console.error(err);
    list.deleteOne({}).then(() => {
      res.redirect('/lists');
    }).catch(function(error) {
      console.log(error);
    });
  });
}

function edit(req, res) {
  console.log(`hitting ${req.params.id}/edit`);
  List.findById(req.params.id, (err, list) => {
    if (err) console.error(err);
    Entry.find({}, (err, allEntries) => {
      if (err) console.error(err);
      res.render('lists/new', {
        list: list,
        entries: allEntries,
        user: req.user,
      });
    });
  });
}

function index(req, res) {
  List.find({}, (err, allLists) => {
    if (err) console.error(err);
    Entry.find({}, (err, allEntries) => {
      if (err) console.error(err);
      res.render('lists/index', {
        entries: allEntries,
        lists: allLists,
        user: req.user,
      });
    });
  });
}

function newList(req, res) {
  Entry.find({}, (err, allEntries) => {
    if (err) console.error(err);
    let entries = [];
    allEntries.forEach((entry) => {
      if (entry.headword) {
        entries.push(entry);
      }
    });
    res.render('lists/new', {
      list: undefined,
      entries: entries,
      user: req.user,
    });
  });
}

function show(req, res) {
  List.findById(req.params.id)
  .populate('entries').exec(function(err, list) {
    console.log(list);
    if (err) console.error(err);
    res.render('lists/show', {
      list: list,
      user: req.user,
    });
  });
}

function update(req, res) {
  console.log(req.body);
  Lists.findById(req.params.id, (err, list) => {
    if (err) console.error(err);
    list.name = req.body.name;
    list.entries = req.body.entries;
    list.save();
    res.redirect(`/lists/${req.params.id}`);
  });
}

module.exports = {
  create: create,
  delete: deleteList,
  edit: edit,
  index: index,
  new: newList,
  show: show,
  update: update,
};