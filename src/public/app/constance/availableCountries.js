const AsiaPacific = 'Australia,Japan,Hong Kong,Indonesia,Malaysia,New Zealand,Philippines,Singapore,Taiwan'.split(',');
const Europe = 'Andorra,Austria,Belgium,Bulgaria,Cyprus,Czech Republic,Denmark,Estonia,Finland,France,Germany,Greece,Hungary,Iceland,Ireland,Italy,Latvia,Liechtenstein,Lithuania,Luxembourg,Malta,Monaco,Netherlands,Norway,Poland,Portugal,Slovakia,Spain,Sweden,Switzerland,Turkey,UK'.split(',');
const America = 'Argentina,Bolivia,Brazil,Canada,Chile,Colombia,Costa Rica,Dominican Republic,Ecuador,El Salvador,Guatemala,Honduras,Mexico,Nicaragua,Panama,Paraguay,Peru,Uruguay,USA'.split(',');
const availableCountries = AsiaPacific.concat(Europe.concat(America)).sort();
availableCountries.unshift('World');

export default availableCountries;
