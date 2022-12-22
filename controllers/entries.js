const Entry = require('../models/entry');
const api = require('../utils/api');

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
      tisp: '',
    });
  });
}

async function index(req, res) {
  // shortcut to query parameter; 'none' if no query parameters
  const qp = Object.keys(req.query).length ? req.query.sort : 'none';
  console.log(`here's the sort key ${qp}`);
  console.log(req.query.sort);
  const sortQuery = {
    'alphabetical': await Entry.find()
      .collation({locale: 'en', strength: 1})
      .sort({headword:1})
      .then((allEntries) => {
        return allEntries;
    }), 'oldest': await Entry.find({})
      .sort({updatedAt: 'asc'})
      .then(allEntries => {
        return allEntries;
    }),'newest': await Entry.find({})
      .sort({updatedAt: 'desc'})
      .then(allEntries => {
        return allEntries;
    }), 'none': await Entry.find({})
      .then(allEntries => {
        return allEntries;
  })};
  const sortedEntries = sortQuery[qp];
  const qps = Object.keys(sortQuery);
  console.log(`these are the query parameters: ${qps}`);
  // console.log(`these are the sorted entries`);
  // console.log(sortQuery[qp]);
  // console.log(req.query);
  // if (req.query.sort === 'alphabetical') {
  //   console.log(`hitting alphabetical`);
  //   sortString = 'alphabetical';
  //   sortedEntries = await Entry.find().collation({locale: 'en', strength: 1})
  //   .sort({headword:1}).then((allEntries) => {
  //     return allEntries;
  //   });
  // } else if (req.query.sort === 'oldest') {
  //   sortString = 'newest';
  //   sortedEntries = await Entry.find({}).sort({updatedAt: 'asc'})
  //     .then(allEntries => {
  //       return allEntries;
  //   });
  // } else if (req.query.sort === 'newest' || 
  //   req.query.sort === undefined) {
  //   sortedEntries = await Entry.find({}).sort({updatedAt: 'desc'}).then((allEntries) => {
  //     console.log(`trying to sort bv most recent`);
  //     return allEntries;
  //   });
  // }
  // console.log(sortedEntries[0].headword)
  // const trueData = await fetch(api.checkDict(sortedEntries[0].headword))
  // .then((response) => response.json())
  // .then((data) => {return data});
  // console.log(trueData);
  res.render('entries/index', {
    entries: sortedEntries,
    qp: qp.length ? qp : '',
    qps: qps,
    tisp: 'All Entries' + ' - ',
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

async function show(req, res) {
  console.log(`hitting show`);
  console.log(req.originalUrl);
  let un;
  const entry = await Entry.findById(req.params.id).then(entry => {
    return entry;
  });
  const entryData = await fetch(api.checkDict(entry.headword))
    .then((res) => res.json())
    .then((data) => {return data});
  console.log(un);
  console.log(`Here's the entry data`);
  console.log(entryData);
  console.log(`And here's the def Object`);
  console.log(entryData[0].def);
  console.log(`which has an 'sseq' array`);
  console.log(entryData[0].def[0].sseq[0]);
  console.log(`which itself container an array of two items two levels deep. the second item is at the first index. here it is`);
  console.log(entryData[0].def[0].sseq[0][0][1]);
  console.log(`and here's the 'et' array`);
  console.log(entryData[0].et);
  res.render('entries/show', {
  entry: entry,
  entryData: entryData,
  user: req.user,
  tisp: '',
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