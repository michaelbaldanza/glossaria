const util = require('util');
const fs = require('fs');
const str = require('../utils/str');

const info = {
  'mw': {
    'name': `Merriam-Webster's Collegiate Dictionary`,
    'link': 'https://dictionaryapi.com/products/json',
    'cap': function(word) {
      return word.toUpperCase();
    },
    'log': function(word) {
      console.log(this.cap(word));
      console.log(`I'm logging ${word}`);
    },
    'endpoint': function (word) {
      const qs = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' +
        word + '?key=' + process.env.DICTIONARY_KEY;
      return qs;
    },
    'compose': async function(word) {
      const apiRes = await get(this.endpoint(word));
      const mws = []; // array containing all returned merriam-webster's responses
      // console.log(res);
      for (let i = 0; i < apiRes.length; i++){
        const re = apiRes[i];
        const mw = {};
        mw.word = str.remColon(re.meta.id);
        mw.inflections = re.meta.stems;
        mw.partOfSpeech = re.fl;
        mw.shortDef = re.shortdef;
        mws.push(mw);
      }
      // console.log(mws);
      return mws;
    },
  },
  'fd': {
    'name': 'Free Dictionary',
    'link': 'https://dictionaryapi.dev/',
    'endpoint': function (word) {
      return 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word;
    },
    'compose': async function(word) {
      const apiRes = await get(this.endpoint(word));
      return apiRes;
    },
  },
  'odus': {
    'name': 'Oxford Dictionary, US',
    'link': 'https://developer.oxforddictionaries.com/documentation/languages',
    'endpoint': function (word) {
      const qs = 'https://od-api.oxforddictionaries.com/api/v2/entries/en-gb/' + word;
      const ro = {
        method: 'GET',
        headers: {'app_id': process.env.OXFORD_ID, 'app_key': process.env.OXFORD_KEY}
      }
      return [qs, ro];
    },
    'compose': async function(word) {
      const comp = await composeOxford(this.endpoint(word));
      return comp;
    },
  },
  'odgb': {
    'name': 'Oxford Dictionary, GB',
    'link': 'https://developer.oxforddictionaries.com/documentation/languages',
    'endpoint': function (word) {
      const qs = 'https://od-api.oxforddictionaries.com/api/v2/entries/en-us/' + word;
      const ro = {
        method: 'GET',
        headers: {'app_id': process.env.OXFORD_ID, 'app_key': process.env.OXFORD_KEY}
      }
      return [qs, ro];
    },
    'compose': async function(word) {
      const comp = await composeOxford(this.endpoint(word));
      return comp;
    },
  },
}

const dictionaries = Object.keys(info);

async function lookup(word) {
  console.log(dictionaries)
  const responses = {};
  for (let i = 0; i < dictionaries.length; i++) {
    const code = dictionaries[i];
    const response = await get(info[code]['endpoint'](word));
    const dir = `./responses/${word}`
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(
      `${dir}/${code}.text`, JSON.stringify(response, null, 2), 'utf-8'
    );
    responses[code] = response;
  }
  return responses;
  // const mw = await get(endpoints['mw'](word));
  // return mw;
}

async function get(query) {
  if (Array.isArray(query)) {
    const data = await fetch(...query)
    .then((res) => res.json()
    .then((data) => {
      return data;
    }));
    return data;
  } else {
    const data = await fetch(query)
    .then((res) => res.json()
    .then((data) => {
      return data;
    }));
    return data;
  }
}

function read(apires) {
  const responses = [];
  for (let i = 0; i < apires.length; i++) {
    const res = apires[i];
    const response = {};
    console.log(`READING ${i + 1}`);
    console.log(res.meta.id);
    console.log(res.meta.fl);
    console.log(res.meta.shortdef);
    response['full'] = res;
    response['headword'] = res.meta.id;
    response['partOfSpeech'] = res.fl;
    response['shortdef'] = res.shortdef;
    responses.push(response);
  }
  return responses;
}

function readMerr(apires) {
  const responses = [];
  for (let i = 0; i < apires.length; i++) {
    const res = apires[i];
    const response = {};
    response['full'] = res;
    response['headword'] = res.meta.id;
    response['partOfSpeech'] = res.fl;
    response['shortdef'] = res.shortdef;
    responses.push(response);
  }
  return responses;
}

function readFree(apires) {
  const responses = [];
  for (let i = 0; i < apires.length; i++) {
    const res = apires[i];
    const meanings = res.meanings;
    for (let j = 0; j < meanings.length; j++) {
      const meaning = meaning[i];
      const response = {};
      response['headword'] = res.word;
      response['partOfSpeech'] = meaning.partOfSpeech
    }
    
    response['full'] = res;
    response['headword'] = res.word;
    response['partOfSpeech'] = res.fl;
    response['shortdef'] = res.shortdef;
    responses.push(response);
  }
  return responses;
}

async function composeOxford(endpoint){
  const od = await get(endpoint); // store api res
  for (let i = 0; i < od.results.length; i++) {
    const etyms = [];
    // iterate results
    const result = od.results[i];
    if (result.lexicalEntries[0].entries[0].etymologies) {
      for (let j = 0; j < result.lexicalEntries.length; j++) {
        const lexicalEntry = result.lexicalEntries[j];
        if (lexicalEntry.entries[0].etymologies) {
          for (let l = 0; l < lexicalEntry.entries.length; l++) {
            const entry = lexicalEntry.entries[l];
            if (entry.etymologies) {
              for (let m = 0; m < entry.etymologies.length; m++) {
                const etym = entry.etymologies[0];
                etyms.push(etym);
              }
            }
          }
        }
      }
    }
    od.results[i].etyms = etyms;
  }
  return od;
}

module.exports = {
  lookup: lookup,
  read: read,
  keys: dictionaries,
  info: info,
}