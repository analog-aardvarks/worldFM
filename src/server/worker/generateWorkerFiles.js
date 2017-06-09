const request = require('request-promise-native');
const fs = require('fs');

const startingTime = Date.now();
const token = 'BQD_XeXRjyX5jRcfc0uzgeCcQy2PWEH4SlHnaYHx5yw_mt5xdwoPPPCPt6x0uQQmfIJ-QMVfJMEo7lQADqgfphl9ZWkNAZ6ZXDDGW5VRSV3RIWF9Ao-iGw7fTbSE14eY8u3TXd7lUjlOOLqzK1ESEFf6fDYv-LYYkFIm9DpnDbGK89ZMxMRg-_oJSNa3X8rL0vjc3zta4pAMOpK6JpOvVzV5KCHDhNUoMASBLcd8YHv0YMW7fxL3ZPYmncxMf2-QugxIlz3S6v3mnB5YuH1sADGUXQ9w8emA5Krw';
const owner = 'thesoundsofspotify';
const startingIndex = 0;// 3398;
const endingIndex = 5000;// 4928
const promises = [];
let currentPlaylistType = 'COUNTRY';
let currentPlaylistIndex = startingIndex;
let endingFlag = null;
const playlistIndexData = { startingIndexCountries: 0 };

const getPlaylistInfo = (offset, limit) => {
  console.log(`[${Date.now() - startingTime}ms] RUNNING ${offset} - ${offset + limit}`);
  return new Promise((resolve, reject) => {
    request(`https://api.spotify.com/v1/users/${owner}/playlists?limit=${limit}&offset=${offset}`,
      { headers: { Authorization: `Bearer ${token}` } })
    .then(res => JSON.parse(res))
    .then(res => res.items)
    .then((res) => {
      return res.map((playlist) => {
        currentPlaylistIndex++;
        switch (playlist.name) {
          case 'The Sound of \'s-hertogenbosch NL':
            playlistIndexData.endingIndexCountries = currentPlaylistIndex - 2;
            playlistIndexData.startingIndexCities = currentPlaylistIndex;
            currentPlaylistType = 'CITY';
            break;
          case 'The Sounds of Cities':
            playlistIndexData.endingIndexCities = currentPlaylistIndex - 1;
            playlistIndexData.startingIndexGenres = currentPlaylistIndex + 1;
            currentPlaylistType = 'GENRE';
            break;
          case 'The Sound of Zydeco':
            playlistIndexData.endingIndexGenres = currentPlaylistIndex;
            endingFlag = currentPlaylistIndex + 1;
            break;
          default: break;
        }
        if (currentPlaylistIndex > endingIndex || currentPlaylistIndex === endingFlag) currentPlaylistType = 'DELETE';
        return {
          name: `[${currentPlaylistType} - ${currentPlaylistIndex}] ${playlist.name}`,
          id: playlist.id,
          total: playlist.tracks.total,
        };
      });
    })
    .then(res => res.filter(p => !p.name.includes('DELETE')))
    .then((res) => {
      const string = JSON.stringify(res);
      const parsedString = `${string.split('').splice(1, string.length - 2).join('')}${string.length > 2 ? ',' : ''}`;
      fs.appendFile('./playlistData.js', parsedString, (err) => {
        if (err) reject(err);
        else resolve();
      });
    })
    .catch(err => reject(err));
  });
};

const getPlaylistInfoGenerator = (offset, limit) => () => getPlaylistInfo(offset, limit);

promises.push(() => new Promise((resolve, reject) => {
  fs.writeFile('./playlistData.js', 'const playlistData = [',
  (err) => {
    if (err) reject(err);
    else resolve();
  });
}));

for (let i = startingIndex; i < endingIndex; i += 50) {
  promises.push(getPlaylistInfoGenerator(i, 50));
}

promises.push(() => new Promise((resolve, reject) => {
  fs.appendFile('./playlistData.js', ']; module.exports = playlistData;',
  (err) => {
    if (err) reject(err);
    else {
      console.log(`[${Date.now() - startingTime}ms] FINISHED CREATING playlistData.js`);
      resolve();
    }
  });
}));

promises.push(() => new Promise((resolve, reject) => {
  fs.writeFile('./playlistIndexData.js', 'const playlistIndexData = ',
  (err) => {
    if (err) reject(err);
    else resolve();
  });
}));

promises.push(() => new Promise((resolve, reject) => {
  const string = JSON.stringify(playlistIndexData);
  fs.appendFile('./playlistIndexData.js', `${string}; module.exports = playlistIndexData;`,
  (err) => {
    if (err) reject(err);
    else {
      console.log(`[${Date.now() - startingTime}ms] FINISHED CREATING playlistIndexData.js`);
      resolve();
    }
  });
}));

promises.reduce((acc, fn) => acc.then(fn), Promise.resolve());
