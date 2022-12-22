const apiBtn = document.getElementById('api-req');

apiBtn.addEventListener('click', handleClick);

console.log(apiBtn);

function checkDict(word) {
  return 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' +
    word + '?key=' + process.env.DICTIONARY_KEY;
}

async function handleClick(e) {
  const lookup = e.target.getAttribute('lookup');
  const entry = await fetch(checkDict(lookup))
    .then((res) => res.json())
    .then((data => {return data}));
  console.log(entry);
}

console.log(`hello world`);