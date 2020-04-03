const csv = require('csv-parser');
const fs = require('fs-extra');
const path = require('path');

const config = {
  folder: 'three',
};

const results = [];

fs.createReadStream('C:\\Users\\Scott Rupprecht\\Downloads\\ERA-3-Cluster-grouping\\ERA-3-Cluster-grouping')
  .pipe(csv())
  .on('data', ({ index, lat, lon, cluster }) => results.push({ index, latitude: parseFloat(lat), longitude: parseFloat(lon), cluster: parseInt(cluster, 10) }))
  .on('end', () => {
    const directory = path.join('L:\\AdamHonts\\climate-change\\public\\data', config.folder);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    fs.writeJsonSync(path.join(directory, 'clusters.json'), results, { spaces: 2 });
  });
