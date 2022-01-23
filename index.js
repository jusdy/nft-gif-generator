const myArgs = process.argv.slice(2);
const { buildSetup, createFiles, possibleEdition } = require("./src/main.js");
const { defaultEdition } = require("./src/config.js");
const edition = myArgs.length > 0 ? Number(myArgs[0]) : defaultEdition;

(async () => {
  buildSetup();
  await createFiles();
  //console.log(possibleEdition())
})();

