const listGenerator = require('./lib');
const fs = require('fs');
const mm = require('musicmetadata');

const source = "/home/hanma/Área de Trabalho/teste";
const target = "/home/hanma/Área de Trabalho/alvo";
const searchFor =   ["mp3", "m4a"]

listGenerator(source, target, searchFor);


// var parser = mm(fs.createReadStream('/home/hanma/Documentos/NWK/Let It Go.mp3'), function (err, metadata) {
//   if (err) throw err;
//   console.log(metadata);
// });