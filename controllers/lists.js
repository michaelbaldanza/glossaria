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

function index(req, res) {
  List.find({}, (err, allLists) => {
    if (err) console.error(err);
    Entry.find({}, (err, allEntries) => {
      if (err) console.error(err);
      console.log(allEntries);
      res.render('lists/index', {
        entries: allEntries,
        lists: allLists,
        user: req.user,
      });
    });
  });
  // res.render('lists/index', {user: req.user});
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
      entries: entries,
      user: req.user,
    });
  });
  // res.render('lists/new', {user: req.user});
}

function show(req, res) {
  List.findById(req.params.id)
  .populate('entries').exec(function(err, list) {
    if (err) console.error(err);
    res.render('lists/show', {
      list: list,
      user: req.user,
    });
  });
  //   if (err) console.error(err);
  //   console.log(list.entries);
  //   res.render('lists/show', {
  //     list: list,
  //     user: req.user,
  //   });
  // });
}

module.exports = {
  create: create,
  index: index,
  new: newList,
  show: show,
};