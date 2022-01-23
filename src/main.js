const fs = require("fs");
const { createCanvas, loadImage, Image } = require("canvas");
const console = require("console");
const { promisify } = require('util')
const { createWriteStream, readdir } = require('fs')
const GIFEncoder = require('gif-encoder-2')
const { layersOrder, format, rarity, frameCount } = require("./config.js");
const path = require('path')

const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");

const readdirAsync = promisify(readdir)
process.env.PWD = process.cwd();

const buildDir = `${process.env.PWD}/build`;
const metDataFile = '_metadata.json';
const layersDir = `${process.env.PWD}/layers`;

let metadata = [];
let attributes = [];
let hash = [];
let decodedHash = [];
let tempAtt = {};
let editionCount = {};


const cleanName = _str => {
  let name = _str.slice(0, -4);
  rarity.forEach((r) => {
    name = name.replace(r.key, "");
  });
  return name;
};

const getElements = path => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index + 1,
        name: cleanName(i),
        fileName: i,
      };
    });
};

/**
 *
 * @param {*} layersOrder ::layer detail lists
 * @param {*} type :: attribute type - common, uncommon, rare, epic
 * @returns :: All elements in the selected attribute type
 */

const layersSetup = (layersOrder, type) => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    location: `${layersDir}/${layerObj.name}/${type}`,
    elements: getElements(`${layersDir}/${layerObj.name}/${type}`),
    position: { x: 0, y: 0 },
    size: { width: format.width, height: format.height },
    number: layerObj.number[type],
    type: type
  }));
  return layers;
};

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
};

/**
 *
 * @param {*} _canvas :: the canvas contains the image
 * @param {*} _edition :: index for the file saving
 * @param {*} _frame :: index of the frame in the gif
 * @param {*} _type :: type of the attribute
 */
const saveLayer = (_canvas, _edition, _frame, _type) => {
  //if the output folder doesn't exist, create new one
  if (!fs.existsSync(`${buildDir}/${_type}/gif/`)) {
    fs.mkdirSync(`${buildDir}/${_type}`);
    fs.mkdirSync(`${buildDir}/${_type}/gif`);
  }

  // create output folder for the each edition
  if (!fs.existsSync(`${buildDir}/${_type}/gif/${_edition}`)) {
    fs.mkdirSync(`${buildDir}/${_type}/gif/${_edition}`);
  }

  // create new png file of canvas in the output folder
  fs.writeFileSync(`${buildDir}/${_type}/gif/${_edition}/${_frame}.png`, _canvas.toBuffer("image/png"));
};

const addMetadata = (_edition, _type) => {
  let dateTime = Date.now();
  let tempMetadata = {
    name: "Radioactive Ranged Dark Neko",
    description: "This green tweeting machine is one of the most exciting and excited creatures on the planet. Don't let his looks fool you, he loves to love new technology and help others get involved. Loves watching 'JSON Parser'",
    image: "https://ipfs.io/ipfs/QmW1toapYs7M29rzLXTENn3pbvwe8ioikX1PwzACzjfdHP?filename=Chainlink_Orc.png",
    realm: "radioactive",
    class: "ranged",
    nature: "dark",
    layers_info: {
      "body": hash[0],
      "ears": hash[2],
      "skins": hash[4],
      "eyes": hash[6],
      "accessories": hash[8],
    },
    type: _type,
    date: dateTime,
    attributes: [
      {
        "trait_type": "Strength",
        "value": 5
      },
      {
        "trait_type": "Dexterity",
        "value": 5
      },
      {
        "trait_type": "Vitality",
        "value": 5
      },
      {
        "trait_type": "Intelligence",
        "value": 5
      },
      {
        "trait_type": "Agility",
        "value": 5
      },
      {
        "trait_type": "Luck",
        "value": 5
      },
    ],
  };
  metadata.push(tempMetadata); //push metadata to array

  // initialize values
  attributes = [];
  hash = [];
  decodedHash = [];
};

const addAttributes = (_element, _layer) => {
  let tempAttr = {
    id: _element.id,
    layer: _layer.name,
    name: _element.name,
    rarity: _element.rarity,
  };
  attributes.push(tempAttr);
  hash.push(_element.id);
  hash.push(_layer.type);
  decodedHash.push({ [_layer.id]: _element.id });
};


/**
 * Choose Random assets from layer and combine to image
 * @param {*} _layer :: info of choose layer
 * @param {*} _edition :: index of the gif
 * @param {*} _frame :: index of the frame
 */

const drawLayer = async (_layer, _edition, _frame, _id) => {
  let rand = _id;
  // if choosen layer have random value, apply it to other frames,
  // otherwise, generate new random value to layer

  let element;
  /**
   * choose elements randomly using random index calculated above
   */


  /**
   * if body has choosen, choose other elements based on body's index
   */

  if (_layer.name == 'body' || _layer.name == 'eyes') {
    element = _layer.elements[rand] || null;
    if (_layer.name == "body") tempAtt.body = element.fileName;
  }
  else {
    element = _layer.elements[rand + (tempAtt.body - 1) * _layer.number] ? _layer.elements[rand + (tempAtt.body - 1) * _layer.number] : null;
  }

  if (element) {
    addAttributes(element, _layer);

    const image = await loadImage(`${_layer.location}/${element.id}/frame${_frame}.png`); // load image from speicific frame index
    // draw the image on the canvas
    ctx.drawImage(
      image,
      _layer.position.x,
      _layer.position.y,
      _layer.size.width,
      _layer.size.height
    );
    saveLayer(canvas, _edition, _frame, _layer.type);
  }
};

const createFiles = async edition => {

  editionCount = possibleEdition()
  randLayers = {}
  tempAtt = {}


  await abc([0,0,0,0,0], 1)
};

/**
 * create metadata file of generated gif
 */

const createMetaData = async (edition, type) => new Promise((resolve, reject) => {
  if (!fs.existsSync(`${buildDir}/${type}/metadata`)) {
    fs.mkdirSync(`${buildDir}/${type}/metadata`);
  }

  fs.stat(`${buildDir}/${type}/metadata/${edition}.json`, (err) => {
    if (err == null || err.code === 'ENOENT') {
      fs.writeFileSync(`${buildDir}/${type}/metadata/${edition}.json`, JSON.stringify(metadata[edition - 1] || '', null, 2));
      return resolve({ success: true })
    } else {
      console.log('Oh no, error: ', err.code);
      return resolve({ success: false })
    }
  });
});


/**
 * Merge the frame images into the Gifs selected folder
 */

async function createGif(algorithm, edition, type) {

  const imagesFolder = path.join(__dirname, "../", "build", `${type}`, 'gif', `${edition}`); // Set the frame image input directory

  return new Promise(async resolve1 => {
    const files = await readdirAsync(imagesFolder);

    const [width, height] = await new Promise(resolve2 => {
      const image = new Image()
      image.onload = () => resolve2([image.width, image.height])
      image.src = path.join(imagesFolder, files[0])
    })

    const dstPath = buildDir + `/${type}/gif/${edition}.gif`; // Set the output directory file name

    const writeStream = createWriteStream(dstPath)

    writeStream.on('close', () => {
      resolve1()
    })

    const encoder = new GIFEncoder(width, height, algorithm)

    encoder.createReadStream().pipe(writeStream)
    encoder.start()
    encoder.setDelay(150) // Set the delay time of the gif
    encoder.setTransparent(true) // background Transparency

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    for (const file of files) {
      await new Promise(resolve3 => {
        ctx.clearRect(0, 0, format.width, format.height);
        const image = new Image()
        image.onload = () => {
          ctx.drawImage(image, 0, 0)
          encoder.addFrame(ctx)
          resolve3()
        }
        image.src = path.join(imagesFolder, file)
      })
    }
  })
}

/**
 * Get all possible generating counts from each styles in layer
 * Styles:
 *          common
 *          uncommon
 *          rare
 *          epic
 */

const possibleEdition = () => {
  let total;
  let result = {    // Result object of the possible counts of the styles
    common: -1,
    uncommon: -1,
    rare: -1,
    epic: -1,
    total: -1
  };

  for (let edition of layersOrder) {
    if(edition.number.common != 0) result.common = Math.abs(result.common * edition.number.common);         // get possible counts of common style
    if(edition.number.uncommon != 0) result.uncommon = Math.abs(result.uncommon * edition.number.uncommon);     // get possible counts of uncommon style
    if(edition.number.rare != 0) result.rare = Math.abs(result.rare * edition.number.rare);             // get possible counts of rare style
    if(edition.number.epic != 0) result.epic = Math.abs(result.epic * edition.number.epic);             // get possible counts of epic style
  }

  result.common = result.common === -1 ? 0 : result.common
  result.uncommon = result.uncommon === -1 ? 0 : result.uncommon
  result.rare = result.rare === -1 ? 0 : result.rare
  result.epic = result.epic === -1 ? 0 : result.epic

  result.total = result.common + result.uncommon + result.rare + result.epic;
  return result;
}

const abc = async (indexArr, total) => {
  if (total > editionCount.total) return;

  if (total <= editionCount.common) {
    layer_type = 'common';
  } else if (total > editionCount.common && total <= editionCount.uncommon + editionCount.common) {
    layer_type = 'uncommon';
  } else if (total > editionCount.uncommon + editionCount.common && total <= editionCount.total - editionCount.epic) {
    layer_type = 'rare';
  } else if (total > editionCount.total - editionCount.epic) {
    layer_type = 'epic';
  }

  let baseIndex = {
    'common': 0,
    'uncommon': editionCount.common,
    'rare': editionCount.common + editionCount.uncommon,
    'epic': editionCount.common + editionCount.uncommon + editionCount.rare
  };

  layers = layersSetup(layersOrder, layer_type)

  console.log(indexArr)
  for (let j = 1; j <= frameCount; j++) {
    ctx.clearRect(0, 0, format.width, format.height)
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].number !== 0) {
        await drawLayer(layers[i], total - baseIndex[layer_type], j, indexArr[i])
      }
    }
  }

  addMetadata(total, layer_type);
  await createMetaData(total - baseIndex[layer_type], layer_type);
  createGif('neuquant', total - baseIndex[layer_type], layer_type)
  hash = [];

  indexArr[0]++
  if (indexArr[0] >= layers[0].number) {
    let i = 0
    while (indexArr[i] >= layers[i].number) {
      for (let j = 0; j <= i; j++) {
        indexArr[j] = 0
      }
      indexArr[i + 1]++
      i++
      if (i === layers.length) {
        i = 0
        indexArr = [0, 0, 0, 0, 0]
      }
    }
  }

  abc(indexArr, total + 1)
}
module.exports = { buildSetup, createFiles, possibleEdition };