const dayjs = require('dayjs');
const fs = require('fs');

const { joinImages } = require('join-images');

const layers = [
  'terrain',
  'forest',
  'bushes',
  'countmain',
  'count',
  'roads',
  'objects',
];

const merge = async (fileName) => {
  const maxZoom =
    fs.readdirSync(`${__dirname}/maps/original/${fileName}/${layers[0]}`)
      .length - 1;

  const pathToLayers = `maps/original/${fileName}`;
  const pathToMerged = `maps/merged/${fileName}`;

  if (fs.existsSync(`${__dirname}/${pathToMerged}`)) {
    fs.rmdirSync(`${__dirname}/${pathToMerged}`, { recursive: true });
  }

  fs.mkdirSync(`${__dirname}/${pathToMerged}`);

  for (let i = 0; i <= maxZoom; i++) {
    const zoom = i;

    if (fs.existsSync(`${__dirname}/${pathToMerged}/${zoom}`)) {
      fs.rmdirSync(`${__dirname}/${pathToMerged}/${zoom}`, { recursive: true });
    }

    fs.mkdirSync(`${__dirname}/${pathToMerged}/${zoom}`);

    const fileNames = fs.readdirSync(
      `${__dirname}/${pathToLayers}/${layers[0]}/${zoom}`
    );

    for (const fileName of fileNames) {
      const paths = [];

      for (const layer of layers) {
        paths.push(`${__dirname}/${pathToLayers}/${layer}/${zoom}/${fileName}`);
      }

      const finalFilePath = `${__dirname}/${pathToMerged}/${zoom}/${fileName}`;

      const img = await joinImages(paths, {
        offset: '-256',
      });

      await img.toFile(finalFilePath);

      console.log('Images merged: ', finalFilePath);
    }
  }
};

const start = async () => {
  const startDate = new Date();

  await merge('napf');

  const endDate = new Date();

  console.log(
    `${dayjs(endDate).diff(dayjs(startDate), 'minute')} and ${dayjs(
      endDate
    ).diff(dayjs(startDate), 'second')} seconds`
  );
};

start();
