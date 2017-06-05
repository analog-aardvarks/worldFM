const playlistData = require('./playlistData.js');
let result = "[";
playlistData.splice(3398)
.forEach(p => {
  result += `"${p.name.split('').splice(28).join('')}",`
});
result += "];";
console.log(result)
