const request = require('request-promise-native');
const fs = require('fs');

const startingTime = Date.now();
const token = 'BQBWZhesV_ne2ToC1AAJ_t5XxTVL3w9ksRifw4uLVACnvXqalAAQZE7GVrWFJQHIqG0ZwPeKhleIMqspBnjbzmy9AExDE8nJP1JvdzN_yyLfOVuShc84ekg96CXvP7E7zeJn_02Njbh8KgSRSYjZA3ojcMIOlQ6P5BZ-Ymytc-2FrTriQ-vqgEKeXUvwERF-dyI0qYSOOiuwi2MBB6xdoqT2ayaO_VsrkukcJoA-xAAHEfI8FbRhDgBQMDC5_UkMttXIMa9jrmiZEA3LBQ-ZT-IAE7dbwIof4oGT8W2N1g3TkGNO-VSJQzrtVqt309NadO9poA';
const owner = 'thesoundsofspotify';
const startingIndex = 0;// 3398;
const endingIndex = 10;// 4928
const promises = [];
let currentPlaylistType = 'COUNTRY';
let currentPlaylistIndex = startingIndex;
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
            playlistIndexData.endingIndexCountries = currentPlaylistIndex - 1;
            playlistIndexData.startingIndexCities = currentPlaylistIndex;
            currentPlaylistType = 'CITY';
            break;
          case 'The Sound of Cities':
            playlistIndexData.endingIndexCities = currentPlaylistIndex - 1;
            playlistIndexData.startingIndexGenres = currentPlaylistIndex + 1;
            currentPlaylistType = 'GENRE';
            break;
          case 'The Sound of Zydeco':
            playlistIndexData.endingIndexCities = currentPlaylistIndex;
            currentPlaylistType = null;
            break;
          default: break;
        }
        return {
          name: `[${currentPlaylistType} - ${currentPlaylistIndex}] ${playlist.name}`,
          id: playlist.id,
          total: playlist.tracks.total,
        };
      });
    })
    .then((res) => {
      const string = JSON.stringify(res);
      const parsedString = `${string.split('').splice(1, string.length - 2).join('')},`;
      fs.appendFile('./playlistData.js', parsedString,
      (err) => {
        if (err) reject(err);
        else resolve();
      });
    })
    .catch(err => reject(err));
  });
};

const getPlaylistInfoGenerator = (offset, limit) => () => getPlaylistInfo(offset, limit);

promises.push(() => new Promise((resolve, reject) => {
  fs.writeFile('./playlistData.js', 'const playistData = [',
  (err) => {
    if (err) reject(err);
    else resolve();
  });
}));

for (let i = startingIndex; i < endingIndex; i += 50) {
  promises.push(getPlaylistInfoGenerator(i, 50));
}

promises.push(() => new Promise((resolve, reject) => {
  fs.appendFile('./playlistData.js', ']; module.exports = playistData;',
  (err) => {
    if (err) reject(err);
    else {
      console.log(`[${Date.now() - startingTime}ms] FINISHED CREATING playlistData.js`);
      resolve();
    }
  });
}));

promises.push(() => new Promise((resolve, reject) => {
  fs.writeFile('./playlistIndexData.js', 'const playistIndexData = ',
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
