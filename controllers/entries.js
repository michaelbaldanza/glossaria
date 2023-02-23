const Entry = require('../models/entry');
const api = require('../utils/api');

async function create(req, res) {
  console.log(req.body);
  if (req.body.addInfo) {
    const q = req.body.headword; // word to check apis for
    const entryData = await fetch(api.lookup(q))
    .then((res) => res.json())
    .then((data) => {
      // console.log(`logging entry data`);
      // console.log(data);
      console.log(`API data stored`);
      return data;
  });
    if (entryData.length === 1 &&typeof(entryData[0] === 'object')) {
      console.log('One valid response!');
    } else if (!entryData.length) {
      console.log('No results');
    } else if (entryData.length > 0) {
      console.log(`gonna have to choose just one`);
    }
  } else {
    console.log(`NOT CHECKED`);
  }
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

async function edit(req, res) {
  console.log(`hitting edit`);
  const entry = await Entry.findById(req.params.id);
  // console.log(entry);
  const lookup = await api.lookup(entry.headword);
  
  const responses = api.read(lookup);
  // console.log(responses);
  const keys = Object.keys(responses[0]);
  // console.log(keys);
  res.render('entries/new', {
    entry: entry,
    responses: responses,
    keys: keys,
    user: req.user,
    pt: 'Edit ' + entry.headword,
  });
}

async function index(req, res) {
  // shortcut to query parameter; 'none' if no query parameters
  const qp = Object.keys(req.query).length ? req.query.sort : 'none';
  // look up query parameter and return sorted collection
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
  // const sortedEntries = sortQuery[qp];
  const qps = Object.keys(sortQuery);
  // const trueData = await fetch(api.checkDict(sortedEntries[0].headword))
  // .then((response) => response.json())
  // .then((data) => {return data});
  // console.log(trueData);
  res.render('entries/index', {
    entries: sortQuery[qp],
    // provision query parameters
    qps: qps,
    // set the active query parameter for the page
    qp: qp.length ? qp : '',
    pt: 'All Entries',
    user: req.user,
  });
}

function newEntry(req, res) {
  res.render('entries/new', {
    entry: undefined,
    user: req.user,
    pt: 'Add an Entry',
  });
}

async function show(req, res) {
  console.log(`hitting show`);
  console.log(req.originalUrl);
  let un;
  const entry = await Entry.findById(req.params.id).then(entry => {
    return entry;
  });
  let entryData = [];
  // const entryData = await fetch(api.lookup(entry.headword))
  //   .then((res) => res.json())
  //   .then((data) => {
  //     console.log(`logging entry data`);
  //     console.log(data);
  //     return data;
  // });
  // entryData = await re.json();
  if (entryData.length) {
    console.log(un);
    console.log(`Here's the entry data`);
    console.log(entryData);
    if (typeof(entryData[0]) === 'string') {
      console.log('no result found for ' + entry.headword);
    }
    console.log(typeof(entryData[0]));
    // console.log(`And here's the def Object`);
    // console.log(entryData[0].def);
    // console.log(`which has an 'sseq' array`);
    // console.log(entryData[0].def[0].sseq[0]);
    // console.log(`which itself container an array of two items two levels deep. the second item is at the first index. here it is`);
    // console.log(entryData[0].def[0].sseq[0][0][1]);
    // console.log(`and here's the 'et' array`);
    // console.log(entryData[0].et);
  } else {
    console.log(`no response`);
  }
  res.render('entries/show', {
  entry: entry,
  entryData: entryData,
  user: req.user,
  pt: entry.headword ? entry.headword : '',
  });
}

function update(req, res) {
  console.log(`hititng update`);
  Entry.findById(req.params.id, (err, entry) => {
    if (err) console.error(err);
    entry.headword = req.body.headword;
    entry.bodyText = req.body.bodyText;
    entry.modifiedPaths(); // causes save to send only updated values to MongoDB
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