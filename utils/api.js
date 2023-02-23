const util = require('util');
const fs = require('fs');

const info = {
  'mw': {
    'name': `Merriam-Webster's Collegiate Dictionary`,
    'link': 'https://dictionaryapi.com/products/json',
    'endpoint': function (word) {
      const qs = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' +
        word + '?key=' + process.env.DICTIONARY_KEY;
      return qs;
    }
  },
  'fd': {
    'name': 'Free Dictionary',
    'link': 'https://dictionaryapi.dev/',
    'endpoint': function (word) {
      return 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word;
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

module.exports = {
  lookup: lookup,
  read: read,
  keys: dictionaries,
  info: info,
}