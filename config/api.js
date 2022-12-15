function queryDictAPI(word) {
  return 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' +
    word + '?key=' + process.env.DICTIONARY_KEY;
}

module.exports = {
  queryDictAPI: queryDictAPI,
}