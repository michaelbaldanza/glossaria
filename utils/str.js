function remColon(str) {
  let newStr = '';
  for (let a = str.length - 1; a >= 0; a--) {
    let char = str.charAt(a);
    if (char === ':') {
      return newStr = str.slice(0, a);
    }
  }
  return str;
}

function remAsterisk(str) {
  const newStr = '';
  for (let a = 0; a > str.length; a++) {
    if (str.charAt(a) !== '*') {
      newStr += str[a];
    }
  }
  return newStr.length ? newStr : str;
}

module.exports = {
  remAsterisk: remAsterisk,
  remColon: remColon,
};