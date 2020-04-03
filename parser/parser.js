const _ = require('lodash');
const csv = require('csv-parser');
const fs = require('fs-extra');
const path = require('path');

const config = {
  folder: 'three',
};

const configFile = 'L:\\AdamHonts\\climate-change\\src\\data\\clusters.json';
const dataFolder = 'L:\\AdamHonts\\climate-change\\public\\data';

(async () => {
  const clusters = await parseCsvData('C:\\Users\\Scott Rupprecht\\Downloads\\ERA-3-Cluster-grouping\\ERA-3-Cluster-grouping');
  const climateVariables = await parseCsvData('C:\\Users\\Scott Rupprecht\\Downloads\\ERA-3-Cluster-grouping\\ERA-3-Cluster');
  const parsedConfig = require(configFile);

  console.log({ parsedConfig });

  createClusterFile(clusters, 'clusters.json');
  createClusterFile(climateVariables, 'climateVariables.json');
})();

function createClusterFile (data, filename) {
  const directory = path.join(dataFolder, config.folder);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  fs.writeJsonSync(path.join(directory, filename), data, { spaces: 2 });
}

function parseCsvData (path) {
  const results = [];
  const ignoreConversionKeys = ['index'];
  return new Promise((resolve) => {
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (data) => {
        const converted = {};
        _.each(data, (value, key) => {
          let convertedValue = value;

          if (!_.includes(ignoreConversionKeys, key)) {
            if (_.isString(value)) {
              if (/^[0-9]*$/.test(value)) {
                convertedValue = parseInt(value, 10);
              } else if (!isNaN(value)) {
                convertedValue = parseFloat(value);
              }
            }
          }

          converted[key] = convertedValue;
        });

        results.push(converted);
      })
      .on('end', () => {
        resolve(results);
      });
  });
}
