const path = require('path');

const MapData = {
  getWorldJson(req, res) {
    res.sendFile(path.join(__dirname, '../data/world-110.json'));
  },
  getCountryNames(req, res) {
    res.sendFile(path.join(__dirname, '../data/world-110m-country-names.tsv'));
  },
};

module.exports = MapData;
