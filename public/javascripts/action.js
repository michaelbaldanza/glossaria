const submit = document.getElementById('sbutton');
const input = document.getElementById('word-input');
const form = document.getElementById('word-form');

submit.addEventListener('click', handleSubmit);

function handleSubmit(event) {
  console.log(event);
  console.log(input.value)
  form.setAttribute('action', ('/' + input.value));
}