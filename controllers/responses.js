const Response = require('../models/response');
const api = require('../utils/api');
const defs = require('../utils/defs');
const str = require('../utils/str');

async function create(req, res) {
  console.log(`THE WORD IS "${req.body.word}"`);
  const word = await api.lookup(req.body.word);
  const response = new Response();
  response['word'] = req.body.word;
  const keys = Object.keys(word);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    response[key] = word[key];
  }
  await response.save()
    .catch(err => {
      console.error(err);
      res.redirect('/words/new');
    })
  res.redirect(`/words`);
}

async function index(req, res) {
  // Response.find({}, )
  const responses = await Response.find({})
    .then(allResponses => {
    return allResponses;
  });
  console.log(responses);
  res.render('responses/index', {
    responses: responses,
    pt: 'All Words',
    user: req.user,
  });
}

function newResponse(req, res) {
  res.render('responses/new', {
    response: undefined,
    user: req.user,
    pt: 'Add a word',
  });
}

function accessArray(arr) {
  console.log(arr)
  console.log(`arr is ${arr.length} long, and type of first child is ${Object.prototype.toString.call(arr[0])}`)
  if (Object.prototype.toString.call(arr[0]) === '[object Array]' && arr.length === 1) {
    console.log(`accessing array's first child`);
    return accessArray(arr[0]);
  } else {
    console.log(`returning arr`);
    console.log(arr);
    return arr;
  }
}

function findObject(arr) {
  console.log(`hitting find object`)
  for (let i = 0; i < arr.length; i++) {
    console.log(`iteration ${i}`);
    console.log(arr[i]);
    if (typeof(arr[i]) !== 'string') {
      
      const sk = Object.keys(arr[i]);
      for (let j = 0; j < sk.length; j++) {
        console.log(`subiteration ${j}`)
        if (sk[j] === 'dt') {
          console.log(accessArray(arr[i][sk[j]]));
        }
      }
    }
  }
}

async function show(req, res) {
  console.log(req.params.word);
  console.log(`here are the keys`)
  console.log(api.keys);
  const response = await Response.findOne({word: req.params.word}).exec();
  const keys = api.keys;
  const rs = []; // initiate array for api responses
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const apiRes = response[key];
    const r = {};
    defs.makeDef(key, apiRes);
    const rStr = JSON.stringify(apiRes, null, 2);
    r['source'] = api.info[key].name;
    r['text'] = rStr;
    rs.push(r);
  }
  
  // console.log(`doing some things with ${req.params.word}`);
  // console.log(accessArray(response['mw'][0].def[0]));
  // const defArr = accessArray(response['mw'][0].def[0].sseq);
  // console.log(`trying to log what accessArray returns`);
  // console.log(defArr);
  // findObject(defArr);
  // findObject(def);

  // compose etymologies for Oxford Dictionaries here
  // return array of etymologies

  const mws = defs.compose['mw'](response['mw']);
  const us = response['odus'];
  const oxfordUS = defs.compose['od'](us);
  const gb = response['odgb'];
  const oxfordGB = defs.compose['od'](gb);
  // const oxfordGB = defs.compose['odgb'](response['odgb']);
  console.log(response['odus'].results);
  // const first = response['odus'].results[0];
  // console.log(first
  // first.newProp = 'hello world';
  // console.log(first);
  res.render('responses/show', {
    oxfordUS: oxfordUS,
    oxfordGB: oxfordGB,
    mws: mws,
    remColon: str.remColon,
    response: response,
    rs: rs,
    user: req.user,
    pt: response.word,
  });
}

module.exports = {
  create: create,
  index: index,
  new: newResponse,
  show: show,
};