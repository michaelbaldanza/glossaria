const str = require('./str');

function makeDef(dict, res) { // with JSON.stringify
  if(dict === 'mw') {
    console.log(`hitting makeDef ${dict}`);
    const str = JSON.stringify(res, null, 2);
    console.log(`This string is ${str.length} characters long`);
    // find stem
    const stemsIdx = str.indexOf("stems");
    console.log(`The stem property starts at index ${stemsIdx}`);
    let counter = stemsIdx;
    while (str[counter] !== ']') {
      counter++;
    }
    console.log(`The end of the stem property is at the ${counter + 1}th character`);
    const stemsstr = str.substring(stemsIdx, counter);
    console.log(stemsstr);
    const newstr = str.substring(counter);
    console.log(`in the original str stems idx is ${newstr.indexOf('stems')}`);
    console.log(`there are ${newstr.length} characters after the stems property`)
    // find partOfSpeech

    const mwObj = {};
  }
  
  // if (dict === 'mw') {
  //   console.log(res);
  // }
}
const compose = {
  'fd': function (res){
    const resAr = [];
    for (let i = 0; i < dict.length; i++) {
      const resObj = {};
      resObj.word = dict['fd'].word;
      
    }
  },
  'mw': function (res){
    // console.log(`hitting compose ${dict}`);
    const mws = [];
    // console.log(res);
    for (let i = 0; i < res.length; i++){
      const re = res[i];
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
  'od': function(res){
    console.log('composing odus');
    const odus = res;
    for (let i = 0; i < odus.results.length; i++) {
      const etyms = [];
      // iterate results
      const result = odus.results[i];
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
      odus.results[i].etyms = etyms;
    }
    return odus;
  },
  'odgb': function(res) {

  }
}

module.exports = {
  makeDef: makeDef,
  compose: compose,
};