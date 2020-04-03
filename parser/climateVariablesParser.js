const csv = require('csv-parser');
const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');

const config = {
  folder: 'three',
};

const results = [];

const ignoreConversionKeys = ['index'];

fs.createReadStream('C:\\Users\\Scott Rupprecht\\Downloads\\ERA-3-Cluster-grouping\\ERA-3-Cluster')
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
    const directory = path.join('L:\\AdamHonts\\climate-change\\public\\data', config.folder);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    fs.writeJsonSync(path.join(directory, 'climateVariables.json'), results, { spaces: 2 });
  });
