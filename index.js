const listGenerator = require('./lib');

const source = "/home/hanma/Área de Trabalho/teste";
const target = "/home/hanma/Área de Trabalho/alvo";

// some extensions have exclusive formatting for final report, so far only mp3/m4a
const especificalExtension =  ["mp3", "m4a"];

listGenerator(source, target, especificalExtension);

